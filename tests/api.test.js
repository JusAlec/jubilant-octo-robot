import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { request as httpRequest } from 'node:http';
import { createStore } from '../server/store.js';
import { createApi } from '../server/http.js';
async function setup(t){const store=createStore(':memory:'),server=createApi(store);server.listen(0,'127.0.0.1');await once(server,'listening');t.after(async()=>{await new Promise(r=>server.close(r));store.close();});return {url:`http://127.0.0.1:${server.address().port}`,store};}
const json=body=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
test('HTTP API saves a task and returns project-scoped state to another client',async t=>{
 const {url}=await setup(t);const projects=await fetch(url+'/api/projects').then(r=>r.json()),p=projects.projects[0];
 const created=await fetch(`${url}/api/projects/${p.id}/tasks`,json({title:'API integration',agent_id:'atlas'}));assert.equal(created.status,201);const task=await created.json();
 const patched=await fetch(`${url}/api/projects/${p.id}/tasks/${task.id}`,{...json({status:'In progress',version:1}),method:'PATCH'});assert.equal(patched.status,200);
 const snapshot=await fetch(`${url}/api/projects/${p.id}/snapshot`).then(r=>r.json());assert.equal(snapshot.tasks[0].title,'API integration');assert.equal(snapshot.tasks[0].status,'In progress');assert.equal(snapshot.events.at(-1).type,'task.updated');
});
test('local API rejects foreign origins, DNS rebinding hosts, and cross-site requests',async t=>{
 const {url}=await setup(t);
 assert.equal((await fetch(url+'/api/projects',{headers:{Origin:'https://untrusted.example'}})).status,403);
 const hostStatus=await new Promise((resolve,reject)=>{const req=httpRequest(url+'/api/projects',{headers:{Host:'untrusted.example'}},res=>{res.resume();resolve(res.statusCode);});req.on('error',reject);req.end();});
 assert.equal(hostStatus,403);
 assert.equal((await fetch(url+'/api/projects',{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);
});
test('API validation and missing routes return structured errors without saving',async t=>{
 const {url,store}=await setup(t),p=store.listProjects()[0];
 const invalid=await fetch(`${url}/api/projects/${p.id}/tasks`,json({title:' '}));assert.equal(invalid.status,400);assert.ok((await invalid.json()).error);
 assert.equal((await fetch(`${url}/api/projects/${p.id}/tasks`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{bad'})).status,400);
 assert.equal((await fetch(`${url}/api/projects/${p.id}/tasks`,{method:'POST',body:'plain text'})).status,415);
 assert.equal((await fetch(url+'/api/missing')).status,404);
 assert.equal(store.snapshot(p.id).tasks.length,0);
});
test('request workflow API creates scoped records, comments, and guarded actions',async t=>{
 const {url}=await setup(t),p=(await fetch(url+'/api/projects').then(r=>r.json())).projects[0];
 const root=`${url}/api/projects/${p.id}/requests`;
 const response=await fetch(root,json({title:'Booking request',description:'Add booking.',requester:'Operator'}));assert.equal(response.status,201);const request=await response.json();
 const start=await fetch(`${root}/${request.id}/actions`,json({action:'start_product_review',version:1,notes:'Review the need.'}));assert.equal(start.status,200);
 assert.equal((await fetch(`${root}/${request.id}/comments`,json({author:'Operator',body:'A question.'}))).status,200);
 assert.equal((await fetch(`${root}/${request.id}/actions`,json({action:'record_release',version:2,notes:'Skip'}))).status,409);
 const s=await fetch(`${url}/api/projects/${p.id}/snapshot`).then(r=>r.json());assert.equal(s.workflow.requests[0].stage,'Product review');assert.equal(s.workflow.comments.length,1);
});
