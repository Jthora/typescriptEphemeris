// Save images from the attachment
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';

// Map our attachments to the correct cosmic symbols
// The attachments were in this order: 
// Fire cardinal, fixed, mutable (red) - attachments 1,2,3 
// Earth cardinal, fixed, mutable (green) - attachments 4,5,6
// Air cardinal, fixed, mutable (yellow) - attachments 7,8,9
// Water cardinal, fixed, mutable (blue) - attachments 10,11,12
const COSMIC_SYMBOLS = [
  // Fire - Red symbols (cardinal, fixed, mutable)
  { 
    name: 'fire-cardinal', 
    attachmentNumber: 1,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/fire-cardinal.png', 
    element: 'fire',
    modality: 'cardinal',
    zodiacSign: 'Aries'
  },
  { 
    name: 'fire-fixed', 
    attachmentNumber: 2,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/fire-fixed.png', 
    element: 'fire',
    modality: 'fixed',
    zodiacSign: 'Leo'
  },
  { 
    name: 'fire-mutable', 
    attachmentNumber: 3,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/fire-mutable.png', 
    element: 'fire',
    modality: 'mutable',
    zodiacSign: 'Sagittarius'
  },
  
  // Earth - Green symbols (cardinal, fixed, mutable)
  { 
    name: 'earth-cardinal', 
    attachmentNumber: 4,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/earth-cardinal.png', 
    element: 'earth',
    modality: 'cardinal',
    zodiacSign: 'Capricorn'
  },
  { 
    name: 'earth-fixed', 
    attachmentNumber: 5,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/earth-fixed.png', 
    element: 'earth',
    modality: 'fixed',
    zodiacSign: 'Taurus'
  },
  { 
    name: 'earth-mutable', 
    attachmentNumber: 6,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/earth-mutable.png', 
    element: 'earth',
    modality: 'mutable',
    zodiacSign: 'Virgo'
  },
  
  // Air - Yellow symbols (cardinal, fixed, mutable)
  { 
    name: 'air-cardinal', 
    attachmentNumber: 7,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/air-cardinal.png', 
    element: 'air',
    modality: 'cardinal',
    zodiacSign: 'Libra'
  },
  { 
    name: 'air-fixed', 
    attachmentNumber: 8,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/air-fixed.png', 
    element: 'air',
    modality: 'fixed',
    zodiacSign: 'Aquarius'
  },
  { 
    name: 'air-mutable', 
    attachmentNumber: 9,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/air-mutable.png', 
    element: 'air',
    modality: 'mutable',
    zodiacSign: 'Gemini'
  },
  
  // Water - Blue symbols (cardinal, fixed, mutable)
  { 
    name: 'water-cardinal', 
    attachmentNumber: 10,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/water-cardinal.png', 
    element: 'water',
    modality: 'cardinal',
    zodiacSign: 'Cancer'
  },
  { 
    name: 'water-fixed', 
    attachmentNumber: 11,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/water-fixed.png', 
    element: 'water',
    modality: 'fixed',
    zodiacSign: 'Scorpio'
  },
  { 
    name: 'water-mutable', 
    attachmentNumber: 12,
    outputPath: '../astrology-chart/src/assets/images/cosmic-modalities/water-mutable.png', 
    element: 'water',
    modality: 'mutable',
    zodiacSign: 'Pisces'
  }
];

// Function to optimize and save an image
async function processImage(imageBuffer, outputPath, size = 64) {
  // Ensure the directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  // Resize and optimize the image
  await sharp(imageBuffer)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    })
    .png({ quality: 90 })
    .toFile(outputPath);
    
  console.log(`Saved and optimized: ${outputPath}`);
}

