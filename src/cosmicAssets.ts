// Cosmic Cypher Assets
// Auto-generated from CosmicCypher repository assets

import * as images from './images.js'
import * as fonts from './fonts.js'

// Export everything
export const cosmicAssets = {
  images,
  fonts,
};

// Export helper for registering font files in CSS
type MaybeDocument = {
  createElement?: (tagName: string) => any
  head?: {
    appendChild?: (node: any) => void
  }
}

const getDocument = (): MaybeDocument | null => {
  if (typeof globalThis === 'undefined') return null
  const maybeDoc = (globalThis as { document?: MaybeDocument }).document
  if (!maybeDoc) return null
  return maybeDoc
}

export const registerFonts = () => {
  const doc = getDocument()
  if (!doc || typeof doc.createElement !== 'function') return

  const fontStyles = doc.createElement('style')
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
  `

  if (doc.head && typeof doc.head.appendChild === 'function') {
    doc.head.appendChild(fontStyles)
  }
}

export default cosmicAssets
