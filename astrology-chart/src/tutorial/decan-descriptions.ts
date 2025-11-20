export type DecanDescription = {
  decan: number
  summary: string
  elementalBlend: string
  egyptianLore: string
}

export type DecanDescriptionMap = Record<string, DecanDescription[]>

export const decanDescriptions: DecanDescriptionMap = {
  Aries: [
    {
      decan: 1,
      summary: 'Incendiary, pioneering, combative, catalytic.',
      elementalBlend: 'Cardinal fire fused with Chaos. Releases jagged, experimental surges that refuse to wait. Ideal for daring prototypes, dramatic pivots, and rallying battle cries.',
  egyptianLore: "Egyptian star-priests tied this watch to the prow torch of Montu's war barque, a signal used to alert scouts and shield caravans before dawn marches. Offerings of red ochre were recorded to keep the flame disciplined so campaigns began with precision rather than collateral fire."
    },
    {
      decan: 2,
      summary: 'Directive, guiding, disciplined, purposeful.',
      elementalBlend: "Cardinal fire carrying Prime. Preserves Aries' source code—decisive, upright, contagiously motivated. Stabilizes momentum so sparks mature into reliable directives for the cohort.",
  egyptianLore: "Temple calendars labeled this decan as Khnum's ram standard, an emblem of disciplined craftsmanship. Creation hymns were read over forges so officers shaped new tools and tactics before leading companies into contested ground."
    },
    {
      decan: 3,
      summary: 'Enduring, strategic, commanding, resolute.',
      elementalBlend: 'Cardinal fire meeting Core. Compresses raw passion into frameworks, budgets, and supply lines. Every push gains a maintenance plan, perfect for founders staying in the fight.',
  egyptianLore: 'Star clocks linked the last Aries 10° to Horus of the Horizon, the moment smiths tempered bronze lances for the pharaoh’s guard. The record emphasized debriefs and ritual cleansing after battle so command chains stayed intact.'
    }
  ],
  Taurus: [
    {
      decan: 1,
      summary: 'Grounded, preserving, patient, dependable.',
      elementalBlend: 'Fixed earth supercharged by Core. Holds resources, budgets, and boundaries in trustworthy hands. Excels at storing fuel without letting it stagnate.',
  egyptianLore: 'Egyptian decan tables mapped this watch to the first barley shoots in the fields of Osiris. Scribes noted beer libations and inventory chants so grain tallies stayed accurate while surplus was shared with the work crews.'
    },
    {
      decan: 2,
      summary: 'Sensual, artisanal, nurturing, loyal.',
      elementalBlend: 'Fixed earth transmitting Prime. Keeps Taurus tuned to sensual intelligence. Plans stay tactile, slow, precise—perfect for improving quality without losing soul.',
  egyptianLore: 'Astrologer-priests logged this decan under the Ka of Hathor, signaling workshops to balance comfort with production. Procession records describe sistra music and fragrance offerings used to bless textiles, leather, and food stores before trade fairs.'
    },
    {
      decan: 3,
      summary: 'Institutional, methodical, loyalist, steadfast.',
      elementalBlend: 'Fixed earth merged with Order. Loves repeatable methods, documentation, procurement chains. The audit-friendly side of Taurus underpinning every promise the sign makes.',
  egyptianLore: 'Old star tables placed the final Taurus span under Ptah-Sokar, patron of Memphis artisans. Architects submitted plans at his shrines before setting stone courses, reinforcing the decan’s link with documented measurements and formal handovers.'
    }
  ],
  Gemini: [
    {
      decan: 1,
      summary: 'Analytical, connective, polyphonic, observant.',
      elementalBlend: 'Mutable air amplified by Order. Turns curiosity into elegant systems—taxonomies, APIs, editorial calendars. Thrives when conversations need structure without rigidity.',
  egyptianLore: "Egyptian observers linked this decan with Seshat's measuring cord and used it to recalibrate ledgers, boundary stones, and temple grids. Court scribes were instructed to log testimony during this window so transcripts matched the updated reference lines."
    },
    {
      decan: 2,
      summary: 'Witty, improvisational, bilingual, mercurial.',
      elementalBlend: 'Mutable air channeling Prime. Keeps Gemini near its trickster origin. Ideas arrive raw and witty—ideal for copywriting, improv, rapid dialogue prototyping.',
  egyptianLore: 'Calendars cite the twin forms of Shu and Tefnut exchanging breath above the Delta for this decan. Diplomatic journals describe talks opened here to emphasize paired translators and mirrored oaths, ensuring both delegations left with the same wording.'
    },
    {
      decan: 3,
      summary: 'Intuitive, liminal, subtle, elusive.',
      elementalBlend: 'Mutable air interlacing with Void. Dissolves rigid narratives so subtle signals emerge. Dreams, transmissions, coincidences form a map only the open-minded can read.',
  egyptianLore: 'Temple astronomers aligned the last Gemini span with Anuket’s star boat, using its rise to time departures along the cataracts. Manuals instruct pilots to read current speed and dream omens before entering turbulent channels.'
    }
  ],
  Cancer: [
    {
      decan: 1,
      summary: 'Protective, receptive, cushioning, anticipatory.',
      elementalBlend: 'Cardinal water merged with Void. Prioritizes receptivity, listening, psychic triage. Establishes emotional baselines so everyone knows what needs protection.',
  egyptianLore: 'Egyptian decan lists called this watch the Floodgate of Sopdet, signaling the first rise of the Nile gauges. Priests rang rooftop bells so households could seal grain bins and position cisterns before the water reached their district.'
    },
    {
      decan: 2,
      summary: 'Nurturing, hosting, guiding, affectionate.',
      elementalBlend: 'Cardinal water infused with Prime. Mixes tenderness with leadership. Decisions originate from compassion yet stay confident enough to steer the clan.',
  egyptianLore: 'Iconography for the second Cancer decan shows Bastet presenting bread and beer to traveling officials. Provincial records note mediations scheduled here because hospitality rites and oath-sharing were required before deals were ratified.'
    },
    {
      decan: 3,
      summary: 'Cathartic, insurgent, emotive, regenerative.',
      elementalBlend: 'Cardinal water ignited by Chaos. Brings tidal waves, protest songs, cathartic rituals. Purges stagnation so collective healing can advance.',
  egyptianLore: 'The last Cancer decan was aligned with Sekhmet’s purging flood; temple diaries describe processions that reenacted crisis, cleanup, and medical rites in sequence. Officials used the station to authorize reforms after audits uncovered abuse.'
    }
  ],
  Leo: [
    {
      decan: 1,
      summary: 'Dramatic, volcanic, charismatic, irrepressible.',
      elementalBlend: 'Fixed fire woven with Chaos. Loves pageantry, experimentation, audacious stagecraft. High drama becomes the tool to disrupt complacency.',
  egyptianLore: 'Egyptian astronomers tied this decan to Sekhmet’s solar eye. Temple notes list pacification rites and military reviews intended to direct the heat toward hostile borders while keeping local storehouses safe.'
    },
    {
      decan: 2,
      summary: 'Regal, generous, magnetic, heart-centered.',
      elementalBlend: 'Fixed fire carrying Prime. Radiates pure Leo heart—creative, loyal, unapologetically expressive. Sustains the tribe by sharing warmth instead of hoarding it.',
  egyptianLore: 'The second Leo decan corresponded to Ra at zenith; decrees, tax notices, and festival announcements were scheduled at midday so listeners across the nomes heard a unified message. Sistrum processions simply marked the protocol.'
    },
    {
      decan: 3,
      summary: 'Stewarding, ceremonious, loyal, protective.',
      elementalBlend: 'Fixed fire partnering with Core. Anchors charisma into stewardship. Builds courts, charters, creative guilds that survive leadership transitions.',
  egyptianLore: 'Star tables name the final Leo decan the Throne of Maahes. Judicial archives note verdicts sworn during this period because Maahes symbolized enforcement of oaths, estates, and public works.'
    }
  ],
  Virgo: [
    {
      decan: 1,
      summary: 'Diagnostic, meticulous, preventative, devoted.',
      elementalBlend: 'Mutable earth charged with Core. Loves maintenance, medicine, quiet heroics. Refines tools and bodies so systems survive upcoming pivots.',
  egyptianLore: 'Egyptian medical papyri link this decan with Imhotep’s sleep-sanctuaries, documenting physicians who recorded dream prescriptions beside their patients. The entry stresses nightly rounds, case notes, and herbal stocks rather than spectacle.'
    },
    {
      decan: 2,
      summary: 'Organizing, scripting, methodical, lyrical.',
      elementalBlend: 'Mutable earth relaying Prime. Keeps Virgo honest to its service ethic while inviting artistry. Translates messy reality into checklists that still feel human.',
  egyptianLore: 'Temple archives assign the second Virgo decan to Seshat’s emblem. Survey logs show inspectors physically re-strung gridlines and updated brick counts during this interval before allowing work crews to continue.'
    },
    {
      decan: 3,
      summary: 'Coordinating, integrative, adaptive, pragmatic.',
      elementalBlend: 'Mutable earth merged with Order. Orchestrates teams, supply webs, editorial calendars. Adapts without losing sight of constraints and deadlines.',
  egyptianLore: 'Ancient calendars labeled the final Virgo span the Standard of Neith. Military quartermasters consulted her priests when staging supply caravans, since the decan emphasized stitching garrisons together with redundant caches.'
    }
  ],
  Libra: [
    {
      decan: 1,
      summary: 'Diplomatic, architectural, judicial, balancing.',
      elementalBlend: 'Cardinal air empowered by Order. Drafts treaties, bylaws, UI guidelines with surgical clarity. Initiates fairness by codifying it.',
  egyptianLore: "Egyptian legal texts tie this decan to Ma'at's feather on the scales. Court dockets show high-profile cases opened here so sentencing could be cited as aligned with cosmic calibration."
    },
    {
      decan: 2,
      summary: 'Harmonizing, gracious, persuasive, aesthetic.',
      elementalBlend: 'Cardinal air tuned to Prime. Channels Libra’s essential charm and aesthetic leadership. Kicks off collaborations with grace and beauty.',
  egyptianLore: 'Temple friezes of this decan depict Hathor and Horus renewing vows. Diplomats documented reciprocal gift exchanges and shared authorizations here to emphasize mutual accountability in treaties.'
    },
    {
      decan: 3,
      summary: 'Perceptive, empathic, restorative, discreet.',
      elementalBlend: 'Cardinal air braided with Void. Heightens perception, empathy, telepathic diplomacy. Initiates change through softness, allowing collective grief to surface safely.',
  egyptianLore: 'Ancient texts place the final Libra decan under veiled Isis. City ledgers record nighttime petition rounds for widows, orphans, and debtors so grievances were logged before tax rolls closed.'
    }
  ],
  Scorpio: [
    {
      decan: 1,
      summary: 'Secretive, protective, penetrating, therapeutic.',
      elementalBlend: 'Fixed water aligned with Void. Excels at containment—therapeutic vaults, investigative labs, sanctuaries. Transformation starts by listening without judgment.',
  egyptianLore: 'Egyptian calendars name this decan the Cavern of Anubis. Embalming manuals cite it as the preferred period for sealing tomb goods and reciting the heart-weighing liturgy in private.'
    },
    {
      decan: 2,
      summary: 'Discerning, intense, loyal, investigative.',
      elementalBlend: 'Fixed water channeling Prime. Keeps Scorpio anchored to its noble mission—pierce the veil only to empower trusted allies.',
  egyptianLore: 'The second Scorpio decan is dedicated to Serqet. Ritual notes describe antidote-infused beer shared during loyalty oaths to acknowledge both the venom and the cure she governs.'
    },
    {
      decan: 3,
      summary: 'Transformational, volcanic, relentless, cathartic.',
      elementalBlend: 'Fixed water merged with Chaos. Conducts controlled detonations: detox rituals, investigative exposés, shadow confrontations. Demolishes stagnation to reveal potency.',
  egyptianLore: 'Star clocks portray the last Scorpio decan as the Bennu bird. Temples scheduled bonfire rites and succession audits here to formalize the close of one era before installing the next.'
    }
  ],
  Sagittarius: [
    {
      decan: 1,
      summary: 'Adventurous, iconoclastic, restless, intrepid.',
      elementalBlend: 'Mutable fire charged with Chaos. Sends the Archer far beyond known frontiers. Experiments, pilgrimages, radical curriculum changes thrive here.',
  egyptianLore: 'Egyptian navigation logs tie this decan to Set’s desert storm and treat it as a launch window for long caravans. Captains annotated wind shifts and required backup guides before leaving the oases.'
    },
    {
      decan: 2,
      summary: 'Didactic, inspired, jubilant, expansive.',
      elementalBlend: 'Mutable fire carrying Prime. Keeps Sagittarius connected to faith, humor, meaning-making. Messages arrive as parables that ignite whole classrooms.',
  egyptianLore: 'This decan is associated with Amun’s concealed chapel at Karnak. Records show restricted oracles issued here to brief generals and governors before edicts were announced publicly.'
    },
    {
      decan: 3,
      summary: 'Mission-driven, organizing, visionary, pragmatic.',
      elementalBlend: 'Mutable fire braided with Core. Stabilizes zeal into curricula, travel plans, publishing schedules. Ensures big ideas land somewhere tangible.',
  egyptianLore: 'Ancient planners linked the final Sagittarius decan to Neith’s barque transporting campaign schematics. Engineering rolls specify this date for reviewing supply lines, quartermaster counts, and messenger routes.'
    }
  ],
  Capricorn: [
    {
      decan: 1,
      summary: 'Strategic, pragmatic, disciplined, initiating.',
      elementalBlend: 'Cardinal earth empowered by Core. Kicks off ventures with realistic budgets and accountability. Values measurable progress over hype.',
  egyptianLore: 'Egyptian chronicles match this decan with Khnum overseeing dam construction. Provincial archives mention governors depositing engineering diagrams at his altar before commissioning infrastructure.'
    },
    {
      decan: 2,
      summary: 'Authoritative, stoic, ceremonial, enduring.',
      elementalBlend: 'Cardinal earth carrying Prime. Radiates Capricorn’s pure authority—stoic, strategic, reliable. Launches policies, companies, traditions with gravitas.',
  egyptianLore: 'The second Capricorn decan is timed with ceremonies before the royal ka statue of Osiris. Coronation oaths, tax renewals, and military promotions were deliberately read under this star position for legitimacy.'
    },
    {
      decan: 3,
      summary: 'Administrative, procedural, enduring, executive.',
      elementalBlend: 'Cardinal earth coupled with Order. Excels at governance, compliance, iterative process. Builds institutions that survive leadership turnover.',
  egyptianLore: 'Old astronomers labeled the final Capricorn span the Archive of Thoth. Bureaucratic tablets specify this decan for copying canal levels, harvest quotas, and rulings into the master registers.'
    }
  ],
  Aquarius: [
    {
      decan: 1,
      summary: 'Innovative, systemic, reformist, anticipatory.',
      elementalBlend: 'Fixed air merged with Order. Loves schematics, civic tech, network governance. Optimizes without losing the rebellious Aquarian signature.',
  egyptianLore: 'Egyptian sky-priests named this decan the Net of Shu, depicting the beams that hold the sky apart. Engineering tablets say new irrigation valves and civic mechanisms were tested under this timing.'
    },
    {
      decan: 2,
      summary: 'Collective, electric, experimental, humanitarian.',
      elementalBlend: 'Fixed air channeling Prime. Keeps Aquarius tapped into its humanitarian heartbeat. Community experiments, DAOs, think tanks flourish because the vibe stays true.',
  egyptianLore: 'Temple writings merge the second Aquarius decan with Hapy, distributor of the Nile. Guild charters note that mutual-aid oaths and cooperative budgets were renewed here to ensure goods circulated evenly.'
    },
    {
      decan: 3,
      summary: 'Oracular, inclusive, visionary, liminal.',
      elementalBlend: 'Fixed air woven with Void. Amplifies intuition, remote collaboration, signal from the margins. Listens for what civilization will need next.',
  egyptianLore: 'Ancient astronomers tied the last Aquarius decan to Wepwawet the opener of the ways. Oracular logs describe trance councils beside canals where petitions from overlooked groups were copied into state scrolls.'
    }
  ],
  Pisces: [
    {
      decan: 1,
      summary: 'Oracular, compassionate, synesthetic, porous.',
      elementalBlend: 'Mutable water blended with Void. Dissolves ego so empathy can scan the whole field. Excellent for meditation, score-writing, compassionate analytics.',
  egyptianLore: 'Egyptian mystics linked this decan with the Fish of Abdu ferrying goods to Osiris. Pilgrimage notes describe model boats carrying linen petitions that were launched downstream to the temple landing.'
    },
    {
      decan: 2,
      summary: 'Hospitable, melodic, devotional, reassuring.',
      elementalBlend: 'Mutable water channeling Prime. Keeps Pisces authentic, gentle, miraculously organized when caring for others. Retells myths that remind everyone why compassion matters.',
  egyptianLore: 'This watch belongs to Anuket of the cataracts. Temple rosters mention reed coronations for sailors and recitations of navigational star lists before vessels left the southern harbors.'
    },
    {
      decan: 3,
      summary: 'Purging, surreal, mystical, redemptive.',
      elementalBlend: 'Mutable water infused with Chaos. Sparks spontaneous rituals, art therapy, final chapters. Dissolves what no longer serves and invites miracles to rush in.',
  egyptianLore: 'Star clocks portray the final decan as Sobek rising from the marsh. Ritual guides describe crocodile masks, river cleansings, and sworn protections for healers before flood season closed.'
    }
  ]
}

export function getDecanDescription(sign: string, decanIndex: number): DecanDescription | undefined {
  const entries = decanDescriptions[sign]
  if (!entries) return undefined
  return entries[decanIndex]
}
