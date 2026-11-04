(()=>{
'use strict';
const form=document.getElementById('codex-player-form'),input=document.getElementById('codex-player-name'),message=document.getElementById('codex-player-message'),grid=document.getElementById('codex-player-skills'),header=document.getElementById('codex-player-summary'),clear=document.getElementById('codex-player-clear');
if(!form)return;
const names=['Overall','Attack','Defence','Strength','Constitution','Ranged','Prayer','Magic','Cooking','Woodcutting','Fletching','Fishing','Firemaking','Crafting','Smithing','Mining','Herblore','Agility','Thieving','Slayer','Farming','Runecrafting','Hunter','Construction','Summoning','Dungeoneering','Divination','Invention','Archaeology','Necromancy'];
const ids={Constitution:'constitution',Runecrafting:'runecrafting'};
const storageKey='grand-codex-player-v1',goalsKey='grand-codex-player-goals-v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('en-US');
let player=null;
function store(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function show(data){
 player=data;input.value=data.name;
 const overall=data.stats.Overall;
 header.textContent=data.name+' · Total level '+(overall?fmt(overall.level):'unknown')+' · Total XP '+(overall?fmt(overall.xp):'unknown')+' · Last checked '+new Date(data.checked).toLocaleString();
 const goals=read(goalsKey)||{};
 grid.innerHTML=names.slice(1).map(name=>{
 const row=data.stats[name],id=ids[name]||name.toLowerCase(),goal=goals[id]||Math.min(120,(row?.level||1)+10);
 return '<article class="player-skill"><div class="player-skill-head"><strong>'+esc(name)+'</strong><span>Level '+(row?fmt(row.level):'—')+'</span></div><small>'+(row?fmt(row.xp)+' XP':'No ranked stats')+'</small><label>Target level <input type="number" min="2" max="120" value="'+goal+'" data-goal="'+id+'"></label><button type="button" data-plan="'+id+'" '+(!row?'disabled':'')+'>Plan this skill ↗</button></article>';
 }).join('');
 clear.hidden=false;
}
function parseCsv(body,name){
 const rows=body.trim().split(/\r?\n/);
 if(rows.length<names.length)throw Error('The Hiscores response was incomplete.');
 const stats={};
 names.forEach((skill,i)=>{
  const parts=rows[i].split(','),rank=Number(parts[0]),level=Number(parts[1]),xp=Number(parts[2]);
  if(parts.length>=3&&Number.isFinite(level)&&Number.isFinite(xp)&&level>=1&&xp>=0)stats[skill]={rank,level,xp};
 });
 if(Object.keys(stats).length<20)throw Error('The Hiscores response did not contain enough skills.');
 return {name,stats,checked:Date.now()};
}
async function lookup(name){
 // Official public Hiscores CSV. Some browsers block this request due to CORS.
 const endpoint='https://secure.runescape.com/m=hiscore/index_lite.ws?player='+encodeURIComponent(name);
 const response=await fetch(endpoint,{headers:{Accept:'text/plain'}});
 if(!response.ok)throw Error(response.status===404?'Character not found in public Hiscores.':'Hiscores request failed ('+response.status+').');
 return parseCsv(await response.text(),name);
}
form.addEventListener('submit',async e=>{
 e.preventDefault();const name=input.value.trim();
 if(!name||name.length>12){message.textContent='Enter a RuneScape name (up to 12 characters).';return;}
 message.textContent='Looking up '+name+' in RuneScape Hiscores…';
 form.querySelector('button[type=submit]').disabled=true;
 try{const data=await lookup(name);store(storageKey,data);show(data);message.textContent='Stats imported from public Hiscores. Set a target and choose Plan this skill.';}
 catch(err){message.textContent='Could not load public Hiscores: '+err.message+' Browser cross-origin restrictions may block this request on GitHub Pages. You can still use the manual planner by opening any skill card.';}
 finally{form.querySelector('button[type=submit]').disabled=false;}
});
grid.addEventListener('change',e=>{const id=e.target.dataset.goal;if(!id)return;const goals=read(goalsKey)||{};goals[id]=Number(e.target.value);store(goalsKey,goals);});
grid.addEventListener('click',e=>{
 const button=e.target.closest('[data-plan]');if(!button||!player)return;
 const id=button.dataset.plan,name=names.find(n=>(ids[n]||n.toLowerCase())===id),stat=player.stats[name];
 if(!stat)return;
 const target=Number(grid.querySelector('[data-goal="'+id+'"]').value);
 if(!Number.isInteger(target)||target<=stat.level||target>120){message.textContent='Choose a target above your current level, up to 120.';return;}
 const goals=read(goalsKey)||{};goals[id]=target;store(goalsKey,goals);
 window.CODEX_PLAYER_SELECTION={id,level:stat.level,xp:stat.xp,goal:target,name:player.name};
 location.hash='skill-'+id;
 document.dispatchEvent(new CustomEvent('codex:player-plan',{detail:window.CODEX_PLAYER_SELECTION}));
 document.getElementById('library')?.scrollIntoView({behavior:'smooth'});
});
clear.addEventListener('click',()=>{player=null;try{localStorage.removeItem(storageKey)}catch{};grid.innerHTML='';header.textContent='';input.value='';clear.hidden=true;message.textContent='Saved player profile cleared from this browser.';});
const saved=read(storageKey);if(saved&&saved.stats&&saved.name){show(saved);message.textContent='Showing your saved snapshot. Select Refresh stats to check for updates.';form.querySelector('button[type=submit]').textContent='Refresh stats';}
})();
