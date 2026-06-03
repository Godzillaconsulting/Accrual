import 'dotenv/config';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import qrcodeLib from 'qrcode';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from './config/db.js';
import { agendarEnGoogleCalendar } from './services/calendarService.js';
import { SYSTEM_PROMPT, chatTools, withTimeout } from './config/zilla-prompt.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SESSIONS_BASE = process.env.SESSION_PATH || path.join(__dirname, '..', 'bot_sessions');
const DEBOUNCE_TIME_MS = 8000; // 8 segundos de buffer (jitter de lectura)
const messageQueues = new Map();
const pausedChats = new Map(); // Para dormir al bot cuando un humano interviene
const rescueTimers = new Map(); // Para retomar la plática si el admin olvida contestar
const PAUSE_DURATION_MS = 5 * 60 * 1000; // 5 minutos de pausa

// O(1) RAM Cache para Lista Negra
let blacklistSet = new Set();
let waSock = null;

// Normalización robusta para números de WhatsApp
function normalizeWhatsAppNumber(phone) {
    if (!phone) return '';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('521') && clean.length === 13) {
        clean = '52' + clean.substring(3);
    } else if (clean.length === 10) {
        clean = '52' + clean;
    }
    return clean;
}

const refreshBlacklist = async () => {
    try {
        const result = await pool.query('SELECT phone_number FROM wa_blacklist');
        const normalizedList = result.rows.map(row => normalizeWhatsAppNumber(row.phone_number));
        blacklistSet = new Set(normalizedList);
        console.log(`🛡️ [Blacklist] Cargada exitosamente. Total números: ${blacklistSet.size}`);
    } catch (error) {
        console.error('❌ [Blacklist] Error al consultar base de datos para actualizar lista negra:', error.message);
    }
};

// Refrescar inmediatamente al inicio y luego cada 60 segundos
refreshBlacklist();
setInterval(refreshBlacklist, 60000);

/**
 * Resuelve y bloquea el JID/LID correspondiente a un número de teléfono en la lista negra de Accrual.
 */
async function resolveAndBlockLid(phone, reason, waSocket = null) {
    try {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (!cleanPhone) return null;

        // 1. Intentar buscar en los archivos locales de mapeo de Baileys
        if (fs.existsSync(SESSIONS_BASE)) {
            try {
                const files = fs.readdirSync(SESSIONS_BASE);
                const last10 = cleanPhone.slice(-10);
                const mappingFile = files.find(f => f.startsWith('lid-mapping-') && f.includes(last10) && !f.includes('_reverse'));
                if (mappingFile) {
                    const filePath = path.join(SESSIONS_BASE, mappingFile);
                    const content = fs.readFileSync(filePath, 'utf8').trim();
                    let resolvedLid = content;
                    try {
                        resolvedLid = JSON.parse(content);
                    } catch(e) {}
                    
                    if (resolvedLid) {
                        const resolvedPhone = normalizeWhatsAppNumber(resolvedLid);
                        if (resolvedPhone && resolvedPhone !== cleanPhone) {
                            console.log(`🤖 [Blacklist Sync - Local File] Se resolvió LID desde archivo local para ${cleanPhone} -> ${resolvedLid} (clean: ${resolvedPhone})`);
                            await pool.query(
                                `INSERT INTO wa_blacklist (phone_number, reason) VALUES ($1, $2) ON CONFLICT (phone_number) DO UPDATE SET reason = EXCLUDED.reason`,
                                [resolvedPhone, `${reason || 'Bloqueado'} (LID de ${cleanPhone})`]
                            );
                            return resolvedPhone;
                        }
                    }
                }
            } catch (fileErr) {
                console.error("⚠️ Error buscando mapeo local de LID:", fileErr.message);
            }
        }

        // 2. Si no se encontró en local, intentar resolver usando WhatsApp socket
        const socket = waSocket || waSock;
        if (!socket) {
            console.log(`⚠️ [Blacklist] No hay conexión de WhatsApp para resolver el LID vía red para: ${phone}`);
            return null;
        }

        // Intentar formatear de varias formas para México (con o sin '1' extra de celular en JID de WhatsApp)
        const jidsToTry = [`${cleanPhone}@s.whatsapp.net`];
        if (cleanPhone.startsWith('52') && !cleanPhone.startsWith('521') && cleanPhone.length === 12) {
            jidsToTry.push(`521${cleanPhone.substring(2)}@s.whatsapp.net`);
        } else if (cleanPhone.startsWith('521') && cleanPhone.length === 13) {
            jidsToTry.push(`52${cleanPhone.substring(3)}@s.whatsapp.net`);
        }

        console.log(`🔍 [Blacklist] Buscando JID/LID para el número ${cleanPhone} en WhatsApp...`);
        for (const jid of jidsToTry) {
            const result = await socket.onWhatsApp(jid);
            if (result && result.length > 0 && result[0].exists) {
                const resolvedJid = result[0].jid;
                const resolvedPhone = normalizeWhatsAppNumber(resolvedJid);
                if (resolvedPhone && resolvedPhone !== cleanPhone) {
                    console.log(`🤖 [Blacklist Sync] Se resolvió JID/LID para ${cleanPhone} -> ${resolvedJid} (clean: ${resolvedPhone})`);
                    
                    // Insertar en la lista negra
                    await pool.query(
                        `INSERT INTO wa_blacklist (phone_number, reason) VALUES ($1, $2) ON CONFLICT (phone_number) DO UPDATE SET reason = EXCLUDED.reason`,
                        [resolvedPhone, `${reason || 'Bloqueado'} (LID de ${cleanPhone})`]
                    );
                    return resolvedPhone;
                }
            }
        }
        console.log(`⚠️ [Blacklist] No se encontró ningún LID/JID alternativo en WhatsApp para ${cleanPhone}`);
        return null;
    } catch (e) {
        console.error(`❌ Error resolviendo LID para ${phone}:`, e.message);
        return null;
    }
}

