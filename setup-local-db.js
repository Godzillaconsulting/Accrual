import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'accrual',
    user: 'postgres',
    password: 'godzilla2026',
});

async function setup() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255),
                apellidos VARCHAR(255),
                email VARCHAR(255),
                telefono VARCHAR(50),
                mensaje TEXT,
                service_requested VARCHAR(255),
                fecha DATE,
                hora TIME,
                modalidad VARCHAR(50),
                duracion VARCHAR(50),
                precio NUMERIC(10,2),
                status VARCHAR(50) DEFAULT 'confirmada',
                google_calendar_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla appointments creada o ya existente.');

        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS wa_workflow_states (
                state_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                numero_contacto VARCHAR(50) UNIQUE,
                etapa_embudo VARCHAR(100),
                contexto_ia JSONB,
                ultima_interaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla wa_workflow_states creada o ya existente.');
        
        await pool.query(`
            CREATE OR REPLACE PROCEDURE sp_process_incoming_wa_message(
                p_session_id UUID,
                p_numero_remitente VARCHAR(50),
                p_contenido TEXT,
                p_clasificacion_ia VARCHAR(100),
                p_etapa_workflow VARCHAR(100),
                p_contexto_ia JSONB
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                INSERT INTO wa_workflow_states (
                    numero_contacto, etapa_embudo, contexto_ia, ultima_interaccion
                ) VALUES (
                    p_numero_remitente, p_etapa_workflow, p_contexto_ia, CURRENT_TIMESTAMP
                )
                ON CONFLICT (numero_contacto) DO UPDATE 
                SET 
                    etapa_embudo = EXCLUDED.etapa_embudo,
                    contexto_ia = EXCLUDED.contexto_ia,
                    ultima_interaccion = CURRENT_TIMESTAMP;
            END;
            $$;
        `);
        console.log('✅ SP sp_process_incoming_wa_message creado.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creando tablas:', err);
        process.exit(1);
    }
}
setup();
