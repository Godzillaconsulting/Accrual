import { execSync, spawn } from 'child_process';
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// El gestor ahora se ejecuta desde la raíz directamente
process.chdir(__dirname);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const menu = `
\x1b[36m=============================================\x1b[0m
\x1b[1m  🤖 ACCRUAL - GESTOR DOCKER (SISTEMA + BOT)  \x1b[0m
\x1b[36m=============================================\x1b[0m

\x1b[32m[1]\x1b[0m Levantar/Actualizar Todo el Sistema (Build)
\x1b[32m[2]\x1b[0m Detener Todo el Sistema
\x1b[32m[3]\x1b[0m Reiniciar Sistema (Aplicar Cambios)
\x1b[32m[4]\x1b[0m Ver Logs del Bot de WhatsApp en Vivo
\x1b[32m[5]\x1b[0m Ver Logs del API / Servidor Web
\x1b[32m[6]\x1b[0m Estado de los Contenedores (Docker PS)
\x1b[32m[7]\x1b[0m Borrar Sesión (Desvincular WhatsApp)
\x1b[31m[0]\x1b[0m Salir

Elige una opción: `;

const runCommand = (cmd, showOutput = true) => {
    try {
        const output = execSync(cmd, { encoding: 'utf8', stdio: showOutput ? 'inherit' : 'pipe' });
        return output;
    } catch (e) {
        if (!showOutput) return null;
        console.log('\x1b[31mError ejecutando comando\x1b[0m');
    }
};

const showMenu = () => {
    rl.question(menu, (opcion) => {
        console.log('\n');
        switch (opcion.trim()) {
            case '1':
                console.log('\x1b[32mConstruyendo y levantando contenedores Docker...\x1b[0m');
                runCommand('docker compose up --build -d');
                console.log('\x1b[36mMonitorea la imagen qr_accrual.png para escanear el QR.\x1b[0m');
                setTimeout(showMenu, 1500);
                break;
            case '2':
                console.log('\x1b[33mDeteniendo contenedores Docker...\x1b[0m');
                runCommand('docker compose down');
                setTimeout(showMenu, 1500);
                break;
            case '3':
                console.log('\x1b[36mReiniciando servicios...\x1b[0m');
                runCommand('docker compose restart');
                setTimeout(showMenu, 1500);
                break;
            case '4':
                console.log('\x1b[35mConectando a logs del BOT... (Presiona CTRL+C para salir)\x1b[0m');
                const botLogs = spawn('docker', ['compose', 'logs', '-f', 'accrual-bot'], { stdio: 'inherit', shell: true });
                botLogs.on('close', () => {
                    showMenu();
                });
                break;
            case '5':
                console.log('\x1b[35mConectando a logs del API... (Presiona CTRL+C para salir)\x1b[0m');
                const apiLogs = spawn('docker', ['compose', 'logs', '-f', 'accrual-api'], { stdio: 'inherit', shell: true });
                apiLogs.on('close', () => {
                    showMenu();
                });
                break;
            case '6':
                console.log('\x1b[36mEstado actual de los contenedores:\x1b[0m');
                runCommand('docker compose ps');
                setTimeout(showMenu, 1500);
                break;
            case '7':
                console.log('\x1b[31mBorrando sesión de WhatsApp...\x1b[0m');
                runCommand('docker compose stop accrual-bot', false);
                
                // Borrar carpeta bot_sessions en el host
                const sessionsPath = path.join(__dirname, 'bot_sessions');
                if (fs.existsSync(sessionsPath)) {
                    runCommand(`rmdir /S /Q "${sessionsPath}"`, false);
                }
                
                // Sobreescribir el QR en el host para limpiarlo
                const qrPath = path.join(__dirname, 'qr_accrual.png');
                if (fs.existsSync(qrPath)) {
                    try { fs.writeFileSync(qrPath, ''); } catch(e) {}
                }
                
                console.log('\x1b[32mSesión borrada. Iniciando bot de nuevo para generar código QR...\x1b[0m');
                runCommand('docker compose start accrual-bot');
                setTimeout(showMenu, 1500);
                break;
            case '0':
                console.log('Saliendo del gestor...');
                process.exit(0);
            default:
                console.log('\x1b[31mOpción inválida.\x1b[0m');
                setTimeout(showMenu, 1000);
        }
    });
};

showMenu();
