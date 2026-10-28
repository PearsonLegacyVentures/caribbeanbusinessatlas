// Zero-dependency Chromium smoke test for the static publication.
// Runs real viewport/layout and keyboard/filter checks against the generated dist.
import {createServer} from 'node:http';
import {readFileSync,existsSync,mkdtempSync,rmSync} from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';

const testPage=String.raw`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CBA browser QA</title></head><body>
<pre id="qa-result">RUNNING</pre><script>
(async()=>{
 const results=[];
 const assert=(name,ok,detail='')=>results.push({name,pass:Boolean(ok),detail});
 async function open(route,width,height){
  const frame=document.createElement('iframe');
  frame.style.width=width+'px';frame.style.height=height+'px';frame.style.border='0';
  frame.src=route;
  document.body.append(frame);
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Load timeout '+route)),7000);frame.addEventListener('load',()=>{clearTimeout(timer);resolve()},{once:true})});
  const d=frame.contentDocument,w=frame.contentWindow;
  await new Promise(resolve=>w.requestAnimationFrame(()=>w.requestAnimationFrame(resolve)));
  return {frame,d,w};
 }
 const offenders=d=>{
   const max=d.documentElement.clientWidth;
   return [...d.querySelectorAll('body *')].map(el=>({tag:el.tagName.toLowerCase(),cls:String(el.className||'').slice(0,70),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}))
      .filter(x=>x.right>max+1).slice(0,12);
 };
 const widths=[320,360,390,768,840,900,1024,1280,1440];
 for(const width of widths){
   const {frame,d,w}=await open('/',width,800);
   const measured=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Homepage overflow '+width,measured<=1,'overflow px: '+measured+' elements: '+JSON.stringify(measured>1?offenders(d):[]));
   assert('Homepage heading '+width,Boolean(d.querySelector('h1')?.textContent.includes('CARIBBEAN')));
   const toggle=d.querySelector('[data-menu-toggle]');
   const mobile=width<=820;
   assert('Navigation breakpoint '+width,(w.getComputedStyle(toggle).display!=='none')===mobile);
   if(mobile){
     assert('Mobile target '+width,toggle.getBoundingClientRect().height>=44);
     toggle.click();
     assert('Menu opens '+width,toggle.getAttribute('aria-expanded')==='true'&&!d.querySelector('[data-nav]').hidden);
     d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
     assert('Escape closes '+width,toggle.getAttribute('aria-expanded')==='false'&&d.activeElement===toggle);
   }
   frame.remove();
 }

 {
   const {frame,d}=await open('/',1280,850);
   const heroImages=[...d.querySelectorAll('.la-hero-visual img[data-editorial-photo]')];
   await Promise.race([
     Promise.allSettled(heroImages.map(img=>img.decode())),
     new Promise(resolve=>setTimeout(resolve,8500))
   ]);
   const loaded=heroImages.filter(img=>img.naturalWidth>0).length;
   assert('Hero documentary images load',loaded>=2,'loaded '+loaded+' of '+heroImages.length+' official business-source photos');
   frame.remove();
 }

 // Native interactions, not decorative fake controls.
 {
   const {frame,d,w}=await open('/',390,820);

   assert('Tranquilitas promotional section present',Boolean(d.querySelector('.la-spa-feature')?.textContent.includes('Tranquilitas')));
   assert('Tranquilitas booking action works',d.querySelector('.la-spa-actions a')?.href==='https://www.massagebahamas.com/book');
   assert('Publisher promotion disclosed',d.querySelector('.la-spa-disclosure')?.textContent.includes('connected to the publisher'));

   const buttons=[...d.querySelectorAll('[data-la-island]')];
   const heading=d.querySelector('[data-la-island-company]');
   assert('Eight island choices exist',buttons.length===8);
   buttons[1]?.click();
   assert('Island click changes real company',heading?.textContent==='Blue Mountain Tours Jamaica');
   assert('Island press state moves',buttons[1]?.getAttribute('aria-pressed')==='true'&&buttons[0]?.getAttribute('aria-pressed')==='false');
   assert('Island link updates destination',d.querySelector('[data-la-island-link]')?.getAttribute('href')?.includes('Jamaica'));
   buttons[1]?.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
   assert('Island keyboard navigation',heading?.textContent==='Earthworks Pottery');
   const prev=d.querySelector('[data-la-rail-prev]'),next=d.querySelector('[data-la-rail-next]'),rail=d.querySelector('[data-la-story-rail]');
   assert('Functional story rail buttons',Boolean(prev&&next&&rail));
   assert('Story rail is horizontally scrollable',rail?.scrollWidth>rail?.clientWidth);

   const ticker=d.querySelector('.la-ticker');
   const tickerButton=d.querySelector('[data-la-ticker-toggle]');
   assert('Moving topics have accessible pause button',Boolean(ticker&&tickerButton&&!tickerButton.hidden));
   tickerButton?.click();
   assert('Moving topics pause',ticker?.classList.contains('is-paused')===true&&tickerButton.getAttribute('aria-pressed')==='true');
   assert('Motion button clearly offers resume',tickerButton?.textContent==='Resume motion');
   tickerButton?.click();
   assert('Moving topics resume',ticker?.classList.contains('is-paused')===false&&tickerButton.getAttribute('aria-pressed')==='false');

   frame.remove();
 }


 // Universal command search: real records, keyboard shortcut, close and focus return.
 {
   const {frame,d,w}=await open('/',390,820);
   const trigger=d.querySelector('[data-la-search-open]');
   const dialog=d.querySelector('[data-la-command]');
   trigger?.click();
   assert('Command search opens',dialog?.open===true);
   const input=d.querySelector('[data-la-command-input]');
   input.value='Pedal Paradise';
   input.dispatchEvent(new w.Event('input',{bubbles:true}));
   const results=[...d.querySelectorAll('.la-command-result')];
   assert('Command search returns actual business and story',results.length>=2&&results.some(x=>x.getAttribute('href')==='/directory/pedal-paradise-bahamas/'));
   d.querySelector('[data-la-command-close]')?.click();
   assert('Command search closes',dialog?.open===false);
   assert('Command search returns focus',d.activeElement===trigger);
   frame.remove();
 }

 for(const width of [320,390,768,1280]){
   const {frame,d,w}=await open('/directory/',width,850);
   const over=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Directory overflow '+width,over<=1,'overflow px: '+over+' elements: '+JSON.stringify(over>1?offenders(d):[]));
   const search=d.querySelector('[data-search]'),count=d.querySelector('[data-count]');
   search.value='Pedal Paradise';search.dispatchEvent(new w.Event('input',{bubbles:true}));
   assert('Directory search '+width,count.textContent==='1');
   search.value='zzzz-no-company-999';search.dispatchEvent(new w.Event('input',{bubbles:true}));
   assert('Empty result '+width,count.textContent==='0'&&!d.querySelector('[data-empty]').hidden);
   d.querySelector('[data-clear-filters-empty]').click();
   assert('Reset filters '+width,count.textContent==='21'&&d.querySelector('[data-empty]').hidden);
   frame.remove();
 }

 {
   const {frame,d,w}=await open('/directory/?sector=Technology',390,850);
   const selected=d.querySelector('[data-sector]')?.value;
   const visible=[...d.querySelectorAll('[data-company]')].filter(c=>!c.hidden);
   assert('Industry deep links preselect filters',selected==='Technology');
   assert('Industry deep links filter real cards',visible.length>0&&visible.every(c=>c.dataset.sector==='Technology'));
   frame.remove();
 }


 {
   const {frame,d,w}=await open('/directory/',390,850);
   const chips=[...d.querySelectorAll('[data-la-sector-chip]')];
   const select=d.querySelector('[data-sector]');
   const technology=chips.find(c=>c.dataset.laSectorChip==='Technology');
   technology?.click();
   assert('Sector pill changes actual filter',select?.value==='Technology'&&technology?.getAttribute('aria-pressed')==='true');
   const filtered=[...d.querySelectorAll('[data-company]')].filter(c=>!c.hidden);
   assert('Sector pill filters cards',filtered.length>0&&filtered.every(c=>c.dataset.sector==='Technology'));
   chips.find(c=>c.dataset.laSectorChip==='')?.click();
   assert('All pill restores cards',d.querySelector('[data-count]')?.textContent==='21');
   d.querySelector('[data-la-view="list"]')?.click();
   assert('List view changes real card layout',d.querySelector('[data-la-directory-layout]')?.dataset.view==='list');
   assert('List button updates pressed state',d.querySelector('[data-la-view="list"]')?.getAttribute('aria-pressed')==='true');
   frame.remove();
 }


 {
   const {frame,d,w}=await open('/islands/',320,900);
   const all=[...d.querySelectorAll('.region-row')];
   assert('Eight Caribbean regional destination links',all.length===8);
   assert('Source-linked real photos on region page',d.querySelectorAll('.la-ribbon-photo img[data-editorial-photo]').length>=8);
   frame.remove();
 }


 // Editorial feature: native FAQ, direct booking, authentic source image and all screen sizes.
 for(const width of [320,390,768,1280]){
   const {frame,d,w}=await open('/stories/beach-massage-nassau-tranquilitas/',width,880);
   const over=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Beach article responsive '+width,over<=1,'overflow px: '+over+' '+JSON.stringify(over>1?offenders(d):[]));
   assert('Beach article headings '+width,d.querySelectorAll('.story-body-section h2').length===6);
   assert('Beach FAQ disclosure controls '+width,d.querySelectorAll('.story-faq-item').length===5);
   const first=d.querySelector('.story-faq-item');
   first?.querySelector('summary')?.click();
   assert('Beach FAQ expand '+width,first?.open===true);
   first?.querySelector('summary')?.click();
   assert('Beach FAQ collapse '+width,first?.open===false);
   const booking=d.querySelector('.story-booking-actions .la-btn');
   assert('Beach massage direct booking '+width,booking?.href.includes('/booking?category=mobile&service=beach-massage-nassau'));
   assert('Beach promo disclosure '+width,d.querySelector('.story-booking-disclosure')?.textContent.includes('Publisher-affiliated'));
   if(width===390){
     const img=d.querySelector('.article-visual img[data-editorial-photo]');
     if(img)await Promise.race([img.decode().catch(()=>{}),new Promise(resolve=>setTimeout(resolve,8500))]);
     assert('Beach image loads from official service page',Boolean(img?.naturalWidth),img?.currentSrc||'no image');
   }
   frame.remove();
 }

 for(const route of ['/stories/beyond-the-beach/','/directory/pedal-paradise-bahamas/','/stories/','/about/','/islands/','/stories/tranquilitas-mobile-massage-caribbean/','/directory/earthworks-pottery-barbados/','/submit/']){
   const {frame,d}=await open(route,320,800);
   const over=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Page overflow '+route,over<=1,'overflow px: '+over+' elements: '+JSON.stringify(over>1?offenders(d):[]));
   if(route==='/submit/')assert('Review data honesty',!d.querySelector('form')&&d.body.textContent.includes('COMING SOON'));
   frame.remove();
 }
 document.querySelector('#qa-result').textContent=JSON.stringify({complete:true,results});
})().catch(e=>{document.querySelector('#qa-result').textContent=JSON.stringify({complete:false,error:String(e)})});
</script></body></html>`;

