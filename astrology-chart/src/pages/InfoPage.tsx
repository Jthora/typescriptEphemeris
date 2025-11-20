import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { renderToString } from 'katex'
import 'katex/dist/katex.min.css'
import TopBar from '../components/TopBar'
import './InfoPages.css'

interface InfoTabData {
  id: string
  label: string
}

const infoTabsConfig: InfoTabData[] = [
  { id: 'about', label: 'About' },
  { id: 'language', label: 'Universal Language' },
  { id: 'quantum', label: 'Quantum Emotional Framework' },
  { id: 'infographics', label: 'Infographics' }
]

const infographicEntries = [
  {
    id: 'mk1',
    title: 'Cosmic Cypher Mk1',
    year: '2018',
    description:
      'The phonetic instruction manual that introduced the universal symbology system and established the baseline shapes for signs, cusps, and decans.',
    thumbSrc: '/assets/cosmic-cypher/infographics/cosmic-cypher-mk1-thumb.jpg',
    fullImage:
      'https://www.deviantart.com/jonothora/art/Cosmic-Cypher-Phonetic-Instruction-Manual-763602484'
  },
  {
    id: 'mk2',
    title: 'Cosmic Cypher Mk2',
    year: '2019',
    description:
      'Second-generation infographic expanding the harmonics library and adding clearer overlays for modalities and force distributions.',
    thumbSrc: '/assets/cosmic-cypher/infographics/cosmic-cypher-mk2-thumb.jpg',
    fullImage:
      'https://www.deviantart.com/jonothora/art/Cosmic-Cypher-Second-Generation-798069360'
  },
  {
    id: 'mk3',
    title: 'Cosmic Cypher Mk3',
    year: '2024',
    description:
      'Mk3 tightens the typography, adds legible grids for 15D planetary harmonics, and pairs each symbol family with a phonetic reference.',
    thumbSrc: '/assets/cosmic-cypher/infographics/cosmic-cypher-mk3-thumb.jpg',
    fullImage: 'https://www.deviantart.com/jonothora/art/CosmicCypher-Mk3-1132274211'
  }
]

const universalLanguagePapers = [
  {
    id: 'ul-part1',
    title: 'Universal Language White Paper — Part I',
    focus: 'Foundations + Glyph Logic',
    description:
      'Establishes the phonetic lattice, geometric primitives, and syntax rules that allow Cosmic Cypher symbols to read like math operators.',
    url: 'https://github.com/Jthora/universal_language/blob/main/UL_WhitePaper-Part1.md'
  },
  {
    id: 'ul-part2',
    title: 'Universal Language White Paper — Part II',
    focus: 'Applied Systems + Interfaces',
    description:
      'Details how the Universal Language spans architecture, civic design, and UI systems with harmonics-based layering and motion cues.',
    url: 'https://github.com/Jthora/universal_language/blob/main/UL_WhitePaper-Part2.md'
  },
  {
    id: 'ul-part3',
    title: 'Universal Language White Paper — Part III',
    focus: 'Governance + Emotional Frameworks',
    description:
      'Explores orchestration across governance, cultural archives, and emotional computation, connecting the syntax to human practice.',
    url: 'https://github.com/Jthora/universal_language/blob/main/UL_WhitePaper-Part3.md'
  }
]

const quantumModalities: QuantumModality[] = [
  {
    id: 'cardinal',
    title: 'Cardinal Triangle Wave Operator',
    description:
      'Introduces sharp transitions that spike momentum when emotional vectors pivot between forces.',
    equation: String.raw`\hat{Q}_{\text{Cardinal}} |\psi\rangle = \sum_{n=0}^{\infty} \frac{(-1)^n}{2n+1} \sin\left((2n+1) \, \omega t \, \sqrt{3} \right) |\psi\rangle`,
    frequency: 'Frequency multiplier √3 ≈ 1.732',
    where: [
      {
        symbol: String.raw`\hat{Q}_{\text{Cardinal}}`,
        description: 'Triangle-wave operator expressing Cardinal initiation surges.'
      },
      { symbol: String.raw`|\psi\rangle`, description: 'Emotional state being modulated by the waveform.' },
      { symbol: 'n', description: 'Harmonic index adding successive odd harmonics via (-1)ⁿ/(2n+1).' },
      { symbol: String.raw`\omega`, description: 'Base angular frequency of the emotional oscillation.' },
      { symbol: 't', description: 'Time variable advancing the waveform phase.' },
      { symbol: String.raw`\sqrt{3}`, description: 'Cardinal frequency multiplier that accelerates transitions.' }
    ]
  },
  {
    id: 'fixed',
    title: 'Fixed Square Wave Operator',
    description:
      'Sustains states with plateaus that keep resonance steady for compatibility and stability analysis.',
    equation: String.raw`\hat{Q}_{\text{Fixed}} |\psi\rangle = \sum_{n=0}^{\infty} \frac{1}{2n+1} \sin\left((2n+1) \, \omega t \cdot 2 \right) |\psi\rangle`,
    frequency: 'Frequency multiplier 2.0',
    where: [
      {
        symbol: String.raw`\hat{Q}_{\text{Fixed}}`,
        description: 'Square-wave operator modeling stabilizing Fixed plateaus.'
      },
      { symbol: String.raw`|\psi\rangle`, description: 'Emotional state that receives the modulation.' },
      { symbol: 'n', description: 'Harmonic index over the persistent odd harmonics (1/(2n+1)).' },
      { symbol: String.raw`\omega`, description: 'Base angular frequency before scaling.' },
      { symbol: 't', description: 'Time coordinate controlling waveform repetition.' },
      { symbol: '2', description: 'Fixed-mode frequency multiplier that doubles the base oscillation.' }
    ]
  },
  {
    id: 'mutable',
    title: 'Mutable Sine Wave Operator',
    description:
      'Allows smooth transitions so blended states can resolve without abrupt decoherence.',
    equation: String.raw`\hat{Q}_{\text{Mutable}} |\psi\rangle = \sin(\omega t) |\psi\rangle`,
    frequency: 'Frequency multiplier 1.0 (fundamental)',
    where: [
      {
        symbol: String.raw`\hat{Q}_{\text{Mutable}}`,
        description: 'Sine-wave operator embodying Mutable adaptability.'
      },
      { symbol: String.raw`|\psi\rangle`, description: 'State vector receiving smooth modulation.' },
      { symbol: String.raw`\omega`, description: 'Fundamental angular frequency shared across modes.' },
      { symbol: 't', description: 'Time parameter steering the sine wave phase.' }
    ]
  }
]