/**
 * Recorre todos los números de teléfono reales en la lista negra y resuelve sus LIDs asociados.
 */
async function syncBlacklistLids(waSocket = null) {
    try {
        console.log("🤖 [Blacklist Sync] Iniciando sincronización de LIDs para la lista negra...");
        const entriesResult = await pool.query("SELECT phone_number, reason FROM wa_blacklist WHERE length(phone_number) < 14");
        for (const entry of entriesResult.rows) {
            await resolveAndBlockLid(entry.phone_number, entry.reason, waSocket);
        }
        console.log("🤖 [Blacklist Sync] Sincronización de LIDs de lista negra completada.");
    } catch (e) {
        console.error("❌ Error en syncBlacklistLids:", e.message);
    }
}

const JID_MAP_PATH = path.join(SESSIONS_BASE, 'jid_map.json');
let jidMap = new Map();
let globalBotQueue = Promise.resolve();

// Cargar JID Map al inicio
try {
    if (!fs.existsSync(SESSIONS_BASE)) {
        fs.mkdirSync(SESSIONS_BASE, { recursive: true });
    }
    if (fs.existsSync(JID_MAP_PATH)) {
        const data = JSON.parse(fs.readFileSync(JID_MAP_PATH, 'utf8'));
        jidMap = new Map(Object.entries(data));
        console.log(`🗺️ [JID Map] Cargado exitosamente. Total registros: ${jidMap.size}`);
    }
} catch (e) {
    console.error("❌ Error cargando jid_map.json:", e.message);
}

function saveJidMap() {
    try {
        if (!fs.existsSync(SESSIONS_BASE)) {
            fs.mkdirSync(SESSIONS_BASE, { recursive: true });
        }
        fs.writeFileSync(JID_MAP_PATH, JSON.stringify(Object.fromEntries(jidMap)), 'utf8');
    } catch (e) {
        console.error("❌ Error guardando jid_map.json:", e.message);
    }
}

// ── LIMPIADOR PERIÓDICO DE RAM (Garbage Collector cada minuto) ──
setInterval(() => {
    if (global.gc) {
        global.gc();
        console.log('🧹 [SISTEMA] Garbage Collector forzado ejecutado.');
    }
}, 60000);

/**
 * 🛡️ FILTRO ANTI-SPAM REFORZADO — Detecta mensajes de bots, cupones, publicidad masiva,
 * redes sociales, tarjetas bancarias, códigos de verificación y emojis de publicidad.
 * Retorna true si el mensaje es spam y debe ignorarse silenciosamente.
 */
