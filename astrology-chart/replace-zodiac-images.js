// Direct copy script for cosmic symbol images
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the target directory for cosmic images
const COSMIC_MODALITIES_DIR = path.join(__dirname, 'src', 'assets', 'images', 'cosmic-modalities');

// Ensure the directory exists
if (!fs.existsSync(COSMIC_MODALITIES_DIR)) {
  fs.mkdirSync(COSMIC_MODALITIES_DIR, { recursive: true });
}

console.log(`Target directory: ${COSMIC_MODALITIES_DIR}`);

// Define image mappings based on the new modality naming convention
// active = cardinal, reactive = mutable, static = fixed
const IMAGE_MAPPING = [
  // Yellow (Air) images
  { description: "Yellow up-arrow", filename: 'air-cardinal.png', sign: 'Libra', element: 'air', modality: 'active' },
  { description: "Yellow block", filename: 'air-fixed.png', sign: 'Aquarius', element: 'air', modality: 'static' },
  { description: "Yellow arc", filename: 'air-mutable.png', sign: 'Gemini', element: 'air', modality: 'reactive' },
  
  // Green (Earth) images
  { description: "Green up-arrow", filename: 'earth-cardinal.png', sign: 'Capricorn', element: 'earth', modality: 'active' },
  { description: "Green block", filename: 'earth-fixed.png', sign: 'Taurus', element: 'earth', modality: 'static' },
  { description: "Green arc", filename: 'earth-mutable.png', sign: 'Virgo', element: 'earth', modality: 'reactive' },
  
  // Red (Fire) images
  { description: "Red up-arrow", filename: 'fire-cardinal.png', sign: 'Aries', element: 'fire', modality: 'active' },
  { description: "Red block", filename: 'fire-fixed.png', sign: 'Leo', element: 'fire', modality: 'static' },
  { description: "Red arc", filename: 'fire-mutable.png', sign: 'Sagittarius', element: 'fire', modality: 'reactive' },
  
  // Blue (Water) images
  { description: "Blue up-arrow", filename: 'water-cardinal.png', sign: 'Cancer', element: 'water', modality: 'active' },
  { description: "Blue block", filename: 'water-fixed.png', sign: 'Scorpio', element: 'water', modality: 'static' },
  { description: "Blue arc", filename: 'water-mutable.png', sign: 'Pisces', element: 'water', modality: 'reactive' }
];

console.log('\n=== MANUAL INSTRUCTIONS TO REPLACE ZODIAC SYMBOLS ===');
console.log('To replace the zodiac symbols with the 12 attached modality images:');
console.log('');
console.log('1. Save the 12 images (yellow, green, red, blue circles) to:');
console.log(`   ${COSMIC_MODALITIES_DIR}`);
console.log('');
console.log('2. Use these exact filenames based on their appearance:');
IMAGE_MAPPING.forEach(mapping => {
  console.log(`   - ${mapping.description} → ${mapping.filename} (${mapping.sign}, ${mapping.element}-${mapping.modality})`);
});
console.log('');
console.log('3. After copying the images, restart the development server:');
console.log('   cd /home/jono/workspace/github/typescriptEphemeris/astrology-chart && npm run dev');
console.log('');
console.log('MODALITY MAPPING:');
console.log('   - Active (formerly Cardinal): Up-arrow/Chevron symbol');
console.log('   - Static (formerly Fixed): Block/Square symbol');
console.log('   - Reactive (formerly Mutable): Arc/Curve symbol');
console.log('');
console.log('ELEMENT COLOR MAPPING:');
console.log('   - Yellow = Air');
console.log('   - Green = Earth');
console.log('   - Red = Fire');
console.log('   - Blue = Water');
console.log('=== END INSTRUCTIONS ===');
