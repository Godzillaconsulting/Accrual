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

    // Convertir '10:00 am' a '10:00:00'
    let horaStr = hora.split(' ')[0];
    const isPM = hora.toLowerCase().includes('pm');
    let [horas, minutos] = horaStr.split(':');
    let horasInt = parseInt(horas);
    if (isPM && horasInt !== 12) horasInt += 12;
    if (!isPM && horasInt === 12) horasInt = 0;

    const startDateTimeStr = `${fecha}T${horasInt.toString().padStart(2, '0')}:${minutos}:00`;
    const endDateTimeStr = `${fecha}T${(horasInt + 1).toString().padStart(2, '0')}:${minutos}:00`;

    const event = {
        summary: `Consulta Accrual: ${nombre} - ${servicio}`,
        description: `Servicio: ${servicio}\nTeléfono: ${telefono}\nEmail: ${correo || 'No provisto'}\nNotas: ${notas}`,
        start: { dateTime: startDateTimeStr, timeZone: 'America/Ojinaga' },
        end: { dateTime: endDateTimeStr, timeZone: 'America/Ojinaga' },
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
