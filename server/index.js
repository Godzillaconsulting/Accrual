import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import helmet from 'helmet';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { exec } from 'child_process';

const __filenameSetup = fileURLToPath(import.meta.url);
const __dirnameSetup = path.dirname(__filenameSetup);

const isDocker = fs.existsSync('/.dockerenv') || fs.existsSync('/run/.containerenv');

if (!isDocker) {
    // Si corre directamente en host (Windows), cargar el .env raíz sobreescribiendo DB_HOST a localhost
    dotenv.config({ path: path.resolve(__dirnameSetup, '../../.env'), override: true });
} else {
    // Si corre en Docker, respetar variables locales
    dotenv.config();
}

console.log(`🔌 [API Server DB] Conectando a Postgres en ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432} / ${process.env.DB_NAME || 'accrual'}`);

const app = express();
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,  // React SPA maneja su propio CSP
    crossOriginEmbedderPolicy: false
}));
app.use(express.json());

// Configuracion de pool PostgreSQL (DB Local)
const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'accrual',
    password: process.env.DB_PASSWORD || 'godzilla2026', // Usual local password
    port: process.env.DB_PORT || 5432,
});

// Directorio de medios: E:/accrual-media (o fallback local si no existe E:)
const MEDIA_BASE = process.env.MEDIA_PATH || path.join(__dirnameSetup, '..', 'media-uploads');
const MEDIA_DIRS = {
    images:   path.join(MEDIA_BASE, 'images'),
    videos:   path.join(MEDIA_BASE, 'videos'),
    document: path.join(MEDIA_BASE, 'docs'),
};
Object.values(MEDIA_DIRS).forEach(d => fs.mkdirSync(d, { recursive: true }));

// Multer: almacenamiento en disco local (sin memoria RAM, directo al disco)
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, MEDIA_DIRS.images),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
});
const storageVideo = multer.diskStorage({
    destination: (req, file, cb) => {
        const isDoc = /pdf|doc|xls|ppt|csv/i.test(file.originalname);
        cb(null, isDoc ? MEDIA_DIRS.document : MEDIA_DIRS.videos);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    }
});
const uploadImage = multer({ storage: storageImage, limits: { fileSize: 15 * 1024 * 1024 } });
const uploadVideo = multer({ storage: storageVideo, limits: { fileSize: 1024 * 1024 * 1024 } });

