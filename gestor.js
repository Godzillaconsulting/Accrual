import { execSync, spawn } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const PM2_CMD = 'C:/Users/GODZILLA.IA/AppData/Roaming/npm/pm2.cmd';

const menu = `
\x1b[36m=============================================\x1b[0m
\x1b[1m  🤖 ACCRUAL - GESTOR DE IA (BAILEYS 24/7)   \x1b[0m
\x1b[36m=============================================\x1b[0m

\x1b[32m[1]\x1b[0m Iniciar/Actualizar Accrual Bot
\x1b[32m[2]\x1b[0m Detener Bot
\x1b[32m[3]\x1b[0m Reiniciar Bot (Aplicar Cambios)
\x1b[32m[4]\x1b[0m Ver Consola/Logs en Vivo
\x1b[32m[5]\x1b[0m Estado de Memoria y Procesos
\x1b[32m[6]\x1b[0m Borrar Sesión (Desvincular WhatsApp)
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
                console.log('\x1b[32mIniciando Accrual Bot en segundo plano...\x1b[0m');
                // Borramos la versión vieja genérica si existe
                runCommand(`${PM2_CMD} delete whatsapp-bot`, false);
                runCommand(`${PM2_CMD} start bot/whatsappBot.js --name accrual-bot --update-env`);
                console.log('\x1b[36mVe a http://localhost:3003/link para vincular tu número.\x1b[0m');
                setTimeout(showMenu, 1500);
                break;
            case '2':
                console.log('\x1b[33mDeteniendo Bot...\x1b[0m');
                runCommand(`${PM2_CMD} stop accrual-bot`);
                setTimeout(showMenu, 1500);
                break;
            case '3':
                console.log('\x1b[36mReiniciando Bot para aplicar cambios...\x1b[0m');
                runCommand(`${PM2_CMD} delete whatsapp-bot`, false);
                runCommand(`${PM2_CMD} restart accrual-bot --update-env || ${PM2_CMD} start bot/whatsappBot.js --name accrual-bot --update-env`);
                setTimeout(showMenu, 1500);
                break;
            case '4':
                console.log('\x1b[35mConectando a la consola en vivo... (Presiona CTRL+C para salir de los logs)\x1b[0m');
                const logs = spawn(PM2_CMD, ['logs', 'accrual-bot'], { stdio: 'inherit' });
                logs.on('close', () => {
                    showMenu();
                });
                break;
            case '5':
                runCommand(`${PM2_CMD} list`);
                setTimeout(showMenu, 1500);
                break;
            case '6':
                console.log('\x1b[31mBorrando sesión de WhatsApp...\x1b[0m');
                runCommand(`${PM2_CMD} stop accrual-bot`, false);
                runCommand(`rmdir /S /Q "C:\\Users\\GODZILLA.IA\\Accrual\\Accrual\\bot_sessions"`, false);
                console.log('\x1b[32mSesión borrada. Reinicia el bot (Opción 3) para generar un nuevo código.\x1b[0m');
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