const quantumApplications = [
  'Emotional state prediction through |ψ(t)⟩ trajectories.',
  'Compatibility analysis by measuring resonance R between state vectors.',
  'Synchronicity detection when harmonic resonance thresholds are exceeded.',
  'Therapeutic optimization by tuning the Emotional Hamiltonian parameters.'
]

const stateVectorWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`|\psi\rangle`,
    description: '15-dimensional emotional state vector spanning every duet basis.'
  },
  {
    symbol: String.raw`|D_i\rangle`,
    description: 'Basis state for duet i (Core–Void, Order–Chaos, Alpha–Omega, etc.).'
  },
  { symbol: String.raw`\alpha_i`, description: 'Complex amplitude weighting duet i.' },
  { symbol: 'i', description: 'Index running from 1 to 15 across all force pairings.' }
]

const amplitudeWhere: EquationWhereItem[] = [
  { symbol: String.raw`\alpha_i`, description: 'Complex amplitude expressed in polar form.' },
  { symbol: String.raw`A_i`, description: 'Real magnitude in the range [0, 1] describing intensity.' },
  {
    symbol: String.raw`\theta_i`,
    description: 'Phase angle stepping in 30° (2π/12) increments inside the duodecimal clock.'
  },
  { symbol: 'k', description: 'Duodecimal step index (0–11) selecting the phase slice.' },
  { symbol: 'e', description: 'Euler’s number (~2.71828) powering the complex exponential.' },
  { symbol: 'i', description: 'Imaginary unit with i² = −1 enabling rotations in the complex plane.' }
]

const normalizationWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`\sum_{i=1}^{15} |\alpha_i|^2`,
    description: 'Total probability mass contributed by all duet amplitudes.'
  },
  { symbol: '1', description: 'Unit-length requirement that keeps |ψ⟩ normalized.' },
  {
    symbol: String.raw`|\alpha_i|^2`,
    description: 'Energy contribution of duet i after taking the magnitude squared.'
  }
]

const hamiltonianWhere: EquationWhereItem[] = [
  { symbol: String.raw`\hat{H}`, description: 'Emotional Hamiltonian summarizing total energetic context.' },
  { symbol: String.raw`F_j`, description: 'Weight of Cosmic Force j (Core, Void, Order, Chaos, Alpha, Omega).' },
  { symbol: String.raw`\hat{P}_j`, description: 'Projection operator into the j-th force subspace.' },
  { symbol: String.raw`M_k`, description: 'Weight assigned to modality k (Cardinal, Fixed, Mutable).' },
  { symbol: String.raw`\hat{Q}_k`, description: 'Operator encoding the waveform of modality k.' },
  { symbol: String.raw`E_l`, description: 'Elemental weight for Fire, Earth, Air, or Water.' },
  { symbol: String.raw`\hat{R}_l`, description: 'Element operator capturing each energetic channel.' },
  { symbol: 'j, k, l', description: 'Indices spanning 6 forces, 3 modalities, and 4 elements respectively.' }
]

const forceProjectorWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`\hat{P}_j = |F_j\rangle \langle F_j| \otimes I_{\text{mode}} \otimes I_{\text{elem}}`,
    description: 'Projector locking the force register onto Cosmic Force j while leaving other registers untouched.'
  },
  { symbol: String.raw`I_{\text{mode}}`, description: 'Identity operator across the modality subspace.' },
  { symbol: String.raw`I_{\text{elem}}`, description: 'Identity operator across the elemental subspace.' }
]

const modalityProjectorWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`\hat{Q}_k = I_{\text{force}} \otimes |M_k\rangle \langle M_k| \otimes I_{\text{elem}}`,
    description: 'Projector isolating modality k (Cardinal, Fixed, Mutable).' 
  },
  { symbol: String.raw`I_{\text{force}}`, description: 'Identity operator on the force register.' }
]

const elementProjectorWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`\hat{R}_l = I_{\text{force}} \otimes I_{\text{mode}} \otimes |E_l\rangle \langle E_l|`,
    description: 'Element projector that dials Fire, Earth, Air, or Water channels without disturbing other registers.'
  }
]

