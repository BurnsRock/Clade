# CLADE 🧬

**An evolutionary roguelike deckbuilder.** Play as a lineage: the deck is its genome, and gene cards power lethal fights against organisms and their environments.

## Play the demo

Clone the repository, start a local server, and open the browser:

```bash
git clone https://github.com/BurnsRock/Clade.git
cd Clade
python3 -m http.server 4173
```

Visit **http://localhost:4173**. No npm install or build is needed. The demo uses dependency-free browser ES modules and works as a static site.

## Features

- Choose from four kingdom groupings and eight playable classes, each with a distinct ten-card genome and a class signature gene.
- Pair any kingdom and class with either reproductive strategy; this prototype keeps taxonomy and reproduction independent.
- Class signature genes contribute inheritable traits such as Flight, Social Signaling, and Mycelial Network.
- Trait and gene prerequisites unlock advanced genes; newly unlocked trait genes are guaranteed to appear among the next reward choices.
- Ten enemies, from Spore Leech to the final Extinction Prime.
- Ten environmental hazards with distinct, telegraphed effects on both sides.
- Turn 0 preparation, telegraphed enemy intents, energy, block, toxin, healing, card draw, and exhaust.
- **Asexual Cell Division:** 1 Energy for a mostly identical offspring with occasional mutations.
- **Sexual Mating:** 2 Energy for an offspring with two recombined genes from a simulated partner pool.
- Reproduction can happen once per turn, generating up to three offspring choices in a generation.
- Error-Prone Replication raises mutation opportunities at a cost in HP and energy.
- Inherit a descendant genome and select an optional reward gene between generations.
- Trait-gated rewards such as Aerial Dive, Social Learning, Toolmaking, Spore Cloud, and Networked Defense.
- Gene prerequisites, including cognition-gated Protect Offspring for sexual lineages.
- Ten-generation campaign with a rising difficulty curve, victory, and extinction states.

## Architecture

`index.html` is the browser entry point; `style.css` is the responsive theme. The ES modules in `web/` are readable and directly editable:
- `web/content.js` defines gene cards, enemies, and environments.
- `web/engine.js` contains the deterministic, seedable, immutable game engine.
- `web/main.js` renders the interface and dispatches actions.

Run the automated Node test suite:

```bash
npm test
```

See `docs/DEMO_RULES.md` for the precise game rules and prototype limitations.

## Notes

This is a gameplay-first vertical slice, not a realistic evolutionary simulator. One encounter represents one generation. Kingdom and class are playable lineage presets; Protista is a loose prototype grouping. Reproductive strategy is deliberately independent of taxonomy, so every lineage can choose asexual or sexual reproduction. Reproduction is an innate action always available, rather than a random-draw card. A future version may unlock sexual reproduction through a boss relic. Branching speciation, larger gene pools, epigenetics, inherited objects, and cultural knowledge remain future extensions.
