import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function optimizeDB() {
    try {
        console.log("Creando índices B-Tree en la infraestructura Neon...");
        
        // Índice para buscar por fecha (muy útil cuando hay muchas citas para el calendario)
        await sql`CREATE INDEX IF NOT EXISTS idx_appointments_fecha ON appointments (fecha);`;
        console.log("✅ Índice en 'fecha' creado correctamente.");
        
        // Índice para buscar clientes por email rápido
        await sql`CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments (email);`;
        console.log("✅ Índice en 'email' creado correctamente.");

        // Índice para búsquedas en Leads
        await sql`CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);`;
        console.log("✅ Índice en 'email' (Leads) creado correctamente.");

    } catch (e) {
        console.error("Error optimizando la BDD:", e.message);
    }
}

optimizeDB();
