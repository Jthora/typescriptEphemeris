import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { cosmicSymbols } from '../assets'
import themeManager, { THEMES, type ThemeType } from '../theme-manager'
import { getDecanDescription } from '../tutorial/decan-descriptions'
import {
  astrologicalSymbologyIconsJupiter,
  astrologicalSymbologyIconsMars,
  astrologicalSymbologyIconsMercury,
  astrologicalSymbologyIconsMoon,
  astrologicalSymbologyIconsNeptune,
  astrologicalSymbologyIconsPluto,
  astrologicalSymbologyIconsSaturn,
  astrologicalSymbologyIconsSun,
  astrologicalSymbologyIconsUranus,
  astrologicalSymbologyIconsVenus,
  astrologyIconArkanaAquarius,
  astrologyIconArkanaAquariusWhite,
  astrologyIconArkanaAries,
  astrologyIconArkanaAriesWhite,
  astrologyIconArkanaCancer,
  astrologyIconArkanaCancerWhite,
  astrologyIconArkanaCapricorn,
  astrologyIconArkanaCapricornWhite,
  astrologyIconArkanaGemini,
  astrologyIconArkanaGeminiWhite,
  astrologyIconArkanaLeo,
  astrologyIconArkanaLeoWhite,
  astrologyIconArkanaLibra,
  astrologyIconArkanaLibraWhite,
  astrologyIconArkanaPisces,
  astrologyIconArkanaPiscesWhite,
  astrologyIconArkanaSagittarius,
  astrologyIconArkanaSagittariusWhite,
  astrologyIconArkanaScorpio,
  astrologyIconArkanaScorpioWhite,
  astrologyIconArkanaTaurus,
  astrologyIconArkanaTaurusWhite,
  astrologyIconArkanaVirgo,
  astrologyIconArkanaVirgoWhite,
  astrologyIconNodeLilith,
  astrologyIconNodeNorthNode,
  astrologyIconNodeSouthNode,
  astrologyIconBase16Alpha,
  astrologyIconBase16Chaos,
  astrologyIconBase16Core,
  astrologyIconBase16Omega,
  astrologyIconBase16Order,
  astrologyIconBase16Void,
  cosmicSymbologyIconsOne
} from '../assets/images/icons'
import {
  symbolsO1AirStandard,
  symbolsO1AirWhite,
  symbolsO1EarthStandard,
  symbolsO1EarthWhite,
  symbolsO1FireStandard,
  symbolsO1FireWhite,
  symbolsO1WaterStandard,
  symbolsO1WaterWhite
} from '../assets/images/symbols/universal'
import './TutorialPage.css'

type Element = 'Fire' | 'Earth' | 'Air' | 'Water'
type Modality = 'Cardinal' | 'Fixed' | 'Mutable'

interface TutorialIcon {
  src: string
  alt: string
}

interface TutorialSymbolBadge {
  label: string
  icon: TutorialIcon
}

type TutorialBadge = string | TutorialBadgeDetail

interface TutorialBadgeDetail {
  id?: string
  text: string
  leadingIcon?: TutorialIcon
  trailingIcon?: TutorialIcon
  inlineIcons?: TutorialIcon[]
}

interface TutorialSectionItem {
  label: string
  value?: string
  valueIcons?: TutorialIcon[]
  detail?: string
  range?: string
  badges?: TutorialBadge[]
  equation?: string
  meta?: string
  icon?: TutorialIcon
  forceIcon?: TutorialIcon
  primarySymbolBadge?: TutorialSymbolBadge
  symbolBadges?: TutorialSymbolBadge[]
  decanSummary?: string
  decanBlendDescription?: string
  decanEgyptianLore?: string
}

interface TutorialSectionData {
  id: string
  title: string
  description: string
  layout?: 'grid' | 'list'
  items: TutorialSectionItem[]
}

interface TutorialTabData {
  id: string
  label: string
  description: string
  sections: TutorialSectionData[]
}

interface ZodiacSignMeta {
  id: string
  name: string
  element: Element
  modality: Modality
  force: CosmicForceName
  dates: string
  ruler: string
  polarity: 'Yang' | 'Yin'
  nature: string
  keywords: string
}

type DecanForce = 'prime' | 'core' | 'order' | 'chaos' | 'void' | string

type CosmicForceName = 'Core' | 'Void' | 'Order' | 'Chaos' | 'Alpha' | 'Omega'

type IconVariantSet = {
  light: TutorialIcon
  dark: TutorialIcon
}

const zodiacArkanaIconVariants: Record<string, IconVariantSet> = {
  Aries: {
    light: { src: astrologyIconArkanaAries, alt: 'Aries Arkana symbol' },
    dark: { src: astrologyIconArkanaAriesWhite, alt: 'Aries Arkana symbol (light variant)' }
  },
  Taurus: {
    light: { src: astrologyIconArkanaTaurus, alt: 'Taurus Arkana symbol' },
    dark: { src: astrologyIconArkanaTaurusWhite, alt: 'Taurus Arkana symbol (light variant)' }
  },
  Gemini: {
    light: { src: astrologyIconArkanaGemini, alt: 'Gemini Arkana symbol' },
    dark: { src: astrologyIconArkanaGeminiWhite, alt: 'Gemini Arkana symbol (light variant)' }
  },
  Cancer: {
    light: { src: astrologyIconArkanaCancer, alt: 'Cancer Arkana symbol' },
    dark: { src: astrologyIconArkanaCancerWhite, alt: 'Cancer Arkana symbol (light variant)' }
  },
  Leo: {
    light: { src: astrologyIconArkanaLeo, alt: 'Leo Arkana symbol' },
    dark: { src: astrologyIconArkanaLeoWhite, alt: 'Leo Arkana symbol (light variant)' }
  },
  Virgo: {
    light: { src: astrologyIconArkanaVirgo, alt: 'Virgo Arkana symbol' },
    dark: { src: astrologyIconArkanaVirgoWhite, alt: 'Virgo Arkana symbol (light variant)' }
  },
  Libra: {
    light: { src: astrologyIconArkanaLibra, alt: 'Libra Arkana symbol' },
    dark: { src: astrologyIconArkanaLibraWhite, alt: 'Libra Arkana symbol (light variant)' }
  },
  Scorpio: {
    light: { src: astrologyIconArkanaScorpio, alt: 'Scorpio Arkana symbol' },
    dark: { src: astrologyIconArkanaScorpioWhite, alt: 'Scorpio Arkana symbol (light variant)' }
  },
  Sagittarius: {
    light: { src: astrologyIconArkanaSagittarius, alt: 'Sagittarius Arkana symbol' },
    dark: { src: astrologyIconArkanaSagittariusWhite, alt: 'Sagittarius Arkana symbol (light variant)' }
  },
  Capricorn: {
    light: { src: astrologyIconArkanaCapricorn, alt: 'Capricorn Arkana symbol' },
    dark: { src: astrologyIconArkanaCapricornWhite, alt: 'Capricorn Arkana symbol (light variant)' }
  },
  Aquarius: {
    light: { src: astrologyIconArkanaAquarius, alt: 'Aquarius Arkana symbol' },
    dark: { src: astrologyIconArkanaAquariusWhite, alt: 'Aquarius Arkana symbol (light variant)' }
  },
  Pisces: {
    light: { src: astrologyIconArkanaPisces, alt: 'Pisces Arkana symbol' },
    dark: { src: astrologyIconArkanaPiscesWhite, alt: 'Pisces Arkana symbol (light variant)' }
  }
}

