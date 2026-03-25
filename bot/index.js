import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import 'dotenv/config'; // Make sure to load the env variables

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(), // Saves session to .wwebjs_auth/
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Useful for VPS deployment
    }
});

// Generate and scan this code with your phone
client.on('qr', (qr) => {
    console.log('--- NUEVO CÓDIGO QR ---');
    console.log('Escanea este código con tu aplicación de WhatsApp (Configuración > Dispositivos vinculados)');
    qrcode.generate(qr, { small: true });
});

// Client is properly authenticated and ready
client.on('ready', () => {
    console.log('¡Asistente de Accrual (Bot de WhatsApp) lista y escuchando en el número 6563049604!');
});

import { parseAppointmentIntent } from './ai.js';
import { createGoogleCalendarEvent } from './calendar.js';
import { saveAppointmentToDB } from './db.js';

// Dictionary to keep track of user sessions (simple state machine)
const userSessions = {};

client.on('message', async (msg) => {
    // Only respond to text messages for now and ignore status messages
    if (msg.body && !msg.isStatus) {
        console.log(`[Mensaje de ${msg.from}]: ${msg.body}`);
        
        // Start or retrieve session
        if (!userSessions[msg.from]) {
            userSessions[msg.from] = { history: [] };
        }
        const session = userSessions[msg.from];
        session.history.push('User: ' + msg.body);
        
        // Use Gemini to parse the conversation history
        const fullConversation = session.history.join('\n');
        msg.reply('Procesando tu solicitud con IA... 🤖');
        
        const intentResult = await parseAppointmentIntent(fullConversation);
        
        if (intentResult.intent === 'schedule_appointment') {
            const data = intentResult.data;
            // Check if we have all necessary info
            if (!data.firstName || !data.date || !data.time || !data.service) {
                msg.reply(`Para agendar tu cita, necesito un poco más de información. Me falta: ${intentResult.missingFields ? intentResult.missingFields.join(', ') : 'fecha, hora, o tu nombre'}. ¿Podrías proporcionarlo?`);
                return;
            }
            
            msg.reply('¡Perfecto! Revisando disponibilidad y guardando tu cita...');
            
            // 1. Save to DB First (to prevent double bookings as unique constraint)
            const dbResult = await saveAppointmentToDB({
                firstName: data.firstName,
                lastName: data.lastName || '',
                email: '', 
                phone: msg.from.replace('@c.us', ''),
                date: data.date,
                time: data.time,
                service: data.service,
                modality: data.modality || 'WhatsApp'
            });
            
            if (!dbResult.success) {
                if (dbResult.isDoubleBooking) {
                    msg.reply('Ese horario ya está ocupado en el sistema 😔. Por favor elige otro horario u otra fecha.');
                } else {
                    msg.reply('Hubo un error al guardar la cita en la base de datos.');
                }
                return;
            }
            
            // 2. Sync to Calendar
            const calendarResult = await createGoogleCalendarEvent({
                firstName: data.firstName,
                lastName: data.lastName || '',
                email: '', 
                phone: msg.from.replace('@c.us', ''),
                date: data.date,
                time: data.time,
                service: data.service,
                modality: data.modality || 'WhatsApp',
                duration: '30min'
            });
            
            if (calendarResult.success) {
                msg.reply(`¡Tu cita ha sido confirmada exitosamente! ✅\nServicio: ${data.service}\nFecha: ${data.date}\nHora: ${data.time}\n\nTe esperamos.`);
                // Clear session after successful booking
                delete userSessions[msg.from];
            } else {
                msg.reply('La cita se guardó en nuestro sistema, pero hubo un error al sincronizarla con nuestro calendario general. De todas formas te esperamos.');
            }
        } else {
            // General inquiry
            msg.reply('Soy el asistente de Godzilla Consulting. Puedo ayudarte a agendar citas. ¿En qué te puedo ayudar hoy?');
        }
    }
});

client.initialize();
