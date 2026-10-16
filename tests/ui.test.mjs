import test from 'node:test';
import assert from 'node:assert/strict';
import{readFileSync,existsSync,readdirSync}from'node:fs';
import path from'node:path';
import{companies,stories}from'../src/data.mjs';
import{companyMedia,storyMedia}from'../src/media.mjs';

const html=route=>readFileSync(path.join('dist',route,'index.html'),'utf8');
const css=readFileSync('dist/styles.css','utf8');
const client=readFileSync('dist/app.js','utf8');
const root=html('');

test('HorizonX project design contract and agents instruction are committed',()=>{
  assert.ok(existsSync('ui-spec.yaml'));
  assert.ok(existsSync('AGENTS.md'));
  const spec=readFileSync('ui-spec.yaml','utf8');
  for(const part of ['tokens:','components:','responsive_rules:','accessibility:','motion:','quality_gates:'])assert.ok(spec.includes(part),part);
});
test('tokenized editorial system has declared semantic color and motion tokens',()=>{
  for(const name of ['--color-background','--color-text','--color-surface','--color-border','--color-accent','--color-focus','--duration-normal','--ease-enter'])assert.ok(css.includes(name+':'),name);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
const luminance=hex=>{
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
test('primary content contrast satisfies 4.5:1 target',()=>{
 assert.ok(contrast('#112B2A','#F6F3E9')>=4.5);
 assert.ok(contrast('#53665E','#F6F3E9')>=4.5);
 assert.ok(contrast('#112B2A','#DDF07B')>=4.5);
 assert.ok(contrast('#FFFFFF','#112B2A')>=4.5);
});
test('homepage has one leading editorial CTA and original sourced business photography',()=>{
 assert.match(root,/Read the journal/);
 assert.match(root,/hero-photo-collection/);
 assert.match(root,/THE COVER STORY/);
 assert.match(root,/Read the feature/);
 assert.match(root,/editorial-policy/);
});
test('mobile navigation exposes state, label, Escape close and accessible skip link',()=>{
 assert.match(root,/aria-controls="site-nav"/);
 assert.match(root,/aria-expanded="false"/);
 assert.match(root,/Skip to main content/);
 assert.match(client,/event\.key==='Escape'/);
 assert.match(client,/setMenu\(false,true\)/);
});
test('business directory has visible input labels, reset and readable empty state',()=>{
 const page=html('directory');
 for(const label of ['Search businesses','Industry','Country or market','Show all businesses'])assert.ok(page.includes(label),label);
 assert.match(page,/aria-live="polite"/);
 assert.match(page,/data-clear-filters/);
 assert.match(client,/clearFilters/);
});
test('prelaunch form does not solicit data until configured',()=>{
 const page=html('submit');
 assert.match(page,/SUBMISSIONS \/ COMING SOON/);
 assert.doesNotMatch(page,/<form\b/);
 assert.match(page,/There is no hidden waitlist or data collection/);
});
test('article and business views retain facts and source references',()=>{
 for(const s of stories){const page=html('stories/'+s.slug);assert.match(page,/article-visual/);assert.match(page,/article-navigation/);for(const source of s.sources||[])assert.ok(page.includes(source.url.replaceAll('&','&amp;')),s.slug+' '+source.url)}
 for(const c of companies){const page=html('directory/'+c.slug);assert.ok(page.includes(c.name));assert.match(page,/Business at a glance/);if(c.affiliated)assert.match(page,/[Pp]ublisher has a business interest/)}
});
test('all internal route URLs resolve within the generated output',()=>{
 const routeDirs=['', 'directory','stories','about','islands','submit','editorial-policy','privacy',...stories.map(x=>'stories/'+x.slug),...companies.map(x=>'directory/'+x.slug)];
 for(const dir of routeDirs){
   const page=html(dir);
   for(const found of page.matchAll(/href="(\/[^"#?]*)/g)){
     const target=decodeURIComponent(found[1]);
     if(target.match(/\.(css|js|svg)$/)){assert.ok(existsSync('dist'+target),dir+' -> '+target)}
     else{assert.ok(existsSync('dist'+target+'index.html'),dir+' -> '+target)}
   }
 }
});

test('all verified or publisher-owned companies have sourced visual records',()=>{
 const visualSlugs=companies.filter(c=>c.slug!=='creative-growth-agency').map(c=>c.slug);
 for(const slug of visualSlugs){
  const m=companyMedia[slug];
  assert.ok(m,'Missing business image: '+slug);
  assert.ok(m.url.startsWith('https://'),'Invalid photo URL: '+slug);
  assert.ok(m.source.startsWith('https://'),'Invalid image source: '+slug);
  assert.ok(m.alt.length>25,'Missing substantive alt text: '+slug);
  assert.ok(m.credit.length>3);
  assert.ok(['permission-pending','publisher-owned'].includes(m.rights));
 }
 assert.equal(companyMedia['creative-growth-agency'],undefined,'Do not fabricate an image for an unverified business');
});
test('real business imagery appears on the homepage, directory, articles and profiles',()=>{
 const home=html(''),directory=html('directory'),story=html('stories/pedal-paradise-nassau-experience'),profile=html('directory/pedal-paradise-bahamas');
 for(const page of [home,directory,story,profile])assert.match(page,/data-editorial-photo/);
 assert.match(home,/hero-photo-collection/);
 assert.doesNotMatch(home,/hero-cartography/);
 assert.match(home,/Photo|website|Company photograph|gallery|TOURISM/i);
 assert.match(directory,/media-unverified/);
 assert.match(directory,/Pedal Paradise Bahamas/);
 assert.match(story,/pedalparadiseadventures\.com/);
 assert.match(profile,/Image source:/);
});
test('editorial article photo associations refer to actual source records',()=>{
 for(const s of stories){const m=storyMedia(s.slug);assert.ok(m,s.slug);assert.ok(m.source.startsWith('https://'))}
});
