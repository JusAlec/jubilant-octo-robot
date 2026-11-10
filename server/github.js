import { createHmac, timingSafeEqual, createHash } from 'node:crypto';
import { AppError } from './errors.js';

export function verifyDelivery(raw, headers, secret) {
  if (!secret || secret.length < 32) throw new AppError(503,'GitHub receiver is not configured.');
  const signature=headers['x-hub-signature-256'];
  if(typeof signature!=='string'||!/^sha256=[a-f0-9]{64}$/.test(signature))throw new AppError(401,'Invalid webhook signature.');
  const expected=createHmac('sha256',secret).update(raw).digest();
  if(!timingSafeEqual(Buffer.from(signature.slice(7),'hex'),expected))throw new AppError(401,'Invalid webhook signature.');
  const delivery=headers['x-github-delivery'],type=headers['x-github-event'];
  if(typeof delivery!=='string'||! /^[a-zA-Z0-9-]{8,100}$/.test(delivery)||typeof type!=='string'||! /^[a-z_]{1,50}$/.test(type))throw new AppError(400,'Missing or invalid GitHub delivery headers.');
  let payload;try{payload=JSON.parse(raw.toString('utf8'));}catch{throw new AppError(400,'Invalid webhook JSON.');}
  if(!payload||Array.isArray(payload)||typeof payload!=='object')throw new AppError(400,'Invalid webhook payload.');
  return {delivery,type,payload,digest:createHash('sha256').update(raw).digest('hex')};
}
const safeText=(value,max=240)=>typeof value==='string'?value.replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,max):'';
function githubUrl(value, repo){
  try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='github.com'&&!u.port&&!u.username&&!u.password&&u.pathname.toLowerCase().startsWith('/'+repo.toLowerCase()+'/')?u.href:null;}catch{return null;}
}
const states=['queued','requested','pending','in_progress','completed','success','failure','error','neutral','cancelled','skipped','timed_out','action_required','stale','startup_failure','waiting','inactive','expected'];
const state=value=>states.includes(value)?value:'unknown';
export function normalizeGitHub(type,payload,repository){
  const action=safeText(payload.action,40);
  let title='',status='',url=null,sha='',number=null,externalId=null;
  if(type==='pull_request'){
    const pr=payload.pull_request;
    if(!pr||!Number.isSafeInteger(pr.number)||!Number.isSafeInteger(pr.id))throw new AppError(400,'Invalid pull request event.');
    if(!['opened','reopened','closed','synchronize','edited','ready_for_review','converted_to_draft'].includes(action))return null;
    number=pr.number;externalId=String(pr.id);title=`PR #${number}: ${safeText(pr.title)}`;status=pr.merged===true?'merged':pr.state==='closed'?'closed':pr.draft?'draft':'open';url=githubUrl(pr.html_url,repository);sha=safeText(pr.head?.sha,64);
  }else if(type==='check_run'){
    const check=payload.check_run;if(!check||!Number.isSafeInteger(check.id))throw new AppError(400,'Invalid check event.');
    if(!['created','completed','rerequested'].includes(action))return null;
    externalId=String(check.id);title=`Check: ${safeText(check.name)}`;status=state(check.conclusion||check.status);url=githubUrl(check.html_url,repository);sha=safeText(check.head_sha,64);
  }else if(type==='workflow_run'){
    const run=payload.workflow_run;if(!run||!Number.isSafeInteger(run.id))throw new AppError(400,'Invalid workflow event.');
    if(!['requested','in_progress','completed'].includes(action))return null;
    externalId=String(run.id);title=`Workflow: ${safeText(run.name)}`;status=state(run.conclusion||run.status);url=githubUrl(run.html_url,repository);sha=safeText(run.head_sha,64);
  }else if(type==='deployment_status'){
    const deployment=payload.deployment,delivery=payload.deployment_status;
    if(!deployment||!delivery||!Number.isSafeInteger(deployment.id)||!Number.isSafeInteger(delivery.id))throw new AppError(400,'Invalid deployment event.');
    externalId=String(deployment.id);title=`Deployment: ${safeText(deployment.environment,80)||'environment'}`;status=state(delivery.state);url=githubUrl(delivery.log_url,repository)||`https://github.com/${repository}/deployments`;sha=safeText(deployment.sha,64);
  }else if(type==='push'){
    if(typeof payload.after!=='string'||!/^refs\/heads\//.test(payload.ref||''))throw new AppError(400,'Invalid branch push event.');
    externalId=safeText(payload.ref,250);title=`Push to ${safeText(payload.ref.slice(11),100)}`;status=payload.deleted?'deleted':'updated';sha=payload.deleted?'':safeText(payload.after,64);url=payload.deleted?`https://github.com/${repository}/branches`:/^[a-f0-9]{40,64}$/.test(sha)&&!/^0+$/.test(sha)?`https://github.com/${repository}/commit/${sha}`:null;
  }else return null;
  if(!externalId||!url)throw new AppError(400,'GitHub event is missing a trusted evidence URL.');
  if(sha&&!/^[a-f0-9]{40,64}$/.test(sha))throw new AppError(400,'Invalid commit reference.');
  const sourceTime=payload.pull_request?.updated_at||payload.workflow_run?.updated_at||payload.check_run?.completed_at||payload.check_run?.started_at||payload.deployment_status?.updated_at||payload.deployment_status?.created_at;
  const occurredAt=sourceTime&&Number.isFinite(Date.parse(sourceTime))?new Date(sourceTime).toISOString():null;
  return {occurredAt,kind:type,externalId,title,status,url,sha,number,summary:`${title} · ${status}`,detail:`Verified GitHub ${type.replaceAll('_',' ')} event from ${repository}.`,action};
}

export async function readWebhook(req){
  if(!req.headers['content-type']?.startsWith('application/json'))throw new AppError(415,'Use application/json.');
  const chunks=[];let size=0;
  for await(const chunk of req){size+=chunk.length;if(size>1024*1024)throw new AppError(413,'Webhook payload exceeds 1 MiB.');chunks.push(chunk);}
  return Buffer.concat(chunks);
}
