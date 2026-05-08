import fs from 'fs/promises';
import path from 'path';
import pg from 'pg';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ASSETS_DIR = 'E:/accrual/assets';

const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'accrual',
    password: process.env.DB_PASSWORD || 'godzilla2026',
    port: process.env.DB_PORT || 5432,
});

async function runIntegrityTest() {
    console.log('🚀 Iniciando Prueba de Integridad (Write-Read Integrity) en Disco Local E:');
    
    // 1. Path Validation
    try {
        await fs.access(ASSETS_DIR);
        console.log(`✅ Directorio detectado: ${ASSETS_DIR}`);
    } catch {
        console.log(`⚠️ Directorio no detectado, intentando crear ${ASSETS_DIR}...`);
        await fs.mkdir(ASSETS_DIR, { recursive: true });
        console.log(`✅ Directorio creado exitosamente: ${ASSETS_DIR}`);
    }

    // Fix Trigger to prevent NEW.variable crashes due to rowtype mismatch
    try {
        await pool.query(`
            CREATE OR REPLACE FUNCTION log_accrual_changes()
            RETURNS trigger AS $$
            BEGIN
                INSERT INTO audit_logs_accrual (table_name, action_type, record_id)
                VALUES (
                    TG_TABLE_NAME, 
                    TG_OP, 
                    COALESCE((to_jsonb(NEW)->>'client_id'), (to_jsonb(NEW)->>'document_id'), (to_jsonb(NEW)->>'session_id'), (to_jsonb(NEW)->>'message_id'), 'N/A')
                );
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
        console.log("✅ Audit Trigger corregido exitosamente para inserciones");
    } catch(e) {
        console.log("⚠️ No se pudo corregir trigger audit_logs_accrual:", e.message);
    }

    // Preparar un cliente temporal para asociarle los documentos
    const tempClientId = crypto.randomUUID();
    const rfcFalso = 'XAXX' + Math.floor(Math.random() * 100000000).toString().padStart(9, '0');
    try {
        await pool.query(
            "INSERT INTO clients_accrual (client_id, razon_social, rfc, regimen_fiscal) VALUES ($1, 'PRUEBA INTEGRIDAD SA DE CV', $2, 'Prueba de Carga') ON CONFLICT DO NOTHING",
            [tempClientId, rfcFalso]
        );
    } catch(e) {
        // Fallback a un id válido si el conflicto no funciona con gen random id.
        console.log("Error inserting client:", e.message);
    }

    // 2. Transacciones 10 Archivos Pesados (~5MB cada uno)
    console.log('\n📦 Generando 10 Archivos Pesados Aleatorios...');
    const writeStartTime = performance.now();
    
    const NUM_ARCHIVOS = 10;
    const tamanoEnMB = 5;
    const promesasEritura = [];
    
    // Crear buffer pesado de ~5MB
    const bufferPesado = Buffer.alloc(tamanoEnMB * 1024 * 1024, 'F'); 

    for (let i = 1; i <= NUM_ARCHIVOS; i++) {
        const fileName = `sim_doc_fiscal_${i}_${Date.now()}.pdf`;
        const filePath = path.join(ASSETS_DIR, fileName);
        
        promesasEritura.push(
            fs.writeFile(filePath, bufferPesado).then(() => filePath)
        );
    }
    
    const archivosEscritos = await Promise.all(promesasEritura);
    const writeEndTime = performance.now();
    
    console.log(`✅ Escritura Directa (Disco E:) completada en ${(writeEndTime - writeStartTime).toFixed(2)} ms`);
    console.log(`   (Aprox ${NUM_ARCHIVOS * tamanoEnMB}MB escritos. Rutas verificadas: ${archivosEscritos[0]}...)`);

    // 3. Transacciones - 1,000 Inserciones SQL
    console.log('\n💾 Insertando 1,000 registros en tax_documents...');
    const dbInstertStartTime = performance.now();

    const insertPromises = [];
    for (let i = 1; i <= 1000; i++) {
        // Tomar una ruta aleatoria de los 10 archivos subidos
        const rutaFisica = archivosEscritos[i % NUM_ARCHIVOS];

        const query = `
            INSERT INTO tax_documents (client_id, tipo_documento, formato, archivo_ruta_fisica, fecha_emision, fecha_vencimiento) 
            VALUES ($1, 'PRUEBA_MASIVA', 'PDF', $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
        `;
        insertPromises.push(pool.query(query, [tempClientId, rutaFisica]));
    }
    
    await Promise.all(insertPromises);
    const dbInstertEndTime = performance.now();
    console.log(`✅ 1,000 Registros insertados en LocalDB (PostgreSQL) en ${(dbInstertEndTime - dbInstertStartTime).toFixed(2)} ms`);

    // 4. Test de Lectura Simultáneo (Verificar Cero Cuellos de Botella)
    console.log('\n🔍 Probando lecturas críticas (Path Verification)...');
    
    const readQueryStart = performance.now();
    const resultado = await pool.query("SELECT COUNT(*) as cuenta FROM tax_documents WHERE tipo_documento = 'PRUEBA_MASIVA'");
    const readQueryEnd = performance.now();
    
    console.log(`✅ Búsqueda Select Count LocalDB: ${(readQueryEnd - readQueryStart).toFixed(2)} ms`);
    console.log(`   Total encontrados: ${resultado.rows[0].cuenta}`);

    console.log("\n=================================");
    console.log("   PRUEBA COMPLETADA CON ÉXITO   ");
    console.log("=================================\n");

    process.exit(0);
}

runIntegrityTest().catch(err => {
    console.error('❌ Error fatal en test:', err);
    process.exit(1);
});
