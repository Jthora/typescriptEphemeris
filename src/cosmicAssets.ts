// Cosmic Cypher Assets
// Auto-generated from CosmicCypher repository assets

// Import all assets
import * as images from './images';
import * as fonts from './fonts';

// Export everything
export const cosmicAssets = {
  images,
  fonts,
};

// Export helper for registering font files in CSS
export const registerFonts = () => {
  const fontStyles = document.createElement('style');
  fontStyles.textContent = `
    @font-face {
      font-family: 'Aldrich';
      src: url('${fonts.aldrichRegular}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    
    @font-face {
      font-family: 'Iceberg';
      src: url('${fonts.icebergRegular}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  document.head.appendChild(fontStyles);
};

export default cosmicAssets;
