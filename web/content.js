export const CARDS = {
    strike: { id: 'strike', name: 'Cytoskeletal Strike', cost: 1, kind: 'attack', description: 'Deal 6 damage.', icon: '⚔' },
    membrane: { id: 'membrane', name: 'Cell Membrane', cost: 1, kind: 'defense', description: 'Gain 7 Block.', icon: '⬡' },
    venom: { id: 'venom', name: 'Venom Secretion', cost: 1, kind: 'attack', description: 'Deal 3 damage. Apply 3 Toxin.', icon: '☣' },
    burst: { id: 'burst', name: 'Metabolic Burst', cost: 0, kind: 'utility', description: 'Gain 1 Energy. Draw 2 cards. Exhaust.', icon: '⚡', exhaust: true },
    regeneration: { id: 'regeneration', name: 'Regeneration', cost: 1, kind: 'utility', description: 'Heal 6 HP. Exhaust.', icon: '✚', exhaust: true },
    osmoregulation: { id: 'osmoregulation', name: 'Osmoregulation', cost: 1, kind: 'defense', description: 'Gain 4 Block. Negate the next environmental damage.', icon: '◈' },
    neural: { id: 'neural', name: 'Neural Signaling', cost: 1, kind: 'utility', description: 'Draw 2 cards. Counts as Cognition I.', icon: '◎', tags: ['cognition'] },
    mutagenesis: { id: 'mutagenesis', name: 'Error-Prone Replication', cost: 1, kind: 'utility', description: 'Your next offspring gains one extra mutation. Take 2 damage.', icon: '✧' },
    swiftStrike: { id: 'swiftStrike', name: 'Rapid Contraction', cost: 0, kind: 'attack', description: 'Deal 4 damage.', icon: '➶' },
    hardShell: { id: 'hardShell', name: 'Reinforced Membrane', cost: 1, kind: 'defense', description: 'Gain 11 Block. Requires Cell Membrane.', icon: '⬢', requires: ['membrane'] },
    cognitiveLeap: { id: 'cognitiveLeap', name: 'Neural Complexity', cost: 1, kind: 'utility', description: 'Draw 2. Gain 1 Energy. Counts as Cognition II.', icon: '✺', tags: ['cognition'], requires: ['neural'] },
    protectOffspring: { id: 'protectOffspring', name: 'Protect Offspring', cost: 1, kind: 'adaptation', description: 'Existing and future offspring gain +6 Max HP next generation. Requires Sexual Reproduction and two Cognition genes.', icon: '♡', requires: ['neural', 'cognitiveLeap'], requiresReproduction: 'sexual' },
    adaptiveMetabolism: { id: 'adaptiveMetabolism', name: 'Efficient Metabolism', cost: 1, kind: 'utility', description: 'Gain 2 Energy. Heal 2 HP. Exhaust.', icon: '❋', exhaust: true }
};
export const STARTING_GENOME = ['strike', 'strike', 'membrane', 'membrane', 'venom', 'burst', 'regeneration', 'osmoregulation', 'neural', 'mutagenesis'];
export const MUTATION_POOL = ['strike', 'membrane', 'venom', 'burst', 'regeneration', 'osmoregulation', 'neural', 'mutagenesis', 'swiftStrike', 'adaptiveMetabolism'];
export const MATE_POOL = ['venom', 'regeneration', 'osmoregulation', 'neural', 'swiftStrike', 'adaptiveMetabolism', 'membrane'];
export const ENEMIES = [
    { id: 'leech', name: 'Spore Leech', hp: 29, icon: '🪱', epithet: 'PARASITE', description: 'Poisons its victims, then feeds on their weakness.' },
    { id: 'colony', name: 'Rival Colony', hp: 37, icon: '🦠', epithet: 'COMPETITOR', description: 'Swarm attacks backed by defensive adaptations.' },
    { id: 'stalker', name: 'Marsh Stalker', hp: 46, icon: '🦎', epithet: 'PREDATOR', description: 'A relentless hunter with punishing heavy attacks.' }
];
export const ENVIRONMENTS = [
    { id: 'hypoxia', name: 'Oxygen-Poor Swamp', icon: '🫧', subtitle: 'HYPOXIA', description: 'Every second combat turn: both combatants suffer 2 damage and next-turn Energy is reduced by 1.' },
    { id: 'flood', name: 'Flash Flood', icon: '🌊', subtitle: 'FLOOD', description: 'Every second combat turn: both combatants suffer 4 unblocked environmental damage.' },
    { id: 'drought', name: 'Severe Drought', icon: '☀', subtitle: 'DROUGHT', description: 'Every combat turn after the first: both combatants suffer 3 environmental damage. Healing is less effective.' }
];
export const ENCOUNTERS = [
    { enemy: 'leech', environment: 'hypoxia' },
    { enemy: 'colony', environment: 'flood' },
    { enemy: 'stalker', environment: 'drought' }
];