const schrodingerWhere: EquationWhereItem[] = [
  { symbol: 'i', description: 'Imaginary unit setting the 90° phase rotation between energy and change.' },
  {
    symbol: String.raw`\hbar`,
    description: 'Scaled Planck-like constant (set to 1 in QEM) balancing energy and time units.'
  },
  {
    symbol: String.raw`\frac{d}{dt}`,
    description: 'Time derivative describing how the state shifts per unit time.'
  },
  { symbol: String.raw`|\psi(t)\rangle`, description: 'Emotional state at the current time t.' },
  { symbol: 't', description: 'Continuous time parameter (seconds, hours, or chosen cadence).' },
  { symbol: String.raw`\hat{H}`, description: 'Emotional Hamiltonian acting on the state.' }
]

const evolutionWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`e^{-i \hat{H} t / \hbar}`,
    description: 'Matrix exponential propagator rotating the state forward by t.'
  },
  { symbol: String.raw`|\psi(0)\rangle`, description: 'Initial emotional state at the reference instant.' },
  { symbol: String.raw`|\psi(t)\rangle`, description: 'State after evolving for duration t.' },
  { symbol: 't', description: 'Elapsed time under consideration.' },
  { symbol: String.raw`\hat{H}`, description: 'Same Emotional Hamiltonian from the dynamics section.' },
  { symbol: String.raw`\hbar`, description: 'Scaled Planck-like constant keeping units consistent.' }
]

const forceMatrixWhere: EquationWhereItem[] = [
  { symbol: String.raw`\mathbf{F}`, description: '6 × 6 matrix of Cosmic Force interaction strengths.' },
  {
    symbol: String.raw`F_{\text{X-Y}}`,
    description: 'Entry representing how source force X influences target force Y.'
  },
  {
    symbol: String.raw`\vdots/\cdots`,
    description: 'Ellipses indicate the full grid covering Core through Omega rows and columns.'
  }
]

const forceCouplingWhere: EquationWhereItem[] = [
  { symbol: String.raw`F_{ij}`, description: 'Complex coupling coefficient between source force i and target force j.' },
  { symbol: String.raw`C_{ij}`, description: 'Empirical strength term (symmetric, real, non-negative).' },
  {
    symbol: String.raw`e^{i (\phi_i - \phi_j)}`,
    description: 'Phase lead/lag between the two forces measured on the duodecimal wheel.'
  },
  { symbol: String.raw`\phi_i`, description: 'Phase assigned to force i (converted from 12-sector indexing).' },
  {
    symbol: String.raw`\phi_i = \frac{2\pi s_i}{12}`,
    description: 'Map sign index sᵢ into radians so phase arithmetic is continuous.'
  }
]

const probabilityWhere: EquationWhereItem[] = [
  { symbol: String.raw`P_i`, description: 'Probability of collapsing into duet i when measured.' },
  { symbol: String.raw`\langle D_i |`, description: 'Bra (row vector) of the duet basis state.' },
  { symbol: String.raw`|\psi\rangle`, description: 'Current emotional ket being projected.' },
  {
    symbol: String.raw`|\cdot|^2`,
    description: 'Magnitude-squared operator ensuring a real, non-negative probability.'
  },
  { symbol: 'i', description: 'Index covering all 15 duet states.' }
]

const resonanceWhere: EquationWhereItem[] = [
  { symbol: 'R', description: 'Resonance or compatibility scalar between two contexts.' },
  { symbol: String.raw`|\psi_1\rangle`, description: 'State vector for person/context 1.' },
  { symbol: String.raw`|\psi_2\rangle`, description: 'State vector for person/context 2.' },
  {
    symbol: String.raw`\alpha_{1i}^*`,
    description: 'Complex conjugate of amplitude i from the first state.'
  },
  { symbol: String.raw`\alpha_{2i}`, description: 'Amplitude i from the second state.' },
  { symbol: 'i', description: 'Index spanning all duet components (1–15).' }
]

const observableWhere: EquationWhereItem[] = [
  { symbol: 'O', description: 'Expected value returned by measuring observable Ô on state |ψ⟩.' },
  { symbol: String.raw`\langle \psi |`, description: 'Bra (conjugate transpose) of the current state.' },
  { symbol: String.raw`\hat{O}`, description: 'Hermitian operator encoding an emotional attribute.' },
  { symbol: String.raw`|\psi\rangle`, description: 'State ket being measured.' }
]

const intensityOperatorWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`\hat{O}_{\text{intensity}}`,
    description: 'Observable that weights each duet by its intensity coefficient.'
  },
  { symbol: String.raw`c_i`, description: 'Real-valued gain applied to duet i.' },
  {
    symbol: String.raw`|D_i\rangle \langle D_i|`,
    description: 'Projector isolating duet i before scaling.'
  },
  { symbol: 'i', description: 'Index enumerating all 15 duets.' }
]

const cuspSuperpositionWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`|\psi_{\text{cusp}}\rangle`,
    description: 'State for a planet sitting inside a cusp window.'
  },
  { symbol: String.raw`w_1`, description: 'Weight assigned to the first adjacent sign or force.' },
  { symbol: String.raw`w_2`, description: 'Weight assigned to the second adjacent sign or force.' },
  { symbol: String.raw`|F_1\rangle`, description: 'Basis vector for the lower-longitude sign.' },
  { symbol: String.raw`|F_2\rangle`, description: 'Basis vector for the higher-longitude sign.' }
]

