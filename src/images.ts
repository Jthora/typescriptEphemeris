export type CosmicImageMap = Record<string, string>

/**
 * Placeholder image exports so the cosmic asset loader can resolve module references.
 * In the CLI context we only need deterministic string paths; bundlers can swap them
 * for hashed URLs during build.
 */
export const glyphReference = '/assets/cosmic-cypher/infographics/cosmic-cypher-mk3-thumb.jpg'
export const modalityGrid = '/assets/cosmic-cypher/infographics/cosmic-cypher-mk2-thumb.jpg'

const images: CosmicImageMap = {
  glyphReference,
  modalityGrid
}

export default images