function checkIsSpamMessage(text) {
    if (!text || typeof text !== 'string') return false;
    const t = text.toLowerCase();

    // ── 1. LINKS DE SPAM / ACORTADORES DE URL ──
    const spamLinks = [
        'bit.ly', 'tinyurl.com', 'cutt.ly', 'short.gy', 'ow.ly', 'rb.gy', 't.co',
        'is.gd', 'buff.ly', 'ift.tt', 'dlvr.it', 'soo.gd', 'clicky.me',
        'rappi.sng.link', 'rappisng.link', 'rappi.com.mx/coupon',
        'temu.com/s/', 'temu.com/m/',
        'didi.onelink.me', 'didifood.com', 'didiglobal.com',
        'wa.me/message', 'wame.in', 'linktr.ee',
        'fb.me', 'fb.watch', 'm.facebook.com', 'facebook.com/share',
        'instagram.com/p/', 'instagr.am', 'ig.me',
        'tiktok.com/@', 'vm.tiktok.com', 'vt.tiktok.com',
        'youtube.com/shorts', 'youtu.be',
        'mercadolibre.com/sec', 'shein.com.mx', 'aliexpress.com',
        'shopee.com.mx', 'wish.com'
    ];
    if (spamLinks.some(link => t.includes(link))) return true;

    // ── 2. PATRONES DE TEXTO DE SPAM (REGEX) ──
    const spamPatterns = [
        /\d+%\s*off/i,
        /\*\d+%\s*off\*/i,
        /cup[oó]n\s*[:\-]\s*\w+/i,
        /c[oó]digo\s*[:\-]\s*\w+/i,
        /promocion\s+exclusiva/i,
        /oferta\s+(por\s+tiempo\s+limitado|especial|del\s+d[ií]a)/i,
        /gratis\s+por\s+\d+\s+d[ií]as/i,
        /solo\s+\d+\s+redenciones/i,
        /descuento\s+del\s+\d+%/i,
        /precio\s+especial\s+hoy/i,
        /hasta\s+\d+%\s*de\s+descuento/i,
        /env[ií]o\s+gratis/i,
        /cashback\s+de\s+\d+/i,
        /gana\s+\$?\d+\s+(pesos|mxn)/i,
        /reclama\s+tu\s+(bono|premio|reward)/i,
        /activa\s+tu\s+(tarjeta|cuenta|promo)/i,
        /descarga\s+(la\s+app|nuestra\s+app|el\s+app)/i,
        /primer\s+(pedido|compra)\s+gratis/i,
        /promo\s*v[aá]lida?\s+(solo|hasta)/i,
        /c[oó]digo\s+de\s+verificaci[oó]n/i,
        /c[oó]digo\s+de\s+(seguridad|confirmaci[oó]n|recuperaci[oó]n|acceso)/i,
        /verification\s+(code|pin)/i,
        /tu\s+c[oó]digo\s+(de\s+)?\w+\s+es[:\s]+\d+/i,
        /\d{4,8}\s+es\s+tu\s+c[oó]digo/i,
        /no\s+compartas\s+(este|tu)\s+c[oó]digo/i,
        /reenvi[aá]\s+(este|el)\s+(c[oó]digo|mensaje)/i,
    ];
    if (spamPatterns.some(p => p.test(text))) return true;

    // ── 3. KEYWORDS DE SPAM / BROADCAST / PUBLICIDAD ──
    const spamKeywords = [
        'aplica términos y condiciones', 'aplica terminos y condiciones',
        'válido hasta agotar existencias', 'valido hasta agotar existencias',
        'consulta términos y condiciones', 'consulta terminos y condiciones',
        'sujeto a disponibilidad', 'mientras duren existencias',
        'hola, me interesa recibir', 'te informamos que tu pedido',
        'tu paquete está en camino', 'tu paquete esta en camino',
        'temu', 'shein', 'aliexpress', 'shopee', 'wish.com',
        'rappicard', 'rappi pay', 'rappiprime',
        'didipay', 'didicard', 'didifood',
        'plata card', 'platacard', 'platacrd',
        'nu bank', 'nubank', 'nu.com.mx', 'stori card', 'storicard',
        'hey banco', 'hey bank', 'spin by oxxo', 'mercado pago',
        'bbva wallet', 'banamex digital', 'santander plus',
        'tu código de whatsapp', 'tu codigo de whatsapp',
        'tu código de facebook', 'tu codigo de facebook',
        'tu código de instagram', 'tu codigo de instagram',
        'tu código de tiktok', 'tu codigo de tiktok',
        'código de recuperación de google', 'codigo de recuperacion de google',
        'microsoft verification', 'apple id verification',
        'verification code', 'security code', 'confirm your',
        'síguenos en facebook', 'siguenos en facebook',
        'visítanos en instagram', 'visitanos en instagram',
        'suscríbete a nuestro canal', 'subscribete a nuestro canal',
        'dale like a nuestra', 'compartenos en facebook',
        'macstore', 'airpods', 'iphone reacondicionado',
        'samsung reacondicionado', 'refurbished',
    ];
    if (spamKeywords.some(kw => t.includes(kw))) return true;

    // ── 4. DETECCIÓN DE EMOJIS MASIVOS (Publicidad) ──
    const emojiRegex = /[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}]/gu;
    const emojiMatches = text.match(emojiRegex) || [];
    if (emojiMatches.length >= 6) {
        console.log(`🚫 [Filtro Emojis] Mensaje con ${emojiMatches.length} emojis detectado como publicidad masiva.`);
        return true;
    }

    // ── 5. DETECCIÓN DE NÚMEROS DE CÓDIGO SMS (4-8 dígitos solos) ──
    if (/\b\d{6}\b/.test(text) && /(c[oó]digo|code|pin|clave|otp|acceso)/i.test(text)) return true;

    return false;
}

/**
 * Registra el mensaje del operador en wa_workflow_states.
 */
