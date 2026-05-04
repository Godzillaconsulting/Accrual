import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import qrcodeLib from 'qrcode';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from './config/db.js';
import { agendarEnGoogleCalendar, cancelarEnGoogleCalendar } from './services/calendarService.js';
import { SYSTEM_PROMPT, chatTools, withTimeout } from './config/zilla-prompt.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Usa el path de .env si lo necesitas. 
const sessionPath = process.env.WWEBJS_SESSION_DIR || 'E:\\accrual_bot_sessions';

export const initWhatsAppBot = () => {
    console.log("🟢 Iniciando Cliente de WhatsApp Local (whatsapp-web.js)...");
    
    try {
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true, mode: 0o700 });
        } else {
            console.log(`🔒 Directorio de sesión disponible en ${sessionPath}`);
        }
    } catch (e) {
        console.warn(`⚠️ Error en permisos de guardado: ${e.message}`);
    }
    
    const client = new Client({
        authStrategy: new LocalAuth({ dataPath: sessionPath }),
        puppeteer: {
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-gpu'
            ],
            headless: 'new'
        }
    });

    let currentQR = null;

    client.on('qr', (qr) => {
        currentQR = qr;
        console.log('\n=============================================');
        console.log('📱 CÓDIGO QR GENERADO. DISPONIBLE EN WEB Y TERMINAL 📱');
        console.log('=============================================');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        currentQR = null;
        console.log('✅ Neurona Accrual (WhatsApp Web) conectada y lista!');
    });

    // EXPRESS SERVER PARA MOSTRAR QR
    const qrApp = express();
    qrApp.get('/qr', async (req, res) => {
        if (!currentQR) {
            return res.send(`
                <h2 style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                    ✅ El bot ya está conectado, o el QR aún se está generando (Recarga en 5 segundos).
                </h2>
            `);
        }
        try {
            const qrImageURL = await qrcodeLib.toDataURL(currentQR);
            res.send(`
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; background: #000; color: white;">
                    <h1 style="color: #00ff88;">Accrual WhatsApp Bot</h1>
                    <p>Abre WhatsApp en tu celular > Dispositivos Vinculados > Vincular</p>
                    <img src="${qrImageURL}" style="width: 350px; height: 350px; border-radius: 10px; padding: 20px; background: white;" />
                    <p style="margin-top: 20px; opacity: 0.6;">Conexión directa local a PostgreSQL E:</p>
                </div>
            `);
        } catch (e) {
            res.status(500).send("Error generando imagen QR: " + e.message);
        }
    });

    qrApp.use(express.json());

    // ENDPOINT PARA PAIRING CODE (VINCULACIÓN CON NÚMERO)
    qrApp.post('/api/pair', async (req, res) => {
        try {
            const { phone } = req.body;
            if (!phone) return res.status(400).json({ error: "Falta número de teléfono" });
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            // Solicitar a la librería de whatsapp el código
            const code = await client.requestPairingCode(cleanPhone);
            res.json({ success: true, code });
        } catch (e) {
            console.error("Error generando pairing code:", e);
            res.status(500).json({ error: e.message });
        }
    });

    // PANTALLA PREMIUM DE VINCULACIÓN
    qrApp.get('/link', (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vincular Accrual Bot</title>
                <style>
                    body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                    .card { background: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center; max-width: 420px; width: 90%; border: 1px solid #334155; }
                    h1 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1.8rem; }
                    p { color: #94a3b8; margin-bottom: 2rem; line-height: 1.6; font-size: 0.95rem; }
                    input { background: #0f172a; border: 1px solid #475569; color: white; padding: 14px; border-radius: 8px; width: calc(100% - 30px); font-size: 18px; margin-bottom: 1.5rem; outline: none; text-align: center; transition: border-color 0.3s; }
                    input:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2); }
                    button { background: linear-gradient(135deg, #0ea5e9, #2563eb); color: white; border: none; padding: 14px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; transition: transform 0.2s, opacity 0.3s; font-weight: 600; width: 100%; }
                    button:hover { opacity: 0.9; transform: translateY(-1px); }
                    button:disabled { background: #475569; cursor: not-allowed; transform: none; }
                    #codeDisplay { margin-top: 2rem; font-size: 2.8rem; font-weight: 900; letter-spacing: 8px; color: #10b981; display: none; background: #022c22; padding: 20px; border-radius: 12px; border: 2px dashed #059669; }
                    .instructions { margin-top: 2rem; text-align: left; font-size: 14.5px; color: #cbd5e1; display: none; background: #0f172a; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #38bdf8; }
                    .instructions li { margin-bottom: 10px; list-style-type: none; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>Conexión Remota Accrual</h1>
                    <p>Ingresa el número de WhatsApp del cliente para generar un <strong>Código de Vinculación Seguro</strong>.</p>
                    
                    <input type="text" id="phone" placeholder="Ej: 5215555555555" autocomplete="off" />
                    <button id="btnGenerar" onclick="requestPairingCode()">Generar Código de 8 Dígitos</button>
                    
                    <div id="codeDisplay"></div>
                    
                    <ul class="instructions" id="instructions">
                        <li>📱 1. Abre WhatsApp en tu celular.</li>
                        <li>⚙️ 2. Toca en <strong>Dispositivos Vinculados</strong>.</li>
                        <li>➕ 3. Selecciona <strong>Vincular un dispositivo</strong>.</li>
                        <li>🔢 4. Toca en <strong>Vincular con el número de teléfono</strong>.</li>
                        <li>✅ 5. Ingresa el código que aparece arriba.</li>
                    </ul>
                </div>

                <script>
                    async function requestPairingCode() {
                        const phone = document.getElementById('phone').value;
                        const btn = document.getElementById('btnGenerar');
                        
                        if(!phone || phone.length < 10) return alert('Por favor, ingresa un número de teléfono válido.');
                        
                        btn.disabled = true;
                        btn.innerText = 'Generando... ⏳';
                        
                        try {
                            const res = await fetch('/api/pair', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ phone })
                            });
                            
                            const data = await res.json();
                            
                            if(data.success) {
                                document.getElementById('codeDisplay').innerText = data.code;
                                document.getElementById('codeDisplay').style.display = 'block';
                                document.getElementById('instructions').style.display = 'block';
                                btn.innerText = '¡Código Generado! ✅';
                            } else {
                                alert('Error: ' + data.error);
                                btn.innerText = 'Generar Código de 8 Dígitos';
                                btn.disabled = false;
                            }
                        } catch(e) {
                            alert('Error de red al conectar con el servidor.');
                            btn.innerText = 'Generar Código de 8 Dígitos';
                            btn.disabled = false;
                        }
                    }
                </script>
            </body>
            </html>
        `);
    });

    qrApp.post('/api/internal/send_message', async (req, res) => {
        try {
            const { numero, mensaje } = req.body;
            if (!numero || !mensaje) return res.status(400).json({ error: "Faltan parametros" });
            
            // Format for whatsapp-web.js (usually number@c.us)
            const chatId = numero.includes('@c.us') ? numero : `${numero}@c.us`;
            await client.sendMessage(chatId, mensaje);
            
            res.json({ success: true, message: "Mensaje de WhatsApp disparado correctamente" });
        } catch (e) {
            console.error("Error disparando WA remoto:", e);
            res.status(500).json({ error: e.message });
        }
    });

    qrApp.listen(3003, () => {
        console.log(`🌐 [Enlace de Escaneo Remoto] Accede a: http://localhost:3003/qr`);
    });

    client.on('message', async (message) => {
        if (message.isGroupMsg) return;
        if (!message.body) return;

        const senderId = message.from;
        const messageText = message.body;

        const maskedSender = senderId.substring(0, 4) + "****" + senderId.substring(senderId.length - 4);
        console.log(`📩 WA Msg recibido [${maskedSender}]: ...`);

        try {
            // Guardamos mensaje temporal y bajamos contexto desde SP que ya hemos creado en PostgreSQL
            // Usamos wa_workflow_states para leer el historial_mensajes localmente.
            let sessionStateResult;
            try {
                // Fetch context
                sessionStateResult = await pool.query(
                    "SELECT contexto_ia FROM wa_workflow_states WHERE numero_contacto = $1",
                    [senderId]
                );
            } catch (err) {
                console.error("No se pudo leer workflow_states", err);
            }

            let historial_mensajes = [];
            let contexto_ia = {};

            if (sessionStateResult && sessionStateResult.rows.length > 0) {
                contexto_ia = sessionStateResult.rows[0].contexto_ia || {};
                historial_mensajes = contexto_ia.historial_mensajes || [];
            }

            // Append User Message a memoria local
            historial_mensajes.push({ role: 'user', contenido: messageText });
            if(historial_mensajes.length > 20) {
                 historial_mensajes = historial_mensajes.slice(-20); // Mantener 20 msg máx por performance
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

            const apiKey = (process.env.GEMINI_API_KEY || "").trim();
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: SYSTEM_PROMPT,
                tools: [{ functionDeclarations: chatTools }]
            });

            const chat = model.startChat({ history: safeHistory });
            let result = await withTimeout(
                chat.sendMessage(messageText), 
                "Lo lamento, la señal del servidor fiscal es un poco débil ahora mismo. ¿Podemos intentarlo de nuevo en unos minutos?"
            );
            
            let botReply = result.response.text();
            const functionCalls = result.response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                for (const call of functionCalls) {
                    let fRes = {};
                    if (call.name === "check_availability") {
                        const { fecha, hora } = call.args;
                        try {
                            const query = "SELECT COUNT(*) as total FROM appointments WHERE fecha=$1 AND ABS(EXTRACT(EPOCH FROM (hora::time - $2::time))) < 3600 AND status!='cancelada'";
                            const r = await pool.query(query, [fecha, hora]);
                            fRes = { disponible: parseInt(r.rows[0].total) === 0 };
                        } catch (e) { fRes = { error: 'Error consultando BD' }; }
                    } else if (call.name === "save_appointment") {
                        const { nombre, correo, telefono, servicio, fecha, hora, notas } = call.args;
                        try {
                            const queryConflict = "SELECT COUNT(*) as total FROM appointments WHERE fecha=$1 AND ABS(EXTRACT(EPOCH FROM (hora::time - $2::time))) < 3600 AND status!='cancelada'";
                            const conflictCheck = await pool.query(queryConflict, [fecha, hora]);
                            
                            if (parseInt(conflictCheck.rows[0].total) > 0) {
                                fRes = { success: false, error: "Horario ocupado." };
                            } else {
                                let gRes = await agendarEnGoogleCalendar({ nombre, correo, telefono, servicio, fecha, hora, notas }).catch(e => null);
                                let calendarId = gRes ? gRes.id : null;
                                
                                const r = await pool.query(
                                    "INSERT INTO appointments (nombre, email, telefono, mensaje, service_requested, fecha, hora, status, modalidad, google_calendar_id) VALUES ($1,$2,$3,$4,$5,$6,$7,'confirmada','whatsapp',$8) RETURNING id",
                                    [nombre, correo || 'sin-correo@wa.com', telefono, notas, servicio, fecha, hora, calendarId]
                                );
                                fRes = { success: true, id: r.rows[0].id, alert: "Cita guardada." };
                                
                            }
                        } catch (err) {
                            console.error("❌ Fallo crítico WA Insert:", err.message);
                            fRes = { success: false, error: "Error interno de base de datos." };
                        }
                    }

                    result = await withTimeout(
                        chat.sendMessage([{ functionResponse: { name: call.name, response: fRes } }]),
                        "Disculpa la demora, mi sistema rechazó la solicitud final. ¿Te ayudo con otra acción?"
                    );
                    botReply = result.response.text();
                }
            }

            await client.sendMessage(senderId, botReply);
            
            // Append assistant msg to Local Context
            historial_mensajes.push({ role: 'assistant', contenido: botReply });
            contexto_ia.historial_mensajes = historial_mensajes;

            // Log usando SP en la BD
            // function syntax: sp_process_incoming_wa_message(p_session_id UUID, p_numero_remitente VARCHAR, p_contenido TEXT, p_clasificacion_ia VARCHAR, p_etapa_workflow VARCHAR, p_contexto_ia JSONB)
            await pool.query(
                "CALL sp_process_incoming_wa_message((SELECT gen_random_uuid()), $1, $2, 'WA_BOT_CONVERSATION', 'CALIFICACION_BOT', $3::JSONB)",
                [senderId, messageText + " [RESP] " + botReply, JSON.stringify(contexto_ia)]
            );

        } catch (error) {
            console.error("❌ Error WA engine:", error);
        }
    });

    client.initialize();

    process.on('SIGINT', async () => {
        console.log('🛑 [SIGINT] PM2 deteniendo Bot...');
        await client.destroy();
        process.exit(0);
    });
};

import { fileURLToPath } from 'url';
const isPM2 = process.env.pm_id !== undefined;
if (isPM2 || process.argv[1] === fileURLToPath(import.meta.url)) {
    initWhatsAppBot();
}
