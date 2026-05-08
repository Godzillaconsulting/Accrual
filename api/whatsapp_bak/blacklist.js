import { sql } from '../db.js';

export default async function handler(request, response) {
    if (request.method === 'GET') {
        try {
            const blacklist = await sql`SELECT * FROM wa_blacklist ORDER BY added_at DESC`;
            return response.status(200).json({ success: true, blacklist });
        } catch (error) {
            return response.status(500).json({ success: false, error: error.message });
        }
    } else if (request.method === 'POST') {
        const { phone_number, reason } = request.body;
        if (!phone_number) return response.status(400).json({ success: false, error: "Missing phone_number" });
        try {
            await sql`INSERT INTO wa_blacklist (phone_number, reason) VALUES (${phone_number}, ${reason || 'Spam'}) ON CONFLICT (phone_number) DO NOTHING`;
            return response.status(200).json({ success: true });
        } catch (error) {
            return response.status(500).json({ success: false, error: error.message });
        }
    } else if (request.method === 'DELETE') {
        // En Vercel, si pasas /api/whatsapp/blacklist/5215555555555 no llega al body a menos que mandes el payload,
        // pero el usuario lo está mandando en la URL (DELETE `/api/whatsapp/blacklist/${encodeURIComponent(phone)}`).
        // Wait, Vercel requiere que el archivo se llame [phone].js para rutas dinámicas, o debemos leer la URL.
        const urlSegments = request.url.split('/');
        const phone_number = urlSegments[urlSegments.length - 1];

        if (!phone_number || phone_number === 'blacklist') {
            return response.status(400).json({ success: false, error: "Missing phone_number in URL" });
        }

        try {
            await sql`DELETE FROM wa_blacklist WHERE phone_number = ${decodeURIComponent(phone_number)}`;
            return response.status(200).json({ success: true });
        } catch (error) {
            return response.status(500).json({ success: false, error: error.message });
        }
    } else {
        return response.status(405).json({ error: 'Method not allowed' });
    }
}
