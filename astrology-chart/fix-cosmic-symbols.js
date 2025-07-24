// Fix cosmic symbol images
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'src', 'assets', 'images', 'cosmic-modalities');

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Define zodiac sign mapping
const ZODIAC_SIGNS = [
  // Fire signs
  {
    name: 'fire-cardinal',
    element: 'fire',
    modality: 'cardinal',
    zodiacSign: 'Aries',
    color: '#FF5733' // Red
  },
  {
    name: 'fire-fixed',
    element: 'fire',
    modality: 'fixed',
    zodiacSign: 'Leo',
    color: '#FF5733' // Red
  },
  {
    name: 'fire-mutable',
    element: 'fire',
    modality: 'mutable',
    zodiacSign: 'Sagittarius',
    color: '#FF5733' // Red
  },
  
  // Earth signs
  {
    name: 'earth-cardinal',
    element: 'earth',
    modality: 'cardinal',
    zodiacSign: 'Capricorn',
    color: '#4CAF50' // Green
  },
  {
    name: 'earth-fixed',
    element: 'earth',
    modality: 'fixed',
    zodiacSign: 'Taurus',
    color: '#4CAF50' // Green
  },
  {
    name: 'earth-mutable',
    element: 'earth',
    modality: 'mutable',
    zodiacSign: 'Virgo',
    color: '#4CAF50' // Green
  },
  
  // Air signs
  {
    name: 'air-cardinal',
    element: 'air',
    modality: 'cardinal',
    zodiacSign: 'Libra',
    color: '#FFEB3B' // Yellow
  },
  {
    name: 'air-fixed',
    element: 'air',
    modality: 'fixed',
    zodiacSign: 'Aquarius',
    color: '#FFEB3B' // Yellow
  },
  {
    name: 'air-mutable',
    element: 'air',
    modality: 'mutable',
    zodiacSign: 'Gemini',
    color: '#FFEB3B' // Yellow
  },
  
  // Water signs
  {
    name: 'water-cardinal',
    element: 'water',
    modality: 'cardinal',
    zodiacSign: 'Cancer',
    color: '#2196F3' // Blue
  },
  {
    name: 'water-fixed',
    element: 'water',
    modality: 'fixed',
    zodiacSign: 'Scorpio',
    color: '#2196F3' // Blue
  },
  {
    name: 'water-mutable',
    element: 'water',
    modality: 'mutable',
    zodiacSign: 'Pisces',
    color: '#2196F3' // Blue
  }
];

// Helper function to get symbol based on modality
function getSymbolForModality(modality) {
  switch(modality) {
    case 'cardinal': return '↑'; // Arrow up for cardinal/active
    case 'fixed': return '○'; // Circle for fixed/static
    case 'mutable': return '⇄'; // Arrows horizontal for mutable/reactive
    default: return '?';
  }
}

// Create all the cosmic symbol images
async function createCosmicSymbols() {
  console.log('Creating cosmic symbol images...');
  
  for (const sign of ZODIAC_SIGNS) {
    const outputPath = path.join(OUTPUT_DIR, `${sign.name}.png`);
    const size = 64;
    
    // Create an SVG with the appropriate symbol and color
    const svgBuffer = Buffer.from(`
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${sign.color}" stroke="black" stroke-width="2"/>
        <text x="${size/2}" y="${size/2+5}" font-family="Arial" font-size="24" text-anchor="middle" fill="white" font-weight="bold">
          ${getSymbolForModality(sign.modality)}
        </text>
        <text x="${size/2}" y="${size/2+20}" font-family="Arial" font-size="10" text-anchor="middle" fill="white" font-weight="bold">
          ${sign.zodiacSign}
        </text>
      </svg>
    `);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png({ quality: 90 })
        .toFile(outputPath);
      
      console.log(`Created: ${outputPath}`);
    } catch (err) {
      console.error(`Error creating ${sign.name}:`, err);
    }
  }
  
  console.log('All cosmic symbol images created!');
}

// Run the process
createCosmicSymbols().catch(err => {
  console.error('Error:', err);
});
