const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'accrual_db',
    password: 'Oswy19200',
    port: 5432,
});

async function main() {
    try {
        console.log('1. Creando o actualizando rol de Base de Datos para Producción...');
        try {
            await pool.query("CREATE ROLE accrual WITH LOGIN PASSWORD 'Accrual2026';");
            await pool.query("GRANT ALL PRIVILEGES ON DATABASE accrual_db TO accrual;");
            await pool.query("GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO accrual;");
            await pool.query("ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO accrual;");
            console.log('✅ Rol "accrual" creado exitosamente con contraseña "Accrual2026".');
        } catch(e) {
            if (e.code === '42710') {
               await pool.query("ALTER ROLE accrual WITH PASSWORD 'Accrual2026';");
               console.log('✅ Rol "accrual" ya existía, contraseña actualizada a "Accrual2026".');
            } else {
               throw e;
            }
        }

        console.log('2. Actualizando contraseña maestra del Panel Web (Admin)...');
        const hash = crypto.createHash('sha256').update('Accrual2026!@').digest('hex');
        await pool.query("UPDATE accrual_admin_users SET password_hash = $1 WHERE username = 'admin'", [hash]);
        console.log('✅ Clave del usuario Admin Web actualizada a "Accrual2026!@".');

    } catch (error) {
        console.error('❌ Error fatal:', error);
    } finally {
        pool.end();
    }
}

main();
