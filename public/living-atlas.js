/**
 * The Living Atlas — progressive interactivity, no heavy animation framework.
 * Every interaction is useful, keyboard operable where applicable, and motion-aware.
 */
(()=>{
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 const calm=()=>reduced.matches;

 // Navigation across pages remains server-rendered HTML. View transitions are
 // progressive enhancement only; never trap the visitor inside a SPA shell.

 // A real reading-position indicator, without scroll listeners doing layout reads on every tick.
 const progress=document.querySelector('[data-la-progress]');
 let scrollQueued=false;
 function updateProgress(){
   scrollQueued=false;
   if(!progress)return;
   const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   const ratio=Math.max(0,Math.min(1,window.scrollY/max));
   progress.style.transform='scaleX('+ratio.toFixed(4)+')';
 }
 if(progress){
   window.addEventListener('scroll',()=>{
     if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress)}
   },{passive:true});
   window.addEventListener('resize',()=>requestAnimationFrame(updateProgress),{passive:true});
   updateProgress();
 }

 // Scroll reveal is opt-in and disabled if an observer or reduced-motion setting is unavailable.
 const revealElements=[...document.querySelectorAll('[data-reveal]')];
 if(revealElements.length && 'IntersectionObserver' in window && !calm()){
   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries){
       if(entry.isIntersecting){
         entry.target.classList.add('is-in-view');
         observer.unobserve(entry.target);
       }
     }
   },{threshold:0.075,rootMargin:'0px 0px -36px 0px'});
   revealElements.forEach(item=>observer.observe(item));
   document.documentElement.classList.add('la-motion-ready');
 }else{
   revealElements.forEach(item=>item.classList.add('is-in-view'));
 }

 // Mouse-driven dimensionality is deliberately bounded and never enabled for coarse pointers.
 const depthStage=document.querySelector('[data-la-depth]');
 if(depthStage && fine.matches && !calm()){
   const frames=[...depthStage.querySelectorAll('[data-depth]')];
   let queued=false;
   let normalizedX=0,normalizedY=0;
   depthStage.addEventListener('pointermove',event=>{
     const rect=depthStage.getBoundingClientRect();
     normalizedX=(event.clientX-rect.left)/rect.width-.5;
     normalizedY=(event.clientY-rect.top)/rect.height-.5;
     if(!queued){
       queued=true;
       requestAnimationFrame(()=>{
         queued=false;
         frames.forEach(frame=>{
           const factor=Number(frame.dataset.depth||0);
           frame.style.setProperty('--depth-x',(normalizedX*factor*165).toFixed(2)+'px');
           frame.style.setProperty('--depth-y',(normalizedY*factor*165).toFixed(2)+'px');
         });
       });
     }
   },{passive:true});
   depthStage.addEventListener('pointerleave',()=>{
     frames.forEach(frame=>{
       frame.style.setProperty('--depth-x','0px');
       frame.style.setProperty('--depth-y','0px');
     });
   });
 }

 // Physical response for calls to action. Maximum visual movement 5px.
 if(fine.matches && !calm()){
   for(const button of document.querySelectorAll('[data-magnetic]')){
     button.addEventListener('pointermove',event=>{
       const rect=button.getBoundingClientRect();
       const x=(event.clientX-rect.left)/rect.width-.5;
       const y=(event.clientY-rect.top)/rect.height-.5;
       button.style.setProperty('--mx',(x*8).toFixed(1)+'px');
       button.style.setProperty('--my',(y*8).toFixed(1)+'px');
     },{passive:true});
     button.addEventListener('pointerleave',()=>{
       button.style.setProperty('--mx','0px');
       button.style.setProperty('--my','0px');
     });
   }

   // A pointer-followed light accent makes feature surfaces feel responsive.
   for(const card of document.querySelectorAll('.la-spotlight')){
     card.addEventListener('pointermove',event=>{
       const rect=card.getBoundingClientRect();
       card.style.setProperty('--pointer-x',((event.clientX-rect.left)/rect.width*100).toFixed(1)+'%');
       card.style.setProperty('--pointer-y',((event.clientY-rect.top)/rect.height*100).toFixed(1)+'%');
     },{passive:true});
   }
 }

 // Counts represent exactly the underlying published records; nothing is simulated.
 const counters=[...document.querySelectorAll('[data-la-count]')];
 if(counters.length && 'IntersectionObserver' in window && !calm()){
   const watch=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
       if(!entry.isIntersecting)return;
       const counter=entry.target;
       const target=Math.max(0,Number(counter.dataset.laCount)||0);
       const started=performance.now();
       const duration=850;
       function frame(now){
         const t=Math.min(1,(now-started)/duration);
         const eased=1-Math.pow(1-t,3);
         counter.textContent=String(Math.round(target*eased)).padStart(target<10?2:1,'0');
         if(t<1)requestAnimationFrame(frame);
         else counter.textContent=String(target).padStart(target<10?2:1,'0');
       }
       requestAnimationFrame(frame);
       watch.unobserve(counter);
     });
   },{threshold:.45});
   counters.forEach(counter=>watch.observe(counter));
 }

 // ISLAND EXPLORER: actual button navigation with updated company/market and official photo.
 // Buttons use aria-pressed and native focus; ArrowLeft/Right/Home/End also work.
 const data=document.getElementById('la-regions');
 const buttons=[...document.querySelectorAll('[data-la-island]')];
 const panel=document.querySelector('[data-la-island-panel]');
 let regions=[];
 try{regions=JSON.parse(data?.textContent||'[]')}catch{}
 if(buttons.length && panel && regions.length===buttons.length){
   const name=panel.querySelector('[data-la-island-name]');
   const number=panel.querySelector('[data-la-island-number]');
   const company=panel.querySelector('[data-la-island-company]');
   const summary=panel.querySelector('[data-la-island-summary]');
   const photo=panel.querySelector('[data-la-island-image]');
   const link=panel.querySelector('[data-la-island-link]');
   let active=0;
   function setIsland(index,{focus=false}={}){
     if(index<0||index>=regions.length)return;
     const item=regions[index];
     active=index;
     buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
     if(focus)buttons[index].focus();
     if(!name||!company||!summary||!link||!photo)return;
     panel.classList.add('is-switching');
     // Content changes immediately for keyboard and screen-reader users.
     name.textContent=item.name;
     number.textContent=String(index+1);
     company.textContent=item.company;
     summary.textContent=item.summary;
     link.href=item.href;
     const text=link.querySelector('span:first-child');
     if(text)text.textContent='Explore '+item.name;
     const imageUrl=item.photo;
     if(imageUrl && photo.getAttribute('src')!==imageUrl){
       photo.classList.remove('media-broken');
       photo.src=imageUrl;
       photo.alt=item.alt;
     }
     const clear=()=>panel.classList.remove('is-switching');
     if(calm())clear();
     else requestAnimationFrame(()=>requestAnimationFrame(clear));
   }
   buttons.forEach((button,index)=>{
     button.addEventListener('click',()=>setIsland(index));
     button.addEventListener('keydown',event=>{
       let next=null;
       if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(active+1)%buttons.length;
       else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(active+buttons.length-1)%buttons.length;
       else if(event.key==='Home')next=0;
       else if(event.key==='End')next=buttons.length-1;
       if(next!==null){event.preventDefault();setIsland(next,{focus:true})}
     });
   });
 }

 // STORY RAIL: scroll-snap with working next/previous and disabled endpoint states.
 const rail=document.querySelector('[data-la-story-rail]');
 const prev=document.querySelector('[data-la-rail-prev]');
 const next=document.querySelector('[data-la-rail-next]');
 if(rail&&prev&&next){
   const update=()=>{
     const end=Math.max(0,rail.scrollWidth-rail.clientWidth);
     prev.disabled=rail.scrollLeft<=3;
     next.disabled=rail.scrollLeft>=end-3;
   };
   const advance=direction=>{
     const first=rail.querySelector('.la-story-card');
     const width=first?first.getBoundingClientRect().width:320;
     const gap=parseFloat(getComputedStyle(rail).gap)||18;
     rail.scrollBy({left:(width+gap)*direction,behavior:calm()?'instant':'smooth'});
     window.setTimeout(update,calm()?0:450);
   };
   prev.addEventListener('click',()=>advance(-1));
   next.addEventListener('click',()=>advance(1));
   rail.addEventListener('scroll',()=>{
     if(!rail.dataset.scrollQueued){
       rail.dataset.scrollQueued='1';
       requestAnimationFrame(()=>{delete rail.dataset.scrollQueued;update()});
     }
   },{passive:true});
   window.addEventListener('resize',update,{passive:true});
   update();
 }

 // Directory deep links from sector portals and island explorer actually filter results.
 const params=new URLSearchParams(location.search);
 const onDirectory=location.pathname.replace(/\/+$/,'')==='/directory';
 if(onDirectory){
   const sector=document.querySelector('[data-sector]');
   const search=document.querySelector('[data-search]');
   const selection=params.get('sector');
   const term=params.get('q');
   if(sector&&selection&&[...sector.options].some(option=>option.value===selection)){
     sector.value=selection;
     sector.dispatchEvent(new Event('change',{bubbles:true}));
   }
   if(search&&term){
     search.value=term.slice(0,120);
     search.dispatchEvent(new Event('input',{bubbles:true}));
   }
   // "/" is a familiar search shortcut but never steals focus from an active field.
   document.addEventListener('keydown',event=>{
     if(event.key!=='/'||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
     const target=event.target;
     if(target?.closest('input,textarea,select,[contenteditable],button'))return;
     if(search){event.preventDefault();search.focus()}
   });
 }


 // Directory controls are functional, not decorative. Pills mirror the native
 // sector <select>, and view options change real rendered card layout.
 if(onDirectory){
   const selector=document.querySelector('[data-sector]');
   const chips=[...document.querySelectorAll('[data-la-sector-chip]')];
   function syncChips(){
     const selected=selector?.value||'';
     chips.forEach(chip=>chip.setAttribute('aria-pressed',String((chip.dataset.laSectorChip||'')===selected)));
   }
   for(const chip of chips)chip.addEventListener('click',()=>{
     if(!selector)return;
     selector.value=chip.dataset.laSectorChip||'';
     selector.dispatchEvent(new Event('change',{bubbles:true}));
     const params=new URLSearchParams(location.search);
     if(selector.value)params.set('sector',selector.value);
     else params.delete('sector');
     const query=params.toString();
     if(history.replaceState)history.replaceState(null,'',location.pathname+(query?'?'+query:'')+location.hash);
     syncChips();
   });
   selector?.addEventListener('change',syncChips);
   syncChips();

   const layout=document.querySelector('[data-la-directory-layout]');
   const buttons=[...document.querySelectorAll('[data-la-view]')];
   const currentView=new URLSearchParams(location.search).get('view');
   function setView(view){
     if(!layout||!['grid','list'].includes(view))return;
     layout.dataset.view=view;
     buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.laView===view)));
   }
   for(const button of buttons)button.addEventListener('click',()=>setView(button.dataset.laView||'grid'));
   if(currentView==='list')setView('list');
 }

 // Image credits remain navigable source links; failures retain accessible fallbacks.
 const photoObserver=new MutationObserver(records=>{
   for(const record of records){
     if(record.type==='attributes'&&record.attributeName==='src'){
       const img=record.target;
       img.classList.remove('media-broken');
     }
   }
 });
 for(const img of document.querySelectorAll('[data-la-island-image]')){
   photoObserver.observe(img,{attributes:true,attributeFilter:['src']});
 }

 // Bound on progressive image errors in native capture mode.
 document.addEventListener('error',event=>{
   const img=event.target;
   if(img?.matches?.('img[data-editorial-photo]'))img.classList.add('media-broken');
 },true);

 // Universal command search — real directory and article routes, no API required.
 const command=document.querySelector('[data-la-command]');
 const commandIndex=document.getElementById('la-command-index');
 const searchOpeners=[...document.querySelectorAll('[data-la-search-open]')];
 if(command&&commandIndex&&typeof command.showModal==='function'){
   const input=command.querySelector('[data-la-command-input]');
   const results=command.querySelector('[data-la-command-results]');
   const closeButton=command.querySelector('[data-la-command-close]');
   let entries=[];
   let previouslyFocused=null;
   try{entries=JSON.parse(commandIndex.textContent||'[]')}catch{}
   function createNode(tag,className,text){
     const el=document.createElement(tag);
     if(className)el.className=className;
     if(text!==undefined)el.textContent=text;
     return el;
   }
   function renderCommand(term=''){
     if(!results)return;
     results.replaceChildren();
     const query=term.trim().toLocaleLowerCase();
     const matches=(query?entries.filter(record=>(record.name+' '+record.type+' '+record.detail).toLocaleLowerCase().includes(query)):entries).slice(0,7);
     if(!matches.length){
       const empty=createNode('p','la-command-empty','No matching businesses or stories. Try another search.');
       results.append(empty);
       return;
     }
     const list=createNode('div','la-command-list');
     for(const record of matches){
       if(!/^\/(?:directory|stories)\/[a-z0-9-]+\/$/.test(record.href))continue;
       const row=createNode('a','la-command-result');
       row.href=record.href;
       const tag=createNode('span','la-command-tag',record.type);
       const content=createNode('span','la-command-content');
       content.append(createNode('strong','',record.name),createNode('small','',record.detail));
       row.append(tag,content,createNode('span','la-command-arrow','↗'));
       list.append(row);
     }
     results.append(list);
   }
   function openCommand(){
     previouslyFocused=document.activeElement;
     if(!command.open)command.showModal();
     input.value='';
     renderCommand();
     requestAnimationFrame(()=>input.focus());
   }
   function closeCommand(){if(command.open)command.close();if(previouslyFocused?.isConnected&&typeof previouslyFocused.focus==='function')previouslyFocused.focus()}
   for(const opener of searchOpeners)opener.addEventListener('click',openCommand);
   closeButton?.addEventListener('click',closeCommand);
   command.addEventListener('click',event=>{if(event.target===command)closeCommand()});
   command.addEventListener('close',()=>{
     if(previouslyFocused?.isConnected&&typeof previouslyFocused.focus==='function')previouslyFocused.focus();
   });
   input?.addEventListener('input',()=>renderCommand(input.value));
   input?.addEventListener('keydown',event=>{
     if(event.key==='ArrowDown'){
       const first=results.querySelector('.la-command-result');
       if(first){event.preventDefault();first.focus()}
     }else if(event.key==='Enter'){
       const first=results.querySelector('.la-command-result');
       if(first){event.preventDefault();first.click()}
     }
   });
   results?.addEventListener('keydown',event=>{
     if(!['ArrowDown','ArrowUp'].includes(event.key))return;
     const links=[...results.querySelectorAll('.la-command-result')];
     const index=links.indexOf(document.activeElement);
     const next=links[index+(event.key==='ArrowDown'?1:-1)];
     if(next){event.preventDefault();next.focus()}
     else if(event.key==='ArrowUp'&&index===0){event.preventDefault();input.focus()}
   });
   document.addEventListener('keydown',event=>{
     if(event.key?.toLowerCase()==='k'&&(event.metaKey||event.ctrlKey)){
       event.preventDefault();
       if(command.open)closeCommand();else openCommand();
     }
   });
 }

})();
