import { sql } from './db.js';

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const id = url.searchParams.get('id');

        try {
            if (id) {
                const article = await sql`SELECT * FROM articles WHERE id = ${id}`;
                if (article.length === 0) return response.status(404).json({ error: 'Article not found' });
                return response.status(200).json(article[0]);
            } else {
                const articles = await sql`SELECT * FROM articles ORDER BY id ASC`;
                return response.status(200).json(articles);
            }
        } catch (error) {
            return response.status(500).json({ error: error.message });
        }
    } else {
        return response.status(405).json({ error: 'Method not allowed' });
    }
}
