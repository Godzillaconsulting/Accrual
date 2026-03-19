import { sql } from './db.js';

export default async function handler(request, response) {
    if (request.method === 'POST') {
        try {
            const { email } = request.body || {};
            if (!email) {
                return response.status(400).json({ error: 'El correo es obligatorio' });
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
