(() => {
  'use strict';
  const icons = {
    'arrow-right':'<path d="M4 12h15m-5-5 5 5-5 5"/>',
    bookmark:'<path d="M6 4h12v17l-6-4-6 4z"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    link:'<path d="m9 15 6-6m-7 4-2 2a3.5 3.5 0 0 0 5 5l3-3m2-6 2-2a3.5 3.5 0 0 0-5-5l-3 3"/>',
    scroll:'<path d="M5 4h13a3 3 0 0 1 3 3v2h-4V7a2 2 0 0 0-4 0v12a2 2 0 0 1-4 0v-2H3v2a2 2 0 0 0 2 2h6M5 4a2 2 0 0 0-2 2v5m4-2h3m-3 3h3"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM19 3v4m-2-2h4M4 18v4m-2-2h4"/>',
    robe:'<path d="m8 4 4 3 4-3 5 6-4 3-1-2v10H8V11l-1 2-4-3Zm4 3v14M8 4l-1 5m9-5 1 5"/>',
    urn:'<path d="M8 3h8M9 3v4l-4 5c-3 5 0 9 7 9s10-4 7-9l-4-5V3M7 14h10M8 17h8"/>',
    swords:'<path d="m4 3 5 2 10 13-2 2L5 8Zm1 16 3-3m6-7 5-6 2 1-3 7M4 16l4 4m8-4 4 4"/>',
    fist:'<path d="M7 12V5a2 2 0 0 1 4 0v5-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v9l-3 7H9l-5-7a2 2 0 0 1 3-2l3 3M9 21v-3h7v3"/>',
    shield:'<path d="m12 3 8 3v7c0 5-8 9-8 9s-8-4-8-9V6Zm0 4v10m-4-6h8"/>',
    bow:'<path d="M6 3c14 2 14 16 0 18L10 12ZM4 12h17m-3-3 3 3-3 3"/>',
    staff:'<path d="m6 22 8-15m-2-4 4-2 4 4-2 4-5-2Zm3 0 2 2"/>',
    skull:'<path d="M7 16a8 8 0 1 1 10 0v5H7ZM9 21v-3m3 3v-3m3 3v-3"/><circle cx="8.5" cy="10.5" r="1.5"/><circle cx="15.5" cy="10.5" r="1.5"/><path d="m11 15 1-2 1 2"/>',
    heart:'<path d="M12 21 4 13C-3 5 7-1 12 6c5-7 15-1 8 7Z"/><path d="M4 11h4l2-3 3 7 2-4h5"/>',
    prayer:'<path d="m12 2 2 7 7 3-7 2-2 8-2-8-7-2 7-3Zm-8 3 3 2m10 11 3 2M19 4l-2 3M5 19l2-3"/>',
    summon:'<path d="m12 3 3 5 6 1-4 5 1 7-6-3-6 3 1-7-4-5 6-1Z"/><circle cx="12" cy="12" r="3"/>',
    mattock:'<path d="m4 21 13-16m-7-2c4-1 10 1 12 5l-5-1-3-3m-5 5L5 6 2 10l4 2"/>',
    wisp:'<path d="M12 22c-7-3-9-8-5-13 3-3 5-4 5-8 2 5 8 8 8 13 0 5-3 7-8 8Zm0-4c-4-2-3-5 1-8 0 3 4 6-1 8Z"/>',
    leaf:'<path d="M4 20C1 7 8 3 21 3c0 13-4 20-17 17Zm0 0L17 7M8 16v-6m4 2h6"/>',
    fish:'<path d="M4 12c6-10 12-8 16 0-4 8-10 10-16 0Zm0 0L1 7v10Z"/><circle cx="15" cy="11" r=".7"/><path d="m10 5 1-3 4 4m-5 13 3 3 2-4"/>',
    trap:'<path d="m3 8 9-5 9 5v10l-9 4-9-4Zm0 0 9 5 9-5m-9 5v9m-5-7 2 1m6 0 2-1M7 10l9-5"/>',
    pickaxe:'<path d="m5 21 10-13M4 7c7-7 15-3 18 6l-6-5-7-2Z"/>',
    axe:'<path d="m6 22 10-18m-3 2-5-3-6 7 7 5 4-4m2-6 5 3 2 5-6 2-3-3"/>',
    hammer:'<path d="m4 21 10-12m-4-5 3-3 9 8-3 4Z"/>',
    cook:'<path d="M7 10C0 9 3 1 8 4c1-4 7-4 8 0 5-3 8 5 1 6v8H7Zm0 5h10M5 21h14"/>',
    gem:'<path d="m7 3-5 7 10 12 10-12-5-7ZM2 10h20M7 3l5 19L17 3m-10 0 5 7 5-7"/>',
    flame:'<path d="M13 2c1 6 8 8 7 14-1 8-15 8-16 0C3 10 8 9 7 5l5 7c3-3 2-6 1-10Zm-1 13c-4 3-3 6 1 6 4-1 3-4-1-6Z"/>',
    feather:'<path d="M3 21 17 7M6 18C1 5 18-4 22 3c4 8-8 16-16 15Zm4-4-1-6m5 2V4m0 9h6"/>',
    potion:'<path d="M9 2h6M10 2v7l-6 9c-1 2 0 4 3 4h10c3 0 4-2 3-4l-6-9V2M7 15h10"/><circle cx="10" cy="18" r=".6"/><circle cx="14" cy="17" r=".6"/>',
    rune:'<path d="m12 2 9 5v10l-9 5-9-5V7Zm-4 5 8 5-8 5Zm4 2v6"/>',
    anvil:'<path d="M3 7h18l-4 5h-3v4l4 3v2H6v-2l4-3v-4H6L3 9ZM6 4h8v3"/>',
    boot:'<path d="M5 3h10v10l5 3c3 2 2 5-1 5H5V3Zm0 13h10M5 7h5m-5 3h5m-5 3h5"/>',
    dungeon:'<path d="M3 22V3h18v19M8 22V12a4 4 0 0 1 8 0v10M3 7h5m8 0h5M3 16h5m8 0h5M12 3v4"/>',
    hand:'<path d="M8 12V5a1.5 1.5 0 0 1 3 0v6-8a1.5 1.5 0 0 1 3 0v8-6a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v7l-4 6H9l-6-7a2 2 0 0 1 3-2l3 3"/>',
    cog:'<path d="m10 2-1 4-3-1-3 4 3 3-3 3 3 4 3-1 1 4h4l1-4 3 1 3-4-3-3 3-3-3-4-3 1-1-4Z"/><circle cx="12" cy="12" r="3"/>'
  };
  const svg = (name) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.sparkles}</svg>`;
  const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  document.querySelectorAll('[data-icon]').forEach((el) => el.outerHTML = svg(el.dataset.icon));

  const skills = window.CODEX_SKILLS || [];
  const grid = document.getElementById('skill-grid');
  const search = document.getElementById('skill-search');
  const dialog = document.getElementById('skill-dialog');
  const colours = {Combat:'var(--combat)',Gathering:'var(--gathering)',Artisan:'var(--artisan)',Support:'var(--support)'};
  const skillPalette = {"attack":"#d94d4d","strength":"#d86b32","defence":"#6395cf","ranged":"#5eaa58","magic":"#5488e8","necromancy":"#a36bea","constitution":"#d96079","prayer":"#e8d9a3","summoning":"#b9a0e8","archaeology":"#b78b5c","divination":"#66c8da","farming":"#76b64b","fishing":"#35b2d1","hunter":"#b8864c","mining":"#8ca8ba","woodcutting":"#4b9a61","smithing":"#c27c5b","cooking":"#e3a65d","crafting":"#c69bcd","firemaking":"#ee7138","fletching":"#77bba0","herblore":"#71c978","runecrafting":"#c59bdf","agility":"#9ac5e5","thieving":"#a47a8d","slayer":"#b45b5d","construction":"#d5a45b","dungeoneering":"#8d7eac","invention":"#e4c05b"};
  const skillArt = (s) => `<img class="skill-official-icon" src="https://apps.runescape.com/runemetrics/images/skill-icons/${encodeURIComponent(s.id)}.png" alt="" loading="lazy" onerror="this.remove()" />`;
  const labels = {low:'ESSENTIAL LOADOUT',medium:'UPGRADED LOADOUT',high:'PREMIUM LOADOUT'};
  const gems = {low:'bronze',medium:'silver',high:'gold'};
  const descriptions = {
    low:'Inexpensive essentials and useful earned unlocks. Low cash cost can still mean a longer unlock grind.',
    medium:'Practical upgrades that make a meaningful difference. Earned unlocks may take time.',
    high:'Premium, method-dependent optimisation. Some equipment requires levels above 99; check the full guide.'
  };
  const storage = {
    get(key,fallback){try{const value=JSON.parse(localStorage.getItem(key));return value===null?fallback:value;}catch{return fallback;}},
    set(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Storage can be disabled in private browsing. */}}
  };
  const stored = storage.get('grand-codex-saved',[]);
  const saved = new Set(Array.isArray(stored)?stored.filter(id=>skills.some(s=>s.id===id)):[]);
  const storedTier = storage.get('grand-codex-tier','medium');
  let tier = Object.hasOwn(labels,storedTier)?storedTier:'medium';
  let category = 'all';
  let savedOnly = false;
  let activeSkill = null;
  let previousFocus = null;
  let toastTimer;

  function notify(message){
    const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('visible');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2600);
  }
  function updateSaved(){
    storage.set('grand-codex-saved',[...saved]);
    document.getElementById('saved-count').textContent=saved.size;
    document.getElementById('saved-filter').setAttribute('aria-pressed',String(savedOnly));
    if(activeSkill){
      const selected=saved.has(activeSkill.id);
      document.getElementById('dialog-save').innerHTML=svg('bookmark')+`<span>${selected?'Skill saved':'Save skill'}</span>`;
      document.getElementById('dialog-save').setAttribute('aria-pressed',String(selected));
    }
  }
  function toggleSaved(id){
    const skill=skills.find(s=>s.id===id);if(!skill)return;
    const wasSaved=saved.has(id);wasSaved?saved.delete(id):saved.add(id);
    updateSaved();render();notify(`${skill.name} ${wasSaved?'removed from':'added to'} your collection`);
  }
  function render(){
    const query=search.value.trim().toLowerCase();
    const results=skills.filter(s=>(category==='all'||s.category===category)&&(!savedOnly||saved.has(s.id))&&(`${s.name} ${s.summary} ${s.bonus} ${Object.values(s.tiers).flat().join(' ')}`.toLowerCase().includes(query)));
    document.getElementById('result-count').textContent=results.length;
    document.getElementById('result-label').textContent=savedOnly?'saved skills':results.length===1?'skill to explore':'skills to explore';
    document.getElementById('empty-state').hidden=results.length!==0;
    document.getElementById('empty-message').textContent=savedOnly?'Save a skill with its bookmark button, or show all skills.':'Try another skill name, item or category.';
    grid.innerHTML=results.map((s,index)=>`<article class="skill-card" style="--skill-color:${skillPalette[s.id] || colours[s.category]};animation-delay:${Math.min(index,8)*24}ms"><div class="card-top"><div class="skill-emblem">${svg(s.icon)}${skillArt(s)}</div><button class="save-button ${saved.has(s.id)?'saved':''}" data-save="${s.id}" aria-label="${saved.has(s.id)?'Unsave':'Save'} ${escape(s.name)}" aria-pressed="${saved.has(s.id)}">${svg('bookmark')}</button></div><p class="card-category">${escape(s.category==='Support'?'Support & elite':s.category)}</p><h3>${escape(s.name)}</h3><p class="card-summary">${escape(s.summary)}</p><span class="boost-pill">${svg('sparkles')}${escape(s.bonus)}</span><div class="card-loadout"><div class="loadout-label"><span class="tier-gem ${gems[tier]}"></span>${labels[tier]}</div><ul>${s.tiers[tier].map(item=>`<li>${escape(item)}</li>`).join('')}</ul></div><div class="card-bottom"><span>METHOD-SPECIFIC GUIDE</span><button class="card-open" data-open="${s.id}" aria-label="Read ${escape(s.name)} guide">Read guide ${svg('arrow-right')}</button></div></article>`).join('');
    document.querySelectorAll('[data-tier]').forEach(b=>{const selected=b.dataset.tier===tier;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    document.querySelectorAll('[data-category]').forEach(b=>{const selected=b.dataset.category===category;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
    document.getElementById('tier-description').textContent=descriptions[tier];
  }
  function openSkill(id,updateUrl=true){
    const skill=skills.find(s=>s.id===id);if(!skill)return;
    if(!dialog.open)previousFocus=document.activeElement;
    activeSkill=skill;
    dialog.style.setProperty('--skill-color',skillPalette[skill.id] || colours[skill.category]);
    document.dispatchEvent(new CustomEvent('codex:skill-open',{detail:{id:skill.id,name:skill.name}}));
    document.getElementById('dialog-category').textContent=`${skill.category==='Support'?'SUPPORT & ELITE':skill.category.toUpperCase()} / SKILL FIELD GUIDE`;
    document.getElementById('dialog-title').textContent=skill.name;
    document.getElementById('dialog-summary').textContent=skill.summary;
    document.getElementById('dialog-icon').innerHTML=svg(skill.icon)+skillArt(skill);
    document.getElementById('dialog-content').innerHTML=skill.notes;
    updateSaved();
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;
    document.getElementById('dialog-close').focus({preventScroll:true});
    if(updateUrl)history.replaceState(null,'',`#skill-${skill.id}`);
  }
  function closeSkill(){if(dialog.open)dialog.close();}
  grid.addEventListener('click',event=>{
    const save=event.target.closest('[data-save]');if(save){toggleSaved(save.dataset.save);return;}
    const open=event.target.closest('[data-open]');if(open)openSkill(open.dataset.open);
  });
  document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;render();}));
  document.querySelectorAll('[data-tier]').forEach(b=>b.addEventListener('click',()=>{tier=b.dataset.tier;storage.set('grand-codex-tier',tier);render();}));
  search.addEventListener('input',render);
  document.getElementById('saved-filter').addEventListener('click',()=>{savedOnly=!savedOnly;updateSaved();render();});
  document.getElementById('saved-nav').addEventListener('click',()=>{savedOnly=true;category='all';search.value='';updateSaved();render();document.getElementById('library').scrollIntoView({behavior:'smooth'});});
  document.getElementById('clear-filters').addEventListener('click',()=>{category='all';savedOnly=false;search.value='';updateSaved();render();});
  document.getElementById('dialog-close').addEventListener('click',closeSkill);
  document.getElementById('dialog-save').addEventListener('click',()=>{if(activeSkill)toggleSaved(activeSkill.id);});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeSkill();}});
  dialog.addEventListener('close',()=>{activeSkill=null;if(location.hash.startsWith('#skill-'))history.replaceState(null,'','#library');if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});});
  document.getElementById('copy-link').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(location.href);notify('Skill link copied');}catch{notify('Copy the skill link from your address bar');}
  });
  document.getElementById('back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  document.addEventListener('keydown',event=>{if(event.key==='/'&&!dialog.open&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.activeElement.isContentEditable){event.preventDefault();search.focus();document.getElementById('library').scrollIntoView({behavior:'smooth'});}});
  document.addEventListener('codex:player-plan',e=>{openSkill(e.detail.id,true);});
  window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#skill-'))openSkill(location.hash.slice(7),false);else if(dialog.open)closeSkill();});
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.tool-card,.featured-note,.small-notes article').forEach(el=>{el.classList.add('reveal');observer.observe(el);});
  }
  updateSaved();render();
  if(location.hash.startsWith('#skill-'))openSkill(location.hash.slice(7),false);
})();
