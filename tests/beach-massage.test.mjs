import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stories } from '../src/data.mjs';
import { storyMedia } from '../src/media.mjs';
import { SITE_ORIGIN } from '../src/site-config.mjs';

const slug='beach-massage-nassau-tranquilitas';
const route='/stories/'+slug+'/';
const story=stories.find(x=>x.slug===slug);
const html=()=>readFileSync('dist'+route+'index.html','utf8');

test('beach massage story is substantial, dated and sourced',()=>{
 assert.ok(story,'story exists');
 assert.equal(story.datePublished,'2026-10-28');
 assert.ok(story.title.includes('Beach Massage in Nassau'));
 assert.ok(story.summary.length>=80&&story.summary.length<=175);
 assert.ok(story.sections.length>=5);
 assert.ok(story.faqs.length>=4);
 const words=[...story.paragraphs,...story.sections.flatMap(x=>[x.heading,...x.paragraphs]),...story.faqs.flatMap(x=>[x.question,x.answer])].join(' ').trim().split(/\s+/).length;
 assert.ok(words>=750,'article must be a meaningful feature, not thin SEO filler');
 assert.ok(story.sources.length>=3);
 for(const src of story.sources)assert.ok(src.url.startsWith('https://www.massagebahamas.com/'));
});

test('beach massage page includes accessible sections, native FAQ and booking CTA',()=>{
 const markup=html();
 assert.match(markup,/<h1>Beach Massage in Nassau:/);
 assert.equal((markup.match(/class="story-body-section"/g)||[]).length,6);
 assert.equal((markup.match(/class="story-faq-item"/g)||[]).length,5);
 assert.match(markup,/<details class="story-faq-item"><summary>/);
 assert.match(markup,/aria-label="Reserve Tranquilitas beach massage"/);
 assert.match(markup,/Check beach massage availability/);
 assert.match(markup,/category=mobile&amp;service=beach-massage-nassau/);
 assert.match(markup,/DISCLOSED PROMOTIONAL FEATURE/);
 assert.match(markup,/This article discusses a venture connected to the publisher/);
 assert.match(markup,/Sources and further reading/);
 assert.match(markup,/28 OCT 2026/);
});

test('specific beach service claims and access restrictions are accurate in published HTML',()=>{
 const markup=html();
 for(const phrase of ['private or controlled waterfront','suitable','60-minute','90-minute','couples','weather','property permission','US$214.50','US$275','US$429']){
  assert.ok(markup.toLowerCase().includes(phrase.toLowerCase()),'Missing service information: '+phrase);
 }
 assert.doesNotMatch(markup,/(?:the )?#1 mobile spa in the Caribbean/i);
 assert.ok(markup.includes('not a claim of exclusive partnerships'));
});

test('article SEO preserves date, canonical path, sources and real company-media provenance',()=>{
 const markup=html();
 assert.ok(markup.includes('rel="canonical" href="'+SITE_ORIGIN+route+'"'));
 assert.ok(markup.includes('<title>Beach Massage Nassau Bahamas | Tranquilitas Guide</title>'));
 assert.ok(!markup.includes('noindex,nofollow'));
 const json=JSON.parse(markup.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]||'[]');
 const article=json.find(x=>x['@type']==='Article');
 assert.ok(article,'Article JSON-LD present');
 assert.equal(article.headline,story.title);
 assert.equal(article.datePublished,'2026-10-28');
 assert.equal(article.dateModified,'2026-10-28');
 assert.ok(article.image?.includes('static.wixstatic.com'));
 assert.ok(article.citation.includes('https://www.massagebahamas.com/beach-massage-nassau'));
 assert.ok(markup.includes('og:description'));
 assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('<loc>'+SITE_ORIGIN+route+'</loc>'));
 const m=storyMedia(slug);
 assert.ok(m?.url.startsWith('https://static.wixstatic.com/media/'));
 assert.equal(m.rights,'publisher-owned');
 assert.equal(m.source,'https://www.massagebahamas.com/best-massage-nassau-bahamas');
});

test('new beach massage feature is prominent on magazine homepage and journal',()=>{
 const homepage=readFileSync('dist/index.html','utf8');
 const journal=readFileSync('dist/stories/index.html','utf8');
 assert.ok(homepage.includes('/stories/'+slug+'/'));
 assert.ok(journal.includes('/stories/'+slug+'/'));
 assert.equal(stories[0].slug,slug);
});
