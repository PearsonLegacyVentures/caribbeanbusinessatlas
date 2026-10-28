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
test('Living Atlas homepage has an immersive, genuinely interactive hierarchy',()=>{
 assert.match(root,/THE CARIBBEAN|CARIBBEAN/);
 assert.match(root,/la-hero-visual/);
 assert.match(root,/la-island-btn/);
 assert.match(root,/la-story-rail/);
 assert.match(root,/la-portal-grid/);
 assert.match(root,/Explore the Atlas/);
 assert.match(root,/Read the stories/);
 assert.match(root,/id="la-regions"/);
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
 assert.match(home,/la-hero-visual/);
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

test('futuristic palette, layered authentic images and motion guards exist',()=>{
 const motion=readFileSync('dist/living-atlas.css','utf8');
 const interaction=readFileSync('dist/living-atlas.js','utf8');
 for(const token of ['--la-night:','--la-lagoon:','--la-coral:','--la-sun:','--la-sand:'])assert.ok(motion.includes(token),token);
 for(const visual of ['la-hero-visual','la-islands-stage','la-spotlight','la-portal-grid','la-finale'])assert.ok(motion.includes('.'+visual),visual);
 assert.match(motion,/prefers-reduced-motion:reduce/);
 assert.match(interaction,/data-la-island/);
 assert.match(interaction,/aria-pressed/);
 assert.match(interaction,/data-la-story-rail/);
 assert.match(interaction,/prefers-reduced-motion: reduce/);
 assert.match(interaction,/clearFilters|setIsland/);
 for(const asset of ['living-atlas.css','living-atlas.js'])assert.ok(root.includes('/'+asset));
});
test('homepage interactions use actual content, not marketing counters',()=>{
 const records=JSON.parse(root.match(/<script type="application\/json" id="la-regions">([^<]+)<\/script>/)?.[1]||'[]');
 assert.equal(records.length,8);
 for(const record of records){
  const matches=companies.filter(c=>c.island===record.name && c.status!=='Research pending');
  assert.equal(record.count,matches.length);
  assert.ok(record.href.startsWith('/directory/?country='));
  assert.ok(record.company.length>2);
  assert.ok(record.photo.startsWith('https://'));
 }
 assert.ok(root.includes('data-la-count="'+companies.length+'"'));
 assert.ok(root.includes('data-la-count="'+stories.length+'"'));
});

test('search command palette has indexed, correct paths and valid accessible dialog',()=>{
 const page=html('');
 assert.match(page,/data-la-search-open/);
 assert.match(page,/data-la-command/);
 assert.match(page,/data-la-command-input/);
 const match=page.match(/<script type="application\/json" id="la-command-index">([^<]+)<\/script>/);
 assert.ok(match,'Search index JSON missing');
 const records=JSON.parse(match[1]);
 assert.equal(records.length,companies.length+stories.length);
 for(const record of records)assert.ok(/^\/(?:directory|stories)\/[a-z0-9-]+\/$/.test(record.href),record.href);
});
test('secondary page ribbons display authentic visual source references',()=>{
 for(const route of ['directory','stories','about','islands']){
  const page=html(route);
  assert.match(page,/la-photo-ribbon/);
  assert.match(page,/la-ribbon-source/);
  assert.match(page,/data-editorial-photo/);
 }
 assert.match(html('directory'),/data-la-sector-chip/);
 assert.match(html('directory'),/data-la-view="list"/);
 assert.match(html('directory'),/data-la-directory-layout/);
});


test('UI Taste polish preserves factual counts and clear directory language',()=>{
  const home=html('');
  const directory=html('directory');
  const journal=html('stories');
  assert.ok(home.includes('<strong>'+companies.length+'</strong><span>COMPANY PROFILES</span>'));
  assert.doesNotMatch(home,/la-float-plus/);
  assert.match(home,/data-la-ticker-toggle/);
  assert.match(directory,/directory-filter-help/);
  assert.match(directory,/Search companies, industries or islands/);
  assert.match(directory,/Results update as you search or select filters/);
  assert.match(journal,/FIELD NOTE/);
  assert.doesNotMatch(journal,/>1 MIN READ</);
});
test('UI Taste motion control has reduced-motion and accessible state support',()=>{
  const motion=readFileSync('dist/living-atlas.css','utf8');
  const behavior=readFileSync('dist/living-atlas.js','utf8');
  assert.match(motion,/\.la-ticker\.is-paused \.la-ticker-track/);
  assert.match(motion,/\.la-ticker-control:focus-visible/);
  assert.match(motion,/prefers-reduced-motion:reduce/);
  assert.match(behavior,/data-la-ticker-toggle/);
  assert.match(behavior,/aria-pressed/);
  assert.match(behavior,/Pause moving topics/);
});


test('published pages are indexable with canonical and accurate sitemap',()=>{
 const origin='https://mag.bahamasaisolutions.com';
 const robots=readFileSync('dist/robots.txt','utf8');
 const sitemap=readFileSync('dist/sitemap.xml','utf8');
 assert.match(robots,/User-agent: \*/);
 assert.match(robots,/Allow: \//);
 assert.doesNotMatch(robots,/Disallow:\s*\//);
 assert.match(robots,/Sitemap: https:\/\/mag\.bahamasaisolutions\.com\/sitemap\.xml/);
 assert.match(sitemap,/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
 for(const route of ['','directory/','stories/','islands/','about/','directory/tranquilitas-day-spa/','stories/tranquilitas-mobile-massage-caribbean/','directory/earthworks-pottery-barbados/']){
   const markup=html(route);
   const url=origin+'/'+route;
   assert.doesNotMatch(markup,/noindex,nofollow/);
   assert.ok(markup.includes('rel="canonical" href="'+url+'"'),'canonical missing '+url);
   assert.ok(sitemap.includes('<loc>'+url+'</loc>'),'sitemap missing '+url);
 }
 assert.ok(!sitemap.includes('/directory/creative-growth-agency/'));
 assert.ok(!sitemap.includes('/submit/'));
});
test('regional expansion contains sourced operating small-business profiles',()=>{
 const newSlugs=['the-new-duff','blue-mountain-tours-jamaica','earthworks-pottery-barbados','d-market-movers','fond-doux-eco-resort','grenada-chocolate-company','caicos-dream-tours','kreyol-essence'];
 assert.equal(companies.length,21);
 assert.equal(stories.length,13);
 for(const slug of newSlugs){
  const c=companies.find(c=>c.slug===slug);
  assert.ok(c,'missing '+slug);
  assert.ok(c.sources.length>=2,'missing sources: '+slug);
  assert.ok(c.url.startsWith('https://'));
  assert.ok(html('directory/'+slug).includes(c.summary));
 }
 assert.match(html('directory/d-market-movers'),/password-protected/);
 assert.equal(new Set(companies.map(c=>c.island).filter(c=>c!=='Caribbean location unconfirmed')).size,8);
});
test('Tranquilitas is prominently featured with clear commercial disclosure',()=>{
 const spa=companies.find(c=>c.slug==='tranquilitas-day-spa');
 assert.ok(spa.affiliated);
 assert.equal(companies[0].slug,'tranquilitas-day-spa');
 assert.match(root,/la-spa-feature/);
 assert.match(root,/TRANQUILITAS \/ MOBILE SPA/);
 assert.match(root,/FEATURED \/ PUBLISHER-AFFILIATED/);
 assert.match(root,/Book Tranquilitas/);
 assert.match(root,/massagebahamas\.com\/book/);
 assert.match(root,/No independently verified regional ranking is claimed/);
 const story=html('stories/tranquilitas-mobile-massage-caribbean');
 assert.match(story,/DISCLOSED PROMOTIONAL FEATURE/);
 assert.match(story,/publisher/);
 assert.match(story,/Book a Tranquilitas treatment/);
 assert.match(html('directory/tranquilitas-day-spa'),/publisher has a business interest/i);
});
