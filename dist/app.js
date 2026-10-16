const input=document.querySelector('[data-search]'),sector=document.querySelector('[data-sector]'),country=document.querySelector('[data-country-filter]');
const cards=[...document.querySelectorAll('[data-company]')],empty=document.querySelector('[data-empty]'),count=document.querySelector('[data-count]');
function filter(){
 if(!cards.length)return;
 const q=(input?.value||'').trim().toLocaleLowerCase();
 let n=0;
 for(const card of cards){
  const show=card.dataset.company.includes(q)&&(!sector?.value||card.dataset.sector===sector.value)&&(!country?.value||card.dataset.country===country.value);
  card.hidden=!show;if(show)n++;
 }
 if(empty)empty.hidden=n>0;
 if(count)count.textContent=String(n);
}
input?.addEventListener('input',filter);sector?.addEventListener('change',filter);country?.addEventListener('change',filter);
const initialCountry=new URLSearchParams(location.search).get('country');
if(country&&initialCountry&&[...country.options].some(x=>x.value===initialCountry))country.value=initialCountry;
filter();
const form=document.querySelector('[data-submission]');
form?.addEventListener('submit',async event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const output=document.querySelector('[data-form-status]');
 if(form.dataset.enabled!=='true'){
  if(output)output.textContent='This pre-launch form does not send or store your information. Submissions will open after secure configuration.';
  return;
 }
 const data=new FormData(form);
 const payload=Object.fromEntries(data.entries());
 payload.consent=data.has('consent');
 payload.turnstileToken=String(data.get('cf-turnstile-response')||'');
 const btn=form.querySelector('button[type="submit"]');
 if(btn){btn.disabled=true;btn.textContent='Submitting…'}
 try{
  const response=await fetch('/api/submissions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const result=await response.json();
  if(response.ok&&result.ok){
   form.reset();
   if(output)output.textContent='Submission received for editorial review. Thank you.';
   if(window.turnstile&&typeof window.turnstile.reset==='function')window.turnstile.reset();
  }else{if(output)output.textContent=result.message||'Unable to submit. Please try again.'}
 }catch{if(output)output.textContent='Connection error. Please try again later.'}
 finally{if(btn){btn.disabled=false;btn.textContent='Submit for editorial consideration →'}}
});

const toggle=document.querySelector('[data-menu-toggle]'),navigation=document.querySelector('[data-nav]');
function closeMenu(){if(!toggle||!navigation)return;navigation.removeAttribute('data-open');toggle.setAttribute('aria-expanded','false')}
toggle?.addEventListener('click',()=>{const open=navigation?.hasAttribute('data-open');if(open)closeMenu();else{navigation?.setAttribute('data-open','');toggle.setAttribute('aria-expanded','true')}});
navigation?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
