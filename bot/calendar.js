import { google } from 'googleapis';
import 'dotenv/config';

// The Calendar ID should be set in environment variables
const CALENDAR_ID = process.env.CALENDAR_ID || 'primary';

// Authenticate with Google
// Using a simple API Key or standard credentials
// Important: the user needs to provide a credentials.json or GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY
let auth;
try {
    // Example using Service Account JSON file (if available) or standard env variables
    auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });
} catch (error) {
    console.warn('Warning: Google Auth couldn\'t be initialized. Need Service Account credentials.');
}

const calendar = google.calendar({ version: 'v3', auth });

/**
 * Creates an event in Google Calendar.
 * @param {Object} appointmentData
 */
export async function createGoogleCalendarEvent(appointmentData) {
    const { firstName, lastName, email, phone, date, time, duration, service, modality } = appointmentData;
    
    // Convert duration like '30min' or '60min' to minutes integer
    const durationMinutes = parseInt(duration) || 30;
    
    // Parse time mathematically to add duration without timezone issues
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);
    
    minutes += durationMinutes;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
    
    const endHoursStr = hours.toString().padStart(2, '0');
    const endMinutesStr = minutes.toString().padStart(2, '0');
    
    const startTimeStr = `${date}T${time}:00`;
    const endTimeStr = `${date}T${endHoursStr}:${endMinutesStr}:00`;

    const event = {
        summary: `Cita: ${firstName} ${lastName} - ${service || 'Servicio'}`,
        description: `Nombre: ${firstName} ${lastName}\nEmail: ${email || ''}\nTel: ${phone}\nModalidad: ${modality}\nServicio: ${service}`,
        start: {
            dateTime: startTimeStr,
            timeZone: 'America/Mexico_City',
        },
        end: {
            dateTime: endTimeStr,
            timeZone: 'America/Mexico_City',
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
        });
        console.log('Event created:', response.data.htmlLink);
        return { success: true, link: response.data.htmlLink, eventId: response.data.id };
    } catch (error) {
        console.error('Error creating Calendar event:', error);
        return { success: false, error: error.message };
    }
}
