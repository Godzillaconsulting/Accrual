import http from 'http';
import articlesHandler from './api/articles.js';
import leadsHandler from './api/leads.js';
import appointmentsHandler from './api/appointments.js';

const server = http.createServer(async (req, res) => {
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST' || req.method === 'PUT') {
        const buffers = [];
        for await (const chunk of req) buffers.push(chunk);
        if (buffers.length > 0) {
            try { req.body = JSON.parse(Buffer.concat(buffers).toString()); } catch(e) {}
        }
    }

    try {
        if (req.url.startsWith('/api/articles')) {
            await articlesHandler(req, res);
        } else if (req.url.startsWith('/api/leads')) {
            await leadsHandler(req, res);
        } else if (req.url.startsWith('/api/appointments')) {
            await appointmentsHandler(req, res);
        } else {
            res.status(404).json({ error: 'Endpoint not found' });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

server.listen(3001, () => {
    console.log('🔌 Local API dev server running on port 3001');
});
