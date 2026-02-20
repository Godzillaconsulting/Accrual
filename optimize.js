import sharp from 'sharp';

async function optimize() {
    try {
        await sharp('./src/assets/Urrutia.jpg')
            .resize({ width: 600, fit: 'contain' }) // Resize appropriately, just to reduce the massive 16MB file
            .jpeg({ quality: 90, progressive: true })
            .toFile('./src/assets/Urrutia-optimized.jpg');
        console.log('Image optimized successfully');
    } catch (error) {
        console.error('Error optimizing image:', error);
    }
}

optimize();
