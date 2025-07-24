// Script to copy the 12 attached images to the cosmic-modalities folder
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COSMIC_MODALITIES_DIR = path.join(__dirname, '..', 'src', 'assets', 'images', 'cosmic-modalities');

// Mapping of attachment numbers to cosmic modality files
const IMAGE_MAPPING = [
  { attachmentNumber: 1, filename: 'air-cardinal.png' },
  { attachmentNumber: 2, filename: 'air-fixed.png' },
  { attachmentNumber: 3, filename: 'air-mutable.png' },
  { attachmentNumber: 4, filename: 'earth-cardinal.png' },
  { attachmentNumber: 5, filename: 'earth-fixed.png' },
  { attachmentNumber: 6, filename: 'earth-mutable.png' },
  { attachmentNumber: 7, filename: 'fire-cardinal.png' },
  { attachmentNumber: 8, filename: 'fire-fixed.png' },
  { attachmentNumber: 9, filename: 'fire-mutable.png' },
  { attachmentNumber: 10, filename: 'water-cardinal.png' },
  { attachmentNumber: 11, filename: 'water-fixed.png' },
  { attachmentNumber: 12, filename: 'water-mutable.png' }
];

// Source directory for attachments
const SOURCE_DIR = path.join(__dirname, 'attachments');

// Ensure source directory exists
if (!fs.existsSync(SOURCE_DIR)) {
  fs.mkdirSync(SOURCE_DIR, { recursive: true });
  console.log(`Created attachments directory: ${SOURCE_DIR}`);
  console.log('Please place the 12 cosmic symbol attachments in this directory');
}

// Ensure cosmic modalities directory exists
if (!fs.existsSync(COSMIC_MODALITIES_DIR)) {
  fs.mkdirSync(COSMIC_MODALITIES_DIR, { recursive: true });
  console.log(`Created cosmic modalities directory: ${COSMIC_MODALITIES_DIR}`);
}

// Instructions for manual placement of images
console.log('\n=== INSTRUCTIONS FOR USING THE COSMIC SYMBOL IMAGES ===');
console.log('1. Save the 12 attachment images to the cosmic-modalities directory with these filenames:');
IMAGE_MAPPING.forEach(mapping => {
  console.log(`   - Attachment ${mapping.attachmentNumber} → ${mapping.filename}`);
});
console.log('\n2. The images should be placed in:');
console.log(`   ${COSMIC_MODALITIES_DIR}`);
console.log('\n3. After placing the images, run:');
console.log('   cd /home/jono/workspace/github/typescriptEphemeris/astrology-chart && npm run dev');
console.log('\n=== END INSTRUCTIONS ===');
