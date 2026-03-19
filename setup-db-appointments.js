import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function setupAppointmentsDB() {
    try {
        console.log('Creando tabla appointments...');
        // Execute the schema query
        await sql`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellidos VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                telefono VARCHAR(20) NOT NULL,
                mensaje TEXT,
                modalidad VARCHAR(20) NOT NULL,
                fecha DATE NOT NULL,
                hora VARCHAR(20) NOT NULL,
                duracion VARCHAR(20) NOT NULL,
                precio NUMERIC(10, 2) NOT NULL,
                stripe_payment_intent_id VARCHAR(255),
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        console.log('Tabla appointments creada exitosamente.');

        // Optionally, check if it was created and show schema
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public' 
            AND table_type='BASE TABLE';
        `;
        console.log('Tablas existentes:', tables.map(t => t.table_name).join(', '));
        
    } catch (error) {
        console.error('Error creando la base de datos de appointments:', error);
    }
}

setupAppointmentsDB();
