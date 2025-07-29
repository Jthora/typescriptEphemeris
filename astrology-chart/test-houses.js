/**
 * Test script to verify house system calculations are working correctly
 */

import { AstrologyCalculator } from './astrology.js';

const calculator = new AstrologyCalculator();

// Test data: same time, different locations
const testTime = new Date('2024-01-15T12:00:00Z');

const locations = [
  { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Equator', lat: 0, lng: 0 }
];

const houseSystems = ['equal', 'placidus', 'whole-sign'];

console.log('🏠 Testing House System Calculations');
console.log('=====================================\n');

for (const location of locations) {
  console.log(`📍 Location: ${location.name} (${location.lat}°, ${location.lng}°)`);
  
  const birthData = {
    date: testTime,
    latitude: location.lat,
    longitude: location.lng,
    name: 'Test'
  };

  for (const system of houseSystems) {
    try {
      const chart = await calculator.calculateChart(birthData, system);
      const cusps = chart.houses.cusps;
      
      console.log(`  ${system.padEnd(12)}: ASC=${cusps[0].toFixed(1)}° MC=${cusps[9].toFixed(1)}° DSC=${cusps[6].toFixed(1)}° IC=${cusps[3].toFixed(1)}°`);
      
      // Check if houses are different sizes (not all 30°)
      const houseSizes = [];
      for (let i = 0; i < 12; i++) {
        const nextCusp = cusps[(i + 1) % 12];
        let size = nextCusp - cusps[i];
        if (size < 0) size += 360;
        houseSizes.push(size);
      }
      
      const minSize = Math.min(...houseSizes);
      const maxSize = Math.max(...houseSizes);
      const sizeVariation = maxSize - minSize;
      
      console.log(`    House sizes: ${minSize.toFixed(1)}° to ${maxSize.toFixed(1)}° (variation: ${sizeVariation.toFixed(1)}°)`);
      
    } catch (error) {
      console.log(`    ERROR: ${error.message}`);
    }
  }
  console.log('');
}

console.log('✅ Test complete! Check if:');
console.log('1. ASC/MC values change significantly between locations');
console.log('2. Placidus shows house size variation (especially at high latitudes)');
console.log('3. Equal House always shows 30° houses');
console.log('4. Different systems produce different results');