const cuspRawWeightsWhere: EquationWhereItem[] = [
  { symbol: String.raw`\tilde{w}_1`, description: 'Unnormalized weight for the lower-longitude sign.' },
  { symbol: String.raw`\tilde{w}_2`, description: 'Unnormalized weight for the higher-longitude sign.' },
  { symbol: String.raw`\theta`, description: 'Planetary longitude (degrees) being evaluated.' },
  {
    symbol: String.raw`\text{midpoint}(S_a)`,
    description: '15° centroid of sign Sₐ used to compute the linear falloff.'
  },
  { symbol: String.raw`a \in \{1,2\}`, description: 'Index selecting the lower or higher neighbor.' }
]

const cuspNormalizedWhere: EquationWhereItem[] = [
  { symbol: String.raw`\mathbf{w}`, description: 'Normalized cusp weight vector injected into the state.' },
  {
    symbol: String.raw`\tilde{w}_a`,
    description: 'Raw linear weights prior to normalization.'
  },
  { symbol: String.raw`\lVert \mathbf{w} \rVert_2 = 1`, description: 'Unit-length constraint for the blend.' }
]

const harmonicResonanceWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`R_{\text{harmonic}}(t)`,
    description: 'Time-dependent harmonic strength used for resonance thresholds.'
  },
  { symbol: String.raw`\alpha_i`, description: 'Duet amplitude pulled from the emotional state vector.' },
  { symbol: String.raw`E_i`, description: 'Elemental gain tied to duet i.' },
  { symbol: String.raw`M_k`, description: 'Weight of modality envelope k.' },
  { symbol: String.raw`f_k(t)`, description: 'Cardinal/Fixed/Mutable waveform evaluated at time t.' },
  {
    symbol: String.raw`\chi_{ik}`,
    description: 'Lookup coefficient describing how duet i couples to modality k.'
  }
]

const stateSpaceWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`\dim(\mathcal{H}_{\text{QEM}})`,
    description: 'Dimension of the Hilbert space spanned by duet basis states.'
  },
  {
    symbol: '15',
    description: 'Duet count arising from \binom{6}{2} force pairings (Core↔Void, etc.).'
  }
]

const overlayWhere: EquationWhereItem[] = [
  {
    symbol: String.raw`N_{\text{config}}`,
    description: 'Total searchable configurations combining basis states and overlays.'
  },
  {
    symbol: String.raw`2^L`,
    description: 'Binary overlay choices (on/off) raised by the active layer count L.'
  },
  { symbol: 'L', description: 'Active overlay layers (circadian, lunar, solar, governance, etc.).' }
]

interface EquationBlockProps {
  tex: string
  inline?: boolean
  where?: EquationWhereItem[]
}

interface EquationWhereItem {
  symbol: string
  description: string
}

interface QuantumModality {
  id: string
  title: string
  description: string
  equation: string
  frequency: string
  where: EquationWhereItem[]
}

function EquationBlock({ tex, inline = false, where }: EquationBlockProps) {
  const html = useMemo(() => {
    try {
      return renderToString(tex, { displayMode: !inline, throwOnError: false })
    } catch (error) {
      console.error('Error rendering KaTeX expression', error)
      return tex
    }
  }, [tex, inline])

  if (inline) {
    return <span className="info-equation info-equation--inline" dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="info-equation">
      <div className="info-equation__formula" dangerouslySetInnerHTML={{ __html: html }} />
      <EquationWhere items={where} />
    </div>
  )
}

