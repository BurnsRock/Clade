import {CARDS} from './content.js';
import {canPlay,chooseReward,currentEnemy,currentEnvironment,endTurn,enemyIntent,environmentIntent,play,selectOffspring,startGame} from './engine.js';
const root=document.querySelector('#app');let state=null,selectedMode='asexual',showGenome=false;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=(n,max)=>Math.max(0,Math.min(100,n/max*100))+'%';
const hpBar=(label,value,max,color)=>`<div class="meter"><div class="meter-label"><span>${label}</span><strong>${value} / ${max}</strong></div><div class="track"><div class="fill ${color}" style="width:${pct(value,max)}"></div></div></div>`;
const badge=(name,text)=>`<span class="status-chip"><strong>${name}</strong> ${text}</span>`;
function cardMarkup(uid,id,disabled=false){
 const c=CARDS[id];return `<button type="button" class="gene-card ${c.kind} ${disabled?'disabled':''}" data-action="play" data-uid="${esc(uid)}" ${disabled?'disabled':''} title="${esc(c.description)}">
 <div class="card-heading"><span class="energy-cost">${c.cost}</span><span class="card-icon">${c.icon}</span></div>
 <div class="card-core"><div class="gene-name">${esc(c.name)}</div><p>${esc(c.description)}</p></div>
 <span class="gene-category">${c.kind.toUpperCase()}${c.exhaust?' · EXHAUST':''}</span></button>`;
}
function menu(){root.innerHTML=`<main class="intro-screen"><div class="ambient orb-one"></div><div class="ambient orb-two"></div><div class="intro-content">
 <p class="eyebrow">AN EXPERIMENT IN NATURAL SELECTION</p><h1>CLA<span>DE</span><sup>α</sup></h1>
 <p class="hero-line">The genome is your deck.<br/>The enemy is extinction.</p>
 <p class="hero-copy">Express genes. Fight biological rivals. Reproduce before victory. Choose which offspring carries your lineage to the next generation.</p>
 <div class="setup-card"><p class="eyebrow">SELECT REPRODUCTIVE STRATEGY</p><div class="mode-grid">
 <button data-action="mode" data-mode="asexual" class="mode-option ${selectedMode==='asexual'?'selected':''}"><span class="mode-symbol">◎</span><strong>Asexual</strong><small>Cell Division · 1 Energy</small><span>Reliable near-clones. Use mutation to diversify.</span></button>
 <button data-action="mode" data-mode="sexual" class="mode-option ${selectedMode==='sexual'?'selected':''}"><span class="mode-symbol">∞</span><strong>Sexual</strong><small>Mating · 2 Energy</small><span>Recombine genes with a partner. More varied descendants.</span></button></div>
 <button class="primary-btn wide" data-action="start">BEGIN EVOLUTION <span>↗</span></button></div>
 <p class="intro-footer">10 starting gene cards · 3 generations · 3 enemies · 3 environments</p></div></main>`;}
function topBar(s){return `<header class="topbar"><div class="logo">CLA<span>DE</span><sup>α</sup></div>
 <div class="top-stat"><small>GENERATION</small><strong>${String(s.generation).padStart(2,'0')} <em>/ 03</em></strong></div>
 <div class="top-stat"><small>REPRODUCTION</small><strong>${s.mode==='sexual'?'∞ SEXUAL':'◎ ASEXUAL'}</strong></div>
 <div class="top-actions"><button class="ghost-btn" data-action="genome">${showGenome?'HIDE':'VIEW'} GENOME <span>(${s.genePool.length})</span></button>
 <button class="ghost-btn danger-text" data-action="restart">↻ NEW RUN</button></div></header>`;}
function environmentPanel(s){const e=currentEnvironment(s);return `<section class="environment-banner"><div class="env-icon">${e.icon}</div><div class="env-main"><span class="eyebrow">ENVIRONMENTAL PRESSURE · ${e.subtitle}</span><h2>${e.name}</h2><p>${e.description}</p></div>
 <div class="env-next"><small>NEXT EFFECT</small><strong>${environmentIntent(s)}</strong></div></section>`;}