const elementIconVariants: Record<Element, IconVariantSet> = {
  Fire: {
    light: { src: symbolsO1FireStandard, alt: 'Fire element symbol' },
    dark: { src: symbolsO1FireWhite, alt: 'Fire element symbol (light variant)' }
  },
  Earth: {
    light: { src: symbolsO1EarthStandard, alt: 'Earth element symbol' },
    dark: { src: symbolsO1EarthWhite, alt: 'Earth element symbol (light variant)' }
  },
  Air: {
    light: { src: symbolsO1AirStandard, alt: 'Air element symbol' },
    dark: { src: symbolsO1AirWhite, alt: 'Air element symbol (light variant)' }
  },
  Water: {
    light: { src: symbolsO1WaterStandard, alt: 'Water element symbol' },
    dark: { src: symbolsO1WaterWhite, alt: 'Water element symbol (light variant)' }
  }
}

const MODALITY_WAVE_PATHS: Record<Modality, string> = {
  Cardinal: 'M2 24 L10 4 L18 24 L26 4 L34 24 L42 4 L50 24',
  Fixed: 'M2 24 V4 H12 V24 H22 V4 H32 V24 H42 V4 H50 V24',
  Mutable: 'M2 14 C6 2 10 2 14 14 S22 26 26 14 S34 2 38 14 S46 26 50 14'
}

