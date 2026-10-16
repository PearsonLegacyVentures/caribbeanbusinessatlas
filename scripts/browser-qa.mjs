// Zero-dependency Chromium smoke test for the static publication.
// Runs real viewport/layout and keyboard/filter checks against the generated dist.
import {createServer} from 'node:http';
import {readFileSync,existsSync} from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import path from 'node:path';

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
 const widths=[320,360,390,768,1280,1440];
 for(const width of widths){
   const {frame,d,w}=await open('/',width,800);
   const measured=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Homepage overflow '+width,measured<=1,'overflow px: '+measured);
   assert('Homepage heading '+width,Boolean(d.querySelector('h1')?.textContent.includes('Small islands')));
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
 for(const width of [320,390,768,1280]){
   const {frame,d,w}=await open('/directory/',width,850);
   const over=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Directory overflow '+width,over<=1,'overflow px: '+over);
   const search=d.querySelector('[data-search]'),count=d.querySelector('[data-count]');
   search.value='Pedal Paradise';search.dispatchEvent(new w.Event('input',{bubbles:true}));
   assert('Directory search '+width,count.textContent==='1');
   search.value='zzzz-no-company-999';search.dispatchEvent(new w.Event('input',{bubbles:true}));
   assert('Empty result '+width,count.textContent==='0'&&!d.querySelector('[data-empty]').hidden);
   d.querySelector('[data-clear-filters-empty]').click();
   assert('Reset filters '+width,count.textContent==='13'&&d.querySelector('[data-empty]').hidden);
   frame.remove();
 }
 for(const route of ['/stories/beyond-the-beach/','/directory/pedal-paradise-bahamas/','/submit/']){
   const {frame,d}=await open(route,320,800);
   const over=d.documentElement.scrollWidth-d.documentElement.clientWidth;
   assert('Page overflow '+route,over<=1,'overflow px: '+over);
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
const browser=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--window-size=1440,900','--virtual-time-budget=25000','--dump-dom','http://127.0.0.1:'+port+'/__qa__'],{stdio:['ignore','pipe','pipe']});
let stdout='',stderr='';
browser.stdout.on('data',d=>stdout+=d);
browser.stderr.on('data',d=>stderr+=d);
const watchdog=setTimeout(()=>browser.kill('SIGKILL'),90000);
const exit=await new Promise(resolve=>browser.on('close',resolve));
clearTimeout(watchdog);server.close();
const found=stdout.match(/<pre id="qa-result">([\s\S]*?)<\/pre>/);
if(!found){console.error(stderr.slice(-1200));throw Error('Chrome did not complete browser QA (exit '+exit+').')}
const decoded=found[1].replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const report=JSON.parse(decoded);
if(!report.complete)throw Error('Browser QA failed to execute: '+report.error);
for(const r of report.results)console.log((r.pass?'PASS':'FAIL')+' '+r.name+(r.detail?' — '+r.detail:''));
const failures=report.results.filter(r=>!r.pass);
console.log('Browser QA: '+(report.results.length-failures.length)+'/'+report.results.length+' checks passed');
if(failures.length)process.exitCode=1;