// === Inicialización Autónoma de Tablas (Ahorro de I/O) ===
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS accrual_cms_nodes (
                id VARCHAR(100) PRIMARY KEY,
                draft_data JSONB DEFAULT '{}'::jsonb,
                published_data JSONB DEFAULT '{}'::jsonb,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS accrual_admin_users (
                user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100),
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'admin',
                photo_url VARCHAR(500),
                is_active BOOLEAN DEFAULT TRUE
            );

            CREATE TABLE IF NOT EXISTS accrual_media (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(300) NOT NULL,
                original_name VARCHAR(300),
                type VARCHAR(20) NOT NULL,
                size BIGINT DEFAULT 0,
                url VARCHAR(500) NOT NULL,
                disk_path VARCHAR(500) NOT NULL,
                uploaded_by VARCHAR(100) DEFAULT 'admin',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS accrual_pixel_events (
                id SERIAL PRIMARY KEY,
                event_name VARCHAR(100) NOT NULL,
                source_url VARCHAR(500),
                metadata JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wa_blacklist (
                phone_number VARCHAR(20) PRIMARY KEY,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                reason VARCHAR(255) DEFAULT 'Desconocido'
            );
        `);
        
        // === USUARIO GOD - Único master operacional ===
        const godHash = bcrypt.hashSync('4ccu47"="&', 10);
        const godExists = await pool.query("SELECT user_id FROM accrual_admin_users WHERE email = 'master@accrual.com.mx' OR username = 'adrianaccrual'");
        if (godExists.rows.length === 0) {
            await pool.query(
                `INSERT INTO accrual_admin_users (username, email, password_hash, role) 
                 VALUES ('adrianaccrual', 'master@accrual.com.mx', $1, 'super_admin')`,
                [godHash]
            );
        }
        // Eliminar usuario legacy 'admin' si existiera de versiones anteriores
        await pool.query(`DELETE FROM accrual_admin_users WHERE username = 'admin'`);

        console.log('\u2705 Base de datos verificada. Biblioteca de Medios LOCAL activa.');
    } catch (err) {
        console.error('\u274c Error al inicializar DB:', err);
    }
};
initDB();

/* =========================================================
   RUTAS DE COMUNICACIÓN (Eficientes en Memoria)
   ========================================================= */

// Rate limiting para prevenir Brute Force
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 10, // Limita a 10 intentos por IP
    message: { success: false, message: 'Demasiados intentos de inicio de sesión, por favor intente de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('⚠️ JWT_SECRET no configurado en .env');
    process.exit(1);
}

// Helper para verificación híbrida de contraseñas (Bcrypt y SHA-256 legacy)
function verifyPassword(password, storedHash) {
    if (storedHash && storedHash.startsWith('$2')) {
        return bcrypt.compareSync(password, storedHash);
    }
    // Fallback legacy SHA-256
    const shaHash = crypto.createHash('sha256').update(password).digest('hex');
    return shaHash === storedHash;
}

// Middleware de Autenticación JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ success: false, message: 'Se requiere token de autenticación' });
    }
};

// Middleware para verificar super_admin
const requireSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'super_admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol de super_admin.' });
    }
};

// --- AUTH LOGIC (JWT & Honeypot & Jitter) ---
app.post('/api/auth/login', loginLimiter, async (req, res) => {
    try {
        const { username, password, bot_catch, captcha } = req.body;

        // Jitter Algorithm: Retraso intencional y aleatorio de 500ms a 2500ms
        // Esto previene ataques de fuerza bruta basados en temporización o paralelismo de IAs.
        const jitterMs = Math.floor(Math.random() * 2000) + 500;
        await new Promise(resolve => setTimeout(resolve, jitterMs));

        // Honeypot check para prevenir bots/AI
        if (bot_catch) {
            return res.status(403).json({ success: false, message: 'Actividad sospechosa detectada.' });
        }

        // Sanitización básica (prevenir SQLi y longitudes anómalas)
        if (!username || !password || username.length > 50 || password.length > 100 || /[^a-zA-Z0-9_@]/.test(username)) {
            return res.status(400).json({ success: false, message: 'Entrada inválida.' });
        }

        const result = await pool.query('SELECT role, password_hash FROM accrual_admin_users WHERE username = $1 AND is_active = TRUE', [username]);
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (verifyPassword(password, user.password_hash)) {
                // Migración automática a Bcrypt si es SHA-256 legacy
                if (!user.password_hash.startsWith('$2')) {
                    const newBcryptHash = bcrypt.hashSync(password, 10);
                    await pool.query('UPDATE accrual_admin_users SET password_hash = $1 WHERE username = $2', [newBcryptHash, username]);
                }
                // Generar JWT Real con duración permanente "Estilo Meta" (90 días)
                const token = jwt.sign({ username, role: user.role }, JWT_SECRET, { expiresIn: '90d' });
                return res.json({ success: true, token, role: user.role });
            }
        }
        res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Accrual API', version: '1.0' });
});

// === RUTAS PÚBLICAS DE ARTÍCULOS ===
app.get('/api/public/articles', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, image, content, slug, created_at FROM articles ORDER BY created_at DESC');
        res.json({ success: true, articles: result.rows });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ success: false, error: 'Error fetching articles' });
    }
});

app.get('/api/public/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT id, title, image, content, slug, created_at FROM articles WHERE id = $1 OR slug = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }
        res.json({ success: true, article: result.rows[0] });
    } catch (error) {
        console.error('Error fetching article details:', error);
        res.status(500).json({ success: false, error: 'Error fetching article details' });
    }
});

// Rate Limiting para Citas Públicas (Prevención de Spam)
const publicAppointmentsLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // maximo 5 confirmaciones por usuario
    message: { error: 'Demasiadas peticiones. Intenta más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// === RUTAS PÚBLICAS DE CITAS (Para Vercel Frontend) ===
app.get('/api/public/appointments', async (req, res) => {
    try {
        const date = req.query.date;
        if (!date) {
            return res.status(400).json({ error: 'Falta proveer el parámetro date' });
        }
        const bookedAppointments = await pool.query(
            "SELECT hora, duracion FROM appointments WHERE fecha = $1 AND status != 'cancelled' AND status != 'cancelada'",
            [date]
        );
        const bookedData = bookedAppointments.rows.map(a => ({
            hora: a.hora,
            duracion: a.duracion || '30min'
        }));
        return res.status(200).json(bookedData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/api/public/appointments', publicAppointmentsLimiter, async (req, res) => {
    try {
        // Jitter Algorithm: Retraso intencional y aleatorio para mitigar ataques paralelos
        const jitterMs = Math.floor(Math.random() * 2000) + 500;
        await new Promise(resolve => setTimeout(resolve, jitterMs));

        const sanitize = (str) => {
            if (typeof str !== 'string') return '';
            return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
        };

        const raw = req.body || {};
        const firstName = sanitize(raw.firstName);
        const lastName = sanitize(raw.lastName);
        const email = sanitize(raw.email);
        const phone = sanitize(raw.phone);
        const message = sanitize(raw.message);
        const date = sanitize(raw.date);
        const time = sanitize(raw.time);
        const modality = sanitize(raw.modality);
        const service = sanitize(raw.service);
        const duration = sanitize(raw.duration);
        const price = raw.price;

        if (!firstName || !lastName || !email || !phone || !date || !time || !modality) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        if (firstName.length > 100 || lastName.length > 100 || email.length > 255 || phone.length > 50) {
            return res.status(400).json({ error: 'Payload excesivo en campos de contacto' });
        }
        if (message.length > 2000) {
            return res.status(400).json({ error: 'El mensaje no puede exceder los 2000 caracteres' });
        }

        const calculatedPrice = price || (duration === '60min' ? 1000 : 600);

        const result = await pool.query(
            `INSERT INTO appointments (id, nombre, apellidos, email, telefono, mensaje, fecha, hora, modalidad, duracion, service_requested, precio, status) 
             VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM appointments), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending_payment')
             RETURNING id`,
            [firstName, lastName, email, phone, message || '', date, time, modality, duration || '30min', service || 'No especificado', calculatedPrice]
        );

        return res.status(201).json({ success: true, appointmentId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Este horario ya no está disponible. Por favor, selecciona otro.' });
        }
        return res.status(500).json({ error: error.message });
    }
});

app.put('/api/public/appointments', publicAppointmentsLimiter, async (req, res) => {
    try {
        const { appointmentId, status, paymentMethod } = req.body || {};
        if (!appointmentId) {
            return res.status(400).json({ error: 'Falta appointmentId' });
        }
        
        const updated = await pool.query(
            `UPDATE appointments 
             SET status = $1
             WHERE id = $2
             RETURNING nombre, apellidos, email, telefono, fecha, hora, modalidad, service_requested`,
            [status || 'pending_verification', appointmentId]
        );

        if (updated.rows.length > 0) {
            try {
                const { sendConfirmationEmail } = await import('./mailer.js');
                await sendConfirmationEmail(updated.rows[0]);
            } catch (err) {
                console.error("Error al importar o enviar email:", err);
            }

            try {
                const { agendarEnGoogleCalendar } = await import('../Accrual/bot/services/calendarService.js');
                const cita = updated.rows[0];
                const gRes = await agendarEnGoogleCalendar({
                    nombre: `${cita.nombre} ${cita.apellidos || ''}`.trim(),
                    correo: cita.email,
                    telefono: cita.telefono || 'Sin teléfono',
                    servicio: cita.service_requested,
                    fecha: cita.fecha,
                    hora: cita.hora,
                    notas: `Reserva desde Sitio Web (Modalidad: ${cita.modalidad})`
                });

                if (gRes && gRes.id) {
                    await pool.query("UPDATE appointments SET google_calendar_id = $1 WHERE id = $2", [gRes.id, appointmentId]);
                }
            } catch (gcalErr) {
                console.error("Error al agendar en Google Calendar desde la web:", gcalErr.message);
            }
        }

        return res.status(200).json({ success: true, message: 'Cita actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Obtener Calendario de Citas Reales
app.get('/api/appointments', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM appointments WHERE status != 'borrada' ORDER BY fecha ASC, hora ASC");
        res.json({ success: true, count: result.rowCount, data: result.rows });
    } catch (err) {
        console.error('Error fetching appointments info:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Cancelar Cita Orchestrador (DB, Google, WA, Stripe alert)
app.delete('/api/appointments/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Fetch data
        const r = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: "Cita no encontrada" });
        const cita = r.rows[0];

        // 2. Google Calendar
        if (cita.google_calendar_id) {
            try {
                // To avoid circular or weird dynamic imports from PM2 structure, we can just do a dynamic import or require
                const { cancelarEnGoogleCalendar } = await import('../Accrual/bot/services/calendarService.js');
                await cancelarEnGoogleCalendar(cita.google_calendar_id);
            } catch (e) {
                console.warn("No se pudo borrar de GCalendar:", e.message);
            }
        }

        // 3. Fake Stripe warning / API call place holder
        let stripeReembolso = false;
        if (cita.stripe_payment_intent_id) {
            console.log(`[Stripe Alert] Requiere reembolso para intent: ${cita.stripe_payment_intent_id}`);
            stripeReembolso = true;
            // TODO: const stripe = new Stripe('sk_test_123'); await stripe.refunds.create({ payment_intent: cita.stripe_payment_intent_id });
        }

        // 4. Send WA
        if (cita.telefono) {
            try {
                await fetch('http://localhost:3003/api/internal/send_message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        numero: cita.telefono,
                        mensaje: `Hola ${cita.nombre}, hemos cancelado tu reserva de hoy por petición. Si necesitas reagendar, envíame la palabra Cita de nuevo.`
                    })
                });
            } catch (waErr) {
                console.error("No se alcanzo el microservicio WA", waErr.message);
            }
        }

        // 5. Update DB
        await pool.query("UPDATE appointments SET status = 'cancelada' WHERE id = $1", [id]);

        res.json({ success: true, message: "Cita cancelada con éxito", stripeReembolso });
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// === RUTAS DE USUARIOS (Solo Super Admin) ===
app.get('/api/users', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT username, email, role, is_active FROM accrual_admin_users');
        res.json({ success: true, users: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/security-alerts', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM accrual_admin_logs ORDER BY created_at DESC LIMIT 50");
        res.json({ success: true, alerts: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
        const hash = bcrypt.hashSync(password, 10);
        await pool.query(
            'INSERT INTO accrual_admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
            [username, email, hash, role || 'admin']
        );
        res.json({ success: true, message: 'Usuario creado exitosamente.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:username', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const { username } = req.params;
        if (username === 'adrianaccrual') return res.status(403).json({ success: false, message: 'No se puede eliminar al master principal.' });
        await pool.query('DELETE FROM accrual_admin_users WHERE username = $1', [username]);
        res.json({ success: true, message: 'Usuario eliminado.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === RUTAS DE PERFIL DE USUARIO ===
app.get('/api/users/profile', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, email, role, photo_url, is_active FROM accrual_admin_users WHERE username = $1',
            [req.user.username]
        );
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        
        // El frontend espera is_superadmin basado en el rol
        const profile = result.rows[0];
        profile.is_superadmin = profile.role === 'super_admin';
        res.json({ success: true, profile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/users/profile', authenticateJWT, async (req, res) => {
    try {
        const { username, password, photo_url } = req.body;
        
        if (!username || username.length > 50 || /[^a-zA-Z0-9_@]/.test(username)) {
            return res.status(400).json({ success: false, message: 'Usuario inválido.' });
        }

        // Recuperamos el ID usando el username del token (para no basarnos en el username que puede cambiar)
        const userResult = await pool.query('SELECT user_id FROM accrual_admin_users WHERE username = $1', [req.user.username]);
        if (userResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        const userId = userResult.rows[0].user_id;

        // Comprobar si el nuevo username ya existe en otro user_id
        const userCheck = await pool.query('SELECT user_id FROM accrual_admin_users WHERE username = $1 AND user_id != $2', [username, userId]);
        if (userCheck.rows.length > 0) return res.status(409).json({ success: false, message: 'Ese nombre de usuario ya está en uso.' });

        if (password && password.trim() !== '') {
            const hash = bcrypt.hashSync(password, 10);
            await pool.query(
                'UPDATE accrual_admin_users SET username = $1, password_hash = $2, photo_url = $3 WHERE user_id = $4',
                [username, hash, photo_url || '', userId]
            );
        } else {
            await pool.query(
                'UPDATE accrual_admin_users SET username = $1, photo_url = $2 WHERE user_id = $3',
                [username, photo_url || '', userId]
            );
        }

        res.json({ success: true, newUsername: username, message: 'Perfil actualizado. Se requiere re-autenticación.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === CMS ENDPOINTS (Optimizados para NVMe - Disco E:) ===

// Obtener todos los nodos del sitio web (Uso bajo de RAM comparado con Sanity)
app.get('/api/nodes', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, draft_data, published_data FROM accrual_cms_nodes');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guardar borrador en memoria de alta velocidad JSONB
app.put('/api/nodes/:id/draft', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        const { draft_data } = req.body;
        await pool.query(
            `INSERT INTO accrual_cms_nodes (id, draft_data) VALUES ($1, $2::jsonb) 
             ON CONFLICT (id) DO UPDATE SET draft_data = $2::jsonb, updated_at = CURRENT_TIMESTAMP`,
            [id, JSON.stringify(draft_data || {})]
        );
        res.json({ success: true, message: 'Borrador persistido al disco E:' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Publicar cambios desde el borrador
app.post('/api/nodes/:id/publish', authenticateJWT, async (req, res) => {
    try {
        const { id } = req.params;
        // Mueve todo de draft_data a published_data nativamente en la DB sin parsear en Node (Ahorro de CPU)
        await pool.query(
            `UPDATE accrual_cms_nodes SET published_data = draft_data, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [id]
        );
        res.json({ success: true, message: 'Nodos publicados en tiempo real' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========================================================================
// === AUDITORÍA Y SEGURIDAD: Registro de Cambios ===
// ========================================================================

app.get('/api/system/changelog', authenticateJWT, (req, res) => {
    exec('git log -n 20 --pretty=format:"%h|%an|%ad|%s" --date=short', { cwd: __dirnameSetup }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Error obteniendo historial de git' });
        }
        const logs = stdout.split('\n').filter(Boolean).map(line => {
            const [hash, author, date, message] = line.split('|');
            return { hash, author, date, message };
        });
        res.json({ logs });
    });
});

