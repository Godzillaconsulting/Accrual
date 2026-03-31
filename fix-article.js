import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

async function fixArticle() {
    try {
        if (!process.env.DATABASE_URL) {
            console.error('No DATABASE_URL found in env!');
            return;
        }
        console.log('Connecting to database...');
        const sql = neon(process.env.DATABASE_URL);
        
        console.log('Fixing typo in article 8...');
        await sql`
            UPDATE articles 
            SET content = REPLACE(content, 'Hidratación', 'Erosión')
            WHERE id = 8;
        `;
        
        console.log('Article updated successfully.');
    } catch (error) {
        console.error('Error updating article:', error);
    }
}

fixArticle();