function resolveChrome(){
  for(const candidate of [process.env.CHROME_BIN,'google-chrome','google-chrome-stable','chromium','chromium-browser'].filter(Boolean)){
    if(candidate.includes('/')){if(existsSync(candidate))return candidate;continue}
    const result=spawnSync('which',[candidate],{encoding:'utf8'});
    if(result.status===0)return result.stdout.trim();
  }
  throw Error('A Chromium-family browser is required for viewport QA.');
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const server=createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/__qa__'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(testPage);return}
  let target;
  try{
    const safe=decodeURIComponent(url.pathname);
    if(safe.includes('..'))throw Error('Invalid path');
    target=path.join('dist',safe);
    if(safe.endsWith('/'))target=path.join(target,'index.html');
    else if(!path.extname(target))target=path.join(target,'index.html');
    if(!existsSync(target)){res.writeHead(404);res.end('Not found');return}
    const ext=path.extname(target);
    res.writeHead(200,{'content-type':mime[ext]||'application/octet-stream'});
    res.end(readFileSync(target));
  }catch{res.writeHead(400);res.end('Invalid path')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const chrome=resolveChrome();
const userDataDir=mkdtempSync(path.join(os.tmpdir(),'cba-browser-'));
const browser=spawn(chrome,[
  '--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--remote-allow-origins=*','--remote-debugging-port=0',
  '--user-data-dir='+userDataDir,'--window-size=1440,900',
  'http://127.0.0.1:'+port+'/__qa__'
],{stdio:['ignore','pipe','pipe']});
let stderr='';
browser.stderr.on('data',d=>stderr+=d.toString());
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const deadline=Date.now()+75000;
async function awaitTab(){
  while(Date.now()<deadline){
    const activePort=path.join(userDataDir,'DevToolsActivePort');
    if(existsSync(activePort)){
      const portNumber=Number(readFileSync(activePort,'utf8').split('\n')[0]);
      if(Number.isFinite(portNumber)){
        try{
          const response=await fetch('http://127.0.0.1:'+portNumber+'/json');
          const targets=await response.json();
          const target=targets.find(x=>x.type==='page'&&x.url.includes('/__qa__'));
          if(target?.webSocketDebuggerUrl)return target.webSocketDebuggerUrl;
        }catch{}
      }
    }
    await sleep(180);
  }
  throw Error('Chrome DevTools target not found. '+stderr.slice(-500));
}
let socket;
try{
  const target=await awaitTab();
  socket=new WebSocket(target);
  await new Promise((resolve,reject)=>{
    socket.addEventListener('open',resolve,{once:true});
    socket.addEventListener('error',reject,{once:true});
  });
  let sequence=0;
  const pending=new Map();
  socket.addEventListener('message',event=>{
    const message=JSON.parse(event.data);
    if(message.id&&pending.has(message.id)){
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });
  function send(method,params={}){
    return new Promise((resolve,reject)=>{
      const id=++sequence;
      const timeout=setTimeout(()=>{pending.delete(id);reject(Error('DevTools timeout: '+method))},5000);
      pending.set(id,result=>{clearTimeout(timeout);resolve(result)});
      socket.send(JSON.stringify({id,method,params}));
    });
  }
  await send('Runtime.enable');
  let report=null;
  while(Date.now()<deadline){
    const response=await send('Runtime.evaluate',{expression:"document.querySelector('#qa-result')?.textContent || ''",returnByValue:true});
    const text=response.result?.result?.value||'';
    if(text&&text!=='RUNNING'){
      report=JSON.parse(text);
      break;
    }
    await sleep(220);
  }
  if(!report)throw Error('Timed out waiting for browser QA to finish.');
  if(!report.complete)throw Error('Browser QA script error: '+report.error);
  for(const r of report.results)console.log((r.pass?'PASS':'FAIL')+' '+r.name+(r.detail?' — '+r.detail:''));
  const failures=report.results.filter(r=>!r.pass);
  console.log('Browser QA: '+(report.results.length-failures.length)+'/'+report.results.length+' checks passed');
  if(failures.length)process.exitCode=1;
}finally{
  socket?.close();
  browser.kill();
  server.close();
  try{rmSync(userDataDir,{recursive:true,force:true})}catch{}
}
