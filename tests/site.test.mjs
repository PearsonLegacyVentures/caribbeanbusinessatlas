import test from 'node:test';
import assert from 'node:assert/strict';
import{existsSync,readFileSync}from'node:fs';
import{companies,stories}from'../src/data.mjs';
test('unique company and article slugs',()=>{assert.equal(new Set(stories.map(x=>x.slug)).size,stories.length);assert.equal(new Set(companies.map(x=>x.slug)).size,companies.length)});
test('static routes include new firms and original articles',()=>{const routes=['','directory','stories','about','islands','submit','editorial-policy','privacy',...stories.map(x=>'stories/'+x.slug),...companies.map(x=>'directory/'+x.slug)];assert.equal(routes.length,8+stories.length+companies.length);for(const r of routes)assert.ok(existsSync('dist/'+r+'/index.html'),r)});
test('public pages permit search indexing and advertise sitemap',()=>{const robots=readFileSync('dist/robots.txt','utf8');assert.match(robots,/Allow:\s*\//);assert.doesNotMatch(robots,/Disallow:\s*\//);assert.match(robots,/Sitemap: https:\/\/mag\.bahamasaisolutions\.com\/sitemap\.xml/);for(const page of ['dist/index.html','dist/directory/index.html']){const markup=readFileSync(page,'utf8');assert.doesNotMatch(markup,/noindex,nofollow/);assert.match(markup,/rel="canonical"/)}});
test('all article source URLs use HTTPS',()=>{for(const item of [...stories,...companies])for(const s of item.sources||[])assert.ok(/^https:\/\//.test(s.url),s.url)});
test('all planned ventures retain developmental status',()=>{assert.equal(companies.find(x=>x.slug==='cocoloop-bahamas').status,'In development');assert.equal(companies.find(x=>x.slug==='creative-growth-agency').status,'Research pending')});
test('all business pages expose source context',()=>{for(const c of companies){const html=readFileSync('dist/directory/'+c.slug+'/index.html','utf8');assert.ok(html.includes(c.name.replaceAll('&','&amp;').replaceAll('’','’'))||html.includes('Caribbean Business Atlas'));assert.match(html,/Business at a glance/)}});

test('approved November stories render with disclosures, source links and canonical URLs',()=>{
 for(const slug of ['nassau-couples-massage-honeymoon-anniversary-guide','caribbean-experiences-market-ready-2026','bahamas-yacht-wellness-concierge-massage-2026']){
  const story=stories.find(s=>s.slug===slug);
  assert.ok(story,slug);assert.equal(story.affiliated,true);assert.ok(story.sources.length>=4);
  const html=readFileSync('dist/stories/'+slug+'/index.html','utf8');
  assert.match(html,/Tranquilitas/i);assert.match(html,/rel="canonical"/);assert.ok(html.includes(slug));
  assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('/stories/'+slug+'/'));
 }
});

test('weather resilience feature is included in generated routes and sitemap',()=>{const slug='caribbean-tourism-weather-resilience-booking-2026';const story=stories.find(x=>x.slug===slug);assert.ok(story);assert.equal(story.affiliated,true);assert.ok(story.sources.length>=5);const html=readFileSync('dist/stories/'+slug+'/index.html','utf8');assert.match(html,/Tranquilitas/i);assert.match(html,/rel="canonical"/);assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('/stories/'+slug+'/'))});
