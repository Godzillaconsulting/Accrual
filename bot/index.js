import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import express from 'express';
import 'dotenv/config'; 
import { parseAppointmentIntent } from './ai.js';
import { createGoogleCalendarEvent } from './calendar.js';
import { saveAppointmentToDB } from './db.js';

// --- SERVIDOR DE ESTATUS ---
const app = express();
let isReady = false;

app.get('/', (req, res) => {
    if (isReady) return res.send('<h1>✅ Bot de Accrual autenticado y en línea.</h1>');
    res.send('<h1>⏳ Esperando conexión de WhatsApp Web... Revisa la terminal para el QR.</h1>');
});
app.listen(3005, () => console.log('🌐 Servidor de estatus iniciado en puerto 3005'));

// --- ESTRUCTURAS DE DATOS (LRU Cache con Lista Doblemente Enlazada) ---
// Evita memory leaks de Puppeteer y V8 limitando conversadores activos.

class ChatNode {
    constructor(sender) {
        this.sender = sender;
        this.history = [];
        this.prev = null;
        this.next = null;
    }
}

class ChatLRU {
    constructor(limit) {
        this.limit = limit;
        this.map = new Map(); // Arreglo asociativo
        this.head = null;
        this.tail = null;
    }

    get(sender) {
        if (!this.map.has(sender)) return null;
        const node = this.map.get(sender);
        this.moveToHead(node);
        return node;
    }

    add(sender) {
        if (this.map.has(sender)) {
            const node = this.map.get(sender);
            this.moveToHead(node);
            return node;
        }

        const newNode = new ChatNode(sender);
        this.map.set(sender, newNode);
        this.addToHead(newNode);

        if (this.map.size > this.limit) {
            this.removeTail(); // Garbage Collect de inmediato
        }
        return newNode;
    }

    addToHead(node) {
        node.next = this.head;
        node.prev = null;
        if (this.head) this.head.prev = node;
        this.head = node;
        if (!this.tail) this.tail = node;
    }

    moveToHead(node) {
        if (this.head === node) return;
        if (node.prev) node.prev.next = node.next;
        if (node.next) node.next.prev = node.prev;
        if (this.tail === node) this.tail = node.prev;
        this.addToHead(node);
    }

    removeTail() {
        if (!this.tail) return;
        this.map.delete(this.tail.sender);
        if (this.tail.prev) this.tail.prev.next = null;
        this.tail = this.tail.prev;
        if (!this.tail) this.head = null;
    }

    remove(sender) {
        if (!this.map.has(sender)) return;
        const node = this.map.get(sender);
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;
        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;
        this.map.delete(sender);
    }
}

// Límite conservador de 50 chats concurrentes en memoria
const userSessions = new ChatLRU(50);

// --- WHATSAPP CLIENT (PUPPETEER) ---
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: 'bot_sessions' }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Ahorra mucha RAM
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('\n✅ ESCANEA ESTE CÓDIGO QR CON WHATSAPP:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    isReady = true;
    console.log('✅ ¡Asistente de Accrual (Puppeteer) lista y escuchando al cliente!');
});

client.on('disconnected', (reason) => {
    console.log("🛑 SESIÓN DESVINCULADA: ", reason);
    process.exit(1); 
});

client.on('message', async (msg) => {
    if (msg.from === 'status@broadcast') return;

    const sender = msg.from;
    const text = msg.body;
    const userPhone = sender.split('@')[0];

    if (!text) return;

    console.log(`📩 Recibido de ${userPhone}: ${text}`);

    try {
        // En whatsapp-web.js no hay "sendPresenceUpdate('composing')" directamente, 
        // pero podemos obtener el chat y enviarlo.
        const chat = await msg.getChat();
        await chat.sendStateTyping();

        // Operacion de Memoria Optimizado
        const sessionNode = userSessions.add(sender);
        sessionNode.history.push('User: ' + text);
        
        const fullConversation = sessionNode.history.join('\n');
        await client.sendMessage(sender, 'Procesando tu solicitud con IA... 🤖');
        
        const intentResult = await parseAppointmentIntent(fullConversation);
        
        if (intentResult.intent === 'schedule_appointment') {
            const data = intentResult.data;
            if (!data.firstName || !data.date || !data.time || !data.service) {
                await client.sendMessage(sender, `Para agendar tu cita, necesito un poco más de información. Me falta: ${intentResult.missingFields ? intentResult.missingFields.join(', ') : 'fecha, hora, o tu nombre'}. ¿Podrías proporcionarlo?`);
            } else {
                await client.sendMessage(sender, '¡Perfecto! Revisando disponibilidad y guardando tu cita...');
                
                const dbResult = await saveAppointmentToDB({
                    firstName: data.firstName,
                    lastName: data.lastName || '',
                    email: '', 
                    phone: userPhone,
                    date: data.date,
                    time: data.time,
                    service: data.service,
                    modality: data.modality || 'WhatsApp'
                });
                
                if (!dbResult.success) {
                    if (dbResult.isDoubleBooking) {
                        await client.sendMessage(sender, 'Ese horario ya está ocupado en el sistema 😔. Por favor elige otro horario u otra fecha.');
                    } else {
                        await client.sendMessage(sender, 'Hubo un error al guardar la cita en la base de datos.');
                    }
                } else {
                    const calendarResult = await createGoogleCalendarEvent({
                        firstName: data.firstName,
                        lastName: data.lastName || '',
                        email: '', 
                        phone: userPhone,
                        date: data.date,
                        time: data.time,
                        service: data.service,
                        modality: data.modality || 'WhatsApp',
                        duration: '30min'
                    });
                    
                    if (calendarResult.success) {
                        await client.sendMessage(sender, `¡Tu cita ha sido confirmada exitosamente! ✅\nServicio: ${data.service}\nFecha: ${data.date}\nHora: ${data.time}\n\nEn Accrual, tus problemas fiscales tienen soluciones reales. ¡Te esperamos!`);
                        // Operacion Memoria: Cliente cumplió el flujo, lo destruimos para liberar RAM.
                        userSessions.remove(sender);
                    } else {
                        await client.sendMessage(sender, 'La cita se guardó en nuestro sistema, pero hubo un error al sincronizarla con nuestro calendario general. De todas formas te esperamos.');
                    }
                }
            }
        } else {
            await client.sendMessage(sender, 'Soy el asistente virtual de Accrual. Puedo ayudarte a resolver dudas sobre nuestros servicios o agendar una cita. ¿En qué te puedo ayudar hoy?');
        }

        await chat.clearState();

    } catch (error) {
        console.error("Error:", error);
        await client.sendMessage(sender, 'Una disculpa, tuve un problema técnico temporal procesando tu solicitud. ¿Me la podrías repetir en unos minutos?');
    }
});

client.initialize();
