import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../.env') }); // Point to Accrual/.env

const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CALENDAR_ID = process.env.CALENDAR_ID;

let authClient = null;

const getAuthClient = async () => {
    if (authClient) return authClient;
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        throw new Error('credentials.json no encontrado en Accrual/Accrual');
    }
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
    authClient = await auth.getClient();
    return authClient;
};

export const agendarEnGoogleCalendar = async ({ nombre, correo, telefono, servicio, fecha, hora, notas }) => {
    const auth = await getAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });

    const startDateTime = new Date(`${fecha}T${hora}:00-07:00`); // Asegurar timezone correcto
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hora de duración

    const event = {
        summary: `Consulta Accrual: ${nombre} - ${servicio}`,
        description: `Servicio: ${servicio}\nTeléfono: ${telefono}\nEmail: ${correo || 'No provisto'}\nNotas: ${notas}`,
        start: { dateTime: startDateTime.toISOString() },
        end: { dateTime: endDateTime.toISOString() },
        attendees: correo && correo !== 'sin-correo@wa.com' ? [{ email: correo }] : [],
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 24 * 60 },
                { method: 'popup', minutes: 30 },
            ],
        },
    };

    try {
        const res = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
            sendUpdates: 'all'
        });
        return { 
            id: res.data.id,
            personalCalendarLink: res.data.htmlLink
        };
    } catch (e) {
        console.error('Error Google Calendar Insert:', e);
        throw e;
    }
};

export const cancelarEnGoogleCalendar = async (eventId) => {
    try {
        const auth = await getAuthClient();
        const calendar = google.calendar({ version: 'v3', auth });
        await calendar.events.delete({
            calendarId: CALENDAR_ID,
            eventId: eventId,
        });
        return true;
    } catch (e) {
        console.error('Error Google Calendar Delete:', e);
        throw e;
    }
};
