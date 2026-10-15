import test from 'node:test';
import assert from 'node:assert/strict';
import {STARTING_GENOME,ENCOUNTERS,ENEMIES,ENVIRONMENTS} from '../web/content.js';
import {startGame,play,endTurn,selectOffspring,chooseReward,canPlay,currentEnemy,currentEnvironment,getRewards} from '../web/engine.js';
test('ten cards plus innate reproduction',()=>{
 const s=startGame('asexual',42);
 assert.equal(STARTING_GENOME.length,10);
 assert.equal(s.genePool.length,10);
 assert.equal(s.hand.length,4);
 assert.equal(s.preparation,true);
 assert.equal(canPlay(s,'reproduction'),true);
});
test('three unique enemies and environments',()=>{
 assert.equal(ENCOUNTERS.length,3);
 assert.equal(new Set(ENCOUNTERS.map(x=>x.enemy)).size,3);
 assert.equal(new Set(ENCOUNTERS.map(x=>x.environment)).size,3);
 assert.equal(ENEMIES.length,3);assert.equal(ENVIRONMENTS.length,3);
});
test('division produces a candidate and consumes energy immutably',()=>{
 const s=startGame('asexual',42),n=play(s,'reproduction');
 assert.equal(n.offspring.length,1);assert.equal(n.energy,2);
 assert.equal(n.reproducedThisTurn,true);assert.equal(canPlay(n,'reproduction'),false);
 assert.equal(s.offspring.length,0);assert.equal(n.offspring[0].genome.length,10);
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
test('three generations win',()=>{
 let s=startGame('asexual',9);
 for(let gen=1;gen<=3;gen++){
 s.phase='offspring';s.offspring=[{id:'test',genome:s.genePool.map(x=>({...x})),changes:[],hpBonus:0}];
 s=selectOffspring(s,'test');if(gen<3)s=chooseReward(s,'skip');
 }
 assert.equal(s.phase,'won');assert.equal(s.generation,3);
});
test('hypoxic hazard hurts both despite block',()=>{
 let s=startGame('asexual',23);
 s.preparation=false;s.round=2;s.hand=[];s.discardPile=[];s.player.block=25;
 const hp=s.player.hp,enemyHp=s.enemy.hp;
 s=endTurn(s);
 assert.equal(s.player.hp,hp-2);assert.equal(s.enemy.hp,enemyHp-2);
 assert.equal(s.round,3);assert.equal(s.energy,2);
});
