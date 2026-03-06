const fs = require('fs');

function getPngDimensions(filePath) {
    const buf = fs.readFileSync(filePath);
    // PNG signature check
    if (buf.readUInt32BE(0) !== 0x89504E47) return null;
    const width = buf.readInt32BE(16);
    const height = buf.readInt32BE(20);
    return { width, height };
}

const iconoPath = 'd:\\Godzilla Co\\Accrual\\Pagina web\\Project file\\Wireframe\\accrual-prototype\\src\\assets\\Accrual icono.png';
const dimensions = getPngDimensions(iconoPath);
console.log(JSON.stringify(dimensions));
