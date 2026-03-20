import { sql } from './db.js';

const rateLimitMap = new Map();

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
            // Security: XSS Sanitization
            const sanitize = (str) => {
                if (typeof str !== 'string') return '';
                return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
            };

            const raw = req.body || {};
            const firstName = sanitize(raw.firstName);
            const lastName = sanitize(raw.lastName);
            const email = sanitize(raw.email);
            const phone = sanitize(raw.phone);
            const message = sanitize(raw.message);
            const date = sanitize(raw.date);
            const time = sanitize(raw.time);
            const modality = sanitize(raw.modality);
            const service = sanitize(raw.service);
            const duration = sanitize(raw.duration);
            const price = raw.price;

            // Security: In-memory Rate Limiting
            const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
            const now = Date.now();
            const record = rateLimitMap.get(ip) || { count: 0, start: now };
            if (now - record.start > 600000) { record.count = 0; record.start = now; } // Reset after 10 mins
            record.count += 1;
            rateLimitMap.set(ip, record);

            if (record.count > 10) {
                return res.status(429).json({ error: 'Demasiadas peticiones. Intenta más tarde.' });
            }

            if (!firstName || !lastName || !email || !phone || !date || !time || !modality) {
                return res.status(400).json({ error: 'Faltan campos obligatorios' });
            }

            // Security: Strict Payload Length Limits (DoS Mitigation)
            if (firstName.length > 100 || lastName.length > 100 || email.length > 255 || phone.length > 50) {
                return res.status(400).json({ error: 'Payload excesivo en campos de contacto' });
            }
            if (message.length > 2000) {
                return res.status(400).json({ error: 'El mensaje no puede exceder los 2000 caracteres' });
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
