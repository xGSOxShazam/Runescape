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

// Routes are assembled independently for each level segment, rather than ranking partial routes.
const routeChoices=[
 {id:'fast',label:'FASTEST',title:'Fastest XP',explain:'Prioritizes XP per hour, even if supplies cost more.'},
 {id:'balanced',label:'BEST OVERALL',title:'Best Overall',explain:'Balances speed and GP cost. Penalizes very expensive XP.'},
 {id:'profit',label:'MOST PROFITABLE',title:'Most Profitable',explain:'Prioritizes estimated profit; only claims profit when priced.'}
];
let selected='balanced',lastPlan=null;
const progressKey='grand-codex-fletching-progress-v2';
function savedProgress(){try{return JSON.parse(localStorage.getItem(progressKey)||'{}')}catch{return {}}}
function methodList(level,multiplier){
 const list=recipes.filter(r=>r.level<=level).map(r=>({...r,kind:'recipe',per:r.xp*multiplier,perHour:r.rate*r.xp*multiplier}));
 // Mk. 5 workbench data are preliminary. Never substitute a bow with an unverified GE quote silently.
 if(level>=100)list.push({name:'Eternal magic shortbow Mk. 5',level:100,xp:52840,per:52840*multiplier,rate:3600/912,perHour:52840*multiplier*3600/912,kind:'workbench',base:'Eternal magic shortbow',output:'Eternal magic shortbow Mk. 5',logs:63,source:'https://runescape.wiki/w/Fletching'});
 if(level>=103)list.push({name:'Primal crossbow Mk. 5',level:103,xp:65235,per:65235*multiplier,rate:3600/1091.4,perHour:65235*multiplier*3600/1091.4,kind:'workbench',base:'Primal crossbow',output:'Primal crossbow Mk. 5',logs:63,source:'https://runescape.wiki/w/Fletching'});
 return list;
}
function stageEstimate(m,xpNeeded){
 const count=Math.ceil(xpNeeded/m.per),hours=count/m.rate;
 let items=m.kind==='recipe'?Object.entries(m.inputs).map(([name,qty])=>({name,qty:qty*count})):
 [{name:m.base,qty:count},{name:'Eternal magic logs',qty:count*m.logs}];
 let buy=0,unknown=[];
 for(const item of items){const quote=price(item.name,'buy');if(quote===null)unknown.push(item.name);else buy+=quote*item.qty;}
 const output=m.output,sale=price(output,'sell');
 if(sale===null)unknown.push(output);
 const revenue=sale===null?null:sale*count*(m.units||1)*.98;
 return {method:m,count,hours,items,buy:unknown.length?null:buy,revenue:unknown.length?null:revenue,net:unknown.length?null:revenue-buy,unknown};
}
function chooseStage(level,xpNeeded,kind,multiplier){
 const choices=methodList(level,multiplier).map(m=>stageEstimate(m,xpNeeded));
 if(kind==='fast')return choices.sort((a,b)=>a.hours-b.hours)[0];
 if(kind==='profit'){
  const known=choices.filter(x=>x.net!==null);
  return known.length?known.sort((a,b)=>b.net-a.net)[0]:choices.sort((a,b)=>a.hours-b.hours)[0];
 }
 // A profitable route is favored, but a much slower route must earn its extra time.
 // 3m GP per extra hour is a configurable opportunity-cost assumption, not a market fact.
 const known=choices.filter(x=>x.net!==null);
 return known.length?known.sort((a,b)=>(b.net-3000000*b.hours)-(a.net-3000000*a.hours))[0]:choices.sort((a,b)=>a.hours-b.hours)[0];
}
function buildRoute(from,to,xp,multiplier,kind){
 const boundaries=[from,...[100,103].filter(n=>n>from&&n<to),to];
 const stages=[];
 for(let i=0;i<boundaries.length-1;i++){
  const start=boundaries[i],end=boundaries[i+1];
  const amount=xpAt(end)-(i===0?xp:xpAt(start));
  stages.push({start,end,xp:amount,...chooseStage(start,amount,kind,multiplier)});
 }
 const known=stages.every(s=>s.net!==null);
 return {kind,stages,hours:stages.reduce((n,s)=>n+s.hours,0),buy:known?stages.reduce((n,s)=>n+s.buy,0):null,revenue:known?stages.reduce((n,s)=>n+s.revenue,0):null,net:known?stages.reduce((n,s)=>n+s.net,0):null,unknown:[...new Set(stages.flatMap(s=>s.unknown))]};
}
function money(n){return n===null?'Unavailable':(n>=0?'+':'−')+gp(Math.abs(n))}
function routeMarkup(route,from,to){
 const saved=savedProgress(),id=from+'-'+to+'-'+route.kind;
 const stages=route.stages.map((s,i)=>{
  const key=id+'-'+s.start+'-'+s.end+'-'+s.method.name,done=!!saved[key];
  return '<article class="plan-stage'+(done?' stage-done':'')+'"><div class="plan-stage-level">LEVEL '+s.start+' → '+s.end+'</div><div class="plan-stage-main"><strong>'+escape(s.method.name)+'</strong><span>'+nf.format(s.count)+' to make</span></div>'+
  '<p>'+nf.format(s.xp)+' XP to earn · '+s.hours.toFixed(1)+' estimated hours · '+(s.net===null?'GE margin unavailable':money(s.net)+' net GP')+'</p>'+
  '<details><summary>Shopping list & breakdown</summary><ul>'+s.items.map(item=>'<li>'+nf.format(item.qty)+' × '+escape(item.name)+'</li>').join('')+'</ul><p>Purchase cost: '+(s.buy===null?'Unavailable':gp(s.buy))+' · Sale revenue after estimated GE tax: '+(s.revenue===null?'Unavailable':gp(s.revenue))+'</p><p><a href="'+escape(s.method.source)+'" target="_blank" rel="noopener">Method reference ↗</a></p></details>'+
  '<label class="plan-done"><input type="checkbox" data-stage="'+escape(key)+'" '+(done?'checked':'')+'> Mark stage complete</label></article>';
 }).join('');
 return '<div class="plan-roadmap"><h3>When to switch methods</h3>'+stages+'</div>';
}
function summaryMarkup(route){
 return '<div class="plan-totals"><div><small>TIME</small><strong>'+route.hours.toFixed(1)+'h</strong></div><div><small>SUPPLIES</small><strong>'+(route.buy===null?'Price missing':gp(route.buy))+'</strong></div><div><small>RESALE</small><strong>'+(route.revenue===null?'Price missing':gp(route.revenue))+'</strong></div><div><small>NET GP</small><strong>'+money(route.net)+'</strong></div></div>';
}
function drawPlan(){
 if(!lastPlan)return;
 const {from,to,xp,multiplier,routes}=lastPlan;
 const route=routes.find(r=>r.kind===selected);
 const fastest=routes.find(r=>r.kind==='fast');
 const difference=route.hours-fastest.hours;
 const trade=selected==='fast'?'This route prioritizes time over GP.':route.net!==null&&fastest.net!==null?
  'Compared with Fastest: '+(difference>=0?difference.toFixed(1)+' more hours':Math.abs(difference).toFixed(1)+' fewer hours')+' and '+money(route.net-fastest.net)+' additional net GP.':'GP comparison unavailable until all items have current quotes.';
 const missing=route.unknown.length?'<p class="plan-warning">Missing or stale GE prices: '+escape(route.unknown.join(', '))+'. Profit and cost totals are intentionally hidden.</p>':'';
 results.innerHTML='<div class="plan-summary"><strong>'+nf.format(xpAt(to)-xp)+' XP remaining</strong><span>Level '+from+' → '+to+' · '+(multiplier===2?'Double XP scenario':'Base XP')+'</span></div>'+
 '<div class="plan-strategies" role="group" aria-label="Training strategy">'+routeChoices.map(r=>'<button type="button" data-route="'+r.id+'" class="'+(r.id===selected?'is-active':'')+'">'+r.title+'</button>').join('')+'</div>'+
 '<p class="plan-strategy-info">'+escape(routeChoices.find(r=>r.id===selected).explain)+'</p>'+summaryMarkup(route)+'<p class="plan-tradeoff">'+escape(trade)+'</p>'+routeMarkup(route,from,to)+missing+
 '<div class="plan-controls"><button type="button" id="plan-recalculate" class="button button-outline">Recalculate remaining XP</button></div>'+
 '<p class="plan-disclaimer">Training speeds, workbench recipes and yields are provisional assumptions, not verified purchase instructions. GE quotes are indicative. The Best Overall route uses a 3m GP/hour time-value assumption. DXP eligibility varies by activity. Progress is saved only in this browser.</p>';
}
function skillGuidePlan(from,to,xp){
 const entry=(window.CODEX_SKILLS||[]).find(s=>s.id===activeSkill);
 const needed=xpAt(to)-xp;
 const steps=[from,...[10,20,30,40,50,60,70,80,90,99,100,110].filter(n=>n>from&&n<to),to];
 const tiers=entry?.tiers||{};
 const equip=level=>level<60?'low':level<90?'medium':'high';
 const stages=steps.slice(0,-1).map((level,i)=>{
  const end=steps[i+1],tier=equip(level);
  const items=(tiers[tier]||[]).map(v=>'<li>'+escape(v)+'</li>').join('');
  return '<article class="plan-stage"><div class="plan-stage-level">LEVEL '+level+' → '+end+'</div><div class="plan-stage-main"><strong>'+escape(entry?.name||activeSkill)+' training milestone</strong><span>'+nf.format(xpAt(end)-(i===0?xp:xpAt(level)))+' XP</span></div><p>Suggested '+tier+'-tier setup from the skill guide:</p><ul>'+items+'</ul></article>';
 }).join('');
 results.innerHTML='<div class="plan-summary"><strong>'+nf.format(needed)+' XP remaining</strong><span>Level '+from+' → '+to+'</span></div><p class="plan-warning">A detailed training-method database is not yet available for '+escape(entry?.name||activeSkill)+'. This is an XP milestone and equipment guide, not a verified fastest or profitable route. No invented GP or XP/hour estimates are shown.</p><div class="plan-roadmap"><h3>Level milestones and recommended setup</h3>'+stages+'</div><p class="plan-disclaimer">See the research guide below for training methods and unlock requirements. Equipment tiers are general recommendations, not guaranteed level-specific unlocks.</p>';
 setStatus('Showing XP milestones and existing equipment research for '+(entry?.name||activeSkill)+'.');
}
function compute(){
 const from=Number(current.value),to=Number(goal.value),raw=currentXp.value.trim();
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to>120||to<=from){setStatus('Choose a current level and a higher goal between 1 and 120.');results.innerHTML='';return;}
 if(activeSkill!=='fletching'){const rawXp=currentXp.value.trim(),actualXp=rawXp===''?xpAt(from):Number(rawXp.replace(/,/g,''));if(!Number.isFinite(actualXp)||actualXp<xpAt(from)||actualXp>=xpAt(from+1)){setStatus('Enter valid XP for your current level.');results.innerHTML='';return;}skillGuidePlan(from,to,actualXp);return;}
 const xp=raw===''?xpAt(from):Number(raw.replace(/,/g,''));
 if(!Number.isFinite(xp)||xp<xpAt(from)||xp>=xpAt(from+1)){setStatus('Current XP must fall within your selected level.');results.innerHTML='';return;}
 const multiplier=dxp.checked?2:1;
 const routes=routeChoices.map(r=>buildRoute(from,to,xp,multiplier,r.id));
 lastPlan={from,to,xp,multiplier,routes};
 drawPlan();
 setStatus('Live GE quotes checked '+new Date(priceUpdated).toLocaleTimeString()+'. Routes compare entire journeys, not isolated methods.');
}
document.getElementById('plan-form').addEventListener('submit',async e=>{e.preventDefault();results.innerHTML='';if(activeSkill!=='fletching'){compute();return;}setStatus('Checking Grand Exchange prices…');try{await loadPrices();compute();}catch(e){setStatus('GE quotes could not be loaded. Check your connection and try again.');}});
results.addEventListener('click',e=>{
 const route=e.target.closest('[data-route]');if(route){selected=route.dataset.route;drawPlan();return;}
 if(e.target.closest('#plan-recalculate')){lastPlan=null;document.getElementById('plan-form').requestSubmit();}
});
results.addEventListener('change',e=>{
 const input=e.target.closest('[data-stage]');if(!input)return;
 const saved=savedProgress();saved[input.dataset.stage]=input.checked;
 try{localStorage.setItem(progressKey,JSON.stringify(saved))}catch{}
 input.closest('.plan-stage')?.classList.toggle('stage-done',input.checked);
});
document.addEventListener('codex:skill-open',e=>{activeSkill=e.detail.id;lastPlan=null;results.innerHTML='';currentXp.value='';setStatus(activeSkill==='fletching'?'Enter your Fletching levels to compare complete routes.':'Verified route calculations are not yet available for '+e.detail.name+'.');});
document.getElementById('plan-refresh').addEventListener('click',()=>{priceMap=null;prices=null;document.getElementById('plan-form').requestSubmit();});
})();
