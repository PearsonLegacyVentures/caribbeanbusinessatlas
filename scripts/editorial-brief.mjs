import{mkdir,writeFile}from'node:fs/promises';
import{stories,companies}from'../src/data.mjs';
const date=(process.argv.find(x=>x.startsWith('--date='))||'--date='+new Date().toISOString().slice(0,10)).split('=')[1];
if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Pass ISO date: --date=YYYY-MM-DD');
const themes=[
 {name:'Nassau tourism operators and distribution',sector:'Tourism',companies:['pedal-paradise-bahamas','tranquilitas-day-spa']},
 {name:'Caribbean payroll and operational technology',sector:'Technology',companies:['triblock-hr','bahamas-ai-solutions']},
 {name:'Local materials and commercial circularity',sector:'Manufacturing',companies:['bahamas-mineral-company','cocoloop-bahamas']},
 {name:'Regional business scale and market expansion',sector:'Regional Business',companies:['gracekennedy','massy-group','sagicor']}
];
const seed=Math.floor(Date.parse(date+'T00:00:00Z')/86400000);
const topic=themes[Math.abs(seed)%themes.length];
const selected=topic.companies.map(slug=>companies.find(c=>c.slug===slug)).filter(Boolean);
const text=[
 '# UNPUBLISHED EDITORIAL ASSIGNMENT',
 '',
 'Date prepared: '+date,
 'Status: RESEARCH PENDING — NOT APPROVED FOR PUBLICATION',
 'Working topic: '+topic.name,
 'Sector: '+topic.sector,
 '',
 '## Companies and official starting points',
 ...selected.map(c=>'- '+c.name+' — '+c.status+' — '+(c.url||'OFFICIAL SOURCE UNCONFIRMED')),
 '',
 '## Reporting checklist',
 '- [ ] Confirm the newsworthy question / reason for this story.',
 '- [ ] Interview operator or obtain original documents.',
 '- [ ] Verify every statistic and comparative claim using primary evidence.',
 '- [ ] Seek independent corroboration and explicitly label vendor claims.',
 '- [ ] Confirm URLs, entity identity, business stage and product availability.',
 '- [ ] Check source dates, photo permission and licensing.',
 '- [ ] Declare commercial or publisher ownership conflicts where relevant.',
 '- [ ] Draft a useful headline, standfirst and reader-focused article.',
 '- [ ] Editor approval before adding the text to published stories.',
 '',
 '## Existing related headlines — avoid repeating',
 ...stories.filter(x=>x.category===topic.sector).map(x=>'- '+x.title),
 '',
 'Created automatically as a research assignment, not as reporting or publication.',
 ''
].join('\n');
await mkdir('drafts',{recursive:true});
const path='drafts/'+date+'-editorial-brief.md';
await writeFile(path,text);
console.log('Unpublished editorial brief created: '+path);