// Inyección y edición de estados (WhatsApp Neurona Logic Placeholder)
app.post('/api/whatsapp/status', async (req, res) => {
    res.json({ success: true, message: 'Status endpoint. PM2 Bridge connected.' });
});

// Obtener QR de WhatsApp en tiempo real
app.get('/api/whatsapp/qr', (req, res) => {
    const qrPath = '/app/qr_accrual.png';
    if (fs.existsSync(qrPath)) {
        return res.sendFile(qrPath);
    } else {
        const localPath = path.join(__dirnameSetup, '../qr_accrual.png');
        if (fs.existsSync(localPath)) {
            return res.sendFile(localPath);
        } else {
            return res.status(404).send('QR no disponible aún.');
        }
    }
});

// Obtener estado de la conexión de WhatsApp
app.get('/api/whatsapp/status', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT qr_status, ultima_conexion FROM wa_sessions WHERE numero_telefono = 'accrual_bot'");
        if (result.rows.length > 0) {
            res.json({ success: true, status: result.rows[0].qr_status, ultima_conexion: result.rows[0].ultima_conexion });
        } else {
            res.json({ success: true, status: 'DISCONNECTED', ultima_conexion: null });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========================================================================
// === WHATSAPP BLACKLIST API (O(1) Hash Set Backend) ===
// ========================================================================

app.get('/api/whatsapp/blacklist', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT phone_number, added_at, reason FROM wa_blacklist ORDER BY added_at DESC');
        res.json({ success: true, blacklist: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/whatsapp/blacklist', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const { phone_number, reason } = req.body;
        if (!phone_number) return res.status(400).json({ error: 'Falta phone_number' });
        
        const cleanPhone = phone_number.replace(/[^0-9]/g, '');
        if (cleanPhone.length < 10) return res.status(400).json({ error: 'Número inválido' });

        await pool.query(
            'INSERT INTO wa_blacklist (phone_number, reason) VALUES ($1, $2) ON CONFLICT (phone_number) DO NOTHING',
            [`${cleanPhone}@s.whatsapp.net`, reason || 'Usuario Bloqueado']
        );
        res.json({ success: true, message: 'Número agregado a la lista negra.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/whatsapp/blacklist/verify-master', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const { masterPass } = req.body;
        if (!masterPass) return res.status(400).json({ success: false, error: 'Contraseña requerida' });
        
        const result = await pool.query("SELECT user_id, password_hash FROM accrual_admin_users WHERE username = 'adrianaccrual' AND is_active = TRUE");
        
        if (result.rows.length > 0 && verifyPassword(masterPass, result.rows[0].password_hash)) {
            // Migración automática a Bcrypt si es SHA-256 legacy
            if (!result.rows[0].password_hash.startsWith('$2')) {
                const newBcryptHash = bcrypt.hashSync(masterPass, 10);
                await pool.query("UPDATE accrual_admin_users SET password_hash = $1 WHERE username = 'adrianaccrual'", [newBcryptHash]);
            }
            res.json({ success: true });
        } else {
            // Log security alert in DB
            await pool.query(
                "INSERT INTO accrual_admin_logs (user_id, action, details) VALUES ($1, $2, $3)",
                [req.user.user_id || null, 'FAILED_BLACKLIST_UNLOCK', JSON.stringify({ username: req.user.username, ip: req.ip })]
            );
            res.status(401).json({ success: false, error: 'Contraseña maestra incorrecta' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/whatsapp/blacklist/:phone', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const { phone } = req.params;
        await pool.query('DELETE FROM wa_blacklist WHERE phone_number = $1', [phone]);
        res.json({ success: true, message: 'Número eliminado de la lista negra.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========================================================================
// === BIBLIOTECA DE MEDIOS LOCAL (Sin Vercel Blob, directo a disco E:) ===
// ========================================================================

// GET /api/media - Listar toda la biblioteca
app.get('/api/media', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT filename, original_name as "originalName", type, size, url, created_at
             FROM accrual_media ORDER BY created_at DESC`
        );
        const images = result.rows.filter(r => r.type === 'images');
        const videos = result.rows.filter(r => r.type !== 'images');
        res.json({ images, videos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/media/upload - Subir imagen
app.post('/api/media/upload', authenticateJWT, uploadImage.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
        const { filename, originalname, size } = req.file;
        const url = `/media-uploads/images/${filename}`;
        await pool.query(
            `INSERT INTO accrual_media (filename, original_name, type, size, url, disk_path, uploaded_by)
             VALUES ($1, $2, 'images', $3, $4, $5, $6)`,
            [filename, originalname, size, url, req.file.path, req.user?.username || 'admin']
        );
        res.json({ success: true, url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/media/upload-video - Subir video o documento
app.post('/api/media/upload-video', authenticateJWT, uploadVideo.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });
        const { filename, originalname, size } = req.file;
        const isDoc = /pdf|doc|xls|ppt|csv/i.test(originalname);
        const type = isDoc ? 'document' : 'videos';
        const folder = isDoc ? 'docs' : 'videos';
        const url = `/media-uploads/${folder}/${filename}`;
        await pool.query(
            `INSERT INTO accrual_media (filename, original_name, type, size, url, disk_path, uploaded_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [filename, originalname, type, size, url, req.file.path, req.user?.username || 'admin']
        );
        res.json({ success: true, url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/media/:type/:filename - Borrar archivo de disco y DB
app.delete('/api/media/:type/:filename', authenticateJWT, async (req, res) => {
    try {
        const { type, filename } = req.params;
        const result = await pool.query(
            'SELECT disk_path FROM accrual_media WHERE filename = $1 AND type = $2',
            [filename, type]
        );
        if (result.rows.length > 0) {
            const diskPath = result.rows[0].disk_path;
            if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
        }
        await pool.query('DELETE FROM accrual_media WHERE filename = $1 AND type = $2', [filename, type]);
        res.json({ success: true, message: 'Archivo eliminado de disco y base de datos.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========================================================================
// === ANALYTICS & PIXEL TRACKING ===
// ========================================================================

const pixelLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 60, // Límite razonable por IP
    standardHeaders: true,
    legacyHeaders: false,
});

app.post('/api/public/pixel', pixelLimiter, async (req, res) => {
    try {
        const { event_name, source_url, metadata } = req.body;
        if (!event_name) return res.status(400).json({ error: 'event_name required' });
        
        await pool.query(
            `INSERT INTO accrual_pixel_events (event_name, source_url, metadata) VALUES ($1, $2, $3)`,
            [event_name.substring(0, 100), source_url ? source_url.substring(0, 500) : 'unknown', metadata || {}]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Pixel error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/analytics/dashboard', authenticateJWT, async (req, res) => {
    try {
        // Pixel Events Breakdown
        const pixelEventsQuery = await pool.query(`
            SELECT event_name as name, COUNT(*) as count 
            FROM accrual_pixel_events 
            GROUP BY event_name 
            ORDER BY count DESC
        `);
        const pixelEvents = pixelEventsQuery.rows.map(r => ({ name: r.name, count: parseInt(r.count) }));

        // Appointments as Leads
        const leadsQuery = await pool.query(`SELECT COUNT(*) as total FROM appointments WHERE status != 'cancelled' AND status != 'cancelada'`);
        const totalLeads = parseInt(leadsQuery.rows[0].total) || 0;

        // Web Traffic (Calculate views from pixel events 'page_view')
        const pageViews = pixelEvents.find(e => e.name === 'page_view')?.count || 0;
        const totalVisits = pageViews; 

        // Hoy
        const hoy = new Date().toLocaleDateString('es-MX');

        const dashboardData = {
            success: true,
            kpis: { avgCac: '$0.00' },
            trafficSources: [
                { id: 'web', name: 'Tráfico Web (Accrual Pixel)', cac: '$0.00', leads: totalLeads, visitors: totalVisits, emoji: '🌐' }
            ],
            sankeyData: [
                ['De', 'A', 'Volumen'],
                ['Tráfico Directo', 'Landing Page', totalVisits > 0 ? totalVisits : 1],
                ['Landing Page', 'Checkout / Citas', totalLeads > 0 ? totalLeads : 0]
            ],
            webGraphData: [
                { date: hoy, views: totalVisits, interactions: pixelEvents.reduce((acc, curr) => acc + curr.count, 0) - totalVisits }
            ],
            pixelEvents: pixelEvents,
            botHealth: []
        };
        
        res.json(dashboardData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// RUTAS DB STUDIO
// ==========================================

app.get('/api/db-studio/tables', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const query = `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public' AND table_type='BASE TABLE'
            ORDER BY table_name ASC;
        `;
        const result = await pool.query(query);
        const tables = result.rows.map(r => r.table_name);
        res.json({ success: true, tables });
    } catch (err) {
        console.error('[DB Studio] Error iterando tablas:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/db-studio/tables/:name', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        const tableName = req.params.name;
        if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
            return res.status(400).json({ success: false, error: 'Nombre de tabla inválido' });
        }

        const query = `SELECT * FROM "${tableName}" LIMIT 50`;
        const result = await pool.query(query);
        
        res.json({ 
            success: true, 
            rows: result.rows,
            fields: result.fields.map(f => f.name)
        });
    } catch (err) {
        console.error(`[DB Studio] Error leyendo ${req.params.name}:`, err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/db-studio/query', authenticateJWT, requireSuperAdmin, async (req, res) => {
    try {
        // Validación de Seguridad Extrema: Solo adrianaccrual o jareg pueden inyectar querys raw
        const username = req.user?.username?.toLowerCase();
        if (username !== 'jareg' && username !== 'adrianaccrual') {
            return res.status(403).json({ success: false, error: 'Acceso Denegado: Inyecciones SQL limitadas a adrianaccrual.' });
        }

        let { query } = req.body;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ success: false, error: 'Se requiere una query válida.' });
        }

        if (query.trim().toUpperCase().startsWith('SELECT') && !/LIMIT/i.test(query)) {
            query = query.trim() + ' LIMIT 500';
        }

        const triggerTime = process.hrtime();
        const result = await pool.query(query);
        const diffTime = process.hrtime(triggerTime);
        const execMs = (diffTime[0] * 1000 + diffTime[1] / 1e6).toFixed(2);

        if (result.command !== 'SELECT') {
            return res.json({
                success: true,
                command: result.command,
                rowCount: result.rowCount || 0,
                timeMs: execMs
            });
        }

        res.json({
            success: true,
            rows: result.rows,
            fields: result.fields?.map(f => f.name) || [],
            timeMs: execMs
        });

    } catch (err) {
        console.error('[DB Studio] SQL Syntax Error:', err.message);
        res.status(400).json({ success: false, error: err.message, position: err.position });
    }
});


// === PRODUCCIÓN: SERVIR FRONTEND ESTÁTICO ===
// Ahorra muchísima RAM ya que no corremos un segundo proceso para Vite
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos de media subidos desde la Biblioteca Local (Sin CDN externo)
app.use('/media-uploads', express.static(path.join(__dirname, '..', 'media-uploads')));

app.use(express.static(path.join(__dirname, '../dist')));

// SPA Fallback - Express v5: usar app.use() en lugar de app.get('*')
// path-to-regexp v8 ya no acepta wildcards sin nombre en app.get()
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`🚀 Accrual Production Server activo en puerto ${PORT}`);
});
