export const TRAIT_LABELS = {
    armor: 'Armor',
    barrier: 'Cell Barrier',
    budding: 'Budding',
    care: 'Parental Care',
    cognition: 'Cognition',
    flight: 'Flight',
    manipulation: 'Manipulation',
    metabolism: 'Metabolism',
    mobility: 'Mobility',
    mutation: 'Mutation',
    network: 'Mycelial Network',
    photosynthesis: 'Photosynthesis',
    predation: 'Predation',
    recovery: 'Recovery',
    resin: 'Resin',
    social: 'Social Signaling',
    spores: 'Spore Production',
    toxin: 'Toxin',
    waterControl: 'Water Control'
};

export const CARDS = {
    strike: { id: 'strike', name: 'Cytoskeletal Strike', cost: 1, kind: 'attack', description: 'Deal 6 damage.', icon: '⚔', traits: ['predation'] },
    membrane: { id: 'membrane', name: 'Cell Membrane', cost: 1, kind: 'defense', description: 'Gain 7 Block.', icon: '⬡', traits: ['barrier'] },
    venom: { id: 'venom', name: 'Venom Secretion', cost: 1, kind: 'attack', description: 'Deal 3 damage. Apply 3 Toxin.', icon: '☣', traits: ['toxin'] },
    burst: { id: 'burst', name: 'Metabolic Burst', cost: 0, kind: 'utility', description: 'Gain 1 Energy. Draw 2 cards. Exhaust.', icon: '⚡', exhaust: true, traits: ['metabolism'] },
    regeneration: { id: 'regeneration', name: 'Regeneration', cost: 1, kind: 'utility', description: 'Heal 6 HP. Exhaust.', icon: '✚', exhaust: true, traits: ['recovery'] },
    osmoregulation: { id: 'osmoregulation', name: 'Osmoregulation', cost: 1, kind: 'defense', description: 'Gain 4 Block. Negate the next environmental effect.', icon: '◈', traits: ['waterControl'] },
    neural: { id: 'neural', name: 'Neural Signaling', cost: 1, kind: 'utility', description: 'Draw 2 cards. Counts as Cognition I.', icon: '◎', traits: ['cognition'] },
    mutagenesis: { id: 'mutagenesis', name: 'Error-Prone Replication', cost: 1, kind: 'utility', description: 'Your next offspring gains one extra mutation. Take 2 damage.', icon: '✧', traits: ['mutation'] },
    swiftStrike: { id: 'swiftStrike', name: 'Rapid Contraction', cost: 0, kind: 'attack', description: 'Deal 4 damage.', icon: '➶', traits: ['mobility', 'predation'] },
    hardShell: { id: 'hardShell', name: 'Reinforced Membrane', cost: 1, kind: 'defense', description: 'Gain 11 Block. Requires Cell Membrane.', icon: '⬢', requires: ['membrane'], traits: ['armor'] },
    cognitiveLeap: { id: 'cognitiveLeap', name: 'Neural Complexity', cost: 1, kind: 'utility', description: 'Draw 2. Gain 1 Energy. Counts as Cognition II.', icon: '✺', requires: ['neural'], traits: ['cognition'] },
    protectOffspring: { id: 'protectOffspring', name: 'Protect Offspring', cost: 1, kind: 'adaptation', description: 'Existing and future offspring gain +6 Max HP next generation. Requires Sexual Reproduction and two Cognition genes.', icon: '♡', requires: ['neural', 'cognitiveLeap'], requiresReproduction: 'sexual', traits: ['care'] },
    adaptiveMetabolism: { id: 'adaptiveMetabolism', name: 'Efficient Metabolism', cost: 1, kind: 'utility', description: 'Gain 2 Energy. Heal 2 HP. Exhaust.', icon: '❋', exhaust: true, traits: ['metabolism'] },

    parentalCare: { id: 'parentalCare', name: 'Parental Care', cost: 1, kind: 'defense', description: 'Gain 6 Block. Offspring gain +3 Max HP next generation.', icon: '♡', traits: ['care', 'social'] },
    chitinousWings: { id: 'chitinousWings', name: 'Chitinous Wings', cost: 1, kind: 'defense', description: 'Gain 8 Block.', icon: '🪽', traits: ['armor', 'flight'] },
    photosyntheticPulse: { id: 'photosyntheticPulse', name: 'Photosynthetic Pulse', cost: 1, kind: 'utility', description: 'Gain 1 Energy. Heal 3 HP.', icon: '☼', traits: ['metabolism', 'photosynthesis'] },
    resinousNeedles: { id: 'resinousNeedles', name: 'Resinous Needles', cost: 1, kind: 'defense', description: 'Gain 6 Block. Apply 2 Toxin.', icon: '🌲', traits: ['photosynthesis', 'resin'] },
    mycelialNetwork: { id: 'mycelialNetwork', name: 'Mycelial Network', cost: 1, kind: 'utility', description: 'Gain 5 Block. Draw 1 card.', icon: '🍄', traits: ['network', 'spores'] },
    buddingBurst: { id: 'buddingBurst', name: 'Budding Burst', cost: 0, kind: 'utility', description: 'Draw 2 cards. Exhaust.', icon: '🫧', exhaust: true, traits: ['budding'] },
    mixotrophicShift: { id: 'mixotrophicShift', name: 'Mixotrophic Shift', cost: 1, kind: 'utility', description: 'Gain 1 Energy. Heal 3 HP.', icon: '🦠', traits: ['metabolism', 'waterControl'] },
    toxicBloom: { id: 'toxicBloom', name: 'Toxic Bloom', cost: 1, kind: 'attack', description: 'Deal 4 damage. Apply 3 Toxin.', icon: '✨', traits: ['toxin'] },

    prehensileGrip: { id: 'prehensileGrip', name: 'Prehensile Grip', cost: 1, kind: 'defense', description: 'Gain 8 Block. Unlocks toolmaking genes.', icon: '✋', traits: ['manipulation'] },
    socialSignals: { id: 'socialSignals', name: 'Social Signals', cost: 1, kind: 'utility', description: 'Draw 2 cards. Unlocks social genes.', icon: '◉', traits: ['social'] },
    glidingMembrane: { id: 'glidingMembrane', name: 'Gliding Membrane', cost: 1, kind: 'defense', description: 'Gain 7 Block. Unlocks aerial genes.', icon: '🪽', traits: ['flight'] },
    sporeDispersal: { id: 'sporeDispersal', name: 'Spore Dispersal', cost: 1, kind: 'utility', description: 'Draw 2 cards. Unlocks spore genes.', icon: '✺', traits: ['spores'] },

    aerialDive: { id: 'aerialDive', name: 'Aerial Dive', cost: 2, kind: 'attack', description: 'Deal 12 damage. Requires Flight.', icon: '➶', requiresTraits: ['flight'], traits: ['mobility', 'predation'] },
    socialLearning: { id: 'socialLearning', name: 'Social Learning', cost: 1, kind: 'utility', description: 'Draw 3 cards. Requires Cognition and Social Signaling.', icon: '◎', requiresTraits: ['cognition', 'social'], traits: ['cognition', 'social'] },
    toolmaking: { id: 'toolmaking', name: 'Toolmaking', cost: 1, kind: 'adaptation', description: 'Deal 6 damage and gain 5 Block. Requires Cognition and Manipulation.', icon: '⚒', requiresTraits: ['cognition', 'manipulation'], traits: ['manipulation'] },
    sporeCloud: { id: 'sporeCloud', name: 'Spore Cloud', cost: 1, kind: 'attack', description: 'Deal 3 damage. Apply 4 Toxin. Requires Spore Production.', icon: '☣', requiresTraits: ['spores'], traits: ['spores', 'toxin'] },
    networkedDefense: { id: 'networkedDefense', name: 'Networked Defense', cost: 1, kind: 'adaptation', description: 'Gain 9 Block. Heal 3 HP. Requires Mycelial Network and Cognition.', icon: '♧', requiresTraits: ['network', 'cognition'], traits: ['network', 'recovery'] },
    cooperativeHunt: { id: 'cooperativeHunt', name: 'Cooperative Hunt', cost: 2, kind: 'attack', description: 'Deal 14 damage. Requires Predation and Social Signaling.', icon: '⚔', requiresTraits: ['predation', 'social'], traits: ['predation', 'social'] }
};

