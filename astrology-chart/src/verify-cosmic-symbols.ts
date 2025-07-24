/**
 * Script to verify that cosmic symbols are correctly loaded and displayed
 */
import { cosmicSymbols } from './assets/images';

// Verify that all cosmic symbols are properly defined and accessible
const verifyCosmicSymbols = () => {
  console.log('Verifying cosmic symbols...');

  // Check that the zodiac object exists
  if (!cosmicSymbols.zodiac) {
    console.error('Error: cosmicSymbols.zodiac is not defined!');
    return false;
  }

  // Check for each zodiac sign
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  let success = true;

  // Verify each zodiac sign has an associated image
  for (const sign of zodiacSigns) {
    const symbolData = cosmicSymbols.zodiac[sign as keyof typeof cosmicSymbols.zodiac];
    
    if (!symbolData) {
      console.error(`Error: No cosmic symbol data found for ${sign}`);
      success = false;
      continue;
    }

    if (!symbolData.image) {
      console.error(`Error: No image URL defined for ${sign}`);
      success = false;
      continue;
    }

    console.log(`✅ ${sign}: ${symbolData.element}-${symbolData.modality} (${symbolData.image})`);
  }

  return success;
};

// Execute verification
const result = verifyCosmicSymbols();
console.log(result ? '✅ All cosmic symbols verified successfully!' : '❌ Some cosmic symbols are missing or incorrect');

export default verifyCosmicSymbols;
