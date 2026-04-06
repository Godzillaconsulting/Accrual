const http = require('http');
const { exec } = require('child_process');

const BOT_URL = process.env.BOT_URL || 'http://localhost:3005';
const CHECK_INTERVAL = 60000; // 60 segundos

function checkBotHealth() {
    http.get(BOT_URL, (res) => {
        if (res.statusCode >= 500) {
            console.error(`[${new Date().toISOString()}] ALERTA CRÍTICA: Bot reportó status ${res.statusCode}. Reiniciando...`);
            restartBot();
        } else {
            console.log(`[${new Date().toISOString()}] Health check OK. Bot Status: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error(`[${new Date().toISOString()}] Error crítico conectando al bot local: ${err.message}. Reiniciando...`);
        restartBot();
    });
}

function restartBot() {
    console.log(`[${new Date().toISOString()}] Reiniciando accrual-bot con PM2...`);
    exec('pm2 restart accrual-bot', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al reiniciar bot con PM2: ${error.message}`);
            return;
        }
        console.log(`[${new Date().toISOString()}] Bot reiniciado exitosamente.\n${stdout}`);
    });
}

console.log(`🤖 Accrual Bot Monitor iniciado. Vigílalo cada ${CHECK_INTERVAL/1000}s en: ${BOT_URL}`);
setInterval(checkBotHealth, CHECK_INTERVAL);

// Primera ejecución inmediata
checkBotHealth();
