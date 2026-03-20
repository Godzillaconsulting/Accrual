import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function addConstraint() {
    try {
        await sql`
            ALTER TABLE appointments 
            ADD CONSTRAINT unique_fecha_hora UNIQUE (fecha, hora);
        `;
        console.log("Constraint UNIQUE(fecha, hora) added successfully.");
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log("Constraint already exists.");
        } else {
            console.error("Error adding constraint:", e);
        }
    }
}
addConstraint();
