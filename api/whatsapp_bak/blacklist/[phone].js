import { sql } from '../../db.js';

export default async function handler(request, response) {
    if (request.method === 'DELETE') {
        const { phone } = request.query;

        if (!phone) {
            return response.status(400).json({ success: false, error: "Missing phone_number in URL" });
        }

        try {
            await sql`DELETE FROM wa_blacklist WHERE phone_number = ${phone}`;
            return response.status(200).json({ success: true });
        } catch (error) {
            return response.status(500).json({ success: false, error: error.message });
        }
    } else {
        return response.status(405).json({ error: 'Method not allowed' });
    }
}
