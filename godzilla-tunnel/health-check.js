const http = require('http');
const { exec } = require('child_process');

const WP_URL = process.env.WP_URL || 'http://localhost';
const CHECK_INTERVAL = 60000; // 60 segundos

function checkWPHealth() {
    http.get(WP_URL, (res) => {
        if (res.statusCode === 500) {
            console.error(`[${new Date().toISOString()}] ALERTA CRÍTICA: WordPress devolvió error 500 en ${WP_URL}.`);
            console.log(`[${new Date().toISOString()}] Reiniciando servicios gestionados por PM2...`);
            
            // Reiniciar ambos servicios bajo PM2 de inmediato
            exec('pm2 restart all', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error al reiniciar servicios con PM2: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`PM2 Stderr: ${stderr}`);
                }
                console.log(`[${new Date().toISOString()}] Servicios reiniciados exitosamente.\n${stdout}`);
            });
            
            // Opcional: si Apache/PHP es gestionado por systemd y necesitas forzar reseteo, descomenta:
            // exec('sudo systemctl restart apache2 php8.1-fpm', ...)
            
        } else {
            console.log(`[${new Date().toISOString()}] Health check OK. Estado: ${res.statusCode}`);
        }
    }).on('error', (err) => {
        console.error(`[${new Date().toISOString()}] Error crítico o timeout conectando a servidor WP local: ${err.message}`);
    });
}

console.log(`🚀 Godzilla Tunnel Monitor iniciado. Vigílalo cada ${CHECK_INTERVAL/1000}s en: ${WP_URL}`);
setInterval(checkWPHealth, CHECK_INTERVAL);

// Primera ejecución inmediata
checkWPHealth();