export const STARTING_GENOME = ['strike', 'strike', 'membrane', 'membrane', 'venom', 'burst', 'regeneration', 'osmoregulation', 'neural', 'mutagenesis'];

export const KINGDOMS = [
    { id: 'animalia', name: 'Animalia', icon: '🐾', description: 'Mobile feeders, predators, and swarms.' },
    { id: 'plantae', name: 'Plantae', icon: '🌿', description: 'Energy capture, water control, and durable tissues.' },
    { id: 'fungi', name: 'Fungi', icon: '🍄', description: 'Decomposition, spores, and rapid growth.' },
    { id: 'protista', name: 'Protista', icon: '🧫', description: 'A loose prototype group for single-celled eukaryotes.' }
];

export const LINEAGES = [
    { id: 'mammalia', kingdomId: 'animalia', className: 'Mammalia', commonName: 'Mammals', icon: '🫀', signatureCard: 'parentalCare', description: 'Parental care and neural signaling support protected, social lineages.', replacements: [{ from: 'membrane', to: 'parentalCare' }] },
    { id: 'insecta', kingdomId: 'animalia', className: 'Insecta', commonName: 'Insects', icon: '🪲', signatureCard: 'chitinousWings', description: 'Chitinous wings combine flight with a durable body plan.', replacements: [{ from: 'neural', to: 'swiftStrike' }, { from: 'regeneration', to: 'hardShell' }, { from: 'membrane', to: 'chitinousWings' }] },
    { id: 'magnoliopsida', kingdomId: 'plantae', className: 'Magnoliopsida', commonName: 'Flowering plants', icon: '🌼', signatureCard: 'photosyntheticPulse', description: 'Photosynthesis converts each turn into energy and recovery.', replacements: [{ from: 'neural', to: 'adaptiveMetabolism' }, { from: 'mutagenesis', to: 'regeneration' }, { from: 'membrane', to: 'photosyntheticPulse' }] },
    { id: 'pinopsida', kingdomId: 'plantae', className: 'Pinopsida', commonName: 'Conifers', icon: '🌲', signatureCard: 'resinousNeedles', description: 'Resinous needles defend the lineage and poison attackers.', replacements: [{ from: 'strike', to: 'osmoregulation' }, { from: 'neural', to: 'hardShell' }, { from: 'membrane', to: 'resinousNeedles' }] },
    { id: 'agaricomycetes', kingdomId: 'fungi', className: 'Agaricomycetes', commonName: 'Mushroom-forming fungi', icon: '🍄', signatureCard: 'mycelialNetwork', description: 'A mycelial network links defense, card flow, and spores.', replacements: [{ from: 'strike', to: 'venom' }, { from: 'neural', to: 'adaptiveMetabolism' }, { from: 'membrane', to: 'mycelialNetwork' }] },
    { id: 'saccharomycetes', kingdomId: 'fungi', className: 'Saccharomycetes', commonName: 'Yeasts', icon: '🫧', signatureCard: 'buddingBurst', description: 'Budding bursts cycle through the genome at high speed.', replacements: [{ from: 'strike', to: 'swiftStrike' }, { from: 'membrane', to: 'burst' }, { from: 'venom', to: 'buddingBurst' }] },
    { id: 'euglenophyceae', kingdomId: 'protista', className: 'Euglenophyceae', commonName: 'Euglenids', icon: '🦠', signatureCard: 'mixotrophicShift', description: 'Mixotrophy adapts energy use to changing conditions.', replacements: [{ from: 'strike', to: 'adaptiveMetabolism' }, { from: 'neural', to: 'osmoregulation' }, { from: 'membrane', to: 'mixotrophicShift' }] },
    { id: 'dinophyceae', kingdomId: 'protista', className: 'Dinophyceae', commonName: 'Dinoflagellates', icon: '✨', signatureCard: 'toxicBloom', description: 'Toxic blooms turn chemical defense into an offensive weapon.', replacements: [{ from: 'strike', to: 'venom' }, { from: 'membrane', to: 'mutagenesis' }, { from: 'osmoregulation', to: 'toxicBloom' }] }
];

