import { sql } from './db.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const date = url.searchParams.get('date');

            if (!date) {
                return res.status(400).json({ error: 'Falta proveer el parámetro date' });
            }

            const bookedAppointments = await sql`
                SELECT hora, duracion
                FROM appointments 
                WHERE fecha = ${date} 
                AND status != 'cancelled'
            `;

            // Return objects with both time and duration
            const bookedData = bookedAppointments.map(a => ({
                hora: a.hora,
                duracion: a.duracion || '30min'
            }));
            return res.status(200).json(bookedData);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const { firstName, lastName, email, phone, message, date, time, modality, service, duration, price } = req.body || {};

            if (!firstName || !lastName || !email || !phone || !date || !time || !modality) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            const calculatedPrice = price || (duration === '60min' ? 1000 : 600);

            // Insert ensuring it catches double bookings via the UNIQUE constraint
            const result = await sql`
                INSERT INTO appointments (nombre, apellidos, email, telefono, mensaje, fecha, hora, modalidad, duracion, service_requested, precio) 
                VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${message || ''}, ${date}, ${time}, ${modality}, ${duration || '30min'}, ${service || 'No especificado'}, ${calculatedPrice})
                RETURNING id
            `;

            return res.status(201).json({ success: true, appointmentId: result[0].id });
        } catch (error) {
            // Postgres unique constraint violation
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Este horario ya no está disponible. Por favor, selecciona otro.' });
            }
            return res.status(500).json({ error: error.message });
        }
    } 
    else if (req.method === 'PUT') {
        try {
            const { appointmentId, status, paymentMethod } = req.body || {};
            if (!appointmentId) {
                return res.status(400).json({ error: 'Falta appointmentId' });
            }
            
            await sql`
                UPDATE appointments 
                SET status = ${status || 'pending_verification'}
                WHERE id = ${appointmentId}
            `;

            return res.status(200).json({ success: true, message: 'Cita actualizada correctamente' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
