import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import express from 'express';
import 'dotenv/config'; 
import { parseAppointmentIntent } from './ai.js';
import { createGoogleCalendarEvent } from './calendar.js';
import { saveAppointmentToDB } from './db.js';

const app = express();
let isReady = false;

app.get('/', (req, res) => {
    if (isReady) return res.send('<h1>✅ Bot de Accrual autenticado y en línea.</h1>');
    res.send('<h1>⏳ Esperando conexión de WhatsApp. Revisa la consola de comandos para escribir el código de vinculación de 8 letras...</h1>');
});
app.listen(3005, () => console.log('🌐 Servidor de estatus iniciado en puerto 3005'));

// --- CONFIGURACIÓN DEL CLIENTE ---
const PAIRING_NUMBER = "5216563049604"; 

// Dictionary to keep track of user sessions (simple state machine)
const userSessions = {};

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('bot_sessions');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }), 
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        markOnlineOnConnect: false
    });

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            console.log("\n-----------------------------------------");
            console.log("🤖 SOLICITANDO CÓDIGO DE VINCULACIÓN A META PARA " + PAIRING_NUMBER + "...");
            try {
                const code = await sock.requestPairingCode(PAIRING_NUMBER);
                console.log("\n✅ ¡ÉXITO! TU CÓDIGO DE 8 LETRAS ES:");
                console.log("👉 " + (code?.match(/.{1,4}/g)?.join('-') || code) + " 👈");
                console.log("\n📱 Pásale este código a tu cliente.");
                console.log("En su WhatsApp debe entrar a: Dispositivos Vinculados > Vincular dispositivo > 'Vincular con el número de teléfono en su lugar'.");
                console.log("-----------------------------------------\n");
            } catch(e) {
                console.log("❌ Error solicitando el código.", e.message);
            }
        }, 3000); 
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            console.log('⚠️ Conexión cerrada. Reconectando: ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                 console.log("🛑 SESIÓN DESVINCULADA DESDE EL CELULAR. Borrando caché...");
                 fs.rmSync('bot_sessions', { recursive: true, force: true });
                 process.exit(0);
            }
        } else if (connection === 'open') {
            isReady = true;
            console.log('✅ ¡Asistente de Accrual (Baileys) lista y escuchando en el número '+ PAIRING_NUMBER +'!');
        }
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const userPhone = sender.split('@')[0];

        if (text && !msg.message.protocolMessage) {
            console.log(`📩 Recibido de ${userPhone}: ${text}`);
            
            try {
                await sock.sendPresenceUpdate('composing', sender);

                if (!userSessions[sender]) {
                    userSessions[sender] = { history: [] };
                }
                const session = userSessions[sender];
                session.history.push('User: ' + text);
                
                const fullConversation = session.history.join('\n');
                await sock.sendMessage(sender, { text: 'Procesando tu solicitud con IA... 🤖' });
                
                const intentResult = await parseAppointmentIntent(fullConversation);
                
                if (intentResult.intent === 'schedule_appointment') {
                    const data = intentResult.data;
                    if (!data.firstName || !data.date || !data.time || !data.service) {
                        await sock.sendMessage(sender, { text: `Para agendar tu cita, necesito un poco más de información. Me falta: ${intentResult.missingFields ? intentResult.missingFields.join(', ') : 'fecha, hora, o tu nombre'}. ¿Podrías proporcionarlo?` });
                    } else {
                        await sock.sendMessage(sender, { text: '¡Perfecto! Revisando disponibilidad y guardando tu cita...' });
                        
                        const dbResult = await saveAppointmentToDB({
                            firstName: data.firstName,
                            lastName: data.lastName || '',
                            email: '', 
                            phone: userPhone,
                            date: data.date,
                            time: data.time,
                            service: data.service,
                            modality: data.modality || 'WhatsApp'
                        });
                        
                        if (!dbResult.success) {
                            if (dbResult.isDoubleBooking) {
                                await sock.sendMessage(sender, { text: 'Ese horario ya está ocupado en el sistema 😔. Por favor elige otro horario u otra fecha.' });
                            } else {
                                await sock.sendMessage(sender, { text: 'Hubo un error al guardar la cita en la base de datos.' });
                            }
                        } else {
                            const calendarResult = await createGoogleCalendarEvent({
                                firstName: data.firstName,
                                lastName: data.lastName || '',
                                email: '', 
                                phone: userPhone,
                                date: data.date,
                                time: data.time,
                                service: data.service,
                                modality: data.modality || 'WhatsApp',
                                duration: '30min'
                            });
                            
                            if (calendarResult.success) {
                                await sock.sendMessage(sender, { text: `¡Tu cita ha sido confirmada exitosamente! ✅\nServicio: ${data.service}\nFecha: ${data.date}\nHora: ${data.time}\n\nEn Accrual, tus problemas fiscales tienen soluciones reales. ¡Te esperamos!` });
                                delete userSessions[sender];
                            } else {
                                await sock.sendMessage(sender, { text: 'La cita se guardó en nuestro sistema, pero hubo un error al sincronizarla con nuestro calendario general. De todas formas te esperamos.' });
                            }
                        }
                    }
                } else {
                    await sock.sendMessage(sender, { text: 'Soy el asistente virtual de Accrual. Puedo ayudarte a resolver dudas sobre nuestros servicios o agendar una cita. ¿En qué te puedo ayudar hoy?' });
                }

                await sock.sendPresenceUpdate('available', sender);

            } catch (error) {
                console.error("Error:", error);
                await sock.sendMessage(sender, { text: 'Una disculpa, tuve un problema técnico temporal procesando tu solicitud. ¿Me la podrías repetir en unos minutos?'});
            }
        }
    });
}

connectToWhatsApp();
