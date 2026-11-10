import { createServer } from 'node:http';
import { AppError } from './errors.js';
import { readWebhook,verifyDelivery } from './github.js';

export function createGitHubReceiver(store,secret){
 if(!secret||secret.length<32)throw new AppError(503,'Configure a strong server-side webhook secret before starting the receiver.');
 return createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  try{
   if(req.method!=='POST'||req.url!=='/webhooks/github'){res.writeHead(404);return res.end(JSON.stringify({error:'Not found.'}));}
   const result=store.ingestGitHub(verifyDelivery(await readWebhook(req),req.headers,secret));res.writeHead(200);res.end(JSON.stringify(result));
  }catch(e){if(!e.status)console.error('GitHub ingestion failed:',e.message);res.writeHead(e.status||500);res.end(JSON.stringify({error:e.status?e.message:'Unable to record delivery.'}));}
 });
}