export const lineageFor = id => LINEAGES.find(lineage => lineage.id === id) || LINEAGES[0];

export function startingGenomeFor(lineageId = 'mammalia') {
    const genome = [...STARTING_GENOME];
    for (const replacement of lineageFor(lineageId).replacements) {
        const index = genome.indexOf(replacement.from);
        if (index !== -1) genome[index] = replacement.to;
    }
    return genome;
}

export const MUTATION_POOL = [
    'strike', 'membrane', 'venom', 'burst', 'regeneration', 'osmoregulation', 'neural',
    'mutagenesis', 'swiftStrike', 'adaptiveMetabolism', 'prehensileGrip', 'socialSignals',
    'glidingMembrane', 'sporeDispersal'
];

export const MATE_POOL = [
    'venom', 'regeneration', 'osmoregulation', 'neural', 'swiftStrike', 'adaptiveMetabolism',
    'membrane', 'prehensileGrip', 'socialSignals', 'glidingMembrane', 'sporeDispersal'
];

export const REWARD_POOL = [
    'swiftStrike', 'hardShell', 'neural', 'cognitiveLeap', 'adaptiveMetabolism', 'protectOffspring',
    'venom', 'regeneration', 'membrane', 'prehensileGrip', 'socialSignals', 'glidingMembrane',
    'sporeDispersal', 'aerialDive', 'socialLearning', 'toolmaking', 'sporeCloud',
    'networkedDefense', 'cooperativeHunt'
];

