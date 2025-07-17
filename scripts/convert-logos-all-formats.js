import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertLogosToModernFormats() {
  const logos = [
    {
      name: 'Logo en negro',
      input: path.join(__dirname, '..', 'public', 'Logo en negro.png'),
      webp: path.join(__dirname, '..', 'public', 'Logo en negro.webp'),
      avif: path.join(__dirname, '..', 'public', 'Logo en negro.avif')
    },
    {
      name: 'Logo en blamco',
      input: path.join(__dirname, '..', 'public', 'Logo en blamco.png'),
      webp: path.join(__dirname, '..', 'public', 'Logo en blamco.webp'),
      avif: path.join(__dirname, '..', 'public', 'Logo en blamco.avif')
    }
  ];

  console.log('🚀 Converting logos to modern formats...\n');

  for (const logo of logos) {
    try {
      const originalSize = fs.statSync(logo.input).size;
      console.log(`📁 Processing ${logo.name}...`);
      console.log(`📊 Original PNG size: ${(originalSize / 1024).toFixed(1)} KB`);
      
      // Convert to WebP
      await sharp(logo.input)
        .webp({ quality: 80 })
        .toFile(logo.webp);
      
      const webpSize = fs.statSync(logo.webp).size;
      const webpSavings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
      console.log(`✅ WebP: ${(webpSize / 1024).toFixed(1)} KB (${webpSavings}% savings)`);
      
      // Convert to AVIF
      await sharp(logo.input)
        .avif({ 
          quality: 80,
          effort: 6 // Maximum compression effort
        })
        .toFile(logo.avif);
      
      const avifSize = fs.statSync(logo.avif).size;
      const avifSavings = ((originalSize - avifSize) / originalSize * 100).toFixed(1);
      console.log(`✅ AVIF: ${(avifSize / 1024).toFixed(1)} KB (${avifSavings}% savings)`);
      
      console.log('---');
      
    } catch (error) {
      console.error(`❌ Error converting ${logo.name}:`, error);
    }
  }
  
  console.log('🎉 All logos converted successfully!');
  console.log('\n📝 Implementation notes:');
  console.log('- AVIF provides the best compression but has limited browser support');
  console.log('- WebP provides good compression with broader browser support');
  console.log('- PNG is used as fallback for maximum compatibility');
  console.log('- The <picture> element ensures the best format is selected automatically');
}

convertLogosToModernFormats();
