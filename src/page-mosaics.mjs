const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
/** Real media strips for the rest of the publication. No generated documentary photos. */
export function renderPhotoRibbon(slugs,companies,companyMedia,{variant='editorial',target='profile'}={}){
 const parts=slugs.map((slug,index)=>{
  const c=companies.find(x=>x.slug===slug);
  const m=companyMedia[slug];
  if(!c||!m)return '';
  const url=target==='market'?'/directory/?country='+encodeURIComponent(c.island):'/directory/'+encodeURIComponent(c.slug)+'/';
  return '<div class="la-ribbon-cell la-ribbon-cell-'+index+'"><a class="la-ribbon-photo" href="'+url+'" aria-label="Explore '+esc(c.name)+'"><span class="la-image-fallback" aria-hidden="true"><strong>✳</strong></span><img data-editorial-photo src="'+esc(m.url)+'" alt="'+esc(m.alt)+'" width="900" height="650" loading="lazy" decoding="async"><span class="la-ribbon-gradient"></span><span class="la-ribbon-label"><small>'+esc(c.island)+'</small><strong>'+esc(c.name)+'</strong><b aria-hidden="true">↗</b></span></a><a class="la-ribbon-source" href="'+esc(m.source)+'" target="_blank" rel="noopener noreferrer">'+esc(m.credit)+' / SOURCE ↗</a></div>';
 });
 return '<div class="la-photo-ribbon la-photo-ribbon-'+variant+'">'+parts.join('')+'</div>';
}