const buildWaveIcon = (path: string, stroke: string) => {
  const svg = `<svg width="50" height="28" viewBox="0 0 50 28" xmlns="http://www.w3.org/2000/svg"><path d="${path}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const decanForceIconMap = {
  prime: {
    src: cosmicSymbologyIconsOne,
    alt: 'Prime force icon'
  },
  core: {
    src: astrologyIconBase16Core,
    alt: 'Core force icon'
  },
  order: {
    src: astrologyIconBase16Order,
    alt: 'Order force icon'
  },
  chaos: {
    src: astrologyIconBase16Chaos,
    alt: 'Chaos force icon'
  },
  void: {
    src: astrologyIconBase16Void,
    alt: 'Void force icon'
  }
} satisfies Record<'prime' | 'core' | 'order' | 'chaos' | 'void', TutorialIcon>

const cosmicForceIconMap = {
  Core: {
    src: astrologyIconBase16Core,
    alt: 'Core force glyph'
  },
  Void: {
    src: astrologyIconBase16Void,
    alt: 'Void force glyph'
  },
  Order: {
    src: astrologyIconBase16Order,
    alt: 'Order force glyph'
  },
  Chaos: {
    src: astrologyIconBase16Chaos,
    alt: 'Chaos force glyph'
  },
  Alpha: {
    src: astrologyIconBase16Alpha,
    alt: 'Alpha force glyph'
  },
  Omega: {
    src: astrologyIconBase16Omega,
    alt: 'Omega force glyph'
  }
} satisfies Record<CosmicForceName, TutorialIcon>

function resolveDecanForceIcon(force: DecanForce): TutorialIcon | undefined {
  if (!force) return undefined
  return decanForceIconMap[force as keyof typeof decanForceIconMap]
}

function resolveZodiacIcon(signName: string, isDarkMode: boolean): TutorialIcon | undefined {
  const variants = zodiacArkanaIconVariants[signName]
  if (!variants) return undefined
  return isDarkMode ? variants.dark : variants.light
}

function resolveElementIcon(element: Element, isDarkMode: boolean): TutorialIcon | undefined {
  const variants = elementIconVariants[element]
  if (!variants) return undefined
  return isDarkMode ? variants.dark : variants.light
}

function resolveNatureIcon(sign: ZodiacSignMeta, isDarkMode: boolean): TutorialIcon | undefined {
  const elementIcon = resolveElementIcon(sign.element, isDarkMode)
  if (!elementIcon) return undefined
  return {
    src: elementIcon.src,
    alt: `${sign.name} nature (${sign.nature}) icon`
  }
}

function resolveModalityIcon(modality: Modality, isDarkMode: boolean): TutorialIcon | undefined {
  const path = MODALITY_WAVE_PATHS[modality]
  if (!path) return undefined
  const stroke = isDarkMode ? '#ffffff' : '#050505'
  return {
    src: buildWaveIcon(path, stroke),
    alt: `${modality} modality symbol`
  }
}

const zodiacSigns: ZodiacSignMeta[] = [
  {
    id: 'aries',
    name: 'Aries',
    element: 'Fire',
    modality: 'Cardinal',
    force: 'Alpha',
    dates: 'Mar 21 – Apr 19',
    ruler: 'Mars',
    polarity: 'Yang',
    nature: 'Ignition vector',
    keywords: 'Pioneering, decisive, crisis-ready'
  },
  {
    id: 'taurus',
    name: 'Taurus',
    element: 'Earth',
    modality: 'Fixed',
    force: 'Core',
    dates: 'Apr 20 – May 20',
    ruler: 'Venus',
    polarity: 'Yin',
    nature: 'Stability engine',
    keywords: 'Embodiment, sensual craft, steady building'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    element: 'Air',
    modality: 'Mutable',
    force: 'Void',
    dates: 'May 21 – Jun 20',
    ruler: 'Mercury',
    polarity: 'Yang',
    nature: 'Signal switchboard',
    keywords: 'Story-weaving, adaptable, playful intel'
  },
  {
    id: 'cancer',
    name: 'Cancer',
    element: 'Water',
    modality: 'Cardinal',
    force: 'Omega',
    dates: 'Jun 21 – Jul 22',
    ruler: 'Moon',
    polarity: 'Yin',
    nature: 'Protective tide',
    keywords: 'Caretaking, initiation through feeling'
  },
  {
    id: 'leo',
    name: 'Leo',
    element: 'Fire',
    modality: 'Fixed',
    force: 'Core',
    dates: 'Jul 23 – Aug 22',
    ruler: 'Sun',
    polarity: 'Yang',
    nature: 'Radiant heart',
    keywords: 'Creative sovereignty, loyalty, spotlight fuel'
  },
  {
    id: 'virgo',
    name: 'Virgo',
    element: 'Earth',
    modality: 'Mutable',
    force: 'Order',
    dates: 'Aug 23 – Sep 22',
    ruler: 'Mercury',
    polarity: 'Yin',
    nature: 'Precision loom',
    keywords: 'Iterative craft, analysis, service systems'
  },
  {
    id: 'libra',
    name: 'Libra',
    element: 'Air',
    modality: 'Cardinal',
    force: 'Alpha',
    dates: 'Sep 23 – Oct 22',
    ruler: 'Venus',
    polarity: 'Yang',
    nature: 'Diplomatic launch',
    keywords: 'Symmetry, justice, graceful negotiation'
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    element: 'Water',
    modality: 'Fixed',
    force: 'Chaos',
    dates: 'Oct 23 – Nov 21',
    ruler: 'Mars · Pluto',
    polarity: 'Yin',
    nature: 'Transmutation engine',
    keywords: 'Depth, alchemy, uncompromising focus'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    element: 'Fire',
    modality: 'Mutable',
    force: 'Chaos',
    dates: 'Nov 22 – Dec 21',
    ruler: 'Jupiter',
    polarity: 'Yang',
    nature: 'Vector for meaning',
    keywords: 'Exploration, optimism, philosophy arc'
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    element: 'Earth',
    modality: 'Cardinal',
    force: 'Omega',
    dates: 'Dec 22 – Jan 19',
    ruler: 'Saturn',
    polarity: 'Yin',
    nature: 'Summit strategist',
    keywords: 'Structure, mastery, long-haul legacy'
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    element: 'Air',
    modality: 'Fixed',
    force: 'Order',
    dates: 'Jan 20 – Feb 18',
    ruler: 'Saturn · Uranus',
    polarity: 'Yang',
    nature: 'Systems breaker',
    keywords: 'Innovation, social circuitry, futurecraft'
  },
  {
    id: 'pisces',
    name: 'Pisces',
    element: 'Water',
    modality: 'Mutable',
    force: 'Void',
    dates: 'Feb 19 – Mar 20',
    ruler: 'Jupiter · Neptune',
    polarity: 'Yin',
    nature: 'Dream ocean',
    keywords: 'Compassion, dissolution, liminal wisdom'
  }
]

const planetIconMap = {
  Sun: { src: astrologicalSymbologyIconsSun, alt: 'Sun glyph icon' },
  Moon: { src: astrologicalSymbologyIconsMoon, alt: 'Moon glyph icon' },
  Mercury: { src: astrologicalSymbologyIconsMercury, alt: 'Mercury glyph icon' },
  Venus: { src: astrologicalSymbologyIconsVenus, alt: 'Venus glyph icon' },
  Mars: { src: astrologicalSymbologyIconsMars, alt: 'Mars glyph icon' },
  Jupiter: { src: astrologicalSymbologyIconsJupiter, alt: 'Jupiter glyph icon' },
  Saturn: { src: astrologicalSymbologyIconsSaturn, alt: 'Saturn glyph icon' },
  Uranus: { src: astrologicalSymbologyIconsUranus, alt: 'Uranus glyph icon' },
  Neptune: { src: astrologicalSymbologyIconsNeptune, alt: 'Neptune glyph icon' },
  Pluto: { src: astrologicalSymbologyIconsPluto, alt: 'Pluto glyph icon' }
} satisfies Record<'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto', TutorialIcon>

const nodeIconMap = {
  northNode: { src: astrologyIconNodeNorthNode, alt: 'North Node glyph icon' },
  southNode: { src: astrologyIconNodeSouthNode, alt: 'South Node glyph icon' },
  lilith: { src: astrologyIconNodeLilith, alt: 'Black Moon Lilith glyph icon' }
} satisfies Record<'northNode' | 'southNode' | 'lilith', TutorialIcon>

const planetProfiles: TutorialSectionItem[] = [
  {
    label: 'Sun',
    icon: planetIconMap.Sun,
    value: 'Core • Radiant Focus',
    range: '24h apparent cycle',
    detail: 'Primary vitality operator; anchors the base frequency in MATHEMATICAL_IMPLEMENTATION_SUMMARY for every harmonic computation.',
    badges: ['Vitality anchor', 'Core reference']
  },
  {
    label: 'Moon',
    icon: planetIconMap.Moon,
    value: 'Void • Tidal Memory',
    range: '27.3 days',
    detail: 'Fastest mover for the chart; drives cusp weighting and emotional tides through calculateCosmicForces().',
    badges: ['Cusp sensitivity', 'Night beacon']
  },
  {
    label: 'Mercury',
    icon: planetIconMap.Mercury,
    value: 'Order • Messenger',
    range: '88 days',
    detail: 'Governs mutable signal flow, retrograde toggles, and the reference rails for data overlays.',
    badges: ['Signal flow', 'Retrograde tests']
  },
  {
    label: 'Venus',
    icon: planetIconMap.Venus,
    value: 'Core • Relational Field',
    range: '225 days',
    detail: 'Stabilizes compatibility overlays; smooths the 0.3 cusp contribution for nearby sign blends.',
    badges: ['Attraction vector', 'Palette guide']
  },
  {
    label: 'Mars',
    icon: planetIconMap.Mars,
    value: 'Alpha • Combustion',
    range: '687 days',
    detail: 'Triggers triangle-wave initiations at 0°/120°/240° and shows where action plans ignite.',
    badges: ['Initiation', 'Triangle wave']
  },
  {
    label: 'Jupiter',
    icon: planetIconMap.Jupiter,
    value: 'Chaos • Expansion',
    range: '11.9 years',
    detail: 'Sets macro growth cadences and synodic coaching beats (≈399 days) for Resonance Finder.',
    badges: ['Luck vector', 'Synodic cycles']
  },
  {
    label: 'Saturn',
    icon: planetIconMap.Saturn,
    value: 'Order • Architect',
    range: '29.5 years',
    detail: 'Defines structural checkpoints, house boundaries, and type-check style validations.',
    badges: ['Structure', 'Return cycles']
  },
  {
    label: 'Uranus',
    icon: planetIconMap.Uranus,
    value: 'Chaos • Voltage',
    range: '84 years',
    detail: 'Injects polarity flips into the 15D state vector; treat as the disruption knob for collectives.',
    badges: ['Disruption', 'Polarity flips']
  },
  {
    label: 'Neptune',
    icon: planetIconMap.Neptune,
    value: 'Void • Dream Signal',
    range: '165 years',
    detail: 'Feeds amplitude dampening and empathy overlays; perfect for trance-like decan briefings.',
    badges: ['Dissolution', 'Empathy field']
  },
  {
    label: 'Pluto',
    icon: planetIconMap.Pluto,
    value: 'Omega • Compression',
    range: '248 years',
    detail: 'Marks timeline completions and Omega endpoints; influences permutation math via deep phase offsets.',
    badges: ['Regeneration', 'Omega gate']
  }
]

const nodeProfiles: TutorialSectionItem[] = [
  {
    label: 'Lunar North Node',
    icon: nodeIconMap.northNode,
    value: 'Order • Trajectory',
    range: '18.6 year cycle',
    detail: 'Collective mission vector; aim transits toward this point to align growth with long-haul lessons.',
    badges: ['Destiny rail', 'Ascending node']
  },
  {
    label: 'Lunar South Node',
    icon: nodeIconMap.southNode,
    value: 'Chaos • Release',
    range: '18.6 year cycle',
    detail: 'Karmic exhaust port; use it to identify patterns to compost while North Node pulls forward.',
    badges: ['Karmic release', 'Descending node']
  },
  {
    label: 'Black Moon Lilith',
    icon: nodeIconMap.lilith,
    value: 'Void • Shadow Voltage',
    range: '8.85 year orbit',
    detail: 'Apoapsis of the lunar path; signals unfiltered instinct and power reclamation arcs.',
    badges: ['Instinct core', 'Shadow work']
  }
]

const MODALITY_DEFINITIONS: TutorialSectionItem[] = [
  {
    label: 'Cardinal',
    value: 'Triangle wave',
    detail: 'Initiates cycles, mirroring calculateModalityWave()’s triangle approximation at crisis degrees.',
    badges: ['Start signal', '0°·120°·240°']
  },
  {
    label: 'Fixed',
    value: 'Square wave',
    detail: 'Holds the plateau; pair with hold presets and resistive animations inside AspectArea.',
    badges: ['Sustain', 'Plateau rendering']
  },
  {
    label: 'Mutable',
    value: 'Sine wave',
    detail: 'Smooth modulation for transitions, easing cusp fades and interpolation states.',
    badges: ['Adaptive', 'Ease curves']
  }
]

const ELEMENT_NATURE_DEFINITIONS: TutorialSectionItem[] = [
  {
    label: 'Fire',
    value: 'Radiant · Expansive',
    detail: 'Spirit ignition, boldness, intuition. Drives Alpha/Core story beats and color cues.',
    badges: ['South', 'Warm spectrum']
  },
  {
    label: 'Earth',
    value: 'Crystallized · Enduring',
    detail: 'Materialization, structure, sensory intelligence. Governs Core/Omega palettes.',
    badges: ['North', 'Dense spectrum']
  },
  {
    label: 'Air',
    value: 'Kinetic · Circulatory',
    detail: 'Thought, pattern recognition, signal routing. Maps to Order/Alpha overlays.',
    badges: ['East', 'Light spectrum']
  },
  {
    label: 'Water',
    value: 'Flowing · Resonant',
    detail: 'Emotion, empathy, dissolution. Powers Void/Omega gradients and cusp fades.',
    badges: ['West', 'Cool spectrum']
  }
]

const COSMIC_FORCE_DEFINITIONS = [
  {
    label: 'Core',
    elements: ['Fire', 'Earth'],
    detail: 'Concentration principle—nucleus, seed, singularity. Paint it gold in UI legend chips.',
    badges: ['Concentration', 'Materialization']
  },
  {
    label: 'Void',
    elements: ['Water', 'Air'],
    detail: 'Field, matrix, receptive space; handles background halos and data wells.',
    badges: ['Receptivity', 'Field state']
  },
  {
    label: 'Order',
    elements: ['Air', 'Earth'],
    detail: 'Structure, discipline, latticework; map to grids and chord diagrams.',
    badges: ['Structure', 'Protocol']
  },
  {
    label: 'Chaos',
    elements: ['Fire', 'Water'],
    detail: 'Transformation, vortices, voltage—the animation fuel for transits.',
    badges: ['Transformation', 'Wave power']
  },
  {
    label: 'Alpha',
    elements: ['Fire', 'Air'],
    detail: 'Initiating momentum; attach to launches, ascendants, and hero copy.',
    badges: ['Beginning', 'Ignition']
  },
  {
    label: 'Omega',
    elements: ['Earth', 'Water'],
    detail: 'Completion and integration; governs closures, harvests, and data exports.',
    badges: ['Completion', 'Integration']
  }
] satisfies Array<{ label: CosmicForceName; elements: [Element, Element]; detail: string; badges: TutorialBadge[] }>

function createCosmicForceEntries(isDarkMode: boolean): TutorialSectionItem[] {
  return COSMIC_FORCE_DEFINITIONS.map(({ label, elements, detail, badges }) => {
    const elementIcons = elements
      .map((element) => resolveElementIcon(element, isDarkMode))
      .filter((icon): icon is TutorialIcon => Boolean(icon))

    return {
      label,
      icon: cosmicForceIconMap[label],
      value: `${elements[0]} + ${elements[1]}`,
      valueIcons: elementIcons,
      detail,
      badges
    }
  })
}

function createElementNatureEntries(isDarkMode: boolean): TutorialSectionItem[] {
  return ELEMENT_NATURE_DEFINITIONS.map((entry) => {
    const icon = resolveElementIcon(entry.label as Element, isDarkMode)
    if (!icon) return entry
    return {
      ...entry,
      icon
    }
  })
}

function createModalityEntries(isDarkMode: boolean): TutorialSectionItem[] {
  return MODALITY_DEFINITIONS.map((entry) => {
    const icon = resolveModalityIcon(entry.label as Modality, isDarkMode)
    if (!icon) return entry
    return {
      ...entry,
      icon
    }
  })
}

type DualityAttributeDefinition = {
  id: string
  label: string
  yin: string
  yang: string
  yinForces?: CosmicForceName[]
  yangForces?: CosmicForceName[]
  yinElements?: Element[]
  yangElements?: Element[]
}

const DUALITY_ATTRIBUTE_MATRIX: DualityAttributeDefinition[] = [
  {
    id: 'forces',
    label: 'Cosmic Forces',
    yin: 'Void, Chaos, Omega',
    yang: 'Core, Order, Alpha',
    yinForces: ['Void', 'Chaos', 'Omega'],
    yangForces: ['Core', 'Order', 'Alpha']
  },
  {
    id: 'elements',
    label: 'Elements',
    yin: 'Water, Earth',
    yang: 'Fire, Air',
    yinElements: ['Water', 'Earth'],
    yangElements: ['Fire', 'Air']
  },
  {
    id: 'motion',
    label: 'Motion Pattern',
    yin: 'Absorb, stabilize, integrate',
    yang: 'Initiate, project, accelerate'
  },
  {
    id: 'focus',
    label: 'Focus',
    yin: 'Internal systems & maintenance',
    yang: 'External impact & expansion'
  },
  {
    id: 'communication',
    label: 'Communication',
    yin: 'Listen, synthesize, document',
    yang: 'Broadcast, direct, advocate'
  }
]

function createDualityEntries(isDarkMode: boolean): TutorialSectionItem[] {
  return ['Yin', 'Yang'].map((polarity) => {
    const isYin = polarity === 'Yin'

    const badges: TutorialBadgeDetail[] = DUALITY_ATTRIBUTE_MATRIX.map((attribute) => {
      const forceNames = isYin ? attribute.yinForces : attribute.yangForces
      const elementNames = isYin ? attribute.yinElements : attribute.yangElements

      const forceIcons = (forceNames ?? [])
        .map((force) => cosmicForceIconMap[force])
        .filter((icon): icon is TutorialIcon => Boolean(icon))

      const elementIcons = (elementNames ?? [])
        .map((element) => resolveElementIcon(element, isDarkMode))
        .filter((icon): icon is TutorialIcon => Boolean(icon))

      return {
        id: `${polarity.toLowerCase()}-${attribute.id}`,
        text: `${attribute.label}: ${isYin ? attribute.yin : attribute.yang}`,
        inlineIcons: [...forceIcons, ...elementIcons]
      }
    })

    return {
      label: polarity,
      value: isYin ? 'Feminine • Integrative' : 'Masculine • Expressive',
      detail: isYin
        ? 'Aligns with the Feminine current: Water/Earth elements channel the Void, Chaos, and Omega forces to absorb input, maintain systems, and recycle momentum.'
        : 'Aligns with the Masculine current: Fire/Air elements pair with Core, Order, and Alpha forces to launch initiatives, set direction, and drive momentum forward.',
      badges
    }
  })
}

function createZodiacEntries(signs: ZodiacSignMeta[], isDarkMode: boolean): TutorialSectionItem[] {
  return signs.map((sign) => {
    const signSymbol = cosmicSymbols.zodiac?.[sign.name as keyof typeof cosmicSymbols.zodiac]
    const elementBadge: TutorialBadgeDetail = {
      id: `${sign.name}-element`,
      text: sign.element,
      leadingIcon: resolveNatureIcon(sign, isDarkMode)
    }
    const modalityBadge: TutorialBadgeDetail = {
      id: `${sign.name}-modality`,
      text: sign.modality,
      leadingIcon: resolveModalityIcon(sign.modality, isDarkMode)
    }

    return {
      label: sign.name,
      range: sign.dates,
      detail: sign.keywords,
      badges: [elementBadge, modalityBadge],
      meta: `${sign.polarity} • ${sign.nature}`,
      forceIcon: resolveZodiacIcon(sign.name, isDarkMode),
      icon: signSymbol?.image
        ? {
            src: signSymbol.image,
            alt: `${sign.name} cosmic glyph`
          }
        : undefined
    }
  })
}

const CUSP_FORMAL_NAMES: readonly string[] = [
  'Power',
  'Energy',
  'Magic',
  'Oscillation',
  'Exposure',
  'Beauty',
  'Drama & Criticism',
  'Revolution',
  'Prophecy',
  'Mystery & Imagination',
  'Sensitivity',
  'Rebirth'
]

const CUSP_DESCRIPTOR_WORDS: readonly string[][] = [
  ['dominance', 'potency', 'authority', 'stamina', 'command'],
  ['momentum', 'drive', 'vigor', 'spark', 'initiative'],
  ['enchantment', 'alchemy', 'wonder', 'mystique', 'fascination'],
  ['fluctuation', 'rhythm', 'wavering', 'cadence', 'modulation'],
  ['revelation', 'disclosure', 'unveiling', 'clarity', 'candor'],
  ['grace', 'elegance', 'harmony', 'refinement', 'allure'],
  ['intensity', 'provocation', 'scrutiny', 'confrontation', 'commentary'],
  ['upheaval', 'liberation', 'innovation', 'rebellion', 'breakthrough'],
  ['foresight', 'divination', 'intuition', 'omen', 'insight'],
  ['enigma', 'fantasy', 'reverie', 'abstraction', 'curiosity'],
  ['empathy', 'receptivity', 'gentleness', 'nuance', 'softness'],
  ['renewal', 'resurgence', 'awakening', 'renaissance', 'reset']
]

const tutorialTabsConfig: TutorialTabData[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Dualities, modalities, natures, and forces in one reference hub.',
    sections: [
      {
        id: 'modalities-grid',
        title: 'Modal Waveforms',
        description: 'Reference wave multipliers before adjusting the time scrubber.',
        layout: 'grid',
        items: []
      },
      {
        id: 'elemental-natures',
        title: 'Elemental Natures',
        description: 'Fire, Earth, Air, Water color palettes and behaviors.',
        layout: 'grid',
        items: []
      },
      {
        id: 'force-legend',
        title: 'Cosmic Forces',
        description: 'Element pairings and iconography for the Core/Void/Order/Chaos/Alpha/Omega set.',
        layout: 'grid',
        items: []
      },
      {
        id: 'duality-matrix',
        title: 'Universal Dualities',
        description: 'Map UI elements back to the Planetary Harmonics duality sets.',
        layout: 'grid',
        items: []
      }
    ]
  },
  {
    id: 'planets',
    label: 'Planets',
    description: 'Planetary operators and the nodal set with their harmonic behavior.',
    sections: [
      {
        id: 'planets-primary',
        title: 'Planetary Operators',
        description: 'Frequencies sourced from MATHEMATICAL_IMPLEMENTATION_SUMMARY.',
        layout: 'grid',
        items: planetProfiles
      },
      {
        id: 'node-library',
        title: 'Nodal Operators',
        description: 'Keep these handy when annotating karmic arcs.',
        layout: 'grid',
        items: nodeProfiles
      }
    ]
  },
  {
    id: 'zodiac',
    label: '12 Zodiac',
    description: 'Element, modality, polarity, and rulership data for every sign on the wheel.',
    sections: [
      {
        id: 'signs',
        title: 'Zodiac Index',
        description: 'Keep this nearby while annotating the chart or debugging glyph swaps.',
        layout: 'grid',
        items: []
      }
    ]
  },
  {
    id: 'cusps',
    label: '12 Cusps',
    description: '±5° blending windows with 70/30 weighting for adjacent forces.',
    sections: [
      {
        id: 'cusp-matrix',
        title: 'Cusp Distribution Windows',
        description: 'Reference for calculateCosmicForces cusp fallback logic.',
        layout: 'grid',
        items: []
      }
    ]
  },
  {
    id: 'decans',
    label: '36 Decans',
    description: 'Degree-specific overlays for micro-storytelling inside each sign.',
    sections: [
      {
        id: 'decan-grid',
        title: 'Decan Matrix (36)',
        description: 'Triplicity overlays rotate through element siblings to color each 10° slice.',
        layout: 'grid',
        items: []
      }
    ]
  }
]

export default function TutorialPage() {
  const navigate = useNavigate()
  const [activeTabId, setActiveTabId] = useState(tutorialTabsConfig[0]?.id ?? 'operators')
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') return THEMES.DARK
    return themeManager.getActualTheme()
  })

  useEffect(() => {
    themeManager.initialize()
    const handleThemeChange = (nextTheme: ThemeType) => {
      if (nextTheme === THEMES.SYSTEM) {
        setTheme(themeManager.getActualTheme())
        return
      }
    setTheme(nextTheme)
    }

    themeManager.addListener(handleThemeChange)
    return () => {
      themeManager.removeListener(handleThemeChange)
    }
  }, [])

  const isDarkMode = theme === THEMES.DARK

  const zodiacEntries = useMemo(() => createZodiacEntries(zodiacSigns, isDarkMode), [isDarkMode])

  const cosmicForceEntries = useMemo(() => createCosmicForceEntries(isDarkMode), [isDarkMode])

  const elementNatureEntries = useMemo(() => createElementNatureEntries(isDarkMode), [isDarkMode])

  const modalityEntries = useMemo(() => createModalityEntries(isDarkMode), [isDarkMode])

  const dualityEntries = useMemo(() => createDualityEntries(isDarkMode), [isDarkMode])

  const cuspEntries = useMemo(() => {
    return createCuspEntries(zodiacSigns, cosmicSymbols, isDarkMode)
  }, [isDarkMode])

  const decanEntries = useMemo(() => {
    return createDecanEntries(zodiacSigns, cosmicSymbols, isDarkMode)
  }, [isDarkMode])

  const tutorialTabs = useMemo(() => {
    return tutorialTabsConfig.map((tab) => {
      if (tab.id === 'zodiac') {
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === 'signs' ? { ...section, items: zodiacEntries } : section
          )
        }
      }

      if (tab.id === 'decans') {
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === 'decan-grid' ? { ...section, items: decanEntries } : section
          )
        }
      }

      if (tab.id === 'foundations') {
        return {
          ...tab,
          sections: tab.sections.map((section) => {
            if (section.id === 'force-legend') {
              return { ...section, items: cosmicForceEntries }
            }
            if (section.id === 'elemental-natures') {
              return { ...section, items: elementNatureEntries }
            }
            if (section.id === 'modalities-grid') {
              return { ...section, items: modalityEntries }
            }
            if (section.id === 'duality-matrix') {
              return { ...section, items: dualityEntries }
            }
            return section
          })
        }
      }

      if (tab.id === 'cusps') {
        return {
          ...tab,
          sections: tab.sections.map((section) =>
            section.id === 'cusp-matrix' ? { ...section, items: cuspEntries } : section
          )
        }
      }

      return tab
    })
  }, [cosmicForceEntries, cuspEntries, decanEntries, dualityEntries, elementNatureEntries, modalityEntries, zodiacEntries])

  const currentTab = useMemo(() => {
    return tutorialTabs.find((tab) => tab.id === activeTabId) ?? tutorialTabs[0]
  }, [activeTabId, tutorialTabs])

  return (
    <div className="tutorial-page">
      <TopBar
        tutorialActive
        onOpenTutorial={() => navigate('/tutorial')}
        onOpenAbout={() => navigate('/about')}
        onNavigateHome={() => navigate('/')}
      />

      <main className="tutorial-shell">
        <div className="tutorial-tabs" role="tablist" aria-label="Tutorial sections">
          {tutorialTabs.map((tab) => {
            const isActive = tab.id === currentTab?.id
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`tutorial-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <span>{tab.label}</span>
                <small>{tab.description}</small>
              </button>
            )
          })}
        </div>

        {currentTab && (
          <section
            key={currentTab.id}
            className="tutorial-panel"
            role="tabpanel"
            id={`panel-${currentTab.id}`}
            aria-labelledby={`tab-${currentTab.id}`}
          >
            <div className="tutorial-panel__summary">
              <h2>{currentTab.label}</h2>
              <p>{currentTab.description}</p>
            </div>

            {currentTab.sections.map((section) => (
              <article key={section.id} className={`tutorial-section tutorial-section--${section.id}`}>
                <header>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </header>
                <div className={section.layout === 'list' ? 'tutorial-card-list' : 'tutorial-card-grid'}>
                  {section.items.map((item) => {
                    const valueIcons = item.valueIcons ?? []
                    const hasValueIcons = valueIcons.length > 0

                    return (
                      <div key={`${section.id}-${item.label}`} className="tutorial-card">
                      <div className={`tutorial-card__top ${item.icon ? 'has-icon' : ''}`}>
                        {item.icon && (
                          <div className="tutorial-card__icon">
                            <img src={item.icon.src} alt={item.icon.alt} loading="lazy" />
                          </div>
                        )}
                        <div className="tutorial-card__header">
                          <div className="tutorial-card__label-stack">
                            <p className="tutorial-card__label">{item.label}</p>
                            {item.primarySymbolBadge && (
                              <div className="tutorial-card__symbol tutorial-card__symbol--primary">
                                <div className="tutorial-card__symbol-icon">
                                  <img src={item.primarySymbolBadge.icon.src} alt={`${item.primarySymbolBadge.label} symbol`} loading="lazy" />
                                </div>
                                <span>{item.primarySymbolBadge.label}</span>
                              </div>
                            )}
                          </div>
                          {(item.value || item.forceIcon || hasValueIcons) && (
                            <div className="tutorial-card__value-stack">
                              {hasValueIcons && (
                                <div className="tutorial-card__element-pair" aria-label={`${item.label} element pairing`}>
                                  {valueIcons.map((icon, index) => (
                                    <Fragment key={`${section.id}-${item.label}-value-icon-${index}`}>
                                      <div className="tutorial-card__element-icon">
                                        <img src={icon.src} alt={icon.alt} loading="lazy" />
                                      </div>
                                      {index < valueIcons.length - 1 && (
                                        <span className="tutorial-card__element-plus" aria-hidden="true">
                                          +
                                        </span>
                                      )}
                                    </Fragment>
                                  ))}
                                </div>
                              )}
                              {item.value && <p className="tutorial-card__value">{item.value}</p>}
                              {item.forceIcon && (
                                <div className="tutorial-card__force-icon">
                                  <img src={item.forceIcon.src} alt={item.forceIcon.alt} loading="lazy" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {item.symbolBadges && item.symbolBadges.length > 0 && (
                        <div className="tutorial-card__symbols" aria-label="Symbol references">
                          {item.symbolBadges.map((badge) => (
                            <div key={`${item.label}-${badge.label}`} className="tutorial-card__symbol">
                              <div className="tutorial-card__symbol-icon">
                                <img src={badge.icon.src} alt={`${badge.label} symbol`} loading="lazy" />
                              </div>
                              <span>{badge.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.range && <p className="tutorial-card__range">{item.range}</p>}
                      {item.meta && <p className="tutorial-card__meta">{item.meta}</p>}
                      {item.decanSummary && <p className="tutorial-card__decan-summary">{item.decanSummary}</p>}
                      {item.decanBlendDescription && (
                        <p className="tutorial-card__decan-blend">{item.decanBlendDescription}</p>
                      )}
                      {item.decanEgyptianLore && (
                        <p className="tutorial-card__decan-egyptian">{item.decanEgyptianLore}</p>
                      )}
                      {item.badges && item.badges.length > 0 && (
                        <div className="tutorial-card__badges">
                          {item.badges.map((badge, badgeIndex) => {
                            if (typeof badge === 'string') {
                              return (
                                <span
                                  key={`${item.label}-badge-${badge}-${badgeIndex}`}
                                  className="tutorial-card__badge tutorial-card__badge--text-only"
                                >
                                  {badge}
                                </span>
                              )
                            }

                            const key = badge.id ?? `${item.label}-badge-${badgeIndex}`
                            return (
                              <span key={key} className="tutorial-card__badge">
                                {badge.leadingIcon && (
                                  <span className="tutorial-card__badge-icon tutorial-card__badge-icon--left">
                                    <img src={badge.leadingIcon.src} alt={badge.leadingIcon.alt} loading="lazy" />
                                  </span>
                                )}
                                <span className="tutorial-card__badge-text">{badge.text}</span>
                                {badge.trailingIcon && (
                                  <span className="tutorial-card__badge-icon tutorial-card__badge-icon--right">
                                    <img src={badge.trailingIcon.src} alt={badge.trailingIcon.alt} loading="lazy" />
                                  </span>
                                )}
                                {badge.inlineIcons && badge.inlineIcons.length > 0 && (
                                  <span className="tutorial-card__badge-icon-inline" aria-label={`${item.label} badge icons`}>
                                    {badge.inlineIcons.map((icon, index) => (
                                      <span key={`${key}-inline-icon-${index}`} className="tutorial-card__badge-icon-inline-item">
                                        <img src={icon.src} alt={icon.alt} loading="lazy" />
                                      </span>
                                    ))}
                                  </span>
                                )}
                              </span>
                            )
                          })}
                        </div>
                      )}
                      {item.equation && (
                        <pre className="tutorial-card__equation" aria-label="Equation">
                          {item.equation}
                        </pre>
                      )}
                      {item.detail && <p className="tutorial-card__detail">{item.detail}</p>}
                    </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

function createCuspEntries(signs: ZodiacSignMeta[], symbolSource: typeof cosmicSymbols, isDarkMode: boolean): TutorialSectionItem[] {
  return signs.map((sign, index) => {
    const next = signs[(index + 1) % signs.length]
    const cuspSymbol = selectCuspSymbol(symbolSource.cusps, sign, next, index)
    const cuspForce = (cuspSymbol?.force ?? determineCuspForce(sign.element, next.element, index)) as 'core' | 'order' | 'chaos' | 'void'
    const cuspForceLabel = capitalize(cuspForce)
    const cuspFormalName = CUSP_FORMAL_NAMES[index] ?? 'Cusp'
    const descriptors = CUSP_DESCRIPTOR_WORDS[index] ?? []
    const descriptorText = descriptors.join(', ')
    const natureBadge: TutorialBadgeDetail = {
      id: `${sign.name}-${next.name}-nature`,
      text: `${sign.element} ↔ ${next.element}`,
      leadingIcon: resolveNatureIcon(sign, isDarkMode),
      trailingIcon: resolveNatureIcon(next, isDarkMode)
    }
    const modalityBadge: TutorialBadgeDetail = {
      id: `${sign.name}-${next.name}-modality`,
      text: `${sign.modality} → ${next.modality}`,
      leadingIcon: resolveModalityIcon(sign.modality, isDarkMode),
      trailingIcon: resolveModalityIcon(next.modality, isDarkMode)
    }

    return {
      label: `${cuspFormalName}`,
      value: cuspForceLabel,
      forceIcon: resolveDecanForceIcon(cuspForce),
      range: `${sign.name} 15° – ${next.name} 15°`,
      detail: descriptorText ? `${descriptorText}.` : undefined,
      badges: [natureBadge, modalityBadge],
      icon: cuspSymbol?.image
        ? {
            src: cuspSymbol.image,
            alt: `${sign.name} to ${next.name} cusp (${cuspForceLabel} • ${cuspSymbol.combo})`
          }
        : undefined
    }
  })
}

function createDecanEntries(signs: ZodiacSignMeta[], symbolSource: typeof cosmicSymbols, isDarkMode: boolean): TutorialSectionItem[] {
  return signs.flatMap((sign) => {
    const signDecans = [...(symbolSource.decansByZodiac?.[sign.name as keyof typeof symbolSource.decansByZodiac] ?? [])].sort(
      (a, b) => a.degreesStart - b.degreesStart
    )

    if (signDecans.length === 0) return []

    return signDecans.map((decanSymbol, index) => {
      const localStart = normalizeDecanStart(decanSymbol.degreesStart)
      const localEnd = localStart + 10
      const ordinal = index + 1
      const force = decanSymbol.force as DecanForce
      const narrative = getDecanDescription(sign.name, index)

      const { primary, secondary } = buildDecanSymbolBadges(sign, isDarkMode)

      return {
        label: `${sign.name} Decan ${ordinal}`,
        value: formatDecanValue(force),
        range: `${localStart}° – ${localEnd}° ${sign.name}`,
        primarySymbolBadge: primary,
        symbolBadges: secondary,
        forceIcon: resolveDecanForceIcon(force),
        decanSummary: narrative?.summary,
        decanBlendDescription: narrative?.elementalBlend ?? fallbackDecanBlend(force),
        decanEgyptianLore: narrative?.egyptianLore,
        icon: decanSymbol?.image
          ? {
              src: decanSymbol.image,
              alt: `${sign.name} Decan ${ordinal} glyph (${formatDecanValue(force)})`
            }
          : undefined
      }
    })
  })
}

function normalizeDecanStart(globalStart: number): number {
  return ((globalStart % 30) + 30) % 30
}

function formatDecanValue(force: DecanForce) {
  if (!force) return ''
  if (force === 'prime') return 'Prime'
  return capitalize(force)
}

function fallbackDecanBlend(force: DecanForce) {
  const descriptions: Record<string, string> = {
    prime: 'Pure sign frequency running at full amplitude.',
    core: 'Concentrates and grounds the signal for practical action.',
    order: 'Organizes the narrative into precise, repeatable steps.',
    chaos: 'Injects experimentation, upheaval, and creative sparks.',
    void: 'Opens intuition, empathy, and receptive bandwidth.'
  }

  return descriptions[force] ?? 'Specialized modulation inside this 10° span.'
}

function buildDecanSymbolBadges(
  sign: ZodiacSignMeta,
  isDarkMode: boolean
): { primary?: TutorialSymbolBadge; secondary: TutorialSymbolBadge[] } {
  const secondary: TutorialSymbolBadge[] = []

  const zodiacIcon = resolveZodiacIcon(sign.name, isDarkMode)

  const elementIcon = resolveElementIcon(sign.element, isDarkMode)
  if (elementIcon) {
    secondary.push({ label: sign.element, icon: elementIcon })
  }

  const modalityIcon = resolveModalityIcon(sign.modality, isDarkMode)
  if (modalityIcon) {
    secondary.push({ label: sign.modality, icon: modalityIcon })
  }

  return {
    primary: zodiacIcon ? { label: sign.name, icon: zodiacIcon } : undefined,
    secondary
  }
}

function capitalize(value?: string) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function selectCuspSymbol(
  cuspSymbols: typeof cosmicSymbols.cusps,
  currentSign: ZodiacSignMeta,
  nextSign: ZodiacSignMeta,
  index: number
) {
  const modalityMap: Record<Modality, 'active' | 'static' | 'reactive'> = {
    Cardinal: 'active',
    Fixed: 'static',
    Mutable: 'reactive'
  }

  const currentModality = modalityMap[currentSign.modality]
  const nextModality = modalityMap[nextSign.modality]

  const force = determineCuspForce(currentSign.element, nextSign.element, index)
  const combo = `${currentModality}-${nextModality}`

  const directMatch = cuspSymbols.find((symbol) => symbol.force === force && symbol.combo === combo)
  if (directMatch) return directMatch

  const reversedMatch = cuspSymbols.find((symbol) => symbol.force === force && symbol.combo === `${nextModality}-${currentModality}`)
  if (reversedMatch) return reversedMatch

  const fallback = cuspSymbols.find((symbol) => symbol.force === force)
  return fallback ?? cuspSymbols[index % cuspSymbols.length]
}

function determineCuspForce(currentElement: Element, nextElement: Element, index: number) {
  const current = currentElement.toLowerCase()
  const next = nextElement.toLowerCase()

  if (current === next) {
    const cycle = ['core', 'order', 'chaos', 'void'] as const
    return cycle[index % cycle.length]
  }

  if (current === 'fire') {
    if (next === 'earth') return 'core'
    if (next === 'air') return 'order'
    if (next === 'water') return 'chaos'
  }

  if (current === 'earth') {
    if (next === 'fire') return 'core'
    if (next === 'air') return 'order'
    if (next === 'water') return 'void'
  }

  if (current === 'air') {
    if (next === 'fire') return 'order'
    if (next === 'earth') return 'order'
    if (next === 'water') return 'void'
  }

  if (current === 'water') {
    if (next === 'fire') return 'chaos'
    if (next === 'earth') return 'void'
    if (next === 'air') return 'void'
  }

  return 'core'
}