export const ENEMIES = [
    {
        id: 'leech', name: 'Spore Leech', hp: 29, icon: '🪱', epithet: 'PARASITE',
        description: 'Poisons its victims, then feeds on their weakness.',
        moves: [
            { name: 'Infect', description: '6 damage + 2 Toxin', damage: 6, toxin: 2 },
            { name: 'Leech', description: '7 damage, heal 3', damage: 7, heal: 3 },
            { name: 'Lunge', description: '9 damage', damage: 9 }
        ]
    },
    {
        id: 'colony', name: 'Rival Colony', hp: 37, icon: '🦠', epithet: 'COMPETITOR',
        description: 'Swarm attacks backed by defensive adaptations.',
        moves: [
            { name: 'Swarm', description: '3 damage × 3', damage: 3, hits: 3 },
            { name: 'Fortify', description: 'Gain 8 Block', block: 8 },
            { name: 'Crush', description: '12 damage', damage: 12 }
        ]
    },
    {
        id: 'stalker', name: 'Marsh Stalker', hp: 46, icon: '🦎', epithet: 'PREDATOR',
        description: 'A relentless hunter with punishing heavy attacks.',
        moves: [
            { name: 'Rake', description: '11 damage', damage: 11 },
            { name: 'Stalk', description: 'Gain 8 Block', block: 8 },
            { name: 'Pounce', description: '16 damage', damage: 16 }
        ]
    },
    {
        id: 'glasswing', name: 'Glasswing Moth', hp: 53, icon: '🦋', epithet: 'AERIAL PREDATOR',
        description: 'A fast flier dodges attacks, then strikes in a flurry.',
        moves: [
            { name: 'Dive', description: '8 damage', damage: 8 },
            { name: 'Scatter', description: 'Gain 10 Block', block: 10 },
            { name: 'Razor Wings', description: '5 damage × 3', damage: 5, hits: 3 }
        ]
    },
    {
        id: 'carrionBloom', name: 'Carrion Bloom', hp: 61, icon: '🥀', epithet: 'RESOURCE COMPETITOR',
        description: 'A fungal bloom spreads toxins while absorbing nutrients.',
        moves: [
            { name: 'Spore Drip', description: '5 damage + 2 Toxin', damage: 5, toxin: 2 },
            { name: 'Overgrow', description: 'Gain 9 Block, heal 2', block: 9, heal: 2 },
            { name: 'Caustic Bloom', description: '12 damage + 2 Toxin', damage: 12, toxin: 2 }
        ]
    },
    {
        id: 'apex', name: 'Apex Devourer', hp: 72, icon: '🐊', epithet: 'APEX PREDATOR',
        description: 'A final predator combines poison, armor, and relentless force.',
        moves: [
            { name: 'Rending Bite', description: '11 damage + 2 Toxin', damage: 11, toxin: 2 },
            { name: 'Brace', description: 'Gain 12 Block', block: 12 },
            { name: 'Devour', description: '7 damage × 3, heal 4', damage: 7, hits: 3, heal: 4 }
        ]
    }
];

