import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertLogosToAVIF() {
  const logos = [
    {
      name: 'Logo en negro',
      input: path.join(__dirname, '..', 'public', 'Logo en negro.png'),
      output: path.join(__dirname, '..', 'public', 'Logo en negro.avif')
    },
    {
      name: 'Logo en blamco',
      input: path.join(__dirname, '..', 'public', 'Logo en blamco.png'),
      output: path.join(__dirname, '..', 'public', 'Logo en blamco.avif')
    }
  ];

  for (const logo of logos) {
    try {
      // Convert to AVIF with high quality settings
      await sharp(logo.input)
        .avif({ 
          quality: 80,
          effort: 6 // Maximum compression effort
        })
        .toFile(logo.output);
      
      console.log(`✅ ${logo.name} converted to AVIF successfully!`);
      
      // Get file sizes for comparison
      const originalSize = fs.statSync(logo.input).size;
      const avifSize = fs.statSync(logo.output).size;
      const savings = ((originalSize - avifSize) / originalSize * 100).toFixed(1);
      
      console.log(`📊 Original PNG size: ${(originalSize / 1024).toFixed(1)} KB`);
      console.log(`📊 AVIF size: ${(avifSize / 1024).toFixed(1)} KB`);
      console.log(`💾 Space saved: ${savings}%`);
      console.log('---');
      
    } catch (error) {
      console.error(`❌ Error converting ${logo.name}:`, error);
    }
  }
}

convertLogosToAVIF();
