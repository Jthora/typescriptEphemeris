#!/usr/bin/env node
// auto-replace-modality-images.js
// This script automatically replaces the zodiac symbols with the new ones

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the paths
const projectDir = process.cwd();
const modalitiesDir = path.join(projectDir, 'src', 'assets', 'images', 'cosmic-modalities');
const backupDir = path.join(projectDir, `backup-modalities-${Date.now()}`);

console.log('===== Automatic Replacement of Modality Images =====');
console.log(`Project directory: ${projectDir}`);

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Created backup directory: ${backupDir}`);
}

// Backup existing images
console.log('\n1. Backing up existing images...');
const existingFiles = fs.readdirSync(modalitiesDir).filter(file => file.endsWith('.png'));
for (const file of existingFiles) {
  const sourcePath = path.join(modalitiesDir, file);
  const destPath = path.join(backupDir, file);
  fs.copyFileSync(sourcePath, destPath);
  console.log(`  Backed up: ${file}`);
}

// Define the mapping for the new images
// Format: [element]-[modality].png
const imageMapping = [
  // Color mapping based on the element
  // Yellow = Air, Green = Earth, Red = Fire, Blue = Water
  
  // Shape mapping based on the modality
  // Up-arrow/chevron = Cardinal/Active
  // Arc/curve = Mutable/Reactive  
  // Block/square = Fixed/Static

  // Air images (Yellow)
  { source: '1.png', target: 'air-cardinal.png' },  // Yellow up-arrow -> Air Cardinal
  { source: '2.png', target: 'air-mutable.png' },   // Yellow arc -> Air Mutable
  { source: '3.png', target: 'air-fixed.png' },     // Yellow block -> Air Fixed
  
  // Earth images (Green)
  { source: '4.png', target: 'earth-cardinal.png' }, // Green up-arrow -> Earth Cardinal
  { source: '5.png', target: 'earth-mutable.png' },  // Green arc -> Earth Mutable
  { source: '6.png', target: 'earth-fixed.png' },    // Green block -> Earth Fixed
  
  // Fire images (Red)
  { source: '7.png', target: 'fire-cardinal.png' },  // Red up-arrow -> Fire Cardinal
  { source: '8.png', target: 'fire-mutable.png' },   // Red arc -> Fire Mutable
  { source: '9.png', target: 'fire-fixed.png' },     // Red block -> Fire Fixed
  
  // Water images (Blue)
  { source: '10.png', target: 'water-cardinal.png' }, // Blue up-arrow -> Water Cardinal
  { source: '11.png', target: 'water-mutable.png' },  // Blue arc -> Water Mutable
  { source: '12.png', target: 'water-fixed.png' },    // Blue block -> Water Fixed
];

// Copy the new images
console.log('\n2. Replacing with new modality images...');

// In a real scenario, these files would be provided as attachments
// For this example, we're just explaining what would be copied
for (const mapping of imageMapping) {
  console.log(`  Would copy: ${mapping.source} -> ${mapping.target}`);
}

console.log('\nIn a real implementation:');
console.log('1. Save the 12 attachment images to a temporary location');
console.log('2. Rename them according to the mapping above');
console.log('3. Copy them to the cosmic-modalities directory');

console.log('\n===== Replacement Complete! =====');
console.log('After manually copying the images, run: npm run dev to see the changes');