async function saveOperatorMessage(senderId, msgText) {
    if (!msgText || !msgText.trim()) return;
    try {
        const sessionStateResult = await pool.query(
            "SELECT contexto_ia FROM wa_workflow_states WHERE numero_contacto = $1",
            [senderId]
        );
        let contexto_ia = {};
        let historial_mensajes = [];
        if (sessionStateResult && sessionStateResult.rows.length > 0) {
            contexto_ia = sessionStateResult.rows[0].contexto_ia || {};
            historial_mensajes = contexto_ia.historial_mensajes || [];
        }
        historial_mensajes.push({ role: 'assistant', contenido: msgText });
        if (historial_mensajes.length > 20) {
            historial_mensajes = historial_mensajes.slice(-20);
        }
        contexto_ia.historial_mensajes = historial_mensajes;

        await pool.query(`
            INSERT INTO wa_workflow_states (numero_contacto, contexto_ia, ultimo_mensaje_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (numero_contacto)
            DO UPDATE SET contexto_ia = EXCLUDED.contexto_ia, ultimo_mensaje_at = CURRENT_TIMESTAMP
        `, [senderId, JSON.stringify(contexto_ia)]);
        console.log(`👤 [Modo Humano] Registrado mensaje del operador en DB para ${senderId}`);
    } catch (err) {
        console.error("❌ Error registrando mensaje del operador en DB:", err.message);
    }
}


// ===============================================
// CASCADA DE IA (WATERFALL: GEMINI -> SAMBANOVA)
// ===============================================
async function callAIWaterfall(safeHistory, messageText, dynamicPrompt) {
    let resultText = "";
    let functionCalls = [];

    try {
        // INTENTO 1: GEMINI (Principal - Ultra Rápido y Económico)
        const apiKey = (process.env.GEMINI_API_KEY || "").trim();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: dynamicPrompt,
            tools: [{ functionDeclarations: chatTools }]
        });

        const chat = model.startChat({ history: safeHistory });
        let result = await withTimeout(
            chat.sendMessage(messageText), 
            "Lo lamento, la señal de Gemini está débil. Intentando con servidor de respaldo..."
        );
        
        resultText = result.response.text();
        functionCalls = result.response.functionCalls() || [];
        
        return { chat, sambaMessages: null, resultText, functionCalls, engine: 'gemini' };

    } catch (err) {
        console.warn("⚠️ Falló Gemini. Entrando a Cascada de IA (SAMBANOVA)...", err.message);
        
        try {
            // INTENTO 2: SAMBANOVA (Fallback)
            const sambaKey = (process.env.SAMBANOVA_API_KEY || "").trim();
            if (!sambaKey) throw new Error("Falta llave de SambaNova");

            const openaiTools = chatTools.map(tool => ({
                type: "function",
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: {
                        type: "object",
                        properties: tool.parameters?.properties || {},
                        required: Object.keys(tool.parameters?.properties || {})
                    }
                }
            }));

            let sambaMessages = [
                { role: "system", content: dynamicPrompt }
            ];
            for (const msg of safeHistory) {
                sambaMessages.push({
                    role: msg.role === "model" ? "assistant" : "user",
                    content: msg.parts[0].text
                });
            }
            sambaMessages.push({ role: "user", content: messageText });

            const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sambaKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "Meta-Llama-3.1-70B-Instruct",
                    messages: sambaMessages,
                    temperature: 0.1,
                    tools: openaiTools
                })
            });

            if (!response.ok) throw new Error("Fallo en API SambaNova");
            const data = await response.json();
            const msgObj = data.choices[0].message;

            if (msgObj.tool_calls && msgObj.tool_calls.length > 0) {
                functionCalls = msgObj.tool_calls.map(tc => ({
                    id: tc.id,
                    name: tc.function.name,
                    args: JSON.parse(tc.function.arguments)
                }));
                sambaMessages.push(msgObj);
                return { chat: null, sambaMessages, resultText: "", functionCalls, engine: 'sambanova' };
            } else {
                return { chat: null, sambaMessages: null, resultText: msgObj.content, functionCalls: [], engine: 'sambanova' };
            }

        } catch (sambaErr) {
            console.error("❌ Falló Cascada completa (Gemini y SambaNova):", sambaErr.message);
            resultText = "Disculpa, nuestros servidores fiscales están saturados en este momento. Por favor, ¿podrías enviarme tu duda nuevamente en 2 minutos?";
            return { chat: null, sambaMessages: null, resultText, functionCalls: [], engine: 'fallback' };
        }
    }
}

