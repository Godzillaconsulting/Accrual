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
