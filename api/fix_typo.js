import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
    try {
        const sql = neon(process.env.DATABASE_URL);
        
        await sql`
            UPDATE articles 
            SET content = REPLACE(content, 'Hidratación', 'Erosión')
            WHERE id = 8;
        `;
        
        return response.status(200).json({ success: true, message: "Fixed 'Hidratación' to 'Erosión' in article 8" });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
