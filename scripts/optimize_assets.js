import fs from 'fs';
import path from 'path';

function optimizeDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            optimizeDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            // No optimizamos Navbar ni Hero porque deben cargar inmediato (Above the fold)
            if (file === 'Navbar.jsx' || file === 'Hero.jsx') continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            const newContent = content.replace(/<(img|iframe)\b([^>]+)>/gi, (match, tag, attrs) => {
                if (!attrs.includes('loading=')) {
                    changed = true;
                    return `<${tag} loading="lazy" ${attrs}>`;
                }
                return match;
            });

            if (changed) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Optimización aplicada en:', file);
            }
        }
    }
}
optimizeDir('d:/Proyecos IA/Accrual/src');
