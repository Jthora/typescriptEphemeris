import { AstrologyCalculator } from './astrology';

/**
 * Example usage of the Astrology Calculator
 * This demonstrates how to use the calculator with sample birth data
 */
async function demonstrateAstrologyCalculator() {
  const calculator = new AstrologyCalculator();

  // Example birth data for testing
  const sampleBirthData = {
    date: new Date('1990-07-15T14:30:00'), // July 15, 1990, 2:30 PM
    latitude: 40.7128,  // New York City
    longitude: -74.0060,
    name: 'Example Person'
  };

  try {
    console.log('🌟 Calculating birth chart for:', sampleBirthData.name);
    console.log('📅 Birth Date:', sampleBirthData.date.toLocaleDateString());
    console.log('🕐 Birth Time:', sampleBirthData.date.toLocaleTimeString());
    console.log('📍 Location:', `${sampleBirthData.latitude}°, ${sampleBirthData.longitude}°`);
    console.log('');

    const chart = await calculator.calculateChart(sampleBirthData);

    console.log('✨ Chart calculation completed!');
    console.log('');

    // Display planetary positions
    console.log('🪐 Planetary Positions:');
    chart.bodies.forEach(body => {
      const signIndex = Math.floor(body.longitude / 30);
      const signName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][signIndex];
      const signDegree = body.longitude % 30;
      
      console.log(`  ${body.symbol} ${body.name}: ${signName} ${signDegree.toFixed(2)}° ${body.retrograde ? '℞' : ''}`);
    });
    console.log('');

    // Display house cusps
    console.log('🏠 House Cusps:');
    chart.houses.cusps.forEach((cusp, index) => {
      const signIndex = Math.floor(cusp / 30);
      const signName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][signIndex];
      const signDegree = cusp % 30;
      
      console.log(`  House ${index + 1}: ${signName} ${signDegree.toFixed(2)}°`);
    });
    console.log('');

    // Display major aspects
    console.log('🔗 Major Aspects:');
    const majorAspects = chart.aspects.filter(aspect => 
      ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'].includes(aspect.type)
    );
    
    majorAspects.forEach(aspect => {
      console.log(`  ${aspect.body1} ${aspect.type} ${aspect.body2} (orb: ${Math.abs(aspect.orb).toFixed(1)}°)`);
    });
    console.log('');

    // Display lunar nodes
    console.log('☊ Lunar Nodes:');
    const northSignIndex = Math.floor(chart.nodes.northNode.longitude / 30);
    const northSignName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][northSignIndex];
    const northSignDegree = chart.nodes.northNode.longitude % 30;
    
    const southSignIndex = Math.floor(chart.nodes.southNode.longitude / 30);
    const southSignName = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][southSignIndex];
    const southSignDegree = chart.nodes.southNode.longitude % 30;
    
    console.log(`  ☊ North Node: ${northSignName} ${northSignDegree.toFixed(2)}°`);
    console.log(`  ☋ South Node: ${southSignName} ${southSignDegree.toFixed(2)}°`);
    console.log('');

    console.log('📊 Chart Summary:');
    console.log(`  Total Planets: ${chart.bodies.length}`);
    console.log(`  Total Major Aspects: ${majorAspects.length}`);
    console.log(`  House System: ${chart.houses.system}`);
    console.log('');

    return chart;

  } catch (error) {
    console.error('❌ Error calculating chart:', error);
    throw error;
  }
}

// Export for use in other modules
export { demonstrateAstrologyCalculator };

// If running this file directly in Node.js
if (typeof window === 'undefined') {
  demonstrateAstrologyCalculator()
    .then(() => {
      console.log('✅ Demonstration completed successfully!');
    })
    .catch((error) => {
      console.error('❌ Demonstration failed:', error);
    });
}
