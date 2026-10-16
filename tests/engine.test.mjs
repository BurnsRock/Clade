import test from 'node:test';
import assert from 'node:assert/strict';
import {CARDS,ENCOUNTERS,ENEMIES,ENVIRONMENTS,KINGDOMS,LINEAGES,MATE_POOL,MUTATION_POOL,REWARD_POOL,STARTING_GENOME,TRAIT_LABELS,startingGenomeFor} from '../web/content.js';
import {startGame,play,endTurn,selectOffspring,chooseReward,canPlay,currentEnemy,currentEnvironment,currentTraits,enemyIntent,environmentIntent,getRewards,isCardUnlocked,pruneInvalidGenes} from '../web/engine.js';
test('ten cards plus innate reproduction',()=>{
 const s=startGame('asexual',42);
 assert.equal(STARTING_GENOME.length,10);
 assert.equal(s.genePool.length,10);
 assert.equal(s.hand.length,4);
 assert.equal(s.preparation,true);
 assert.equal(canPlay(s,'reproduction'),true);
});
test('kingdom and class choices each start with a distinct ten-card genome',()=>{
 assert.equal(KINGDOMS.length,4);
 assert.equal(LINEAGES.length,8);
 const genomes=LINEAGES.map(lineage=>startingGenomeFor(lineage.id));
 for(const genome of genomes)assert.equal(genome.length,10);
 assert.equal(new Set(genomes.map(genome=>genome.join(','))).size,LINEAGES.length);
 for(const lineage of LINEAGES)assert.ok(startingGenomeFor(lineage.id).includes(lineage.signatureCard));
 assert.notDeepEqual(startingGenomeFor('mammalia'),STARTING_GENOME);
});
test('every lineage can pair with either reproductive strategy',()=>{
 for(const lineage of LINEAGES){
  for(const mode of ['asexual','sexual']){
   const s=startGame(mode,51,lineage.id);
   assert.equal(s.lineageId,lineage.id);
   assert.equal(canPlay(s,'reproduction'),true,`${lineage.className} should allow ${mode} reproduction`);
  }
 }
});
test('class signature genes pass their traits to the lineage',()=>{
 for(const lineage of LINEAGES){
  const s=startGame('asexual',57,lineage.id),signature=CARDS[lineage.signatureCard];
  assert.ok(s.genePool.some(g=>g.id===lineage.signatureCard));
  assert.ok(signature.traits.some(trait=>currentTraits(s).includes(trait)),`${lineage.className} should inherit a signature trait`);
 }
});
test('six unique enemies and environments',()=>{
 assert.equal(ENCOUNTERS.length,6);
 assert.equal(new Set(ENCOUNTERS.map(x=>x.enemy)).size,6);
 assert.equal(new Set(ENCOUNTERS.map(x=>x.environment)).size,6);
 assert.equal(ENEMIES.length,6);assert.equal(ENVIRONMENTS.length,6);
});
test('gene and encounter catalogs have no dangling references',()=>{
 const ids=new Set(Object.keys(CARDS));
 for(const [id,card] of Object.entries(CARDS)){
  for(const required of card.requires||[])assert.ok(ids.has(required),`${id} requires unknown gene ${required}`);
  for(const trait of [...(card.traits||[]),...(card.requiresTraits||[])])assert.ok(TRAIT_LABELS[trait],`${id} uses unlabeled trait ${trait}`);
 }
 for(const id of [...MATE_POOL,...MUTATION_POOL,...REWARD_POOL])assert.ok(ids.has(id),`Pool references unknown gene ${id}`);
 for(const lineage of LINEAGES)assert.ok(ids.has(lineage.signatureCard),`${lineage.className} has an unknown signature gene`);
 for(const encounter of ENCOUNTERS){
  assert.ok(ENEMIES.some(enemy=>enemy.id===encounter.enemy),`Unknown enemy ${encounter.enemy}`);
  assert.ok(ENVIRONMENTS.some(environment=>environment.id===encounter.environment),`Unknown environment ${encounter.environment}`);
 }
});
test('division produces a candidate and consumes energy immutably',()=>{
 const s=startGame('asexual',42),n=play(s,'reproduction');
 assert.equal(n.offspring.length,1);assert.equal(n.energy,2);
 assert.equal(n.reproducedThisTurn,true);assert.equal(canPlay(n,'reproduction'),false);
 assert.equal(s.offspring.length,0);assert.equal(n.offspring[0].genome.length,10);
});
test('offspring lose only genes whose prerequisite gene was lost',()=>{
 const result=pruneInvalidGenes([{id:'hardShell',uid:'shell'},{id:'strike',uid:'strike'}],'asexual');
 assert.deepEqual(result.genePool.map(g=>g.id),['strike']);
 assert.equal(result.removed.length,1);
 assert.deepEqual(result.removed[0].requirements,['Cell Membrane']);
});
test('a mutation that removes Cell Membrane also removes Reinforced Membrane',()=>{
 const s=startGame('asexual',1);
 s.seed=1;s.genePool=[{id:'membrane',uid:'base'},{id:'hardShell',uid:'advanced'}];s.pendingMutations=1;
 const offspring=play(s,'reproduction').offspring[0];
 assert.equal(offspring.genome.some(g=>g.id==='hardShell'),false);
 assert.ok(offspring.changes.some(change=>change==='Reinforced Membrane removed (lost Cell Membrane).'));
});
test('trait-dependent genes cannot satisfy their own missing prerequisite',()=>{
 const unsupported=pruneInvalidGenes([{id:'sporeCloud',uid:'cloud'}],'asexual');
 assert.deepEqual(unsupported.genePool,[]);
 assert.deepEqual(unsupported.removed[0].requirements,['Spore Production']);

 const supported=pruneInvalidGenes([{id:'sporeCloud',uid:'cloud'},{id:'sporeDispersal',uid:'source'}],'asexual');
 assert.deepEqual(supported.genePool.map(g=>g.id),['sporeCloud','sporeDispersal']);
 assert.deepEqual(supported.removed,[]);
});
test('mating costs 2 and recombines two genes',()=>{
 const n=play(startGame('sexual',43),'reproduction');
 assert.equal(n.energy,1);assert.equal(n.offspring.length,1);
 assert.equal(n.offspring[0].changes.length,2);
});
test('up to three offspring across later turns',()=>{
 let s=startGame('asexual',19);
 s=play(s,'reproduction');s=endTurn(s);
 s=play(s,'reproduction');s=endTurn(s);
 s=play(s,'reproduction');
 assert.equal(s.offspring.length,3);
 s=endTurn(s);assert.equal(canPlay(s,'reproduction'),false);
});
test('killing without reproduction means extinction',()=>{
 let s=startGame('asexual',6);s.preparation=false;s.enemy.hp=5;s.hand=[{id:'strike',uid:'manual'}];
 s=play(s,'manual');assert.equal(s.phase,'lost');assert.match(s.lossReason,/no offspring/i);
});
test('kill after mating allows successor selection',()=>{
 let s=startGame('sexual',2);s=play(s,'reproduction');
 s.preparation=false;s.enemy.hp=3;s.hand=[{id:'strike',uid:'manual'}];
 s=play(s,'manual');assert.equal(s.phase,'offspring');
 s=selectOffspring(s,s.offspring[0].id);assert.equal(s.phase,'reward');
 assert.equal(s.genePool.length,10);
 s=chooseReward(s,'skip');assert.equal(s.phase,'battle');
 assert.equal(s.generation,2);assert.equal(currentEnemy(s).id,'colony');
 assert.equal(currentEnvironment(s).id,'flood');
});
test('Protect Offspring is gated on sex and cognition',()=>{
 const asx=startGame('asexual',7),sex=startGame('sexual',7);
 assert.equal(getRewards(asx).includes('protectOffspring'),false);
 assert.equal(getRewards(sex).includes('protectOffspring'),false);
 sex.genePool.push({id:'cognitiveLeap',uid:'extra'});
 let found=false;
 for(let seed=1;seed<31;seed++){sex.seed=seed;if(getRewards(sex).includes('protectOffspring'))found=true;}
 assert.equal(found,true);
});
test('inherited traits unlock advanced genes and surface them in rewards',()=>{
 const mammal=startGame('sexual',91,'mammalia');
 assert.ok(currentTraits(mammal).includes('social'));
 assert.equal(isCardUnlocked(mammal,'socialLearning'),true);
 assert.equal(isCardUnlocked(mammal,'cooperativeHunt'),true);
 assert.ok(getRewards(mammal).some(id=>CARDS[id].requiresTraits?.length));

 const insect=startGame('asexual',92,'insecta');
 assert.equal(isCardUnlocked(insect,'aerialDive'),true);
 const fungus=startGame('asexual',93,'agaricomycetes');
 assert.equal(isCardUnlocked(fungus,'sporeCloud'),true);
 assert.equal(isCardUnlocked(fungus,'networkedDefense'),false);
 fungus.genePool.push({id:'neural',uid:'trait-test-neural'});
 assert.equal(isCardUnlocked(fungus,'networkedDefense'),true);
});
test('class signature cards have playable effects',()=>{
 const s=startGame('asexual',94,'mammalia');
 s.hand=[{id:'parentalCare',uid:'signature'}];
 const next=play(s,'signature');
 assert.equal(next.player.block,6);
 assert.equal(next.offspringProtection,3);
 assert.equal(s.offspringProtection,0);
});
test('new enemies telegraph their own move patterns',()=>{
 const s=startGame('asexual',95);
 s.generation=4;s.round=1;
 assert.equal(currentEnemy(s).id,'glasswing');
 assert.equal(enemyIntent(s).name,'Dive');
 s.round=3;
 assert.equal(enemyIntent(s).name,'Razor Wings');
});
test('enemy block lasts through the next player turn',()=>{
 let s=startGame('asexual',96);
 s.generation=2;s.preparation=false;s.round=2;s.hand=[];s.discardPile=[];
 s=endTurn(s);
 assert.equal(s.enemy.block,8);
});
test('sporefall applies toxin to both organisms on its telegraphed turn',()=>{
 let s=startGame('asexual',97);
 s.generation=5;s.preparation=false;s.round=2;s.hand=[];s.discardPile=[];
 assert.match(environmentIntent(s),/Toxin/);
 s=endTurn(s);
 assert.equal(s.player.toxin,2);
 assert.equal(s.enemy.toxin,2);
});
test('six generations win',()=>{
 let s=startGame('asexual',9);
 for(let gen=1;gen<=ENCOUNTERS.length;gen++){
 s.phase='offspring';s.offspring=[{id:'test',genome:s.genePool.map(x=>({...x})),changes:[],hpBonus:0}];
 s=selectOffspring(s,'test');if(gen<ENCOUNTERS.length)s=chooseReward(s,'skip');
 }
 assert.equal(s.phase,'won');assert.equal(s.generation,ENCOUNTERS.length);
});
test('hypoxic hazard hurts both despite block',()=>{
 let s=startGame('asexual',23);
 s.preparation=false;s.round=2;s.hand=[];s.discardPile=[];s.player.block=25;
 const hp=s.player.hp,enemyHp=s.enemy.hp;
 s=endTurn(s);
 assert.equal(s.player.hp,hp-2);assert.equal(s.enemy.hp,enemyHp-2);
 assert.equal(s.round,3);assert.equal(s.energy,2);
});
