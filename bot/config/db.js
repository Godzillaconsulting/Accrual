import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDocker = fs.existsSync('/.dockerenv') || fs.existsSync('/run/.containerenv');

if (!isDocker) {
    // Si corre directamente en host (Windows), cargar el .env raíz sobreescribiendo DB_HOST a localhost
    dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: true });
} else {
    // Si corre en Docker, respetar variables
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

console.log(`🔌 [Bot DB] Conectando a Postgres en ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432} / ${process.env.DB_NAME || 'accrual'}`);

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'accrual',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'godzilla2026',
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
