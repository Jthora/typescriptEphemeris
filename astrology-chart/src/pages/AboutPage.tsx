import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import './InfoPages.css'

type InfoSectionLayout = 'grid' | 'list'
type InfoAction = 'home' | 'tutorial'

interface InfoSectionItem {
  id: string
  title: string
  description: string
  caption?: string
  image?: string
  tag?: string
  meta?: string
  bullets?: string[]
  action?: InfoAction
  actionLabel?: string
}

interface InfoSectionData {
  id: string
  title: string
  description: string
  layout?: InfoSectionLayout
  items: InfoSectionItem[]
}

interface InfoTabData {
  id: string
  label: string
  description: string
  heroTitle: string
  heroBody: string
  heroTag?: string
  sections: InfoSectionData[]
}

const ethosPillars = [
  {
    id: 'precision',
    title: 'Precision Astronomy',
    description:
      'Powered by astronomy-engine ephemerides, every coordinate is calculated in real time with space-grade accuracy.'
  },
  {
    id: 'tactile',
    title: 'Tactile UI',
    description: 'Hardware-inspired controls, neon indicators, and glowy panels keep the interface expressive yet dependable.'
  },
  {
    id: 'sharing',
    title: 'Creative Sharing',
    description: 'Capture presets, palettes, and share-ready helpers streamline storytelling around each chart.'
  }
]

const teamHighlights = [
  {
    id: 'core',
    title: 'Core Engine',
    caption: 'Numerical solvers + harmonics synthesizer',
    image: '/symbols/cosmic/core.png'
  },
  {
    id: 'order',
    title: 'Design Language',
    caption: 'Mechanical futurism references',
    image: '/symbols/cosmic/order.png'
  },
  {
    id: 'void',
    title: 'Exploration Team',
    caption: 'Deep space QA & verification',
    image: '/symbols/cosmic/void.png'
  }
]

const aboutSections: InfoSectionData[] = [
  {
    id: 'mission',
    title: 'Mission Brief',
    description: 'How the TypeScript Ephemeris stack keeps the experience cinematic yet precise.',
    layout: 'list',
    items: [
      {
        id: 'mission-astro',
        title: 'Live ephemeris core',
        description: 'Real-time astronomy-engine data drives houses, decans, and harmonic overlays without cached shortcuts.',
        bullets: ['Uses VSOP87 base series', 'UTC and location aware', 'Feeds every visualization layer']
      },
      {
        id: 'mission-ui',
        title: 'Cinematic interface',
        description:
          'Hardware toggles, lens flares, and neon gradients are mapped to the same data structures to keep aesthetics honest to the math.',
        bullets: ['Palette + glyph pairing', 'Responsive hardware buttons', 'Accessible keyboard focus flows']
      },
      {
        id: 'mission-sharing',
        title: 'Share-friendly storytelling',
        description:
          'Preset capture, background palettes, and reference snippets make it easy to export the state vector into social or research-ready copy.'
      }
    ]
  },
  {
    id: 'crews',
    title: 'Systems crews',
    description: 'Each cosmic force maps to a development crew keeping the platform balanced.',
    layout: 'grid',
    items: teamHighlights.map((highlight) => ({
      id: `crew-${highlight.id}`,
      title: highlight.title,
      description: highlight.caption,
      image: highlight.image,
      tag: highlight.id.toUpperCase(),
      caption: highlight.caption
    }))
  },
  {
    id: 'pillars',
    title: 'Ethos pillars',
    description: 'Guiding principles for every release.',
    layout: 'list',
    items: ethosPillars.map((pillar) => ({
      id: `pillar-${pillar.id}`,
      title: pillar.title,
      description: pillar.description
    }))
  },
  {
    id: 'actions',
    title: 'Quick actions',
    description: 'Jump directly to the views you need.',
    layout: 'list',
    items: [
      {
        id: 'action-chart',
        title: 'Return to live chart',
        description: 'Open the interactive wheel to test presets and timestream scrubbing.',
        action: 'home',
        actionLabel: 'Open chart'
      },
      {
        id: 'action-tutorials',
        title: 'View tutorials',
        description: 'Deep dive into zodiac, cusp, and decan reference cards with the Foundations-first layout.',
        action: 'tutorial',
        actionLabel: 'Open tutorial'
      }
    ]
  }
]

