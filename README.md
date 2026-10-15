# CLADE 🧬

**An evolutionary roguelike deckbuilder.** Play as a lineage: the deck is its genome, and gene cards power lethal fights against organisms and their environments.

## Demo

- 10 starting gene cards
- 3 enemies: Spore Leech, Rival Colony, and Marsh Stalker
- 3 environmental hazards: Oxygen-Poor Swamp, Flash Flood, and Severe Drought
- Preparation phase, card draw, energy, poison, block, and enemy intents
- Asexual Cell Division and sexual Mating, each innate and usable once per turn
- Up to three offspring per generation, mutation/recombination, and successor selection
- Three-generation playable run with inheritance choices and gene prerequisites

## Run

This prototype uses standard browser ES modules. From the repository directory:

```bash
python3 -m http.server 4173
```

Open **http://localhost:4173**.

The browser entry point is `index.html`, with compiled scripts in `web/`. The main source of truth is the TypeScript source in `src/`.

## Development

```bash
npm install
npm run build
npm test
```

The rules and limitations of the prototype are in `docs/DEMO_RULES.md`. This is a deliberately small vertical slice, not a full release.