// ===============================================
// PROCESAMIENTO DE MENSAJES CON DEBOUNCING
// ===============================================
const processFullMessage = async (senderId, messageText, sock, typingDelay = null) => {
    const maskedSender = senderId.substring(0, 4) + "****" + senderId.substring(senderId.length - 15, senderId.length - 11);
    console.log(`\n🚀 WA Msg bloque completo [${maskedSender}]: ${messageText}`);

    try {
        // Escribiendo (Typing) de Baileys
        await sock.presenceSubscribe(senderId);
        await sock.sendPresenceUpdate('composing', senderId);

        let sessionStateResult;
        try {
            sessionStateResult = await pool.query(
                "SELECT contexto_ia FROM wa_workflow_states WHERE numero_contacto = $1",
                [senderId]
            );
        } catch (err) { }

        let historial_mensajes = [];
        let contexto_ia = {};

        if (sessionStateResult && sessionStateResult.rows.length > 0) {
            contexto_ia = sessionStateResult.rows[0].contexto_ia || {};
            historial_mensajes = contexto_ia.historial_mensajes || [];
        }

        historial_mensajes.push({ role: 'user', contenido: messageText });
        if(historial_mensajes.length > 20) {
             historial_mensajes = historial_mensajes.slice(-20);
        }

        let safeHistory = [];
        for (const msg of historial_mensajes.slice(0, -1)) {
            if (safeHistory.length > 0 && safeHistory[safeHistory.length - 1].role === (msg.role === 'assistant' ? 'model' : msg.role)) {
                safeHistory[safeHistory.length - 1].parts[0].text += `\n ${msg.contenido}`;
            } else {
                safeHistory.push({
                    role: msg.role === "assistant" ? "model" : msg.role,
                    parts: [{ text: msg.contenido }]
                });
            }
        }

        // Generar contexto de tiempo real en Ciudad Juárez
        const formatter = new Intl.DateTimeFormat("es-MX", { timeZone: "America/Ciudad_Juarez", dateStyle: 'full', timeStyle: 'short' });
        const currentDateStr = formatter.format(new Date());
        const dynamicPrompt = SYSTEM_PROMPT + `\n\n[CONTEXTO TEMPORAL CRÍTICO]:\nHoy es: ${currentDateStr} (Hora de Ciudad Juárez, Chihuahua, MX).\nREGLAS DE AGENDA:\n1. Tienes estrictamente prohibido agendar citas en fechas u horas que ya hayan pasado.\n2. Solo puedes agendar de Lunes a Sábado de 9:00 AM a 7:00 PM.\n3. Siempre verifica la disponibilidad antes de confirmar.`;

        let { chat, sambaMessages, resultText: botReply, functionCalls, engine } = await callAIWaterfall(safeHistory, messageText, dynamicPrompt);
        
        let resetMemory = false;

        if (functionCalls && functionCalls.length > 0) {
            for (const call of functionCalls) {
                let fRes = {};
                if (call.name === "check_availability") {
                    const { fecha, hora } = call.args;
                    try {
                        const requestedDate = new Date(`${fecha}T${hora}:00-06:00`); // Ciudad Juarez (MDT/MST approx)
                        if (requestedDate < new Date()) {
                            fRes = { error: "La fecha/hora solicitada ya pasó. Pide otra fecha." };
                        } else {
                            const query = "SELECT COUNT(*) as total FROM appointments WHERE fecha=$1 AND ABS(EXTRACT(EPOCH FROM (hora::time - $2::time))) < 3600 AND status!='cancelada'";
                            const r = await pool.query(query, [fecha, hora]);
                            fRes = { disponible: parseInt(r.rows[0].total) === 0 };
                        }
                    } catch (e) { fRes = { error: 'Error consultando BD' }; }
                } else if (call.name === "save_appointment") {
                    const { nombre, correo, telefono, servicio, fecha, hora, notas } = call.args;
                    try {
                        const requestedDate = new Date(`${fecha}T${hora}:00-06:00`);
                        if (requestedDate < new Date()) {
                            fRes = { success: false, error: "La fecha es en el pasado." };
                        } else {
                            // GUARDAR JUNTO A LA VEZ (Google Calendar y BD local)
                            let gRes = await agendarEnGoogleCalendar({ nombre, correo, telefono, servicio, fecha, hora, notas }).catch(e => null);
                            let calendarId = gRes ? gRes.id : null;
                            
                            const r = await pool.query(
                                "INSERT INTO appointments (nombre, email, telefono, mensaje, service_requested, fecha, hora, status, modalidad, google_calendar_id) VALUES ($1,$2,$3,$4,$5,$6,$7,'confirmada','whatsapp',$8) RETURNING id",
                                [nombre, correo || 'sin-correo@wa.com', telefono, notas, servicio, fecha, hora, calendarId]
                            );
                            fRes = { success: true, id: r.rows[0].id, alert: "Cita guardada." };
                            resetMemory = true; // Liberar memoria tras el éxito
                        }
                    } catch (err) {
                        fRes = { success: false, error: "Error interno de base de datos." };
                    }
                }

                // Enviar el resultado de la función de vuelta a la IA correspondiente
                if (engine === 'gemini') {
                    let result2 = await withTimeout(
                        chat.sendMessage([{ functionResponse: { name: call.name, response: fRes } }]),
                        "Disculpa la demora, el sistema rechazó la solicitud."
                    );
                    botReply = result2.response.text();
                } else if (engine === 'sambanova') {
                    sambaMessages.push({ role: "tool", tool_call_id: call.id, name: call.name, content: JSON.stringify(fRes) });
                    const sambaKey = process.env.SAMBANOVA_API_KEY.trim();
                    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${sambaKey}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ model: "Meta-Llama-3.1-70B-Instruct", messages: sambaMessages, temperature: 0.1 })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        botReply = data.choices[0].message.content;
                    } else {
                        botReply = "Ocurrió un error al confirmar con SambaNova. Por favor, intenta nuevamente.";
                    }
                }
            }
        }

        // JITTER: Retraso de escritura proporcional al largo de la respuesta
        const baseDelay = botReply.length * 15;
        const jitter = Math.floor(Math.random() * 800) - 400;
        let finalTypingDelay = Math.min(Math.max(baseDelay + jitter, 1500), 5000);
        if (typingDelay) {
            finalTypingDelay = Math.max(typingDelay, 1500);
        }
        await new Promise(r => setTimeout(r, finalTypingDelay));

        await sock.sendPresenceUpdate('paused', senderId);
        await sock.sendMessage(senderId, { text: botReply });
        
        // Manejo de Memoria Optimizada
        if (resetMemory) {
            historial_mensajes = []; // Vaciamos para no matar la BD tras la cita
            contexto_ia.historial_mensajes = [];
        } else {
            historial_mensajes.push({ role: 'assistant', contenido: botReply });
            contexto_ia.historial_mensajes = historial_mensajes;
        }

        await pool.query(
            "CALL sp_process_incoming_wa_message(gen_random_uuid(), $1, $2, 'WA_BOT_CONVERSATION', 'CALIFICACION_BOT', $3::JSONB)",
            [senderId, messageText + " [RESP] " + botReply, JSON.stringify(contexto_ia)]
        );

    } catch (error) {
        console.error("❌ Error WA engine:", error);
    }
};

