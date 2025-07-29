const fs = require('fs');
const path = require('path');

// Create a PNG shadow image using Canvas API in Node.js
async function createShadowImage() {
  try {
    // Try to import canvas
    const { createCanvas } = await import('canvas');
    
    const size = 100; // Image size (100x100 pixels)
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create radial gradient from center to edge
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2;
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    
    // Strong black center (100% opacity) fading to transparent
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1.0)');     // 100% black at center
    gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.8)');   // Still strong at 30%
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');   // Fading at 60%
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');   // Nearly transparent at 80%
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');       // Fully transparent at edge
    
    // Fill the canvas with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Save as PNG
    const outputPath = path.join(__dirname, '..', 'public', 'symbols', 'shadow-circle.png');
    
    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the PNG file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✅ Shadow image created successfully at: ${outputPath}`);
    console.log(`📏 Image size: ${size}x${size} pixels`);
    console.log(`🎨 Gradient: 100% black center → transparent edge`);
    
  } catch (error) {
    console.error('❌ Error creating shadow image with canvas:', error.message);
    console.log('📝 Attempting alternative method using ImageData...');
    
    // Alternative method using pure JavaScript (no canvas library)
    createShadowImageManual();
  }
}

// Fallback method to create PNG manually
function createShadowImageManual() {
  try {
    // Use a simpler approach - create an SVG that can be converted to PNG
    const size = 100;
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:1.0" />
      <stop offset="30%" style="stop-color:rgb(0,0,0);stop-opacity:0.8" />
      <stop offset="60%" style="stop-color:rgb(0,0,0);stop-opacity:0.4" />
      <stop offset="80%" style="stop-color:rgb(0,0,0);stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:0" />
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="50" fill="url(#shadowGradient)" />
</svg>`;
    
    const outputPath = path.join(__dirname, '..', 'public', 'symbols', 'shadow-circle.svg');
    
    // Ensure directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, svgContent);
    
    console.log(`✅ Shadow SVG created successfully at: ${outputPath}`);
    console.log(`📏 Image size: ${size}x${size} pixels`);
    console.log(`🎨 Gradient: 100% black center → transparent edge`);
    console.log(`💡 Note: Using SVG format as fallback (can be converted to PNG if needed)`);
    
  } catch (error) {
    console.error('❌ Error creating shadow image manually:', error.message);
  }
}

// Run the script
createShadowImage();