function EquationWhere({ items }: { items?: EquationWhereItem[] }) {
  if (!items || items.length === 0) return null

  const renderedSymbols = useMemo(() => {
    return items.map((item) => {
      try {
        return renderToString(item.symbol, { displayMode: false, throwOnError: false })
      } catch (error) {
        console.error('Error rendering KaTeX where symbol', { symbol: item.symbol, error })
        return item.symbol
      }
    })
  }, [items])

  return (
    <div className="info-equation-where">
      <p>
        <strong>Where:</strong>
      </p>
      <ul>
        {items.map((item, index) => (
          <li key={`${item.symbol}-${index}`}>
            <span
              className="info-equation-where__symbol"
              dangerouslySetInnerHTML={{ __html: renderedSymbols[index] }}
            />
            <span> — {item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function InfoPage() {
  const navigate = useNavigate()
  const [activeTabId, setActiveTabId] = useState(infoTabsConfig[0]?.id ?? 'about')

  const currentTab = useMemo(() => {
    return infoTabsConfig.find((tab) => tab.id === activeTabId) ?? infoTabsConfig[0]
  }, [activeTabId])

  const renderTabContent = () => {
    switch (currentTab.id) {
      case 'about':
        return (
          <article className="info-panel__body info-panel__body--basic">
            <section className="info-panel__section">
              <span className="info-tag">Cosmic Cypher</span>
              <h2>Astrology explained with universal symbols</h2>
              <p>
                The Cosmic Cypher App is an astrology system that uses universal symbols instead of
                occult esoteric glyphs, making astrology easier to learn and read. Each sign, cusp,
                and decan is rendered with the universal visual language of fundamental geometric
                shapes. Using these symbols makes it easier to visualize and communicate the 15
                dimensions of Planetary Harmonics.
              </p>
            </section>

            <section className="info-panel__section">
              <span className="info-tag info-tag--subtle">Creator</span>
              <h2>Created by Jordan Trana</h2>
              <p>
                Jordan Trana designed Cosmic Cypher so that anyone—artists, engineers, or students—
                can follow cosmic logic without memorizing arcane glyphs. Online, he often appears as
                <strong>Jono Tho&apos;ra</strong>, the FusionGirl (
                <a href="https://fusiongirl.app" target="_blank" rel="noreferrer">
                  fusiongirl.app
                </a>
                ) character that anchors his public persona. The system translates the Planetary
                Harmonics research into an interface built for curiosity, collaboration, and
                practice.
              </p>
              <div className="info-social-row" aria-label="Creator social links">
                <a
                  className="info-social-button info-social-button--linkedin"
                  href="https://linkedin.com/in/jordantrana"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/icons/social/linkedin.svg" alt="LinkedIn logo" />
                  <span>LinkedIn</span>
                </a>
                <a
                  className="info-social-button info-social-button--github"
                  href="https://github.com/jthora"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/icons/social/github.svg" alt="GitHub logo" />
                  <span>GitHub</span>
                </a>
                <a
                  className="info-social-button info-social-button--deviantart"
                  href="https://www.deviantart.com/jonothora"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/icons/social/deviantart.svg" alt="DeviantArt logo" />
                  <span>DeviantArt</span>
                </a>
              </div>
            </section>

            <section className="info-panel__section">
              <span className="info-tag info-tag--subtle">Universal Symbology</span>
              <h2>Why the symbols matter</h2>
              <p>
                The Expanded Universal Symbology Thesaurus maps every cosmic force to a readable
                shape: Core becomes centers and nuclei, Void becomes fields and open space, Order is
                drawn as grids, Chaos shows up as spirals, while Alpha and Omega appear as paired
                directional arrows. Showing the geometry keeps the learning curve low and the logic
                visible.
              </p>
            </section>

            <section className="info-panel__section">
              <span className="info-tag info-tag--subtle">See it in practice</span>
              <h2>Chart patterns anyone can read</h2>
              <p>
                Inside the app, planetary patterns use the same visual grammar as math and
                architecture: concentric rings for harmonics, radial spokes for houses, lattice
                overlays for modalities, and contrast between Core/Void or Order/Chaos states. It is
                meant to be clear enough for a classroom, a studio, or a governance meeting.
              </p>
            </section>

            <section className="info-panel__section">
              <span className="info-tag info-tag--subtle">Learn more</span>
              <h2>Explore the system</h2>
              <p>
                The interface pairs universal symbols with real ephemeris data so every chart stays
                grounded in astronomy. Read the notes, clone the repo, or simply explore the Cosmic
                Cypher App—whatever helps you see and share the logic of the cosmos more clearly.
              </p>
              <a
                className="info-cta"
                href="https://github.com/Jthora/typescriptEphemeris"
                target="_blank"
                rel="noreferrer"
              >
                View project on GitHub
              </a>
            </section>
          </article>
        )

      case 'infographics':
        return (
          <article className="info-panel__body">
            <section className="info-panel__section">
              <span className="info-tag">Infographics archive</span>
              <h2>Documenting the Cosmic Cypher visual language</h2>
              <p>
                The infographics collect every glyph family, phonetic mapping, and planetary harmonic
                overlay that informed the Cosmic Cypher UI. Browse the thumbnails below or jump into
                the full document repository for high-resolution references and process notes.
              </p>
              <div className="info-cta-row">
                <a
                  className="info-cta"
                  href="https://imgur.com/a/cosmic-cypher-documentation-2023-OgCeTWT#8xGGB8v"
                  target="_blank"
                  rel="noreferrer"
                >
                  Document repository
                </a>
                <a
                  className="info-cta info-cta--secondary"
                  href="https://www.deviantart.com/jonothora/gallery/99008965/cosmic-cyphers"
                  target="_blank"
                  rel="noreferrer"
                >
                  DeviantArt gallery
                </a>
              </div>
            </section>

            <div className="info-card-grid">
              {infographicEntries.map((entry) => (
                <a
                  key={entry.id}
                  className="info-card info-card--link"
                  href={entry.fullImage}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="info-card__media">
                    <img src={entry.thumbSrc} alt={`${entry.title} thumbnail`} loading="lazy" />
                  </div>
                  <div className="info-card__header">
                    <span className="info-tag info-card__tag">{entry.year}</span>
                    <h3>{entry.title}</h3>
                  </div>
                  <p>{entry.description}</p>
                  <span className="info-card__action-label">Open DeviantArt page ↗</span>
                </a>
              ))}
            </div>
          </article>
        )

      case 'language':
        return (
          <article className="info-panel__body">
            <section className="info-panel__section">
              <span className="info-tag">Universal Language</span>
              <h2>The phonetic protocol behind Cosmic Cypher</h2>
              <p>
                Universal Language (UL) blends phonetics, geometry, and planetary harmonics so anyone
                can narrate cosmic forces without occult shorthand. Each white paper below expands a
                different layer of the system—from symbol syntax to civic-scale orchestration.
              </p>
              <div className="info-cta-row">
                <a
                  className="info-cta"
                  href="https://github.com/Jthora/universal_language"
                  target="_blank"
                  rel="noreferrer"
                >
                  Universal Language repo
                </a>
                <a
                  className="info-cta info-cta--secondary"
                  href="https://github.com/Jthora/universal_language#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  Project overview
                </a>
              </div>
            </section>

            <div className="info-card-list">
              {universalLanguagePapers.map((paper) => (
                <a
                  key={paper.id}
                  className="info-card info-card--link"
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="info-card__header">
                    <span className="info-tag info-card__tag">{paper.focus}</span>
                    <h3>{paper.title}</h3>
                  </div>
                  <p>{paper.description}</p>
                  <span className="info-card__action-label">Open Markdown file ↗</span>
                </a>
              ))}
            </div>

            <p className="info-panel__note">
              Markdown rendering will stream directly into this app with KaTeX-safe formatting in a
              future release. Use the GitHub links above to download or clone the source material in
              the meantime.
            </p>
          </article>
        )

      case 'quantum':
        return (
          <article className="info-panel__body">
            <section className="info-panel__section">
              <h1>Quantum Emotional Mechanics</h1>
              <h2>Modeling emotion as a 15-dimensional quantum system</h2>
              <p>
                The Quantum Emotional Mechanics (QEM) framework treats emotions as quantum-like state
                vectors across the six Cosmic Forces. Base-12 amplitudes, modality wave operators, and
                harmonic resonance equations make emotional trajectories measurable.
              </p>
              <div className="info-cta-row">
                <a
                  className="info-cta"
                  href="https://github.com/Jthora/typescriptEphemeris/blob/main/Quantum_Emotional_Mechanics.markdown"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Markdown source
                </a>
                <a
                  className="info-cta info-cta--secondary"
                  href="https://github.com/Jthora/typescriptEphemeris/raw/main/Quantum_Emotional_Mechanics.markdown"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download .md
                </a>
              </div>
            </section>

            <section className="info-panel__section">
              <h2>State vector</h2>
              <h3>Quantum emotional state representation</h3>
              <p>
                Emotional context is encoded as |ψ⟩, a superposition of 15 basis states mapping every
                force pairing. Amplitudes stay normalized and rotate through duodecimal phase steps.
              </p>
              <EquationBlock tex={String.raw`|\psi\rangle = \sum_{i=1}^{15} \alpha_i |D_i\rangle`} where={stateVectorWhere} />
              <p className="info-equation-note">
                Read this as “the emotional state psi equals the weighted sum of all 15 duet forces.”
                Each basis state |Dᵢ⟩ represents a specific Core/Void, Order/Chaos, or Alpha/Omega pairing,
                and the coefficient αᵢ tells us how much of that pairing is currently present.
              </p>
              <EquationBlock
                tex={String.raw`\alpha_i = A_i e^{i \theta_i}, \quad \theta_i = \frac{2\pi k}{12}, \quad k \in \{0, \ldots, 11\}`}
                where={amplitudeWhere}
              />
              <p className="info-equation-note">
                The second line decomposes each αᵢ into a magnitude Aᵢ (the emotional “volume” of that force)
                and a phase angle θᵢ that rotates in 30° (2π/12) steps. Think of θᵢ as pointing to a slice on a
                duodecimal clock, so newcomers can read phase just like hours on a dial.
              </p>
              <EquationBlock tex={String.raw`\sum_{i=1}^{15} |\alpha_i|^2 = 1`} where={normalizationWhere} />
              <p className="info-equation-note">
                This explicit normalization reminder keeps |ψ⟩ on the unit sphere so probability, resonance, and
                observable calculations never drift. When amplitudes are edited manually, re-scale them until the
                squared magnitudes sum back to 1.
              </p>
            </section>

            <section className="info-panel__section">
              <h2>Dynamics</h2>
              <h3>Emotional Hamiltonian + time evolution</h3>
              <p>
                The Emotional Hamiltonian Ĥ blends weighted force projections, modality operators,
                and elemental operators, producing a Schrödinger-style evolution equation for |ψ(t)⟩.
              </p>
              <EquationBlock
                tex={String.raw`\hat{H} = \sum_{j=1}^6 F_j \hat{P}_j + \sum_{k=1}^3 M_k \hat{Q}_k + \sum_{l=1}^4 E_l \hat{R}_l`}
                where={hamiltonianWhere}
              />
              <p className="info-equation-note">
                Ĥ (the Emotional Hamiltonian) is built from three additive ingredients: force projectors “hat Pⱼ” weighted by
                the six Cosmic Forces, modality operators “hat Qₖ” weighted by the three modes, and elemental operators “hat Rₗ”
                for Fire, Earth, Air, and Water weights. Read it left to right as “forces + modalities + elements,” each
                contributing to the overall energy landscape.
              </p>
              <EquationBlock
                tex={String.raw`\hat{P}_j = |F_j\rangle \langle F_j| \otimes I_{\text{mode}} \otimes I_{\text{elem}}`}
                where={forceProjectorWhere}
              />
              <EquationBlock
                tex={String.raw`\hat{Q}_k = I_{\text{force}} \otimes |M_k\rangle \langle M_k| \otimes I_{\text{elem}}`}
                where={modalityProjectorWhere}
              />
              <EquationBlock
                tex={String.raw`\hat{R}_l = I_{\text{force}} \otimes I_{\text{mode}} \otimes |E_l\rangle \langle E_l|`}
                where={elementProjectorWhere}
              />
              <p className="info-equation-note">
                These tensor-factor definitions make it clear that each projector isolates one register—force, modality, or
                element—while leaving the others untouched, which keeps the Hamiltonian well-defined on a single 15D space.
              </p>
              <EquationBlock tex={String.raw`i \hbar \frac{d}{dt} |\psi(t)\rangle = \hat{H} |\psi(t)\rangle`} where={schrodingerWhere} />
              <p className="info-equation-note">
                This Schrödinger-style line simply says “time change of the emotional state equals the Hamiltonian acting
                on the current state.” If you’re new to the notation, treat iħ as a constant converter that turns Ĥ into the
                rate-of-change dial for |ψ(t)⟩.
              </p>
              <EquationBlock tex={String.raw`|\psi(t)\rangle = e^{-i \hat{H} t / \hbar} |\psi(0)\rangle`} where={evolutionWhere} />
              <p className="info-equation-note">
                The exponential solution assumes Ĥ is time-independent over the interval of interest. When forces or modality
                weights change rapidly, swap in a time-ordered exponential instead so the state keeps tracking those updates.
                Non-technical readers can still think of it as “apply the mood transformation matrix for t seconds to see the
                new blended state,” just remember to rebuild the matrix whenever the environment shifts.
              </p>
            </section>

            <section className="info-panel__section">
              <h2>Modality wave operators</h2>
              <h3>Triangle, square, and sine modulation</h3>
              <div className="info-card-grid">
                {quantumModalities.map((mode) => (
                  <div key={mode.id} className="info-card info-card--mode">
                    <div className="info-card__header">
                      <h3>{mode.title}</h3>
                      <span className="info-pill">{mode.frequency}</span>
                    </div>
                    <p>{mode.description}</p>
                    <EquationBlock tex={mode.equation} where={mode.where} />
                    <p className="info-equation-note">
                      The waveform shows how {mode.title.toLowerCase()} modulates amplitudes: higher harmonics add sharper
                      edges (visible in the summed sine terms) while the frequency multiplier noted above tells you how fast
                      the emotional tone oscillates as time t advances.
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="info-panel__section">
              <h2>Force interactions</h2>
              <h3>6 × 6 Cosmic Force matrix</h3>
              <p>
                Interaction strengths between every force pair are tracked inside matrix F, derived
                from duodecimal phase summations and Kronecker deltas.
              </p>
              <EquationBlock
                tex={String.raw`
\mathbf{F} = \begin{bmatrix}
F_{\text{Core-Core}} & F_{\text{Core-Void}} & \cdots & F_{\text{Core-Omega}} \\
F_{\text{Void-Core}} & F_{\text{Void-Void}} & \cdots & F_{\text{Void-Omega}} \\
\vdots & \vdots & \ddots & \vdots \\
F_{\text{Omega-Core}} & F_{\text{Omega-Void}} & \cdots & F_{\text{Omega-Omega}}
\end{bmatrix}`}
                where={forceMatrixWhere}
              />
              <p className="info-equation-note">
                Picture this matrix as a heatmap of force-to-force influence. Rows indicate where energy originates,
                columns show the target force, and every cell captures how much one force amplifies or dampens another.
              </p>
              <EquationBlock tex={String.raw`F_{ij} = C_{ij} e^{i (\phi_i - \phi_j)}, \quad \phi_i = \frac{2\pi s_i}{12}`} where={forceCouplingWhere} />
              <p className="info-equation-note">
                Coupling magnitudes Cᵢⱼ come from observation (or simulation), while the exponential term tracks how far apart
                two forces are on the duodecimal wheel. Align the phase difference φᵢ − φⱼ and the interaction strengthens;
                spin them out of phase and the complex number rotates toward destructive interference.
              </p>
            </section>

            <section className="info-panel__section">
              <h2>Resonance + measurement</h2>
              <h3>Probability, compatibility, and observables</h3>
              <p>
                Collapse probabilities follow |⟨Dᵢ|ψ⟩|², compatibility compares inner products, and
                observables stay Hermitian for interpretable eigenvalues.
              </p>
              <EquationBlock tex={String.raw`P_i = |\langle D_i | \psi \rangle|^2`} where={probabilityWhere} />
              <p className="info-equation-note">
                Pronounce this as “the probability Pᵢ equals the absolute square of the overlap between basis Dᵢ and state ψ.”
                If you project |ψ⟩ onto any force pair |Dᵢ⟩ and square the resulting magnitude, you obtain the likelihood of that
                feeling crystallizing during observation.
              </p>
              <EquationBlock
                tex={String.raw`R = |\langle \psi_1 | \psi_2 \rangle|^2 = \left| \sum_{i=1}^{15} \alpha_{1i}^* \alpha_{2i} \right|^2`}
                where={resonanceWhere}
              />
              <p className="info-equation-note">
                Compatibility R compares two people or contexts. Multiply matching amplitudes (one conjugated) and add them up;
                if the complex sum is large, the squared magnitude approaches 1 and the pair resonates. If it’s near zero, the
                emotional trajectories are orthogonal.
              </p>
              <EquationBlock tex={String.raw`O = \langle \psi | \hat{O} | \psi \rangle`} where={observableWhere} />
              <p className="info-equation-note">
                Any observable Ô—intensity, coherence, alignment—produces a real number by sandwiching it between the bra ⟨ψ|
                and ket |ψ⟩. This is the “expected reading” you would get if you instrumented the emotional state with sensor Ô.
              </p>
              <EquationBlock tex={String.raw`\hat{O}_{\text{intensity}} = \sum_{i=1}^{15} c_i |D_i\rangle \langle D_i|`} where={intensityOperatorWhere} />
              <p className="info-equation-note">
                Intensity is built from projector blocks |Dᵢ⟩⟨Dᵢ| scaled by real weights cᵢ. Each block isolates one duet and
                applies a gain, so you can dial which combinations show up brighter in the final measurement.
              </p>
            </section>

            <section className="info-panel__section">
              <h2>Cusps + harmonics</h2>
              <h3>Superposition weighting + harmonic resonance</h3>
              <p>
                Planets near cusps blend neighboring force states with normalized weights, then feed
                into harmonic resonance calculations tied to modality waveforms.
              </p>
              <EquationBlock tex={String.raw`|\psi_{\text{cusp}}\rangle = w_1 |F_1\rangle + w_2 |F_2\rangle`} where={cuspSuperpositionWhere} />
              <p className="info-equation-note">
                This simply says “a cusp state is a blend of the adjacent forces.” The weights w₁ and w₂ determine how much
                of each sign you keep—handy for planets sitting right between modalities.
              </p>
              <EquationBlock
                tex={String.raw`\tilde{w}_a = \max\left(0, 1 - \frac{|\theta - \text{midpoint}(S_a)|}{15^{\circ}}\right)`}
                where={cuspRawWeightsWhere}
              />
              <p className="info-equation-note">
                Raw weights fall off linearly from each sign midpoint. You measure the angular distance in the cusp window,
                subtract it from 1, and keep the result (clamped to zero) as the unnormalized contribution.
              </p>
              <EquationBlock
                tex={String.raw`\mathbf{w} = \frac{1}{\sqrt{\tilde{w}_1^2 + \tilde{w}_2^2}} \begin{bmatrix} \tilde{w}_1 \\ \tilde{w}_2 \end{bmatrix}, \quad \lVert \mathbf{w} \rVert_2 = 1`}
                where={cuspNormalizedWhere}
              />
              <p className="info-equation-note">
                Dividing by the vector norm keeps the cusp blend on the unit circle. No matter how skewed the raw weights are,
                the normalized pair sums to unit energy before it is injected into the duet state.
              </p>
              <EquationBlock tex={String.raw`R_{\text{harmonic}} = \sum_{i=1}^{15} \alpha_i \left( \sum_{k=1}^3 M_k f_k(t) E_i \right)`} where={harmonicResonanceWhere} />
              <p className="info-equation-note">
                Harmonic resonance multiplies each amplitude αᵢ by the modality envelopes fₖ(t) and elemental weights Eᵢ.
                Read it as “sum every duet, but modulate it by the live waveforms so rhythms like Cardinal surges or Mutable
                fades explicitly show up in the scalar Rₕₐᵣₘₒₙᵢc.”
              </p>
            </section>

            <section className="info-panel__section">
              <h2>State space</h2>
              <h3>Basis dimension + macro overlays</h3>
              <p>
                Instead of quoting giant factorials, we track how many duet basis states span the Hilbert space and
                then layer binary macro overlays (circadian, lunar, solar, governance) on top.
              </p>
              <EquationBlock tex={String.raw`\dim(\mathcal{H}_{\text{QEM}}) = \binom{6}{2} = 15`} where={stateSpaceWhere} />
              <p className="info-equation-note">
                Six canonical forces yield 15 unique duets. That finite set forms our orthonormal basis; every emotional
                state decomposes into those 15 components without invoking speculative 12! enumerations.
              </p>
              <EquationBlock tex={String.raw`N_{\text{config}} = \dim(\mathcal{H}_{\text{QEM}}) \times 2^L`} where={overlayWhere} />
              <p className="info-equation-note">
                Each macro layer toggles on/off, doubling the searchable configurations. Pick L overlays to model, raise 2 to
                that power, and multiply by the 15 basis states to understand how wide the configuration catalog becomes.
              </p>
            </section>

            <section className="info-panel__section">
              <h2>Applied practice</h2>
              <h3>What this unlocks</h3>
              <ul className="info-panel__list">
                {quantumApplications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="info-panel__note">
                Full KaTeX rendering and inline data visualizations are in development so these
                equations can animate directly inside the app without leaving the Vite runtime.
              </p>
            </section>
          </article>
        )

      default:
        return (
          <div className="info-panel__placeholder">
            <p>Detailed content for this tab is being composed inside the lab.</p>
            <p className="info-panel__placeholder-note">
              Each section will roll out with bespoke layouts once the instrumentation is ready.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="info-page">
      <TopBar
        aboutActive
        onOpenTutorial={() => navigate('/tutorial')}
        onOpenAbout={() => navigate('/about')}
        onNavigateHome={() => navigate('/')}
      />

      <main className="info-page-content">
        <div className="info-shell">
          <div className="info-tabs" role="tablist" aria-label="Information page sections">
            {infoTabsConfig.map((tab) => {
              const isActive = tab.id === currentTab.id
              return (
                <button
                  key={tab.id}
                  id={`info-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`info-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`info-tab ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <section
            key={currentTab.id}
            className="info-panel"
            role="tabpanel"
            id={`info-panel-${currentTab.id}`}
            aria-labelledby={`info-tab-${currentTab.id}`}
          >
            {renderTabContent()}
          </section>
        </div>
      </main>
    </div>
  )
}