const universalLanguageSections: InfoSectionData[] = [
  {
    id: 'glyph-system',
    title: 'Glyph system',
    description: 'Iconography keeps every data layer recognizable at a glance.',
    layout: 'list',
    items: [
      {
        id: 'glyph-forces',
        title: 'Cosmic forces set',
        description:
          'Alpha, Omega, Core, Void, Order, and Chaos glyphs come from the Base16 library and are paired with matching tutorial badges.',
        bullets: ['Color-coded for polarity', 'Used in cards, legends, and share sheets', 'SVG-first for crisp scaling']
      },
      {
        id: 'glyph-zodiac',
        title: 'Zodiac + decan overlays',
        description:
          'Arkana glyphs ship in dark + light variants for dual-mode support, while decan sigils ride on transparent PNGs for compositing.'
      }
    ]
  },
  {
    id: 'color-language',
    title: 'Color language',
    description: 'A four-quadrant palette keeps storytelling consistent.',
    layout: 'list',
    items: [
      {
        id: 'color-forces',
        title: 'Force gradients',
        description:
          'Alpha/Core lean toward warm metallics, while Chaos/Void lean neon and ultraviolet for immediate separation.',
        bullets: ['WCAG AA contrast targets', 'CSS variables expose each swatch', 'Animated gradients stay under 60fps budgets']
      },
      {
        id: 'color-elements',
        title: 'Element ribbons',
        description: 'Fire/Earth/Air/Water badges reuse the same spectrum used in cusp legends and timestream overlays.'
      }
    ]
  },
  {
    id: 'interaction-language',
    title: 'Interaction language',
    description: 'Microcopy and motion design reinforce the cosmic lexicon.',
    layout: 'list',
    items: [
      {
        id: 'interaction-copy',
        title: 'Microcopy',
        description: 'Every toggle explains the underlying math—no vague “advanced” switches, only harmonic, force, or timestream labels.'
      },
      {
        id: 'interaction-motion',
        title: 'Motion cues',
        description: 'Cardinal waves pulse, fixed waves latch, and mutable waves ease—mirroring the modality animations from the tutorial page.'
      }
    ]
  }
]

