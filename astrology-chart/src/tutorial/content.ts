import type { TutorialContent } from './types'

export const tutorialContent: TutorialContent = [
  {
    id: 'onboarding',
    label: 'Orientation & Setup',
    description: 'Start here to learn the tutorial goals, prerequisites, and how to read the Cosmic Cypher UI before exploring theory.',
    theme: 'alpha',
    sections: [
      {
        id: 'start-here',
        label: 'Start Here',
        summary: 'Clarify what success looks like and what background knowledge helps before diving in.',
        pages: [
          {
            id: 'tutorial-purpose',
            title: 'How to Use This Reference',
            summary: 'Treat the tutorial as a living index of cosmic cypher data rather than a linear course.',
            textBlocks: [
              {
                heading: 'Reference Scope',
                body: 'Every module mirrors the Planetary Harmonics docs and Cosmic Cypher implementation notes so you can look up forces, modalities, or math snippets without digging through multiple markdown files.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
              {
                heading: 'Source Canon',
                body: 'Content is condensed directly from the base-12, cosmic force, and resonance sections—if you need deeper prose, jump to the cited anchors in the markdown files.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#base-12-divisibility-structure',
              },
              {
                heading: 'Reference Etiquette',
                body: 'Dip into any section when you need clarity, copy the `sourceRef`, and cross-check the live chart; there is no notion of “completion,” only quick retrieval.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
            ],
            references: [
              {
                id: 'ref-onboarding-outcomes',
                title: 'Planetary Harmonics — Personal Natal Analysis',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
              {
                id: 'ref-onboarding-base12',
                title: 'Planetary Harmonics — Base-12 Divisibility',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#base-12-divisibility-structure',
              },
              {
                id: 'ref-onboarding-forces',
                title: 'Planetary Harmonics — Cosmic Forces',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
            ],
          },
        ],
      },
      {
        id: 'ui-orientation',
        label: 'Interface Orientation',
        summary: 'Map every part of the chart UI before attaching math or symbolism.',
        pages: [
          {
            id: 'interface-map',
            title: 'Chart Interface Overview',
            summary: 'Snapshot the layers, legends, and overlays this reference keeps mentioning so you always know where to look.',
            textBlocks: [
              {
                heading: 'Layered Canvas',
                body: 'The chart renders in ten named layers (definitions through ChartAngles); when the tutorial mentions “Layer 5” or “Angles rail” you should picture the SVG stack immediately.',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#layer-structure',
              },
              {
                heading: 'Core Structures',
                body: 'ChartDefinitions, ZodiacRing, HouseRing, AspectArea, and supporting components are reusable building blocks—knowing them lets you reconcile tutorial screenshots with the live code.',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#core-structure-components',
              },
              {
                heading: 'Visual Elements',
                body: 'ZodiacSymbols, PlanetaryBodies, AspectLines, and ChartAngles form the “symbol rail” that most lessons cite when they say “look at the glyph beside the copy.”',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#visual-element-components',
              },
            ],
            references: [
              {
                id: 'ref-interface-layers',
                title: 'ChartWheel Refactor — Layer Structure',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#layer-structure',
              },
              {
                id: 'ref-interface-core',
                title: 'ChartWheel Refactor — Core Structure Components',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#core-structure-components',
              },
              {
                id: 'ref-interface-visual',
                title: 'ChartWheel Refactor — Visual Element Components',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#visual-element-components',
              },
            ],
          },
          {
            id: 'navigation-contract',
            title: 'Navigation & Retrieval',
            summary: 'Keep the browsing contract lightweight: tabs and chips just point you to the data category you need.',
            textBlocks: [
              {
                heading: 'Tab → Section → Page Flow',
                body: 'Tabs switch data domains, section chips narrow the subset, and the page slider advances through related callouts; if URL params desync, reload and let the clamped indices reset automatically.',
                sourceRef: 'docs/cosmiccypher/tutorial/phase-b-data-plumbing.md#tasks',
              },
              {
                heading: 'Callout Reading Order',
                body: 'Each page remains summary → snippets → math → references; skim whichever block answers your question and move on—this layout is for fast lookup, not lesson plans.',
                sourceRef: 'docs/cosmiccypher/tutorial/phase-b-data-plumbing.md#key-objectives',
              },
              {
                heading: 'Reference Loop',
                body: 'When clarifying a glyph, open the tutorial beside the live chart, grab the relevant summary, and cite the markdown anchor; close it once the question is answered—no trophies required.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
            ],
            references: [
              {
                id: 'ref-navigation-state',
                title: 'Phase B Data Plumbing — Tasks',
                sourceRef: 'docs/cosmiccypher/tutorial/phase-b-data-plumbing.md#tasks',
              },
              {
                id: 'ref-navigation-objectives',
                title: 'Phase B Data Plumbing — Key Objectives',
                sourceRef: 'docs/cosmiccypher/tutorial/phase-b-data-plumbing.md#key-objectives',
              },
              {
                id: 'ref-navigation-practice',
                title: 'Planetary Harmonics — Personal Natal Analysis',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'foundations',
    label: 'Foundations',
    description:
      'Base-12 circular logic, dualities, and the pathway that turns elements into the six Cosmic Forces visible across the chart UI.',
    theme: 'core',
    sections: [
      {
        id: 'base12-framework',
        label: 'Base-12 Framework',
        summary: 'Use these entries when you need to cite why the chart is sliced into 12 and how those factors cascade into UI layers.',
        pages: [
          {
            id: 'base12-overview',
            title: 'Circular Logic Lattice',
            summary: '12 = 2² × 3 explains every ring, divider, and label in the ChartWheel stack.',
            textBlocks: [
              {
                heading: 'Layer Hooks',
                body: 'Layers 3–6 of the refactored ChartWheel (ZodiacRing through HouseNumbers) each correspond to a divisor of 12; call this out when explaining why the UI never renders a 13th slice.',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#layer-structure',
              },
              {
                heading: 'Factor Crosswalk',
                body: '2 (dualities) → 3 (modalities) → 4 (elements) → 6 (forces) → 12 (houses) is the canonical order to cite when someone asks “where do the Cosmic Forces come from?”',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#mathematical-architecture',
              },
              {
                heading: 'Annotation Shortcut',
                body: 'When annotating screenshots, label the ring you are referencing plus the divisor (e.g., “Layer 5 · 12/3 = modalities”). It keeps reviewers grounded in the math without diving back into the theory doc.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#base-12-divisibility-structure',
              },
            ],
            references: [
              {
                id: 'ref-base12-architecture',
                title: 'Planetary Harmonics — Base-12 Architecture',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#base-12-divisibility-structure',
                summary: 'Defines how dualities, modalities, elements, and forces cascade from 12.',
              },
              {
                id: 'ref-hierarchical-breakdown',
                title: 'Planetary Harmonics — Hierarchical Breakdown',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#mathematical-architecture',
              },
            ],
            usageNotes: [
              'Quote this page when documenting why no additional houses/modality tags exist.',
              'Pair with `CHARTWHEEL_REFACTOR.md#layer-structure` when pointing out a specific SVG layer in reviews.',
            ],
          },
          {
            id: 'dualities',
            title: 'Universal Dualities',
            summary: 'Log every polarity pair that appears in legends, toggles, and aspect overlays.',
            textBlocks: [
              {
                heading: 'Structural Dualities',
                body: 'Spatial (ASC/DSC), Temporal (Alpha/Omega in the force selector), Logical (True/False states in the filter rail), and Energetic (Active/Passive overlays) map directly to toggles in the UI.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-fundamental-dualities-set-of-2',
              },
              {
                heading: 'Existential Thread',
                body: 'Core/Void, Being/Non-being, Manifest/Unmanifest determine the light/dark treatments on the legend chips; reference this when someone asks why Core always renders gold and Void renders teal.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-fundamental-dualities-set-of-2',
              },
              {
                heading: 'UI Cross-Reference',
                body: 'ChartAngles (Layer 10) plus the Force selector in the HUD are the only places where all dualities are visible at once. Screenshot them when producing docs.',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#visual-element-components',
              },
            ],
            references: [
              {
                id: 'ref-dualities',
                title: 'Planetary Harmonics — Fundamental Dualities',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-fundamental-dualities-set-of-2',
              },
              {
                id: 'ref-dualities-visual',
                title: 'ChartWheel Refactor — Visual Element Components',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#visual-element-components',
              },
            ],
            usageNotes: [
              'Use when clarifying why a legend chip has two states or colors.',
              'Link to this entry in bug reports about ASC/DSC polarity rendering.',
            ],
          },
        ],
      },
      {
        id: 'modalities-elements',
        label: 'Modalities & Elements',
        summary: 'Document how waveform metaphors drive the time rail and how elements feed the six-force legend.',
        pages: [
          {
            id: 'modalities',
            title: 'Modal Waveforms',
            summary: 'Triangle, square, and sine waves explain the pacing of time scrubber presets and aspect animations.',
            textBlocks: [
              {
                heading: 'Cardinal Triangle Wave',
                body: 'Treat the triangle wave (√3 multiplier) as shorthand for “start here” badges—0°, 120°, 240° lines line up with the time scrubber’s launch preset.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#modalities',
              },
              {
                heading: 'Fixed Square Wave',
                body: 'Square waves (2× base cycle) justify the “hold” preset on the scrubber and the plateau animations in AspectArea—cite this when defending the flat segments.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#modalities',
              },
              {
                heading: 'Mutable Sine Wave',
                body: 'Sine modulation fuels the in-between frames on overlays; point to it when reviewers ask why transitions are eased instead of stepped.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#modalities',
              },
              {
                heading: 'UI Anchor',
                body: 'The Resonant Finder controls reuse these three waveforms in their iconography—log this connection so devs know not to swap art without updating the tutorial.',
                sourceRef: 'docs/cosmiccypher/tutorial/phase-b-data-plumbing.md#key-objectives',
              },
            ],
            references: [
              {
                id: 'ref-modalities',
                title: 'Planetary Harmonics — Modalities',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#modalities',
                summary: 'Describes triangle, square, and sine modulation behavior.',
              },
              {
                id: 'ref-modalities-brief',
                title: 'Phase B Brief — Schema Objectives',
                sourceRef: 'docs/cosmiccypher/tutorial/phase-b-data-plumbing.md#key-objectives',
              },
            ],
            usageNotes: [
              'Reference when tuning time scrubber presets or reviewing waveform animations.',
              'Include in design notes any time you justify triangle/square/sine iconography.',
            ],
          },
          {
            id: 'elements-forces',
            title: 'Elements Into Forces',
            summary: 'Map Fire/Earth/Air/Water to the six-force legend and HUD badges.',
            textBlocks: [
              {
                heading: 'Elemental States',
                body: 'Fire (radiant), Earth (crystallized), Air (kinetic), Water (flowing) are the four colors used across the force legend background—cite them when describing palette constraints.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-quadratic-elements-set-of-4',
              },
              {
                heading: 'Force Emergence',
                body: 'Fire+Earth → Core, Water+Air → Void, Air+Earth → Order, Fire+Water → Chaos, Fire+Air → Alpha, Earth+Water → Omega—use this table whenever you explain the HUD force selector or compatibility overlays.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
              {
                heading: 'Legend Wiring',
                body: 'The force legend on the main chart imports these pairings via the shared icon set; it’s the authoritative spot to verify that design and data stay in sync.',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#visual-element-components',
              },
            ],
            references: [
              {
                id: 'ref-elements',
                title: 'Planetary Harmonics — Quadratic Elements',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-quadratic-elements-set-of-4',
              },
              {
                id: 'ref-cosmic-forces',
                title: 'Planetary Harmonics — Cosmic Forces',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
              {
                id: 'ref-elements-visual',
                title: 'ChartWheel Refactor — Visual Element Components',
                sourceRef: 'CHARTWHEEL_REFACTOR.md#visual-element-components',
              },
            ],
            usageNotes: [
              'Paste this mapping into any doc describing force legend colors.',
              'Reference here when QA asks how compatibility overlays derive their labels.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'quantum-emotion',
    label: 'Quantum Emotional Mechanics',
    description: 'Explain the 15-dimensional Hilbert space, emotional Hamiltonian, and resonance math powering compatibility overlays.',
    theme: 'chaos',
    sections: [
      {
        id: 'state-vector',
        label: 'State Vector',
        summary: 'Define |ψ⟩ as a 15-dimensional superposition tied to cosmic force pairs.',
        pages: [
          {
            id: 'state-definition',
            title: 'State Vector Definition',
            summary: 'Emotional state is |ψ⟩ = Σ αᵢ |Dᵢ⟩, normalized across 15 dimensions.',
            textBlocks: [
              {
                heading: 'Basis States',
                body: 'Each |Dᵢ⟩ corresponds to a pairwise Cosmic Force relationship—matching the 15 axes described in the harmonic system.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#quantum-emotional-state-representation',
              },
              {
                heading: 'Base-12 Phases',
                body: 'Amplitudes use base-12 angular increments, so every phase shift aligns with the same modular logic as the chart wheel.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#amplitude-in-base-12',
              },
            ],
            math: [
              {
                id: 'state-vector-equation',
                title: 'State Vector',
                latex: '|\\psi\\rangle = \\sum_{i=1}^{15} \\alpha_i |D_i\\rangle',
                description: 'Each amplitude αᵢ carries the contribution of one Cosmic Force pair; all amplitudes square-sum to 1.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#quantum-emotional-state-representation',
              },
            ],
            references: [
              {
                id: 'ref-quantum-state',
                title: 'Quantum Emotional Mechanics — State Representation',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#quantum-emotional-state-representation',
              },
              {
                id: 'ref-base12-phases',
                title: 'Quantum Emotional Mechanics — Base-12 Phases',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#amplitude-in-base-12',
              },
            ],
          },
        ],
      },
      {
        id: 'hamiltonian',
        label: 'Hamiltonian & Resonance',
        summary: 'Show how the emotional Hamiltonian evolves |ψ⟩ and how resonance probability is computed.',
        pages: [
          {
            id: 'hamiltonian-overview',
            title: 'Emotional Hamiltonian',
            summary: 'Ĥ sums force projections, modality operators, and element operators.',
            textBlocks: [
              {
                heading: 'Operator Stack',
                body: 'Ĥ = Σ F_j P_j + Σ M_k Q_k + Σ E_l R_l mixes force, modality, and element contributions to the state evolution.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-dynamics-operator',
              },
              {
                heading: 'Time Evolution',
                body: 'The Schrödinger-style equation iħ d/dt |ψ⟩ = Ĥ|ψ⟩ keeps emotional states aligned with the same timing controls used by the time scrubber.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#time-evolution',
              },
            ],
            math: [
              {
                id: 'hamiltonian-equation',
                title: 'Emotional Hamiltonian',
                latex: '\\hat{H} = \\sum_{j=1}^6 F_j \\hat{P}_j + \\sum_{k=1}^3 M_k \\hat{Q}_k + \\sum_{l=1}^4 E_l \\hat{R}_l',
                description: 'Force projections, modality operators, and element operators combine to evolve the state.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-dynamics-operator',
              },
              {
                id: 'resonance-probability',
                title: 'Resonance Probability',
                latex: 'R = |\\langle \\psi_1 | \\psi_2 \\rangle|^2',
                description: 'Compatibility overlays compare two state vectors and square the magnitude of their inner product.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-resonance-probability',
              },
            ],
            references: [
              {
                id: 'ref-hamiltonian',
                title: 'Quantum Emotional Mechanics — Emotional Dynamics Operator',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-dynamics-operator',
              },
              {
                id: 'ref-resonance-probability',
                title: 'Quantum Emotional Mechanics — Resonance Probability',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-resonance-probability',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cosmic-forces',
    label: 'Cosmic Forces & Dimensions',
    description: 'Map how elemental pairs form the six forces and how those forces expand into the 15-dimensional lattice.',
    theme: 'void',
    sections: [
      {
        id: 'force-profiles',
        label: 'Force Profiles',
        summary: 'Summaries of Core, Void, Order, Chaos, Alpha, Omega with their symbols and meanings.',
        pages: [
          {
            id: 'force-overview',
            title: 'Six Cosmic Forces',
            summary: 'Each force is an elemental hybrid that shows up as a repeated sprite in the UI.',
            textBlocks: [
              {
                heading: 'Core & Void',
                body: 'Core (Fire+Earth) concentrates manifestation, while Void (Water+Air) expands potential and receptivity.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
              {
                heading: 'Order & Chaos',
                body: 'Order (Air+Earth) structures energy into linear progressions; Chaos (Fire+Water) keeps transformation in motion.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
              {
                heading: 'Alpha & Omega',
                body: 'Alpha (Fire+Air) initiates ascent, Omega (Earth+Water) completes and integrates—mirroring the Alpha/Omega toggles in the UI.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
            ],
            references: [
              {
                id: 'ref-force-definitions',
                title: 'Planetary Harmonics — Cosmic Forces (Set of 6)',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-cosmic-forces-set-of-6',
              },
            ],
          },
        ],
      },
      {
        id: 'dimensional-stack',
        label: '15-Dimensional Stack',
        summary: 'Break the 15 relationships into tiers that anchor the tutorial navigation.',
        pages: [
          {
            id: 'tiered-dimensions',
            title: 'Tiered Relationships',
            summary: 'Tier 1 (Core relations) through Tier 5 (Alpha/Omega) describe every axis the chart overlays call upon.',
            textBlocks: [
              {
                heading: 'Tier 1 — Core Relationships',
                body: 'Five dimensions pair Core with each remaining force, creating manifestation axes such as Core-Void and Core-Chaos.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#tier-1-core-relationships-5-dimensions',
              },
              {
                heading: 'Tier 2-4 — Void, Order, Chaos',
                body: 'Subsequent tiers shrink in count (4, 3, 2) as Void, Order, and Chaos interact with the remaining forces.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#tier-2-void-relationships-4-dimensions',
              },
              {
                heading: 'Tier 5 — Alpha/Omega',
                body: 'The fifteenth dimension is the Alpha-Omega axis, the “great cycle” shown whenever the chart animates a full orbit.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#tier-5-alpha-omega-relationship-1-dimension',
              },
            ],
            math: [
              {
                id: 'state-counts',
                title: 'Permutation Count',
                latex: 'N_{\text{states}} = 12! \times \binom{6}{2} \times 3^2 \times 4!',
                description: 'Total emotional permutation states before modality modulation equals 1,555,200,000.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-permutation-states',
              },
              {
                id: 'state-enhanced',
                title: 'Modulated Count',
                latex: 'N_{\text{enhanced}} = N_{\text{states}} \times 8',
                description: 'Eight modality combinations expand the count to 12,441,600,000 states.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#emotional-permutation-states',
              },
            ],
            references: [
              {
                id: 'ref-dimensional-tiers',
                title: 'Planetary Harmonics — 15 Dimensional System',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#the-15-dimensional-system',
              },
              {
                id: 'ref-tier-breakdown',
                title: 'Planetary Harmonics — Dimensional Mapping',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#dimensional-mapping',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cusp-resonance',
    label: 'Cusps & Harmonic Resonance',
    description: 'Show how cusp weighting, harmonic modulation, and resonance detection map to tutorial controls.',
    theme: 'order',
    sections: [
      {
        id: 'cusp-algorithm',
        label: 'Cusp Algorithm',
        summary: 'Explain how the tutorial will visualize cusp weights when hovering over sign transitions.',
        pages: [
          {
            id: 'cusp-weighting',
            title: 'Weighted Superposition',
            summary: 'Planets near cusps blend two forces using weighted contributions.',
            textBlocks: [
              {
                heading: 'Weight Equations',
                body: 'Weights slide between adjacent signs based on the distance from each midpoint inside the ±15° cusp window.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#cusp-influence-in-quantum-context',
              },
              {
                heading: 'Normalization',
                body: 'w₁² + w₂² = 1 keeps the superposition normalized, so the tutorial can animate blending without jumps.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#cusp-influence-in-quantum-context',
              },
            ],
            math: [
              {
                id: 'cusp-weights',
                title: 'Cusp Weights',
                latex: 'w_1 = 1 - \frac{|\theta - \text{mid}(S_1)|}{15^\circ},\quad w_2 = 1 - \frac{|\theta - \text{mid}(S_2)|}{15^\circ}',
                description: 'Weights fade based on angular distance from each sign midpoint inside the cusp zone.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#cusp-influence-in-quantum-context',
              },
            ],
            references: [
              {
                id: 'ref-cusp-algorithm',
                title: 'Quantum Emotional Mechanics — Cusp Influence',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#cusp-influence-in-quantum-context',
              },
            ],
          },
        ],
      },
      {
        id: 'harmonics',
        label: 'Harmonic Resonance',
        summary: 'Connect resonance formulas to the tutorial’s future compatibility overlays.',
        pages: [
          {
            id: 'harmonic-formula',
            title: 'Harmonic Summation',
            summary: 'Resonance sums modality waveforms with elemental amplitudes for each dimension.',
            textBlocks: [
              {
                heading: 'Modal Modulation',
                body: 'Triangle, square, and sine functions f_k(t) weight each force pair differently, mirroring the waveform sprites used earlier.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#harmonic-resonance-in-15-dimensional-space',
              },
              {
                heading: 'Resonance Thresholds',
                body: 'Synchronicity detection triggers when harmonic resonance passes a configurable threshold, matching how the tutorial will highlight aligned nodes.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#applications',
              },
            ],
            math: [
              {
                id: 'harmonic-resonance',
                title: 'Harmonic Resonance',
                latex: 'R_{\text{harm}} = \sum_{i=1}^{15} \alpha_i \left( \sum_{k=1}^3 M_k f_k(t) E_i \right)',
                description: 'Resonance combines amplitudes, modality weights, and element amplitudes for each dimension.',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#harmonic-resonance-in-15-dimensional-space',
              },
            ],
            references: [
              {
                id: 'ref-harmonic-resonance',
                title: 'Quantum Emotional Mechanics — Harmonic Resonance',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#harmonic-resonance-in-15-dimensional-space',
              },
              {
                id: 'ref-applications',
                title: 'Quantum Emotional Mechanics — Applications',
                sourceRef: 'Quantum_Emotional_Mechanics.markdown#applications',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'applications',
    label: 'Applications & Practice',
    description: 'Translate theory into actionable steps for personal, collective, medical, and financial chart work.',
    theme: 'alpha',
    sections: [
      {
        id: 'personal-practice',
        label: 'Personal Practice',
        summary: 'Tutorial callouts that help new users relate the 15-D model to their charts.',
        pages: [
          {
            id: 'personal-usage',
            title: 'Personal Readings',
            summary: 'Use the tutorial to map personality, lifecycle, and compatibility insights.',
            textBlocks: [
              {
                heading: '15-D Personality Mapping',
                body: 'Each dimension contributes to a personal axis; the tutorial will provide cross-links to the live chart for quick validation.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
              {
                heading: 'Compatibility Overlays',
                body: 'Resonance R is turned into an overlay that highlights shared amplitudes; the tutorial will include example walkthroughs.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
            ],
            references: [
              {
                id: 'ref-personal-analysis',
                title: 'Planetary Harmonics — Personal Natal Analysis',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#personal-natal-analysis',
              },
            ],
          },
        ],
      },
      {
        id: 'collective-extensions',
        label: 'Collective Extensions',
        summary: 'Explain how the tutorial will seed future mundane, medical, and financial studies.',
        pages: [
          {
            id: 'collective-roadmap',
            title: 'Collective Applications',
            summary: 'Dimensional resonance can scale to societies, markets, and health cycles.',
            textBlocks: [
              {
                heading: 'Mundane & Social Modeling',
                body: '15-D coordinates track collective consciousness patterns; tutorial callouts link to upcoming dashboards.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#mundane-astrology',
              },
              {
                heading: 'Medical & Financial Timing',
                body: 'Lifecycle optimization, treatment planning, and economic cycles all reuse the same harmonic framework.',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#medical-astrology',
              },
            ],
            references: [
              {
                id: 'ref-mundane',
                title: 'Planetary Harmonics — Mundane Astrology',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#mundane-astrology',
              },
              {
                id: 'ref-medical',
                title: 'Planetary Harmonics — Medical Astrology',
                sourceRef: 'PLANETARY_HARMONICS_THEORY.md#medical-astrology',
              },
            ],
          },
        ],
      },
    ],
  },
]

export default tutorialContent
