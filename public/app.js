const input=document.querySelector('[data-search]');
const sector=document.querySelector('[data-sector]');
const country=document.querySelector('[data-country-filter]');
const cards=[...document.querySelectorAll('[data-company]')];
const empty=document.querySelector('[data-empty]');
const count=document.querySelector('[data-count]');
function filter(){
  if(!cards.length)return;
  const term=(input?.value||'').trim().toLocaleLowerCase();
  let visible=0;
  for(const card of cards){
    const matches=card.dataset.company.includes(term)&&(!sector?.value||card.dataset.sector===sector.value)&&(!country?.value||card.dataset.country===country.value);
    card.hidden=!matches;
    if(matches)visible++;
  }
  if(empty)empty.hidden=visible>0;
  if(count)count.textContent=String(visible);
}
input?.addEventListener('input',filter);
sector?.addEventListener('change',filter);
country?.addEventListener('change',filter);
const initialCountry=new URLSearchParams(location.search).get('country');
if(country&&initialCountry&&[...country.options].some(x=>x.value===initialCountry))country.value=initialCountry;
filter();
const form=document.querySelector('[data-submission]');
form?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const output=document.querySelector('[data-form-status]');
  if(output)output.textContent='This is a pre-launch review. Submissions are not being collected, saved or sent.';
});