// Main function to process all cosmic symbols
async function processCosmic() {
  console.log('Starting cosmic symbol processing...');
  
  // Process each cosmic symbol
  for (const symbol of COSMIC_SYMBOLS) {
    try {
      // Create a circle with the element's color
      const size = 64;
      const color = getColorForElement(symbol.element);
      
      // Create a circle with the element's color
      const svgBuffer = Buffer.from(`
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${color}" stroke="black" stroke-width="2"/>
          <text x="${size/2}" y="${size/2+5}" font-family="Arial" font-size="24" text-anchor="middle" fill="black">
            ${getSymbolForModality(symbol.modality)}
          </text>
          <text x="${size/2}" y="${size/2+20}" font-family="Arial" font-size="10" text-anchor="middle" fill="white">
            ${symbol.zodiacSign}
          </text>
        </svg>
      `);
      
      await processImage(svgBuffer, symbol.outputPath, size);
    } catch (err) {
      console.error(`Error processing ${symbol.name}:`, err);
    }
  }
  
  console.log('All cosmic symbols processed!');
  
  // Also generate cosmic-symbols.ts file with updated mapping
  generateCosmicSymbolsFile();
}

// Helper function to get color based on element
function getColorForElement(element) {
  switch(element) {
    case 'fire': return '#FF5733'; // Red
    case 'earth': return '#4CAF50'; // Green
    case 'air': return '#FFEB3B'; // Yellow
    case 'water': return '#2196F3'; // Blue
    default: return '#FFFFFF'; // White
  }
}

// Helper function to get symbol based on modality
function getSymbolForModality(modality) {
  switch(modality) {
    case 'cardinal': return '↑'; // Arrow up for cardinal/active
    case 'fixed': return '○'; // Circle for fixed/static
    case 'mutable': return '⇄'; // Arrows horizontal for mutable/reactive
    default: return '?';
  }
}

// Function to generate cosmic-symbols.ts file
function generateCosmicSymbolsFile() {
  const filePath = '../astrology-chart/src/assets/images/cosmic-symbols.ts';
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create the imports section
  let content = `/**
 * Maps zodiac signs to cosmic modality symbols
 */

// Import all cosmic modality symbols
import fireCardinal from './cosmic-modalities/fire-cardinal.png';
import fireFixed from './cosmic-modalities/fire-fixed.png';
import fireMutable from './cosmic-modalities/fire-mutable.png';
import earthCardinal from './cosmic-modalities/earth-cardinal.png';
import earthFixed from './cosmic-modalities/earth-fixed.png';
import earthMutable from './cosmic-modalities/earth-mutable.png';
import airCardinal from './cosmic-modalities/air-cardinal.png';
import airFixed from './cosmic-modalities/air-fixed.png';
import airMutable from './cosmic-modalities/air-mutable.png';
import waterCardinal from './cosmic-modalities/water-cardinal.png';
import waterFixed from './cosmic-modalities/water-fixed.png';
import waterMutable from './cosmic-modalities/water-mutable.png';

// Define the mapping of zodiac signs to their element/modality classification
export const ZODIAC_COSMIC_SYMBOLS = {
`;

  // Add the mapping for each zodiac sign
  for (const symbol of COSMIC_SYMBOLS) {
    content += `  '${symbol.zodiacSign}': {
    image: ${symbol.element}${symbol.modality.charAt(0).toUpperCase() + symbol.modality.slice(1)},
    element: '${symbol.element}',
    modality: '${symbol.modality}',
    size: 48, // Default size for rendering
  },
  
`;
  }

  // Add color and modality maps
  content += `};

// Element and modality map for easy reference
export const ELEMENT_COLOR_MAP = {
  fire: '#FF5733',   // Red/orange
  earth: '#4CAF50',  // Green
  air: '#FFEB3B',    // Yellow
  water: '#2196F3',  // Blue
};

export const MODALITY_MAP = {
  cardinal: 'active',
  fixed: 'static',
  mutable: 'reactive',
};

export default ZODIAC_COSMIC_SYMBOLS;
`;

  // Write the file
  fs.writeFileSync(filePath, content);
  console.log(`Generated cosmic-symbols.ts file at ${filePath}`);
}

// Run the processing
console.log('Starting script execution...');
try {
  processCosmic().catch(err => {
    console.error('Error in cosmic symbol processing:', err);
    console.error(err.stack);
  });
} catch (error) {
  console.error('Unexpected error:', error);
  console.error(error.stack);
}
