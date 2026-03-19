import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function setup() {
    try {
        console.log('Creando tabla appointments...');
        await sql`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                company TEXT,
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                modality TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (appointment_date, appointment_time)
            );
        `;
        console.log('Tabla appointments lista.');
    } catch (error) {
        console.error('Error setup appointments DB:', error);
    }
}
setup();