// ===============================================
// INICIALIZACIÓN DE BAILEYS
// ===============================================
async function updateBotStatusInDB(status, tokenSesion = null) {
    try {
        await pool.query(`
            INSERT INTO wa_sessions (numero_telefono, qr_status, token_sesion, ultima_conexion)
            VALUES ('accrual_bot', $1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (numero_telefono)
            DO UPDATE SET qr_status = EXCLUDED.qr_status, token_sesion = EXCLUDED.token_sesion, ultima_conexion = CURRENT_TIMESTAMP
        `, [status, tokenSesion]);
        console.log(`📡 [Accrual Bot DB Status] Estado actualizado a: ${status}`);
    } catch (err) {
        console.error('❌ Error actualizando estado del bot en la DB:', err.message);
    }
}

export const initWhatsAppBot = async () => {
    await refreshBlacklist();
    await updateBotStatusInDB('DISCONNECTED');
    console.log("🟢 Iniciando Cliente de WhatsApp (Baileys 24/7) con IA Waterfall...");
    
    if (!fs.existsSync(SESSIONS_BASE)) {
        fs.mkdirSync(SESSIONS_BASE, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(SESSIONS_BASE);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Accrual IA', 'Chrome', '124.0.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: false
    });
    waSock = sock;

    sock.ev.on('creds.update', saveCreds);

    let currentQR = null;

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            currentQR = qr;
            console.log('\n=============================================');
            console.log('📱 NUEVO QR DISPONIBLE PARA ESCANEO 📱');
            console.log('=============================================');
            qrcode.generate(qr, { small: true });

            // Generar imagen QR en disco para fácil escaneo en el host
            const qrPath = path.join(SESSIONS_BASE, '..', 'qr_accrual.png');
            try {
                const qrDataURL = await qrcodeLib.toDataURL(qr, { width: 400 });
                await qrcodeLib.toFile(qrPath, qr, {
                    color: { dark: '#000000', light: '#FFFFFF' },
                    width: 400
                });
                console.log(`💾 Código QR guardado en: ${qrPath}`);
                await updateBotStatusInDB('QR_READY', qrDataURL);
            } catch (err) {
                console.error('❌ Error generando qr_accrual.png:', err);
                await updateBotStatusInDB('QR_READY', null);
            }
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`⚠️ Desconectado. Reconectar: ${shouldReconnect}`);
            await updateBotStatusInDB('DISCONNECTED');
            if (shouldReconnect) {
                setTimeout(initWhatsAppBot, 5000);
            } else {
                console.log("❌ Sesión cerrada por el usuario. Limpiando credenciales locales...");
                try {
                    fs.rmSync(SESSIONS_BASE, { recursive: true, force: true });
                } catch (err) {
                    console.error("❌ Error al borrar SESSIONS_BASE:", err.message);
                }
                setTimeout(initWhatsAppBot, 3000);
            }
        } else if (connection === 'open') {
            currentQR = null;
            console.log('✅ Neurona Accrual (Baileys) conectada y lista 24/7!');
            await updateBotStatusInDB('CONNECTED');
            
            // Sincronizar LIDs en segundo plano al conectar
            setTimeout(async () => {
                await syncBlacklistLids(sock);
                await refreshBlacklist();
            }, 3000);
            
            // Sobreescribir el código QR con un estado de "CONECTADO" en verde para mantener el mount intacto
            const qrPath = path.join(SESSIONS_BASE, '..', 'qr_accrual.png');
            try {
                await qrcodeLib.toFile(qrPath, 'AccrualBot CONECTADO exitosamente. Ya puedes cerrar esta imagen.', {
                    color: { dark: '#00aa00', light: '#FFFFFF' },
                    width: 400
                });
                console.log('💾 QR de estado "CONECTADO" guardado.');
            } catch (err) {
                console.error('❌ Error al guardar estado conectado en QR:', err);
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message) return;

        const senderId = msg.key.remoteJid;
        if (!senderId || senderId.endsWith('@g.us') || senderId === 'status@broadcast') return;

        // Búsqueda en 0.001 milisegundos usando número normalizado
        const normalizedSender = normalizeWhatsAppNumber(senderId);

        // 🚫 FILTRO DE NÚMEROS CORTOS (Evitar sistemas automáticos o notificaciones de 5-6 dígitos)
        if (normalizedSender.length < 8) {
            console.log(`🚫 [Filtro Shortcode] Ignorando número corto o sospechoso: ${senderId}`);
            return;
        }

        // 🚫 LISTA NEGRA
        let blocked = blacklistSet.has(normalizedSender);
        let realPhone = senderId;
        if (senderId.includes('@lid') && (msg.participant || msg.key?.participant)) {
            const participant = msg.participant || msg.key.participant;
            if (!participant.includes('@lid')) {
                realPhone = participant;
                const normalizedRealPhone = normalizeWhatsAppNumber(realPhone);
                if (blacklistSet.has(normalizedRealPhone)) {
                    blocked = true;
                }
            }
        }

        if (blocked) {
            console.log(`🚫 Mensaje de ${senderId} ignorado por estar en la Blacklist (Normalizado: ${normalizedSender}).`);
            if (senderId.includes('@lid') && realPhone !== senderId) {
                try {
                    const cleanLid = normalizeWhatsAppNumber(senderId);
                    const cleanReal = normalizeWhatsAppNumber(realPhone);
                    const row = await pool.query('SELECT reason FROM wa_blacklist WHERE phone_number = $1 OR phone_number = $2', [cleanReal, realPhone]);
                    const reason = row && row.rows.length > 0 ? row.rows[0].reason : 'Bloqueado';
                    await pool.query(
                        `INSERT INTO wa_blacklist (phone_number, reason) VALUES ($1, $2) ON CONFLICT (phone_number) DO NOTHING`,
                        [cleanLid, `${reason} (LID de ${cleanReal})`]
                    );
                    await refreshBlacklist();
                } catch(e) {
                    console.error("Error auto-guardando LID en blacklist:", e.message);
                }
            }
            return;
        }

        // Guardar mapeo de teléfono limpio a JID original
        if (senderId.includes('@lid') || senderId.includes('@s.whatsapp.net')) {
            if (jidMap.get(normalizedSender) !== senderId) {
                jidMap.set(normalizedSender, senderId);
                saveJidMap();
            }
        }

        const msgText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        // Si el humano envía un mensaje desde su celular (WhatsApp Web/App)
        if (msg.key.fromMe) {
            if (msgText.trim().toLowerCase() === '/bot') {
                pausedChats.delete(senderId);
                clearTimeout(rescueTimers.get(senderId));
                console.log(`🤖 Bot DESPERTADO manualmente para el chat: ${senderId.split('@')[0]}`);
            } else {
                pausedChats.set(senderId, Date.now());
                console.log(`💤 Humano intervino. Bot PAUSADO por 5 mins para: ${senderId.split('@')[0]}`);
                
                // Activar Rescue Timer para 5 minutos
                clearTimeout(rescueTimers.get(senderId));
                rescueTimers.set(senderId, setTimeout(() => {
                    pausedChats.delete(senderId);
                    processFullMessage(senderId, "(Mensaje de sistema invisible: Han pasado 5 minutos desde que el administrador intervino y el chat se quedó en pausa. Retoma la plática con el cliente de forma natural, como si fueras el experto continuando la idea.)", sock);
                }, 5 * 60 * 1000));

                // REGISTRAR MENSAJE DEL OPERADOR EN DB
                await saveOperatorMessage(senderId, msgText);
            }
            return;
        }

        // 🚫 FILTRO DE SPAM / CUPONES / PUBLICIDAD
        if (checkIsSpamMessage(msgText)) {
            console.log(`🚫 [Filtro Spam] Ignorando mensaje sospechoso de spam/cupón: "${msgText.substring(0, 80)}..." de ${senderId}`);
            return;
        }

        // Verificar si el bot está pausado para este cliente
        if (pausedChats.has(senderId)) {
            const pausedAt = pausedChats.get(senderId);
            if (Date.now() - pausedAt < PAUSE_DURATION_MS) {
                // El cliente escribió, pero el bot está pausado.
                clearTimeout(rescueTimers.get(senderId));
                rescueTimers.set(senderId, setTimeout(() => {
                    pausedChats.delete(senderId);
                    processFullMessage(senderId, msgText + "\n\n(Mensaje de sistema: El cliente escribió esto hace 5 minutos y el admin no respondió. Retoma la plática amablemente.)", sock);
                }, 5 * 60 * 1000));
                return; // Silencio, el bot está dormido
            } else {
                pausedChats.delete(senderId); // Tiempo expirado, bot despierta
                clearTimeout(rescueTimers.get(senderId));
                console.log(`⏰ Pausa terminada. Bot DESPIERTO para: ${senderId.split('@')[0]}`);
            }
        }

        clearTimeout(rescueTimers.get(senderId)); // Si el bot procesa normalmente, cancelamos el rescate

        if (!msgText || !msgText.trim()) return;

        console.log(`⏳ Recibido de ${senderId.split('@')[0]} (Debounce): ${msgText.substring(0,30)}`);

        if (!messageQueues.has(senderId)) {
            messageQueues.set(senderId, { timer: null, texts: [], msgs: [] });
        }
        
        const q = messageQueues.get(senderId);
        q.texts.push(msgText);
        q.msgs.push(msg);

        clearTimeout(q.timer);
        q.timer = setTimeout(async () => {
            const combinedText = q.texts.join(' \n ');
            const msgsToRead = [...q.msgs];
            messageQueues.delete(senderId);

            // ── COLA GLOBAL SECUENCIAL ──
            globalBotQueue = globalBotQueue.then(async () => {
                try {
                    // Generar retraso total humano aleatorio entre 6 y 15 segundos
                    const totalDelay = Math.floor(Math.random() * 9000) + 6000;
                    const thinkingDelay = Math.floor(totalDelay * 0.6);
                    const typingDelay = totalDelay - thinkingDelay;

                    // Jitter de pensamiento/lectura
                    await new Promise(r => setTimeout(r, thinkingDelay));

                    // 👤 VISTO HUMANO: Marcar leído y componer justo antes de empezar a escribir
                    if (sock && msgsToRead.length > 0) {
                        try {
                            const keys = msgsToRead.map(m => m.key);
                            await sock.readMessages(keys);
                            await sock.presenceSubscribe(senderId);
                            await sock.sendPresenceUpdate('composing', senderId);
                        } catch (readErr) {
                            // Fallback silencioso
                        }
                    }

                    await processFullMessage(senderId, combinedText, sock, typingDelay);
                } catch (innerErr) {
                    console.error(`❌ Error en cola secuencial para ${senderId}:`, innerErr.message);
                }
            });
        }, DEBOUNCE_TIME_MS);
    });


    // EXPRESS SERVER PARA MOSTRAR QR
    const qrApp = express();
    
    // Alias para /pair y /qr
    qrApp.get(['/pair', '/qr'], async (req, res) => {
        if (!currentQR) return res.send(`<h2>✅ Conectado o cargando QR... (Refresca en 5 segs)</h2>`);
        try {
            const qrImageURL = await qrcodeLib.toDataURL(currentQR);
            res.send(`
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: #000; color: white;">
                    <h1 style="color: #00ff88;">Accrual WhatsApp Bot (Baileys)</h1>
                    <img src="${qrImageURL}" style="width: 350px; height: 350px; border-radius: 10px; padding: 20px; background: white;" />
                </div>
            `);
        } catch (e) { res.send("Error"); }
    });

    qrApp.listen(3001, () => {
        console.log(`🌐 [Enlace de Escaneo Remoto] Accede a: http://localhost:3001/pair`);
    });
};

// Sincronizar LIDs periódicamente (cada 5 minutos)
setInterval(async () => {
    if (waSock) {
        await syncBlacklistLids(waSock);
        await refreshBlacklist();
    }
}, 5 * 60 * 1000);

const isPM2 = process.env.pm_id !== undefined;
if (isPM2 || process.argv[1] === fileURLToPath(import.meta.url)) {
    initWhatsAppBot();
}
