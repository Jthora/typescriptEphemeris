// Test script to validate our calculations against Astro-Seek reference data
// Reference: Kent, WA (47.3831°N, 122.2347°W) July 29, 2025, 09:27 PDT

import { AstrologyCalculator } from './dist/astrology.js';

async function testReferenceData() {
  console.log('🧪 Testing against Astro-Seek reference data...\n');
  
  // Kent, WA birth data - July 29, 2025, 09:27 PDT (updated time)
  const birthData = {
    date: new Date('2025-07-29T09:27:00-07:00'), // PDT is UTC-7
    latitude: 47.3831,   // 47°23'N
    longitude: -122.2347, // 122°14'W (negative for western longitude)
    name: 'Kent WA Reference Test - 09:27 PDT'
  };
  
  console.log('Birth Data:');
  console.log(`  Date: ${birthData.date.toISOString()}`);
  console.log(`  Location: ${birthData.latitude}°N, ${Math.abs(birthData.longitude)}°W`);
  console.log(`  UTC Date: ${birthData.date.toUTCString()}\n`);
  
  // Expected values from Astro-Seek (UPDATED for 09:27 PDT)
  const expected = {
    asc: 166.73,  // Virgo 16°44'
    mc: 73.48,    // Gemini 13°29'
    houses: {
      // Placidus house cusps from Astro-Seek
      1: 166.73,   // Virgo 16°44' (ASC)
      2: 190.02,   // Libra 10°01'
      3: 219.03,   // Scorpio 9°02'
      4: 253.48,   // Sagittarius 13°29' (IC)
      5: 289.22,   // Capricorn 19°13'
      6: 320.65,   // Aquarius 20°39'
      7: 346.73,   // Pisces 16°44' (DSC)
      8: 10.02,    // Aries 10°01'
      9: 39.03,    // Taurus 9°02'
      10: 73.48,   // Gemini 13°29' (MC)
      11: 109.22,  // Cancer 19°13'
      12: 140.65   // Leo 20°39'
    }
  };
  
  try {
    const calculator = new AstrologyCalculator();
    
    // Test with Placidus house system
    console.log('Testing Placidus house system...');
    const chart = await calculator.calculateChart(birthData, 'placidus');
    
    console.log('\n📊 COMPARISON RESULTS:');
    console.log('='.repeat(50));
    
    // Compare house cusps
    console.log('\nHouse Cusps Comparison:');
    chart.houses.cusps.forEach((cusp, index) => {
      const houseNum = index + 1;
      const expectedCusp = expected.houses[houseNum];
      const diff = Math.abs(cusp - expectedCusp);
      const accurate = diff <= 3.0; // Allow 3° tolerance for simplified calculations
      
      // Convert to zodiac sign display
      const ourSign = getZodiacDisplay(cusp);
      const expectedSign = getZodiacDisplay(expectedCusp);
      
      console.log(`  House ${houseNum.toString().padStart(2)}: ${cusp.toFixed(1)}° (${ourSign}) vs ${expectedCusp.toFixed(1)}° (${expectedSign}) - diff: ${diff.toFixed(1)}° ${accurate ? '✅' : '❌'}`);
    });
    
    // Summary
    const accurateCount = chart.houses.cusps.filter((cusp, index) => {
      const expectedCusp = expected.houses[index + 1];
      return Math.abs(cusp - expectedCusp) <= 3.0;
    }).length;
    
    console.log('\n📈 ACCURACY SUMMARY:');
    console.log(`  House System: ${chart.houses.system}`);
    console.log(`  Accurate cusps: ${accurateCount}/12 (${(accurateCount/12*100).toFixed(1)}%)`);
    console.log(`  Tolerance: ±3.0°`);
    
    if (accurateCount >= 10) {
      console.log('  Status: ✅ EXCELLENT - Implementation is highly accurate!');
    } else if (accurateCount >= 8) {
      console.log('  Status: ⚠️  GOOD - Minor adjustments needed');
    } else {
      console.log('  Status: ❌ NEEDS WORK - Significant issues detected');
    }
    
    // Test Equal House system for comparison
    console.log('\n' + '='.repeat(50));
    console.log('Testing Equal House system for comparison...');
    const equalChart = await calculator.calculateChart(birthData, 'equal');
    console.log(`Equal House ASC: ${equalChart.houses.cusps[0].toFixed(1)}° (should match Placidus ASC)`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Helper function to convert longitude to zodiac sign display
function getZodiacDisplay(longitude) {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = Math.floor(longitude / 30);
  const degree = longitude % 30;
  return `${signs[signIndex]} ${degree.toFixed(0)}°`;
}

// Run the test
testReferenceData().catch(console.error);
