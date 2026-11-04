(() => {
'use strict';
const root=document.getElementById('training-planner');if(!root)return;
let activeSkill='fletching';
const current=document.getElementById('plan-current'),goal=document.getElementById('plan-goal'),currentXp=document.getElementById('plan-current-xp'),dxp=document.getElementById('plan-dxp'),results=document.getElementById('plan-results'),status=document.getElementById('plan-status');
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
function stageCard(start,end,method,amount,materials,comment){
 return '<div class="plan-stage"><div class="plan-stage-level">LEVEL '+start+' → '+end+'</div><div class="plan-stage-main"><strong>'+escape(method)+'</strong><span>'+nf.format(amount)+' to make</span></div><p>'+escape(materials)+'</p><small>'+escape(comment)+'</small></div>';
}
function buildRoadmap(from,to,xp,multiplier,kind){
 const breaks=[from,...[100,103].filter(n=>n>from&&n<to),to];
 let html='<section class="plan-roadmap"><div class="plan-card-kicker">'+escape(kind)+' · LEVEL-BY-LEVEL ROUTE</div><h3>What to make, and when to switch</h3>';
 let total=0;
 for(let i=0;i<breaks.length-1;i++){
  const a=breaks[i],b=breaks[i+1],segmentXp=xpAt(b)-(i===0?xp:xpAt(a));
  let method,amount,materials,comment;
  if(kind==='FASTEST'||a<100){
   const r=recipes.find(x=>x.name==='Dragon darts');
   amount=Math.ceil(segmentXp/(r.xp*multiplier));method='Dragon darts';materials=nf.format(amount)+' dragon dart tips + '+nf.format(amount)+' feathers';comment='Available from level 95. High-volume option; compare actual costs.';
  }else{
   const primal=a>=103;
   const per=primal?65235:52840;
   amount=Math.ceil(segmentXp/(per*multiplier));
   method=primal?'Primal crossbow Mk. 5':'Eternal magic shortbow Mk. 5';
   materials=nf.format(amount)+' base bows + approximately '+nf.format(amount*63)+' eternal magic logs';
   comment='Workbench upgrade route. Check current recipe, unlock and actual output before buying supplies; figures are preliminary estimates.';
  }
  total+=amount;
  html+=stageCard(a,b,method,amount,materials,comment);
 }
 html+='</section>';return html;
}
function compute(){
 const from=Number(current.value),to=Number(goal.value),raw=currentXp.value.trim();
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to>120||to<=from){setStatus('Choose a current level and a higher goal between 1 and 120.');results.innerHTML='';return;}
 if(activeSkill!=='fletching'){setStatus('Live method calculations are currently available for Fletching. Other skill plans are being researched; no made-up XP or GP estimates will be shown.');results.innerHTML='';return;}
 const xp=raw===''?xpAt(from):Number(raw.replace(/,/g,''));
 if(!Number.isFinite(xp)||xp<xpAt(from)||xp>=xpAt(from+1)){setStatus('Current XP must fall within your selected current level. Clear the XP field to start at the beginning of the level.');results.innerHTML='';return;}
 const needed=Math.max(0,xpAt(to)-xp),multiplier=dxp.checked?2:1;
 const eligible=recipes.filter(r=>r.level<=from).map(r=>calculate(r,needed,multiplier));
 // Workbench methods unlocked during the journey are calculated for their eligible XP segment.
 function workbench(name,unlock,xpPerBow,seconds,finished){
  if(to<=unlock)return null;
  const stageXp=Math.max(0,xpAt(to)-Math.max(xp,xpAt(unlock)));
  const count=Math.ceil(stageXp/(xpPerBow*multiplier)),logs=count*63;
  const logCost=price('Eternal magic logs','buy'),bowCost=price(name,'buy'),sale=price(finished,'sell');
  const missing=[logCost===null?'Eternal magic logs':null,bowCost===null?name:null,sale===null?finished:null].filter(Boolean);
  const cost=logCost===null||bowCost===null?null:logs*logCost+count*bowCost;
  return {name:finished+' (sell Mk. 5)',level:unlock,xp:xpPerBow,rate:3600/seconds,count,hours:count*seconds/3600,ingredients:[{name,qty:count},{name:'Eternal magic logs',qty:logs}],cost,profit:cost===null||sale===null?null:count*sale*.98-cost,missing,source:'https://runescape.wiki/w/Fletching',note:'Unlocks at level '+unlock+'. These quantities cover only the XP from level '+unlock+' onward; earlier levels need a separate method.'};
 }
 const options=[...eligible,
  workbench('Eternal magic shortbow',100,52840,912,'Eternal magic shortbow Mk. 5'),
  workbench('Primal crossbow',103,65235,1091.4,'Primal crossbow Mk. 5')
 ].filter(Boolean);
 if(!eligible.length){setStatus('No verified Fletching recipes are available at this starting level.');results.innerHTML='';return;}
 const fastest=[...options].sort((a,b)=>a.hours-b.hours)[0];
 const best=[...options].filter(x=>x.profit!==null).sort((a,b)=>b.profit/b.hours-a.profit/a.hours)[0] || fastest;
 const profitable=[...options].filter(x=>x.profit!==null&&x.profit>0).sort((a,b)=>b.profit-a.profit)[0];
 results.innerHTML='<div class="plan-summary"><strong>'+nf.format(needed)+' XP remaining</strong><span>Level '+from+' → '+to+' · '+(dxp.checked?'2× base XP scenario':'Base XP, no bonuses')+'</span></div><div class="plan-cards">'+card('⚡ FASTEST',fastest,'Prioritizes training speed, regardless of cost.')+card('⚖ BEST VALUE',best,'Balances training with estimated GP return per hour; later unlocks apply only to their eligible level ranges.')+(profitable?card('💰 PROFITABLE',profitable,'Positive estimated GP after the GE sale tax, subject to changing prices.'):'<article class="plan-card"><div class="plan-card-kicker">💰 PROFITABLE</div><h3>No confirmed profit method</h3><p>None of the modeled, unlocked recipes has a verified positive margin at the latest available prices. We will not invent a profitable option.</p></article>')+'</div>'+buildRoadmap(from,to,xp,multiplier,'FASTEST')+buildRoadmap(from,to,xp,multiplier,'BEST VALUE / PROFIT') ;
 setStatus('Prices fetched automatically from RuneScape Wiki real-time GE trades. Prices are indicative, not guaranteed. Later unlocks cover only their eligible XP range; earlier levels still need training. Last fetched: '+new Date(priceUpdated).toLocaleTimeString()+'.');
}
document.getElementById('plan-form').addEventListener('submit',async e=>{e.preventDefault();results.innerHTML='';setStatus('Checking Grand Exchange prices…');try{await loadPrices();compute();}catch{setStatus('Live GE prices could not be loaded. Try again later. No unverified GP estimates will be displayed.');}});
document.addEventListener('codex:skill-open',e=>{activeSkill=e.detail.id;results.innerHTML='';currentXp.value='';setStatus(activeSkill==='fletching'?'Enter your Fletching levels, then calculate all three plans.':'Training calculations for '+e.detail.name+' are being researched. This skill’s equipment guide remains available below.');});
document.getElementById('plan-refresh').addEventListener('click',()=>{priceMap=null;prices=null;document.getElementById('plan-form').requestSubmit();});

})();