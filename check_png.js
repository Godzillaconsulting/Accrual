const fs = require('fs');
const path = require('path');

const imgPath = 'd:\\Godzilla Co\\Accrual\\Pagina web\\Project file\\Wireframe\\accrual-prototype\\src\\assets\\Accrual icono.png';

fs.open(imgPath, 'r', (err, fd) => {
    if (err) throw err;
    const buf = Buffer.allocUnsafe(24);
    fs.read(fd, buf, 0, 24, 0, (err, bytesRead) => {
        if (err) throw err;
        // Check PNG signature
        if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
            const width = buf.readInt32BE(16);
            const height = buf.readInt32BE(20);
            console.log(`Width: ${width}, Height: ${height}`);
        } else {
            console.log('Not a PNG or unexpected format');
        }
        fs.close(fd, () => { });
    });
});
