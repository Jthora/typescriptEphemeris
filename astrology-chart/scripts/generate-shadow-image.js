#!/usr/bin/env node

/**
 * Generate a PNG shadow image for cusp symbols
 * Creates a black circle with radial opacity gradient (center 100% opaque, edge 0%)
 */

import fs from 'fs';
import path from 'path';

// Create a simple HTML5 Canvas-based PNG generator
const generateShadowPNG = () => {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Shadow Generator</title>
</head>
<body>
    <canvas id="canvas" width="100" height="100"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create radial gradient from center to edge
        const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)');    // Center: 100% opaque black
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.8)');   // 30%: 80% opaque
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');   // 60%: 40% opaque
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');   // 80%: 10% opaque
        gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');   // Edge: 0% opaque (transparent)
        
        // Fill the entire canvas with the gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 100, 100);
        
        // Convert to PNG data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Output the base64 data for manual extraction
        console.log('Generated shadow PNG data:');
        console.log(dataURL);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'cusp-shadow.png';
        link.href = dataURL;
        link.click();
    </script>
</body>
</html>`;

  return html;
};

// Write the HTML generator
const outputPath = path.join(__dirname, 'shadow-generator.html');
fs.writeFileSync(outputPath, generateShadowPNG());

console.log(`Shadow generator HTML created at: ${outputPath}`);
console.log('Open this file in a browser to generate and download the shadow PNG.');
console.log('Alternatively, use the Node.js canvas approach below...');

// Try to use node-canvas if available, otherwise provide instructions
try {
  const { createCanvas } = require('canvas');
  
  // Create canvas
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  
  // Create radial gradient from center to edge
  const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)');    // Center: 100% opaque black
  gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.8)');   // 30%: 80% opaque
  gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');   // 60%: 40% opaque
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');   // 80%: 10% opaque
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');   // Edge: 0% opaque (transparent)
  
  // Fill the entire canvas with the gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 100, 100);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  const pngPath = path.join(__dirname, '..', 'public', 'cusp-shadow.png');
  
  // Ensure public directory exists
  const publicDir = path.dirname(pngPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(pngPath, buffer);
  console.log(`Shadow PNG created successfully at: ${pngPath}`);
  
} catch (error) {
  console.log('node-canvas not available. Using manual approach...');
  console.log('Install node-canvas with: npm install canvas');
  console.log('Or open the generated HTML file in a browser to download the PNG manually.');
}