const quantumFrameworkSections: InfoSectionData[] = [
  {
    id: 'state-architecture',
    title: 'State architecture',
    description: 'Quantum_Emotional_Mechanics.markdown outlines the math that powers compatibility analytics.',
    layout: 'list',
    items: [
      {
        id: 'state-vector',
        title: '15D emotional vector',
        description:
          'Each amplitude corresponds to a decan-force pairing. Normalization keeps total energy at unity so comparisons stay meaningful.',
        bullets: ['|ψ⟩ = Σ αᵢ |Dᵢ⟩', 'Σ |αᵢ|² = 1', 'Base-12 phase quantization anchors to the zodiac wheel']
      },
      {
        id: 'hamiltonian',
        title: 'Hamiltonian stack',
        description:
          'Force, modality, and element operators combine into Ĥ so timelines can be propagated or rewound consistently.'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics outputs',
    description: 'Observer functions translate the state vector into readable metrics.',
    layout: 'list',
    items: [
      {
        id: 'resonance',
        title: 'Resonance probability',
        description: 'R = |⟨ψ₁|ψ₂⟩|² drives the compatibility meter used inside share overlays.'
      },
      {
        id: 'convergence',
        title: 'Harmonic convergence',
        description: 'Normalized Euclidean distance across the 15D space highlights where two charts differ the most.'
      }
    ]
  },
  {
    id: 'workflow',
    title: 'Workflow integration',
    description: 'How the quantum framework shows up in the UI.',
    layout: 'list',
    items: [
      {
        id: 'briefings',
        title: 'Decan briefings',
        description:
          'Every decan card references the same elemental blend text that feeds the quantum emotional summary, keeping story beats synced.'
      },
      {
        id: 'timestream',
        title: 'Timestream overlays',
        description: 'The timestream canvas uses the quantum amplitudes to color resonance lanes while scrubbing through events.'
      }
    ]
  }
]

const infoTabsConfig: InfoTabData[] = [
  {
    id: 'about',
    label: 'About',
    description: 'Project dossier and crew manifest.',
    heroTag: 'Project dossier',
    heroTitle: 'About Cosmic Cypher',
    heroBody:
      'TypeScript Ephemeris blends astronomer-grade math with a cinematic interface. Every slider, badge, and glyph ties directly back to live ephemerides.',
    sections: aboutSections
  },
  {
    id: 'language',
    label: 'Universal Language',
    description: 'Glyphs, palettes, and interaction cues.',
    heroTag: 'Design language',
    heroTitle: 'Universal Language Guide',
    heroBody: 'A shared lexicon keeps charts, docs, and shareables readable whether you are in dev tools or presentation mode.',
    sections: universalLanguageSections
  },
  {
    id: 'quantum',
    label: 'Quantum Emotional Framework',
    description: '15D emotional engine overview.',
    heroTag: 'Systems research',
    heroTitle: 'Quantum Emotional Framework',
    heroBody:
      'The quantum layer translates decan and force data into a normalized state vector so we can simulate compatibility, resonance, and storyline arcs.',
    sections: quantumFrameworkSections
  }
]

export default function AboutPage() {
  const navigate = useNavigate()
  const [activeTabId, setActiveTabId] = useState(infoTabsConfig[0]?.id ?? 'about')

  const currentTab = useMemo(() => {
    return infoTabsConfig.find((tab) => tab.id === activeTabId) ?? infoTabsConfig[0]
  }, [activeTabId])

  const handleAction = (action: InfoAction) => {
    switch (action) {
      case 'home':
        navigate('/')
        return
      case 'tutorial':
        navigate('/tutorial')
        return
      default:
        return
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
                  <small>{tab.description}</small>
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
            <div className="info-panel__summary">
              {currentTab.heroTag && <p className="info-tag">{currentTab.heroTag}</p>}
              <h1>{currentTab.heroTitle}</h1>
              <p>{currentTab.heroBody}</p>
            </div>

            {currentTab.sections.map((section) => (
              <article key={section.id} className="info-panel__section">
                <header className="info-panel__section-header">
                  <div>
                    <p className="info-tag info-tag--subtle">{section.title}</p>
                    <h2>{section.description}</h2>
                  </div>
                </header>
                <div className={section.layout === 'list' ? 'info-card-list' : 'info-card-grid'}>
                  {section.items.map((item) => (
                    <div key={item.id} className="info-card">
                      {item.tag && <span className="info-card__tag info-tag">{item.tag}</span>}
                      {item.image && (
                        <div className="info-card__media">
                          <img src={item.image} alt={`${item.title} illustration`} loading="lazy" />
                        </div>
                      )}
                      <h3>{item.title}</h3>
                      {item.meta && <p className="info-card__meta">{item.meta}</p>}
                      <p>{item.description}</p>
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="info-card__bullets">
                          {item.bullets.map((bullet) => (
                            <li key={`${item.id}-${bullet}`}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                      {item.caption && <p className="info-card__caption">{item.caption}</p>}
                      {item.action && (
                        <button
                          className="hardware-button info-card__action"
                          type="button"
                          onClick={() => handleAction(item.action!)}
                        >
                          {item.actionLabel ?? 'Open'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
