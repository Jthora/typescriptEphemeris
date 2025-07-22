import { AstrologyCalculator } from './astrology';

// Debug the chart calculation to see why planets aren't showing
async function debugChartCalculation() {
  console.log('🔍 DEBUGGING CHART CALCULATION\n');
  
  const calculator = new AstrologyCalculator();
  
  const testBirthData = {
    date: new Date('1990-01-01T12:00:00.000Z'), // Same as our verification
    latitude: 40.7128,
    longitude: -74.0060,
    name: 'Test Chart'
  };
  
  console.log('Birth Data:', testBirthData);
  console.log('\nCalculating chart...\n');
  
  try {
    const chart = await calculator.calculateChart(testBirthData);
    
    console.log('CHART CALCULATION RESULTS:');
    console.log('═'.repeat(50));
    console.log(`Number of bodies: ${chart.bodies.length}`);
    console.log(`Number of aspects: ${chart.aspects.length}`);
    console.log(`House system: ${chart.houses.system}`);
    console.log('\nBODIES:');
    
    if (chart.bodies.length === 0) {
      console.log('❌ NO BODIES CALCULATED! This is the problem.');
    } else {
      chart.bodies.forEach((body, index) => {
        console.log(`${index + 1}. ${body.name}:`);
        console.log(`   Longitude: ${body.longitude.toFixed(2)}°`);
        console.log(`   Sign: ${body.sign} ${body.signDegree.toFixed(2)}°`);
        console.log(`   House: ${body.house}`);
        console.log(`   Symbol: ${body.symbol}`);
        console.log(`   Retrograde: ${body.retrograde ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    console.log('NODES:');
    console.log(`North Node: ${chart.nodes.northNode.longitude.toFixed(2)}° (${chart.nodes.northNode.sign})`);
    console.log(`South Node: ${chart.nodes.southNode.longitude.toFixed(2)}° (${chart.nodes.southNode.sign})`);
    
    console.log('\nHOUSES:');
    chart.houses.cusps.forEach((cusp, index) => {
      console.log(`House ${index + 1}: ${cusp.toFixed(2)}°`);
    });
    
    console.log('\n✅ Chart calculation completed successfully!');
    
  } catch (error) {
    console.error('❌ CHART CALCULATION FAILED:');
    console.error(error);
    console.error('\nStack trace:');
    console.error((error as Error).stack);
  }
}

debugChartCalculation();
