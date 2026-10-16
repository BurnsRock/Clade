import { CARDS, ENCOUNTERS, ENEMIES, ENVIRONMENTS, MATE_POOL, MUTATION_POOL, lineageFor, startingGenomeFor } from './content.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const copy=s=>structuredClone(s);
const roll=s=>((s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0)/4294967296);
const randomInt=(s,n)=>Math.floor(roll(s)*n);
function shuffle(s,array){const a=[...array];for(let i=a.length-1;i>0;i--){const j=randomInt(s,i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function log(s,t){s.log=[t,...s.log].slice(0,12);}
function draw(s,n){for(let i=0;i<n;i++){if(!s.drawPile.length){if(!s.discardPile.length)break;s.drawPile=shuffle(s,s.discardPile);s.discardPile=[];}s.hand.push(s.drawPile.pop());}}
function encounter(s){
 const def=ENEMIES.find(x=>x.id===ENCOUNTERS[s.generation-1].enemy);
 s.enemy={hp:def.hp,maxHp:def.hp,block:0,toxin:0};s.phase='battle';s.round=0;s.preparation=true;s.energy=3;s.energyPenalty=0;s.reproducedThisTurn=false;
 s.drawPile=shuffle(s,s.genePool);s.discardPile=[];s.hand=[];s.exhaustPile=[];s.offspring=[];s.pendingMutations=0;s.offspringProtection=0;s.hazardGuard=0;s.log=[];
 draw(s,4);log(s,`Generation ${s.generation}. Preparation: the enemy cannot act yet.`);return s;
}
export function startGame(mode,seed=Date.now(),lineageId='mammalia'){
 const lineage=lineageFor(lineageId);
 const s={seed:seed>>>0,phase:'battle',mode,lineageId:lineage.id,generation:1,round:0,preparation:true,energy:3,energyPenalty:0,reproducedThisTurn:false,
 player:{hp:70,maxHp:70,block:0,toxin:0},enemy:{hp:29,maxHp:29,block:0,toxin:0},
 genePool:startingGenomeFor(lineage.id).map((id,i)=>({id,uid:`g${i}`})),drawPile:[],discardPile:[],hand:[],exhaustPile:[],offspring:[],pendingMutations:0,offspringProtection:0,hazardGuard:0,rewards:[],log:[],nextUid:10,lossReason:''};
 return encounter(s);
}
export const currentLineage=s=>lineageFor(s.lineageId);
export const currentEnemy=s=>ENEMIES.find(x=>x.id===ENCOUNTERS[s.generation-1].enemy);
export const currentEnvironment=s=>ENVIRONMENTS.find(x=>x.id===ENCOUNTERS[s.generation-1].environment);
export function enemyIntent(s){
 const turn=(Math.max(s.round,1)-1)%3,id=currentEnemy(s).id;
 if(id==='leech')return [{name:'Infect',description:'6 damage + 2 Toxin',kind:'attack'},{name:'Leech',description:'7 damage, heal 3',kind:'attack'},{name:'Lunge',description:'9 damage',kind:'attack'}][turn];
 if(id==='colony')return [{name:'Swarm',description:'3 damage × 3',kind:'attack'},{name:'Fortify',description:'Gain 8 Block',kind:'defense'},{name:'Crush',description:'12 damage',kind:'attack'}][turn];
 return [{name:'Rake',description:'11 damage',kind:'attack'},{name:'Stalk',description:'Gain 8 Block',kind:'defense'},{name:'Pounce',description:'16 damage',kind:'attack'}][turn];
}
export function environmentIntent(s){
 if(s.preparation)return 'Dormant during preparation';
 const id=currentEnvironment(s).id;
 if(id==='hypoxia')return s.round%2===0?'This turn: -2 HP to both; -1 next Energy':'No hazard this turn';
 if(id==='flood')return s.round%2===0?'This turn: -4 HP to both':'Waters rising';
 return s.round>1?'This turn: -3 HP to both':'Heat intensifying';
}
const direct=(fighter,d)=>fighter.hp=Math.max(0,fighter.hp-d);
function hit(fighter,d){const block=Math.min(fighter.block,d);fighter.block-=block;direct(fighter,d-block);return d-block;}
function attack(s,d){log(s,`You deal ${hit(s.enemy,d)} damage (${d} attack).`);}
function lose(s,t){s.phase='lost';s.lossReason=t;log(s,t);}
function checkVictory(s){
 if(s.enemy.hp>0||s.phase!=='battle')return;
 if(!s.offspring.length)lose(s,'Enemy defeated, but the lineage produced no offspring. Extinction.');
 else{s.phase='offspring';log(s,`Enemy defeated! Choose one of ${s.offspring.length} offspring.`);}
}
function eligible(s,id){const c=CARDS[id];return (!c.requiresReproduction||c.requiresReproduction===s.mode)&&(c.requires||[]).every(req=>s.genePool.some(x=>x.id===req));}
export function canPlay(s,uid){
 if(s.phase!=='battle')return false;
 if(uid==='reproduction')return !s.reproducedThisTurn&&s.offspring.length<3&&s.energy>=(s.mode==='sexual'?2:1);
 const inst=s.hand.find(x=>x.uid===uid);if(!inst)return false;
 const c=CARDS[inst.id];return !(s.preparation&&c.kind==='attack')&&s.energy>=c.cost&&eligible(s,inst.id);
}
function mutate(s,g,changes){
 const i=randomInt(s,g.length),previous=g[i].id;
 const pool=MUTATION_POOL.filter(x=>x!==previous),next=pool[randomInt(s,pool.length)];
 g[i]={id:next,uid:`g${s.nextUid++}`};changes.push(`${CARDS[previous].name} → ${CARDS[next].name}`);
}
function makeOffspring(s){
 const genome=s.genePool.map(c=>({...c})),changes=[];
 if(s.mode==='sexual'){
  for(const index of shuffle(s,genome.map((_,i)=>i)).slice(0,2)){
   const before=genome[index].id,pool=MATE_POOL.filter(id=>id!==before),after=pool[randomInt(s,pool.length)];
   genome[index]={id:after,uid:`g${s.nextUid++}`};changes.push(`${CARDS[before].name} → ${CARDS[after].name} (recombined)`);
  }
 }else if(roll(s)<.12)mutate(s,genome,changes);
 for(let i=0;i<s.pendingMutations;i++)mutate(s,genome,changes);
 s.offspring.push({id:`offspring-${s.generation}-${s.offspring.length+1}`,genome,changes,hpBonus:s.offspringProtection});s.pendingMutations=0;
 log(s,`${s.mode==='sexual'?'Mating':'Cell Division'} produced candidate ${s.offspring.length}${changes.length?` (${changes.length} genetic changes)`:' (near-clone)'}.`);
}
export function play(before,uid){
 if(!canPlay(before,uid))return before;
 const s=copy(before);
 if(uid==='reproduction'){s.energy-=s.mode==='sexual'?2:1;s.reproducedThisTurn=true;makeOffspring(s);return s;}
 const index=s.hand.findIndex(x=>x.uid===uid),inst=s.hand.splice(index,1)[0],c=CARDS[inst.id];s.energy-=c.cost;log(s,`Expressed ${c.name}.`);
 switch(inst.id){
 case 'strike':attack(s,6);break;
 case 'swiftStrike':attack(s,4);break;
 case 'membrane':s.player.block+=7;break;
 case 'hardShell':s.player.block+=11;break;
 case 'venom':attack(s,3);s.enemy.toxin+=3;log(s,'Enemy gained 3 Toxin.');break;
 case 'burst':s.energy++;draw(s,2);break;
 case 'regeneration':s.player.hp=clamp(s.player.hp+(currentEnvironment(s).id==='drought'?4:6),0,s.player.maxHp);break;
 case 'osmoregulation':s.player.block+=4;s.hazardGuard++;break;
 case 'neural':draw(s,2);break;
 case 'cognitiveLeap':s.energy++;draw(s,2);break;
 case 'mutagenesis':s.pendingMutations++;direct(s.player,2);break;
 case 'adaptiveMetabolism':s.energy+=2;s.player.hp=clamp(s.player.hp+2,0,s.player.maxHp);break;
 case 'protectOffspring':s.offspringProtection+=6;s.offspring=s.offspring.map(o=>({...o,hpBonus:o.hpBonus+6}));break;
 }
 if(c.exhaust)s.exhaustPile.push(inst);else s.discardPile.push(inst);
 if(s.player.hp<=0)lose(s,'Your organism died before the lineage could continue.');else checkVictory(s);
 return s;
}
function enemyAct(s){
 if(s.enemy.hp<=0)return;
 const id=currentEnemy(s).id,t=(s.round-1)%3,strike=d=>log(s,`${currentEnemy(s).name} hits for ${hit(s.player,d)}.`);
 if(id==='leech'){
  if(t===0){strike(6);s.player.toxin+=2;log(s,'You gained 2 Toxin.');}
  else if(t===1){strike(7);s.enemy.hp=clamp(s.enemy.hp+3,0,s.enemy.maxHp);}else strike(9);
 }else if(id==='colony'){
  if(t===0){for(let i=0;i<3;i++)strike(3);}
  else if(t===1){s.enemy.block+=8;log(s,'The colony gains 8 Block.');}
  else strike(12);
 }else{
  if(t===0)strike(11);
  else if(t===1){s.enemy.block+=8;log(s,'The stalker gains 8 Block.');}
  else strike(16);
 }
}
function environmentAct(s){
 const id=currentEnvironment(s).id;
 let d=0;if(id==='hypoxia'&&s.round%2===0){d=2;s.energyPenalty=1;}
 else if(id==='flood'&&s.round%2===0)d=4;
 else if(id==='drought'&&s.round>1)d=3;
 if(!d)return;direct(s.enemy,d);
 if(s.hazardGuard>0){s.hazardGuard--;log(s,`Osmoregulation negated ${d} environmental damage.`);}
 else{direct(s.player,d);log(s,`${currentEnvironment(s).name} deals ${d} to both sides.`);}
}
export function endTurn(before){
 if(before.phase!=='battle')return before;
 const s=copy(before);s.discardPile.push(...s.hand);s.hand=[];
 if(s.preparation){s.preparation=false;s.round=1;log(s,'Preparation complete. Combat begins.');}
 else{
  if(s.player.toxin){direct(s.player,s.player.toxin);log(s,`Toxin deals ${s.player.toxin} to you.`);s.player.toxin=Math.max(0,s.player.toxin-1);}
  if(s.enemy.toxin){direct(s.enemy,s.enemy.toxin);log(s,`Toxin deals ${s.enemy.toxin} to the enemy.`);s.enemy.toxin=Math.max(0,s.enemy.toxin-1);}
  if(s.player.hp<=0){lose(s,'Your lineage succumbed to toxins.');return s;}
  if(s.enemy.hp>0)enemyAct(s);
  if(s.player.hp<=0){lose(s,'Your organism was killed in combat.');return s;}
  if(s.enemy.hp>0)environmentAct(s);
  if(s.player.hp<=0){lose(s,'The environment destroyed your last organism.');return s;}
  checkVictory(s);if(s.phase!=='battle')return s;
  s.round++;s.player.block=0;s.enemy.block=0;
 }
 s.energy=Math.max(1,3-s.energyPenalty);s.energyPenalty=0;s.reproducedThisTurn=false;draw(s,5);return s;
}
export function selectOffspring(before,id){
 if(before.phase!=='offspring')return before;
 const candidate=before.offspring.find(x=>x.id===id);if(!candidate)return before;
 const s=copy(before);s.genePool=candidate.genome.map(x=>({...x}));s.player.maxHp=70+candidate.hpBonus;
 s.player.hp=Math.min(s.player.maxHp,s.player.hp+20+candidate.hpBonus);s.player.block=0;s.player.toxin=0;
 if(s.generation===ENCOUNTERS.length){s.phase='won';log(s,'Three generations survived. Your lineage persists!');return s;}
 s.rewards=getRewards(s);s.phase='reward';return s;
}
export function getRewards(s){
 const pool=['swiftStrike','hardShell','cognitiveLeap','adaptiveMetabolism','protectOffspring','venom','regeneration','membrane'];
 return shuffle(s,pool.filter(id=>eligible(s,id))).slice(0,3);
}
export function chooseReward(before,id){
 if(before.phase!=='reward'||(id!=='skip'&&!before.rewards.includes(id)))return before;
 const s=copy(before);if(id!=='skip'){s.genePool.push({id,uid:`g${s.nextUid++}`});log(s,`Inherited new gene: ${CARDS[id].name}.`);}
 s.generation++;return encounter(s);
}
export const catalog=s=>s.genePool.map(x=>CARDS[x.id]);
