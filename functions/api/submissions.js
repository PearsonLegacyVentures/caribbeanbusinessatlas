// Cloudflare Pages Function — only enabled after configuring SUBMISSIONS (KV)
// and TURNSTILE_SECRET_KEY. Never reads submission data in public endpoints.
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const value=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function onRequestPost({request,env}){
 if(!env?.SUBMISSIONS||!env?.TURNSTILE_SECRET_KEY)return json({message:'Submissions have not opened.'},503);
 if(Number(request.headers.get('content-length')||0)>12000)return json({message:'Request too large.'},413);
 let body;
 try{body=await request.json()}catch{return json({message:'Invalid JSON.'},400)}
 if(!body||typeof body!=='object'||Array.isArray(body))return json({message:'Invalid submission.'},400);
 if(body.companyFax)return json({ok:true});
 const item={businessName:value(body.businessName,120),country:value(body.country,80),sector:value(body.sector,80),
  website:value(body.website,250),description:value(body.description,1600),contactName:value(body.contactName,120),
  email:value(body.email,200),relationship:value(body.relationship,80),status:'pending_review',submittedAt:new Date().toISOString()};
 if(item.businessName.length<2||!item.country||!item.sector||item.description.length<30||!item.contactName||!emailPattern.test(item.email)||!item.relationship||body.consent!==true)return json({message:'Please complete all required fields.'},400);
 if(item.website){
  try{const url=new URL(item.website);if(url.protocol!=='https:'||!url.hostname.includes('.')||url.username||url.password)throw Error()}catch{return json({message:'Please enter a valid HTTPS website.'},400)}
 }
 if(!body.turnstileToken||typeof body.turnstileToken!=='string')return json({message:'Security check is required.'},400);
 try{
  const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:body.turnstileToken}),signal:AbortSignal.timeout(7500)});
  const check=await response.json();if(!check.success)return json({message:'Security check failed.'},403);
  const id=crypto.randomUUID();await env.SUBMISSIONS.put('submission:'+id,JSON.stringify(item),{expirationTtl:7776000});
  return json({ok:true},201);
 }catch{return json({message:'Could not receive submission.'},503)}
}
export const onRequestGet=()=>json({message:'Method not allowed.'},405);
