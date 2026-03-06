const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\jesus\\.gemini\\antigravity\\brain\\715a91ca-9723-413b-a4a3-5bc949fdfccb\\favicon_square_1772833125186.png';
const dest = 'd:\\Godzilla Co\\Accrual\\Pagina web\\Project file\\Wireframe\\accrual-prototype\\public\\favicon.png';

fs.copyFile(src, dest, (err) => {
    if (err) throw err;
    console.log('Favicon updated from generated square version!');
});