export const ENVIRONMENTS = [
    {
        id: 'hypoxia', name: 'Oxygen-Poor Swamp', icon: '🫧', subtitle: 'HYPOXIA',
        description: 'Every second combat turn: both combatants suffer 2 damage and next-turn Energy is reduced by 1.',
        quietIntent: 'No hazard this turn', hazardIntent: 'This turn: -2 HP to both; -1 next Energy',
        hazard: { firstRound: 2, every: 2, damage: 2, energyPenalty: 1 }
    },
    {
        id: 'flood', name: 'Flash Flood', icon: '🌊', subtitle: 'FLOOD',
        description: 'Every second combat turn: both combatants suffer 4 unblocked environmental damage.',
        quietIntent: 'Waters rising', hazardIntent: 'This turn: -4 HP to both',
        hazard: { firstRound: 2, every: 2, damage: 4 }
    },
    {
        id: 'drought', name: 'Severe Drought', icon: '☀', subtitle: 'DROUGHT',
        description: 'Every combat turn after the first: both combatants suffer 3 environmental damage. Healing is less effective.',
        quietIntent: 'Heat intensifying', hazardIntent: 'This turn: -3 HP to both',
        hazard: { firstRound: 2, every: 1, damage: 3, healingPenalty: 2 }
    },
    {
        id: 'canopy', name: 'Crowded Canopy', icon: '🌳', subtitle: 'CANOPY',
        description: 'Every second combat turn after the first: tangled growth deals 3 damage to both sides.',
        quietIntent: 'The canopy shifts', hazardIntent: 'This turn: -3 HP to both',
        hazard: { firstRound: 2, every: 2, damage: 3 }
    },
    {
        id: 'sporeRain', name: 'Sporefall', icon: '🍄', subtitle: 'SPOREFALL',
        description: 'Every second combat turn: spores add 2 Toxin to both combatants.',
        quietIntent: 'Spores gather in the air', hazardIntent: 'This turn: +2 Toxin to both',
        hazard: { firstRound: 2, every: 2, toxin: 2 }
    },
    {
        id: 'thermalVents', name: 'Thermal Vents', icon: '♨', subtitle: 'THERMAL VENTS',
        description: 'Every third combat turn: a heat pulse deals 5 damage to both sides and reduces next-turn Energy by 1.',
        quietIntent: 'The vents rumble', hazardIntent: 'This turn: -5 HP to both; -1 next Energy',
        hazard: { firstRound: 3, every: 3, damage: 5, energyPenalty: 1 }
    }
];

export const ENCOUNTERS = [
    { enemy: 'leech', environment: 'hypoxia' },
    { enemy: 'colony', environment: 'flood' },
    { enemy: 'stalker', environment: 'drought' },
    { enemy: 'glasswing', environment: 'canopy' },
    { enemy: 'carrionBloom', environment: 'sporeRain' },
    { enemy: 'apex', environment: 'thermalVents' }
];
