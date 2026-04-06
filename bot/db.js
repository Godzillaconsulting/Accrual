import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

export const sql = neon(process.env.DATABASE_URL || 'postgresql://placeholder');

/**
 * Inserts a new appointment in the Neon Postgres Database.
 * Relies on the EXACT same schema as api/appointments.js
 */
export async function saveAppointmentToDB(appt) {
    try {
        // Enforce defaults identical to the web form
        const duration = appt.duration || '30min';
        const calculatedPrice = appt.price || (duration === '60min' ? 1000 : 600);
        
        // Inserting into Neon table and expecting RETURNING id
        const result = await sql`
            INSERT INTO appointments (
                nombre, apellidos, email, telefono, mensaje, fecha, hora, modalidad, duracion, precio, status
            ) 
            VALUES (
                ${appt.firstName || 'Cliente'}, 
                ${appt.lastName || 'WhatsApp'}, 
                ${appt.email || 'whatsapp@bot.com'}, 
                ${appt.phone}, 
                ${appt.service ? 'Servicio solicitado: ' + appt.service : 'Cita generada vía WhatsApp Bot'}, 
                ${appt.date}, 
                ${appt.time}, 
                ${appt.modality || 'Virtual'}, 
                ${duration}, 
                ${calculatedPrice},
                'confirmed_by_bot'
            )
            RETURNING id
        `;
        
        return { success: true, appointmentId: result[0].id };
    } catch (error) {
        if (error.code === '23505') {
            return { success: false, error: 'Conflicto de horario. Esa fecha y hora ya están reservadas en la base de datos.', isDoubleBooking: true };
        }
        console.error('Error inserting into Neon:', error);
        return { success: false, error: error.message };
    }
}
