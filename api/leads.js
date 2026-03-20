import { sql } from './db.js';

const rateLimitMapLeads = new Map();

const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
};

export default async function handler(request, response) {
    if (request.method === 'POST') {
        try {
            // Security: XSS Sanitization
            const raw = request.body || {};
            const email = sanitize(raw.email);

            // Security: Rate Limiting
            const ip = request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown';
            const now = Date.now();
            const record = rateLimitMapLeads.get(ip) || { count: 0, start: now };
            if (now - record.start > 600000) { record.count = 0; record.start = now; }
            record.count += 1;
            rateLimitMapLeads.set(ip, record);

            if (record.count > 10) {
                return response.status(429).json({ error: 'Demasiadas peticiones de suscripción. Intenta más tarde.' });
            }

            if (!email) {
                return response.status(400).json({ error: 'El correo es obligatorio' });
            }

            // Security: Strict Payload Bounds (DoS)
            if (email.length > 255) {
                return response.status(400).json({ error: 'Formato de correo inválido o excedido en caracteres' });
            }

            await sql`
                INSERT INTO leads (email) 
                VALUES (${email})
                ON CONFLICT (email) DO NOTHING
            `;

            return response.status(200).json({ success: true, message: 'Correo registrado exitosamente' });
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    } else {
        return response.status(405).json({ error: 'Method not allowed' });
    }
}
