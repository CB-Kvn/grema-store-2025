import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertLogoToWebP() {
  const inputPath = path.join(__dirname, '..', 'public', 'Logo en negro.png');
  const outputPath = path.join(__dirname, '..', 'public', 'Logo en negro.webp');
  
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log('✅ Logo converted to WebP successfully!');
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`📊 Original PNG size: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`📊 WebP size: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`💾 Space saved: ${savings}%`);
    
  } catch (error) {
    console.error('❌ Error converting logo:', error);
  }
}

convertLogoToWebP();
