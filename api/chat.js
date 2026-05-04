import { sql } from './db.js';
import { generateAccrualBotResponse } from '../bot/ai.js';

const rateLimitMap = new Map();

// Security: XSS Sanitization
const sanitize = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
};

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Security: In-memory Rate Limiting
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        const record = rateLimitMap.get(ip) || { count: 0, start: now };
        if (now - record.start > 600000) { record.count = 0; record.start = now; } // Reset after 10 mins
        record.count += 1;
        rateLimitMap.set(ip, record);

        if (record.count > 15) {
            return res.status(429).json({ error: 'Demasiadas peticiones. Intenta más tarde.' });
        }

        const raw = req.body || {};
        const sessionId = sanitize(raw.sessionId);
        const message = sanitize(raw.message);

        if (!sessionId || !message) {
            return res.status(400).json({ error: 'Missing sessionId or message' });
        }

        // Fetch user history from Neon Database
        const historyRows = await sql`
            SELECT role, content
            FROM chat_history
            WHERE session_id = ${sessionId}
            ORDER BY created_at ASC
            LIMIT 40
        `;
        
        let history = historyRows.map(row => ({
            role: row.role,
            content: row.content
        }));

        // Call the Accrual Protocol AI logic
        const aiResponse = await generateAccrualBotResponse(history, message);

        // Store the interaction in the database
        await sql`
            INSERT INTO chat_history (session_id, role, content)
            VALUES (${sessionId}, 'user', ${message})
        `;

        await sql`
            INSERT INTO chat_history (session_id, role, content)
            VALUES (${sessionId}, 'assistant', ${aiResponse})
        `;

        return res.status(200).json({ reply: aiResponse });

    } catch (error) {
        console.error('Error in /api/chat:', error);
        return res.status(500).json({ error: error.message });
    }
}
