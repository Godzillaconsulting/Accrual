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

const SESSIONS_BASE = 'C:\\Users\\GODZILLA.IA\\Accrual\\Accrual\\bot_sessions';
const DEBOUNCE_TIME_MS = 8000; // 8 segundos de buffer (jitter de lectura)
const messageQueues = new Map();
const pausedChats = new Map(); // Para dormir al bot cuando un humano interviene
const rescueTimers = new Map(); // Para retomar la plática si el admin olvida contestar
const PAUSE_DURATION_MS = 1 * 60 * 1000; // 1 minuto de pausa

// O(1) RAM Cache para Lista Negra
let blacklistSet = new Set();
const refreshBlacklist = async () => {
    try {
        const result = await pool.query('SELECT phone_number FROM wa_blacklist');
        blacklistSet = new Set(result.rows.map(row => row.phone_number));
    } catch (error) {
        // Ignorar en caso de que la base de datos se esté reiniciando
    }
};
// Refrescar cada 60 segundos
setInterval(refreshBlacklist, 60000);

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
            model: "gemini-2.0-flash",
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
const processFullMessage = async (senderId, messageText, sock) => {
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

        // JITTER: 8 Segundos extra simulando que un humano escribe despacio
        await new Promise(r => setTimeout(r, 8000));

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
            "CALL sp_process_incoming_wa_message((SELECT gen_random_uuid()), $1, $2, 'WA_BOT_CONVERSATION', 'CALIFICACION_BOT', $3::JSONB)",
            [senderId, messageText + " [RESP] " + botReply, JSON.stringify(contexto_ia)]
        );

    } catch (error) {
        console.error("❌ Error WA engine:", error);
    }
};

// ===============================================
// INICIALIZACIÓN DE BAILEYS
// ===============================================
export const initWhatsAppBot = async () => {
    await refreshBlacklist();
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

    sock.ev.on('creds.update', saveCreds);

    let currentQR = null;

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            currentQR = qr;
            console.log('\n=============================================');
            console.log('📱 NUEVO QR DISPONIBLE PARA ESCANEO 📱');
            console.log('=============================================');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(`⚠️ Desconectado. Reconectar: ${shouldReconnect}`);
            if (shouldReconnect) {
                setTimeout(initWhatsAppBot, 5000);
            } else {
                console.error('❌ Sesión cerrada desde el celular. Usa la Opción 6 del Gestor para borrar la sesión y escanear un nuevo QR.');
            }
        } else if (connection === 'open') {
            currentQR = null;
            console.log('✅ Neurona Accrual (Baileys) conectada y lista 24/7!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message) return;

        const senderId = msg.key.remoteJid;
        if (senderId.endsWith('@g.us') || senderId === 'status@broadcast') return;

        // Búsqueda en 0.001 milisegundos gracias a Hash Set
        if (blacklistSet.has(senderId)) return;

        const msgText = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        // Si el humano envía un mensaje desde su celular (WhatsApp Web/App)
        if (msg.key.fromMe) {
            if (msgText.trim().toLowerCase() === '/bot') {
                pausedChats.delete(senderId);
                clearTimeout(rescueTimers.get(senderId));
                console.log(`🤖 Bot DESPERTADO manualmente para el chat: ${senderId.split('@')[0]}`);
            } else {
                pausedChats.set(senderId, Date.now());
                console.log(`💤 Humano intervino. Bot PAUSADO por 1 min para: ${senderId.split('@')[0]}`);
                
                // Activar Rescue Timer para 2 minutos
                clearTimeout(rescueTimers.get(senderId));
                rescueTimers.set(senderId, setTimeout(() => {
                    pausedChats.delete(senderId);
                    processFullMessage(senderId, "(Mensaje de sistema invisible: Han pasado 2 minutos desde que el administrador intervino y el chat se quedó en pausa. Retoma la plática con el cliente de forma natural, como si fueras el experto continuando la idea.)", sock);
                }, 2 * 60 * 1000));
            }
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
                    processFullMessage(senderId, msgText + "\n\n(Mensaje de sistema: El cliente escribió esto hace 2 minutos y el admin no respondió. Retoma la plática amablemente.)", sock);
                }, 2 * 60 * 1000));
                return; // Silencio, el bot está dormido
            } else {
                pausedChats.delete(senderId); // Tiempo expirado, bot despierta
                clearTimeout(rescueTimers.get(senderId));
                console.log(`⏰ Pausa terminada. Bot DESPIERTO para: ${senderId.split('@')[0]}`);
            }
        }

        clearTimeout(rescueTimers.get(senderId)); // Si el bot procesa normalmente, cancelamos el rescate

        try { await sock.readMessages([msg.key]); } catch (e) {}

        if (!msgText) return;

        console.log(`⏳ Recibido de ${senderId.split('@')[0]} (Debounce): ${msgText.substring(0,30)}`);

        if (!messageQueues.has(senderId)) {
            messageQueues.set(senderId, { timer: null, texts: [] });
        }
        
        const q = messageQueues.get(senderId);
        q.texts.push(msgText);

        clearTimeout(q.timer);
        q.timer = setTimeout(async () => {
            messageQueues.delete(senderId);
            const combinedText = q.texts.join(' \n ');
            await processFullMessage(senderId, combinedText, sock);
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

import { fileURLToPath } from 'url';
const isPM2 = process.env.pm_id !== undefined;
if (isPM2 || process.argv[1] === fileURLToPath(import.meta.url)) {
    initWhatsAppBot();
}
