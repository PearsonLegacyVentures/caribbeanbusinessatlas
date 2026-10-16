/* Caribbean Business Atlas interaction states — ui-spec.yaml */
(()=>{'use strict';
  const toggle=document.querySelector('[data-menu-toggle]');
  const nav=document.querySelector('[data-nav]');
  const mobile=window.matchMedia('(max-width: 820px)');
  let menuOpen=false;
  function setMenu(open,returnFocus=false){
    if(!toggle||!nav)return;
    menuOpen=Boolean(open&&mobile.matches);
    toggle.setAttribute('aria-expanded',String(menuOpen));
    toggle.setAttribute('aria-label',menuOpen?'Close navigation':'Open navigation');
    toggle.querySelector('.menu-word').textContent=menuOpen?'Close':'Menu';
    nav.toggleAttribute('data-open',menuOpen);
    if(returnFocus&&mobile.matches)toggle.focus();
  }
  toggle?.addEventListener('click',()=>setMenu(!menuOpen));
  nav?.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false)});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuOpen){event.preventDefault();setMenu(false,true)}});
  document.addEventListener('pointerdown',event=>{if(menuOpen&&!nav?.contains(event.target)&&!toggle?.contains(event.target))setMenu(false)});
  mobile.addEventListener('change',()=>setMenu(false));

  const search=document.querySelector('[data-search]');
  const sector=document.querySelector('[data-sector]');
  const country=document.querySelector('[data-country-filter]');
  const cards=[...document.querySelectorAll('[data-company]')];
  const empty=document.querySelector('[data-empty]');
  const count=document.querySelector('[data-count]');
  const clear=document.querySelector('[data-clear-filters]');
  const clearEmpty=document.querySelector('[data-clear-filters-empty]');
  const initialCountry=new URLSearchParams(location.search).get('country');
  if(country&&initialCountry&&[...country.options].some(option=>option.value===initialCountry))country.value=initialCountry;
  function filter(){
    if(!cards.length)return;
    const text=(search?.value||'').trim().toLocaleLowerCase();
    const selectedSector=sector?.value||'';
    const selectedCountry=country?.value||'';
    let visible=0;
    for(const card of cards){
      const show=card.dataset.company.includes(text)&&(!selectedSector||card.dataset.sector===selectedSector)&&(!selectedCountry||card.dataset.country===selectedCountry);
      card.hidden=!show;if(show)visible++;
    }
    if(empty)empty.hidden=visible>0;
    if(count)count.textContent=String(visible);
    if(clear)clear.hidden=!(text||selectedSector||selectedCountry);
  }
  function clearFilters(){
    if(search)search.value='';
    if(sector)sector.value='';
    if(country)country.value='';
    if(location.search&&history.replaceState)history.replaceState({},'',location.pathname+location.hash);
    filter();
    search?.focus();
  }
  search?.addEventListener('input',filter);
  sector?.addEventListener('change',filter);
  country?.addEventListener('change',filter);
  clear?.addEventListener('click',clearFilters);
  clearEmpty?.addEventListener('click',clearFilters);
  filter();

  const form=document.querySelector('[data-submission]');
  if(!form)return;
  const output=form.querySelector('[data-form-status]');
  const submit=form.querySelector('[type="submit"]');
  const inputs=[...form.querySelectorAll('input,select,textarea')].filter(el=>el.required);
  function report(message,kind){
    if(!output)return;
    output.textContent=message;
    output.dataset.kind=kind;
    output.setAttribute('role',kind==='error'?'alert':'status');
  }
  function validate(){
    let valid=true;
    for(const field of inputs){
      const ok=field.checkValidity();
      field.setAttribute('aria-invalid',String(!ok));
      valid=valid&&ok;
    }
    if(!valid)report('Check the highlighted fields and complete the required information.','error');
    return valid;
  }
  for(const field of inputs)field.addEventListener('input',()=>{
    if(field.getAttribute('aria-invalid')==='true'&&field.checkValidity())field.removeAttribute('aria-invalid');
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(form.dataset.enabled!=='true'){
      report('Submissions are not available during this review. Nothing was sent.','error');
      return;
    }
    if(!validate()){
      inputs.find(field=>!field.checkValidity())?.focus();
      return;
    }
    const data=new FormData(form);
    const payload=Object.fromEntries(data.entries());
    payload.consent=data.has('consent');
    payload.turnstileToken=String(data.get('cf-turnstile-response')||'');
    if(!payload.turnstileToken){report('Complete the security check and try again.','error');return}
    if(!navigator.onLine){report('You appear to be offline. Reconnect and try again.','error');return}
    const initialLabel=submit?.textContent||'Send submission';
    if(submit){submit.disabled=true;submit.setAttribute('aria-busy','true');submit.textContent='Sending for review…'}
    report('Sending your submission securely…','pending');
    try{
      const response=await fetch('/api/submissions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(response.ok&&result.ok){
        form.reset();
        inputs.forEach(field=>field.removeAttribute('aria-invalid'));
        report('Submission received. The editorial team may contact you for verification.','success');
        if(window.turnstile&&typeof window.turnstile.reset==='function')window.turnstile.reset();
      }else{report(result.message||'The submission could not be received. Please try again.','error')}
    }catch{report('A connection error prevented submission. Please try again.','error')}
    finally{if(submit){submit.disabled=false;submit.removeAttribute('aria-busy');submit.textContent=initialLabel}}
  });
})();
