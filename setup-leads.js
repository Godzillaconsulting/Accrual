import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function setup() {
    try {
        console.log('Creando tabla leads...');
        await sql`
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('Tabla leads lista.');
    } catch (error) {
        console.error('Error setup leads DB:', error);
    }
}
setup();
