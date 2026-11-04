(() => {
'use strict';
const root=document.getElementById('training-planner');if(!root)return;
const skill=document.getElementById('plan-skill'),current=document.getElementById('plan-current'),goal=document.getElementById('plan-goal'),currentXp=document.getElementById('plan-current-xp'),dxp=document.getElementById('plan-dxp'),results=document.getElementById('plan-results'),status=document.getElementById('plan-status');
const nf=new Intl.NumberFormat('en-US');const gp=n=>nf.format(Math.round(n))+' GP';
const recipes=[
 {name:'Dragon darts',level:95,xp:25,rate:60000,inputs:{'Dragon dart tip':1,'Feather':1},output:'Dragon dart',units:1,source:'https://runescape.wiki/w/Pay-to-play_Fletching_training'},
 {name:'Dinarrows',level:95,xp:20,rate:45000,inputs:{'Sharp shell shard':1,'Headless dinarrow':1},output:'Dinarrow',units:1,source:'https://runescape.wiki/w/Pay-to-play_Fletching_training'},
 {name:'Dragon arrows',level:90,xp:15,rate:45000,inputs:{'Dragon arrowheads':1,'Headless arrow':1},output:'Dragon arrow',units:1,source:'https://runescape.wiki/w/Pay-to-play_Fletching_training'},
 {name:'Rune arrows',level:75,xp:12.5,rate:45000,inputs:{'Rune arrowheads':1,'Headless arrow':1},output:'Rune arrow',units:1,source:'https://runescape.wiki/w/Pay-to-play_Fletching_training'},
 {name:'Dark arrows',level:95,xp:17.5,rate:45000,inputs:{'Dark arrowheads':1,'Headless arrow':1},output:'Dark arrow',units:1,source:'https://runescape.wiki/w/Pay-to-play_Fletching_training'}
];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function xpAt(level){let points=0;for(let i=1;i<level;i++)points+=Math.floor(i+300*Math.pow(2,i/7));return Math.floor(points/4);}
function setStatus(message){status.textContent=message;}
let priceMap=null,prices=null,priceUpdated=null;
async function loadPrices(){
 if(priceMap&&prices)return;
 const base='https://prices.runescape.wiki/api/v2/rs/';
 const [m,p]=await Promise.all([fetch(base+'mapping'),fetch(base+'latest')]);
 if(!m.ok||!p.ok)throw Error('GE price service unavailable');
 const [mapping,latest]=await Promise.all([m.json(),p.json()]);
 priceMap=new Map(mapping.map(x=>[x.name.toLowerCase(),x.id]));prices=latest.data;priceUpdated=Date.now();
}
function price(name,type){
 const id=priceMap?.get(name.toLowerCase()),p=prices?.[id];if(!p)return null;
 const value=type==='buy'?(p.high??p.low):(p.low??p.high);
 const stamp=type==='buy'?(p.highTime??p.lowTime):(p.lowTime??p.highTime);
 if(!Number.isFinite(value)||!stamp||Date.now()-stamp*1000>7*86400000)return null;
 return value;
}
function calculate(recipe,needed,multiplier){
 const count=Math.ceil(needed/(recipe.xp*multiplier));
 let cost=0,missing=[];
 const ingredients=Object.entries(recipe.inputs).map(([name,qty])=>{
 const unit=price(name,'buy');if(unit===null)missing.push(name);else cost+=unit*qty*count;
 return {name,qty:qty*count,unit};
 });
 const sell=price(recipe.output,'sell');if(sell===null)missing.push(recipe.output);
 const revenue=sell===null?null:sell*recipe.units*count*.98;
 return {...recipe,count,ingredients,hours:count/recipe.rate,cost:missing.length?null:cost,profit:missing.length?null:revenue-cost,missing};
}
function card(label,item,description){
 if(!item)return '<article class="plan-card"><h3>'+escape(label)+'</h3><p>No verified method available for this level range.</p></article>';
 const rows=item.ingredients.map(x=>'<li><strong>'+nf.format(x.qty)+'</strong> '+escape(x.name)+'</li>').join('');
 const outcome=item.profit===null?'Price unavailable':item.profit>=0?'+'+gp(item.profit):'−'+gp(-item.profit);
 return '<article class="plan-card"><div class="plan-card-kicker">'+escape(label)+'</div><h3>'+escape(item.name)+'</h3><p>'+escape(description)+'</p><div class="plan-metrics"><div><small>MAKE</small><strong>'+nf.format(item.count)+'</strong></div><div><small>TIME EST.</small><strong>'+item.hours.toFixed(1)+'h</strong></div><div><small>NET GP EST.</small><strong>'+outcome+'</strong></div></div><h4>Shopping list</h4><ul>'+rows+'</ul><p class="plan-small">Base '+nf.format(item.xp)+' XP per item · '+nf.format(item.rate)+' items/hour assumed · GE sale includes estimated 2% tax. '+(item.missing.length?'Missing or stale prices: '+escape(item.missing.join(', '))+'. ':'')+'<a href="'+item.source+'" target="_blank" rel="noopener">Method reference ↗</a></p></article>';
}
function fillSkills(){const all=window.CODEX_SKILLS||[];skill.innerHTML=all.map(s=>'<option value="'+escape(s.id)+'">'+escape(s.name)+'</option>').join('');skill.value='fletching';}
function compute(){
 const from=Number(current.value),to=Number(goal.value),raw=currentXp.value.trim();
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to>120||to<=from){setStatus('Choose a current level and a higher goal between 1 and 120.');results.innerHTML='';return;}
 if(skill.value!=='fletching'){setStatus('Live method calculations are currently available for Fletching. Other skill plans are being researched; no made-up XP or GP estimates will be shown.');results.innerHTML='';return;}
 const xp=raw===''?xpAt(from):Number(raw.replace(/,/g,''));
 if(!Number.isFinite(xp)||xp<xpAt(from)||xp>=xpAt(from+1)){setStatus('Current XP must fall within your selected current level. Clear the XP field to start at the beginning of the level.');results.innerHTML='';return;}
 const needed=Math.max(0,xpAt(to)-xp),multiplier=dxp.checked?2:1;
 const eligible=recipes.filter(r=>r.level<=from).map(r=>calculate(r,needed,multiplier));
 if(!eligible.length){setStatus('No verified Fletching recipes are available at this starting level.');results.innerHTML='';return;}
 const fastest=[...eligible].sort((a,b)=>a.hours-b.hours)[0];
 const best=[...eligible].sort((a,b)=>((a.profit===null?1e15:-a.profit)/Math.max(1,needed)) - ((b.profit===null?1e15:-b.profit)/Math.max(1,needed)) || a.hours-b.hours)[0];
 const profitable=[...eligible].filter(x=>x.profit!==null&&x.profit>0).sort((a,b)=>b.profit-a.profit)[0];
 results.innerHTML='<div class="plan-summary"><strong>'+nf.format(needed)+' XP remaining</strong><span>Level '+from+' → '+to+' · '+(dxp.checked?'2× base XP scenario':'Base XP, no bonuses')+'</span></div><div class="plan-cards">'+card('⚡ FASTEST',fastest,'Prioritizes training speed, regardless of cost.')+card('⚖ BEST VALUE',best,'Lowest estimated GP cost per XP among the currently modeled methods. This may be slower.')+(profitable?card('💰 PROFITABLE',profitable,'Positive estimated GP after the GE sale tax, subject to changing prices.'):'<article class="plan-card"><div class="plan-card-kicker">💰 PROFITABLE</div><h3>No confirmed profit method</h3><p>None of the modeled, unlocked recipes has a verified positive margin at the latest available prices. We will not invent a profitable option.</p></article>')+'</div>';
 setStatus('Prices fetched automatically from RuneScape Wiki real-time GE trades. Prices are indicative, not guaranteed. Only methods unlocked at your starting level are compared. Last fetched: '+new Date(priceUpdated).toLocaleTimeString()+'.');
}
document.getElementById('plan-form').addEventListener('submit',async e=>{e.preventDefault();results.innerHTML='';setStatus('Checking Grand Exchange prices…');try{await loadPrices();compute();}catch{setStatus('Live GE prices could not be loaded. Try again later. No unverified GP estimates will be displayed.');}});
skill.addEventListener('change',()=>{results.innerHTML='';setStatus(skill.value==='fletching'?'Ready to calculate Fletching.':'This skill is not yet covered by verified method data.');});
document.getElementById('plan-refresh').addEventListener('click',()=>{priceMap=null;prices=null;document.getElementById('plan-form').requestSubmit();});
fillSkills();
})();