function arena(s){
 const enemy=currentEnemy(s),intent=enemyIntent(s);
 return `<section class="arena">
 <div class="combatant hero-fighter"><div class="combatant-heading"><span class="eyebrow">YOUR LINEAGE</span><span class="creature-type">PRIMORDIAL ORGANISM</span></div>
 <div class="creature-glow friendly"><span>🧫</span></div><div class="fighter-name">Protoform ${String(s.generation).padStart(2,'0')}</div>
 ${hpBar('VIABILITY',s.player.hp,s.player.maxHp,'friendly-fill')}<div class="status-row">${badge('⬡',s.player.block+' Block')}${s.player.toxin?badge('☣',s.player.toxin+' Toxin'):''}${s.hazardGuard?badge('◈',s.hazardGuard+' Resist'):''}</div></div>
 <div class="versus"><span>VS</span><div class="combat-divider"></div><small>GEN ${s.generation}</small></div>
 <div class="combatant hostile-fighter"><div class="combatant-heading"><span class="eyebrow">${enemy.epithet}</span><span class="creature-type">LETHAL ENCOUNTER</span></div>
 <div class="creature-glow hostile"><span>${enemy.icon}</span></div><div class="fighter-name">${enemy.name}</div>${hpBar('VITALITY',s.enemy.hp,s.enemy.maxHp,'enemy-fill')}
 <div class="status-row">${badge('⬡',s.enemy.block+' Block')}${s.enemy.toxin?badge('☣',s.enemy.toxin+' Toxin'):''}</div>
 <div class="intent"><span class="eyebrow">${s.preparation?'AWAITING COMBAT':'ENEMY INTENT'}</span><strong>${s.preparation?'Preparing…':intent.name}</strong>
 <small>${s.preparation?'No enemy action this turn':intent.description}</small></div></div></section>`;
}
function reproductionCard(s){
 const sexual=s.mode==='sexual',cost=sexual?2:1,disabled=!canPlay(s,'reproduction');
 return `<button type="button" class="gene-card reproduction ${disabled?'disabled':''}" data-action="play" data-uid="reproduction" ${disabled?'disabled':''}>
 <div class="card-heading"><span class="energy-cost">${cost}</span><span class="card-icon">${sexual?'∞':'◎'}</span></div>
 <div class="card-core"><div class="gene-name">${sexual?'Mating':'Cell Division'}</div><p>${sexual?'Recombine your genome. Produce an offspring candidate.':'Produce a near-clone. Small chance of spontaneous mutation.'}</p></div>
 <span class="gene-category">INNATE · RETAIN · 1 / TURN</span></button>`;
}
function genomeOverlay(s){
 if(!showGenome)return '';const groups={};for(const x of s.genePool)groups[x.id]=(groups[x.id]||0)+1;
 return `<div class="genome-overlay"><div class="genome-title"><h3>Current Genome · ${s.genePool.length} cards</h3><button data-action="genome" class="ghost-btn">CLOSE ×</button></div>
 <div class="genome-list">${Object.entries(groups).map(([id,n])=>`<div><span>${CARDS[id].icon} ${CARDS[id].name}</span><strong>×${n}</strong></div>`).join('')}</div></div>`;
}
function battle(s){
 const earned=s.offspring.length;
 root.innerHTML=`<div class="game-shell">${topBar(s)}<main class="game-main">${environmentPanel(s)}${arena(s)}
 <div class="turn-info"><div><span class="phase-tag">${s.preparation?'TURN 0 · PREPARATION':`TURN ${s.round} · COMBAT`}</span>
 <span class="eyebrow">${s.preparation?'SET UP YOUR GENES BEFORE THE ENEMY ATTACKS':'PLAY GENES, THEN END YOUR TURN'}</span></div>
 <div class="energy-orb"><span>ϟ</span> ${s.energy}<small> / 3 ENERGY</small></div></div>
 <div class="combat-bottom"><div class="hand-area"><div class="section-head"><h3>EXPRESSED GENES <span class="muted">· HAND</span></h3>
 <div class="hand-subtitle">${s.hand.length} cards · ${s.drawPile.length} draw · ${s.discardPile.length} discard · ${s.exhaustPile.length} exhaust</div></div>
 <div class="cards-row">${reproductionCard(s)}${s.hand.map(c=>cardMarkup(c.uid,c.id,!canPlay(s,c.uid))).join('')}</div>
 <div class="combat-actions"><div class="reproduction-meter"><span>OFFSPRING</span><strong>${'◆ '.repeat(earned)}${'◇ '.repeat(3-earned)}</strong>
 <small>${earned} / 3 candidates · ${s.pendingMutations} mutations queued</small></div>
 <button class="primary-btn" data-action="end">${s.preparation?'BEGIN COMBAT':'END TURN'} →</button></div></div>
 <aside class="combat-log"><div class="section-head"><h3>EVOLUTION LOG</h3></div>
 <div class="log-list">${s.log.map((t,i)=>`<p class="${i===0?'latest':''}">${esc(t)}</p>`).join('')}</div>
 <div class="rules-callout"><strong>Survival rule</strong><p>Defeat your enemy <em>and</em> produce at least one offspring. Only then can your lineage advance.</p></div></aside></div>${genomeOverlay(s)}</main>
 <footer class="site-footer">CLADE · GENOME BUILDER PROTOTYPE <span>⟁</span> SCIENCE-INSPIRED, GAMEPLAY-FIRST</footer></div>`;
}
function offspringPhase(s){
 return `<div class="game-shell">${topBar(s)}<main class="phase-page"><p class="eyebrow">GENERATION ${s.generation} COMPLETE</p>
 <h1>Natural selection has spoken.</h1><p class="phase-lead">Your opponent has fallen. Choose which descendant inherits the lineage.</p>
 <div class="offspring-grid">${s.offspring.map((o,i)=>`<div class="offspring-tile"><div class="offspring-avatar">${['◉','◈','✧'][i]}</div>
 <span class="eyebrow">CANDIDATE 0${i+1}</span><h3>Offspring ${String.fromCharCode(65+i)}</h3>
 <p>${o.genome.length} inherited genes ${o.hpBonus?`· +${o.hpBonus} next-gen Max HP`:''}</p>
 <ul>${o.changes.length?o.changes.map(c=>`<li>${esc(c)}</li>`).join(''):'<li>No genetic changes. Genome preserved.</li>'}</ul>
 <button class="secondary-btn" data-action="offspring" data-id="${o.id}">CONTINUE THIS LINEAGE →</button></div>`).join('')}</div>
 <div class="phase-note">${s.mode==='sexual'?'Sexual reproduction recombines genes with a compatible partner.':'Asexual reproduction preserves the genome unless mutation occurs.'}</div>
 </main></div>`;
}
function rewardPhase(s){return `<div class="game-shell">${topBar(s)}<main class="phase-page">
 <p class="eyebrow">EVOLUTIONARY OPPORTUNITY</p><h1>One gene takes root.</h1>
 <p class="phase-lead">Add a gene to your inherited genome, or skip to keep the deck lean. Advanced genes require their prerequisite genes.</p>
 <div class="reward-grid">${s.rewards.map(id=>`<div class="reward-tile"><span class="reward-icon">${CARDS[id].icon}</span><h3>${CARDS[id].name}</h3><p>${CARDS[id].description}</p>
 <div class="reward-type">${CARDS[id].kind} · ${CARDS[id].cost} Energy</div>
 <button class="secondary-btn" data-action="reward" data-id="${id}">INHERIT THIS GENE ↗</button></div>`).join('')}</div>
 <button class="subtle-btn" data-action="reward" data-id="skip">SKIP GENE REWARD →</button></main></div>`;}
