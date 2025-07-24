// Verify that all cosmic symbols are correctly imported and usable
import { useEffect } from 'react';
import ZODIAC_COSMIC_SYMBOLS from './assets/images/cosmic-symbols';

export function VerifySymbols() {
  useEffect(() => {
    console.log('Verifying cosmic symbols...');
    
    // Log all symbol data to verify they're correctly imported
    Object.entries(ZODIAC_COSMIC_SYMBOLS).forEach(([sign, data]) => {
      console.log(`Sign: ${sign}`);
      console.log(`  Element: ${data.element}`);
      console.log(`  Modality: ${data.modality}`);
      console.log(`  Image URL: ${data.image}`);
      console.log(`  Image URL type: ${typeof data.image}`);
      
      // Create an image element to test loading
      const img = new Image();
      img.onload = () => console.log(`✅ Successfully loaded image for ${sign}`);
      img.onerror = () => console.error(`❌ Failed to load image for ${sign}`);
      img.src = data.image;
    });
    
  }, []);
  
  return (
    <div>
      <h2>Cosmic Symbol Verification</h2>
      <p>Check the console for verification results</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {Object.entries(ZODIAC_COSMIC_SYMBOLS).map(([sign, data]) => (
          <div key={sign} style={{ textAlign: 'center', padding: '1rem', border: '1px solid #ccc' }}>
            <h3>{sign}</h3>
            <img 
              src={data.image} 
              alt={`${sign} (${data.element}/${data.modality})`}
              style={{ width: '64px', height: '64px' }}
            />
            <p>{data.element} / {data.modality}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifySymbols;
