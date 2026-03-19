import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { data1 } from './data1.js';
import { data2 } from './data2.js';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log('Vaciando tabla articles...');
        await sql`TRUNCATE TABLE articles RESTART IDENTITY;`;
        
        const allArticles = [...data1, ...data2];
        console.log(`Insertando ${allArticles.length} artículos...`);
        for (const a of allArticles) {
            await sql`
                INSERT INTO articles (title, image, content)
                VALUES (${a.title}, ${a.image}, ${a.content})
            `;
            console.log(`Insertado: ${a.title}`);
        }
        console.log('Base de datos poblada correctamente.');
    } catch (e) {
        console.error('Error insertando datos:', e);
    }
}
run();
