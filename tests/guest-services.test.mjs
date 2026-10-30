import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stories} from '../src/data.mjs';
import {storyMedia} from '../src/media.mjs';
import {SITE_ORIGIN} from '../src/site-config.mjs';
const slug='caribbean-guest-services-tourism-2026',route='/stories/'+slug+'/',story=stories.find(x=>x.slug===slug);
const page=()=>readFileSync('dist'+route+'index.html','utf8');
test('guest services article is original, timely, substantial and sourced',()=>{
 assert.ok(story);assert.equal(story.datePublished,'2026-10-30');
 assert.equal(stories.filter(x=>x.slug===slug).length,1);
 const words=[...story.paragraphs,...story.sections.flatMap(s=>[s.heading,...s.paragraphs])].join(' ').trim().split(/\s+/).length;
 assert.ok(words>=700&&words<=1100,'word count: '+words);
 assert.ok(story.sections.length>=6);assert.ok(story.sources.length>=5);
 for(const host of ['onecaribbean.org','airbnb.com','massagebahamas.com'])assert.ok(story.sources.some(x=>x.url.includes(host)),host);
});
test('article has canonical SEO, visible conflict disclosure and useful CTA',()=>{
 const html=page();
 assert.ok(html.includes('<h1>'+story.title+'</h1>'));
 for(const phrase of ['PUBLISHER-AFFILIATED CASE STUDY','This article discusses a venture connected to the publisher','has not verified a Nassau Services marketplace','Explore Tranquilitas mobile appointments','Explore the company profile','Sources and further reading'])assert.ok(html.includes(phrase),phrase);
 assert.ok(html.includes('rel="canonical" href="'+SITE_ORIGIN+route+'"'));
 assert.ok(html.includes('<title>Caribbean Tourism 2026 | Local Guest Services &amp; Revenue</title>'));
 assert.ok(readFileSync('dist/sitemap.xml','utf8').includes('<loc>'+SITE_ORIGIN+route+'</loc>'));
 const schema=JSON.parse(html.split('<script type="application/ld+json">')[1].split('</script>')[0]);
 const item=schema.find(x=>x['@type']==='Article');
 assert.equal(item.datePublished,'2026-10-30');
 assert.ok(item.citation.some(x=>x.includes('onecaribbean.org')));
});
test('image is sourced and story appears in the homepage and journal',()=>{
 const image=storyMedia(slug);
 assert.equal(image.rights,'publisher-owned');assert.ok(image.source.includes('massagebahamas.com'));
 assert.ok(page().includes(image.url.replaceAll('&','&amp;')));
 assert.ok(readFileSync('dist/index.html','utf8').includes(route));
 assert.ok(readFileSync('dist/stories/index.html','utf8').includes(route));
});
