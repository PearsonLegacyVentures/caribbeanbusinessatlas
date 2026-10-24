import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { companies, stories } from '../src/data.mjs';
import { SITE_ORIGIN, SITE_NAME, UNREADY_ROUTES } from '../src/site-config.mjs';

const get=route=>readFileSync(path.join('dist',route,'index.html'),'utf8');
const canonical=markup=>markup.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const metas=(markup,key)=>markup.match(new RegExp('<meta '+key+'="([^"]*)" content="([^"]*)"'))?.[2];
const ld=markup=>{
 const raw=markup.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
 assert.ok(raw,'structured JSON-LD is present');
 return JSON.parse(raw);
};

test('sitewide canonical domain is mag.bahamasaisolutions.com',()=>{
 assert.equal(SITE_ORIGIN,'https://mag.bahamasaisolutions.com');
 assert.equal(SITE_NAME,'Caribbean Business Atlas');
 const routes=['','directory','stories','islands','about','editorial-policy','privacy','submit',
  ...companies.map(c=>'directory/'+c.slug),
  ...stories.map(s=>'stories/'+s.slug)];
 for(const route of routes){
  const markup=get(route);
  const url=SITE_ORIGIN+'/'+(route?route+'/':'');
  assert.equal(canonical(markup),url,'canonical '+route);
  assert.ok(markup.includes('<meta property="og:url" content="'+url+'">'),'OG URL '+route);
  assert.ok(markup.includes('<meta name="twitter:title"'),'Twitter title '+route);
  assert.ok(!markup.includes('caribbeanbusinessatlas.pages.dev'),'old host leaked in '+route);
  if(!UNREADY_ROUTES.has('/'+(route?route+'/':''))){
   assert.ok(!/<meta name="robots" content="noindex/.test(markup),'unexpected noindex '+route);
  }
 }
});

test('sitemap and robots publish only official-domain, indexable routes',()=>{
 const xml=readFileSync('dist/sitemap.xml','utf8');
 const robots=readFileSync('dist/robots.txt','utf8');
 assert.match(robots,/^User-agent: \*/m);
 assert.match(robots,/^Allow: \/$/m);
 assert.ok(robots.includes('Sitemap: '+SITE_ORIGIN+'/sitemap.xml'));
 assert.ok(!robots.includes('pages.dev'));
 assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
 const urls=[...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(x=>x[1]);
 assert.equal(urls.length,39);
 assert.equal(new Set(urls).size,urls.length);
 for(const url of urls){
  assert.ok(url.startsWith(SITE_ORIGIN+'/'),url);
  const parsed=new URL(url),route=parsed.pathname;
  const file=path.join('dist',route,'index.html');
  assert.ok(existsSync(file),'sitemap target missing '+file);
  assert.ok(!get(route).includes('name="robots" content="noindex'),'sitemap target noindexed '+url);
 }
 for(const route of UNREADY_ROUTES){
  assert.ok(!urls.includes(SITE_ORIGIN+route));
  assert.match(get(route),/<meta name="robots" content="noindex,follow">/);
 }
});

test('category pages have distinct, meaningful descriptions and concise titles',()=>{
 const pages=['','directory','stories','islands','about','editorial-policy','privacy'];
 const descriptions=new Set();
 for(const route of pages){
  const markup=get(route);
  const desc=markup.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const title=markup.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(desc && desc.length>70 && desc.length<190,'invalid description '+route+' '+desc);
  assert.ok(title && title.length<=70,'title too long '+route+' '+title);
  assert.ok(!descriptions.has(desc),'duplicate description '+route);
  descriptions.add(desc);
  assert.ok(markup.includes('<meta property="og:description" content="'+desc+'">'));
 }
 for(const story of stories){
  const markup=get('stories/'+story.slug);
  const title=markup.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title && title.length<=72,'article title too long '+story.slug+' '+title);
  assert.ok(markup.includes('<h1>'+story.title+'</h1>'),'editorial headline preserved '+story.slug);
 }
});

test('structured data uses canonical publisher IDs, actual business profiles and navigable breadcrumbs',()=>{
 const index=ld(get(''));
 const website=index.find(x=>x['@type']==='WebSite');
 assert.equal(website.url,SITE_ORIGIN+'/');
 assert.equal(website['@id'],SITE_ORIGIN+'/#website');
 assert.equal(website.potentialAction.target.urlTemplate,SITE_ORIGIN+'/directory/?q={search_term_string}');
 const listing=ld(get('directory'));
 const collection=listing.find(x=>x['@type']==='CollectionPage');
 assert.ok(collection);
 assert.equal(collection.mainEntity.itemListElement.length,companies.filter(c=>c.status!=='Research pending').length);
 assert.ok(collection.mainEntity.itemListElement.every(x=>x.url.startsWith(SITE_ORIGIN+'/directory/')));
 const company=ld(get('directory/tranquilitas-day-spa'));
 assert.ok(company.some(x=>x['@type']==='Organization'&&x.name==='Tranquilitas Day Spa'&&x.mainEntityOfPage===SITE_ORIGIN+'/directory/tranquilitas-day-spa/'));
 const crumbs=company.find(x=>x['@type']==='BreadcrumbList');
 assert.deepEqual(crumbs.itemListElement.map(c=>c.name),['Home','Business directory','Tranquilitas Day Spa']);
 const article=ld(get('stories/tranquilitas-mobile-massage-caribbean')).find(x=>x['@type']==='Article');
 assert.equal(article.url,SITE_ORIGIN+'/stories/tranquilitas-mobile-massage-caribbean/');
 assert.equal(article.publisher['@id'],SITE_ORIGIN+'/#publisher');
 assert.ok(article.citation.length>=2);
});

test('404 does not claim the homepage as its canonical identity',()=>{
 const notFound=readFileSync('dist/404.html','utf8');
 assert.equal(canonical(notFound),SITE_ORIGIN+'/404');
 assert.match(notFound,/<meta name="robots" content="noindex,follow">/);
});
