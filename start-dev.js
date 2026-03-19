import { spawn } from 'child_process';

console.log('🚀 Iniciando entorno de desarrollo (Frontend + Backend local)...');

const api = spawn('node', ['local-api.js'], { stdio: 'inherit', shell: true });
const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  api.kill();
  vite.kill();
  process.exit();
});
