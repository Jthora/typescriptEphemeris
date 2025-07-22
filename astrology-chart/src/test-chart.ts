import { AstrologyCalculator } from './astrology';

// Test the astrology calculator
const testChart = async () => {
  const calculator = new AstrologyCalculator();
  
  const testBirthData = {
    date: new Date('1990-01-01T12:00:00'),
    latitude: 40.7128,
    longitude: -74.0060,
    name: 'Test Person'
  };
  
  try {
    console.log('Testing chart calculation...');
    const chart = await calculator.calculateChart(testBirthData);
    console.log('Chart calculated successfully:');
    console.log('Number of bodies:', chart.bodies.length);
    console.log('Bodies:', chart.bodies.map(b => `${b.name}: ${b.sign} ${b.signDegree.toFixed(2)}°`));
    console.log('Houses:', chart.houses);
    console.log('Aspects:', chart.aspects.length);
    console.log('Nodes:', chart.nodes);
  } catch (error) {
    console.error('Chart calculation failed:', error);
  }
};

// Run the test
testChart();