function endScreen(s){return `<div class="game-shell">${topBar(s)}<main class="ending"><div class="ending-sigil">${s.phase==='won'?'❋':'☠'}</div>
 <p class="eyebrow">${s.phase==='won'?'EVOLUTIONARY SUCCESS':'EXTINCTION EVENT'}</p><h1>${s.phase==='won'?'THE LINEAGE ENDURES':'THE LINEAGE ENDS'}</h1>
 <p>${s.phase==='won'?'You survived all three enemy species and their environments. Your descendants inherit the genome you shaped.':esc(s.lossReason)}</p>
 <div class="ending-stats"><div><span>GENERATIONS</span><strong>${s.generation} / 3</strong></div>
 <div><span>GENOME</span><strong>${s.genePool.length} CARDS</strong></div><div><span>STRATEGY</span><strong>${s.mode.toUpperCase()}</strong></div></div>
 <button class="primary-btn" data-action="restart">TRY A NEW LINEAGE ↻</button></main></div>`;}
function render(){
 if(!state){menu();return;}
 if(state.phase==='battle')battle(state);
 else if(state.phase==='offspring')root.innerHTML=offspringPhase(state);
 else if(state.phase==='reward')root.innerHTML=rewardPhase(state);
 else root.innerHTML=endScreen(state);
}
root.addEventListener('click',event=>{
 const button=event.target.closest('button[data-action]');if(!button||button.disabled)return;
 const a=button.dataset.action;
 if(a==='mode'){selectedMode=button.dataset.mode;render();return;}
 if(a==='start'){state=startGame(selectedMode);showGenome=false;render();return;}
 if(a==='restart'){state=null;showGenome=false;render();return;}
 if(!state)return;
 if(a==='genome'){showGenome=!showGenome;render();return;}
 if(a==='play')state=play(state,button.dataset.uid);
 if(a==='end')state=endTurn(state);
 if(a==='offspring')state=selectOffspring(state,button.dataset.id);
 if(a==='reward')state=chooseReward(state,button.dataset.id);
 render();
});
render();
