import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { once } from 'node:events';
import { createStore } from '../server/store.js';
import { createGitHubReceiver } from '../server/github-http.js';
import { createApi } from '../server/http.js';
import { verifyDelivery,normalizeGitHub } from '../server/github.js';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Deliberately synthetic provider fixtures. Never exported as real project evidence.
const secret='test-only-webhook-signature-key-0123456789';
const repository={id:1171152130,full_name:'JusAlec/jubilant-octo-robot'};
function payload(){return {action:'opened',repository,installation:{id:42},pull_request:{id:22,number:7,title:'Add persistent tasks',state:'open',draft:false,updated_at:'2026-01-02T00:00:00Z',html_url:'https://github.com/JusAlec/jubilant-octo-robot/pull/7',head:{sha:'a'.repeat(40)}}};}
function delivery(body=payload(),id='test-delivery-0001',type='pull_request'){
 const raw=Buffer.from(JSON.stringify(body));const headers={'x-hub-signature-256':'sha256='+createHmac('sha256',secret).update(raw).digest('hex'),'x-github-delivery':id,'x-github-event':type};return {raw,headers,verified:()=>verifyDelivery(raw,headers,secret)};
}
function setup(t){const store=createStore(':memory:'),p=store.listProjects()[0];store.bindGitHub(p.id,{repository_id:repository.id,full_name:repository.full_name,installation_id:42});t.after(()=>store.close());return {store,p};}
test('signature verification rejects tampering, missing keys, and malformed headers',()=>{
 const d=delivery();assert.equal(d.verified().type,'pull_request');
 assert.throws(()=>verifyDelivery(Buffer.from('{}'),d.headers,secret),e=>e.status===401);
 assert.throws(()=>verifyDelivery(d.raw,{...d.headers,'x-hub-signature-256':'sha256=bad'},secret),e=>e.status===401);
 assert.throws(()=>verifyDelivery(d.raw,d.headers,undefined),e=>e.status===503);
 assert.throws(()=>verifyDelivery(d.raw,{...d.headers,'x-github-delivery':''},secret),e=>e.status===400);
});
test('valid delivery persists evidence and source-labeled activity exactly once',t=>{
 const {store,p}=setup(t),d=delivery();assert.equal(store.ingestGitHub(d.verified()).outcome,'recorded');
 const before=store.snapshot(p.id);assert.equal(before.github.evidence.length,1);assert.equal(before.events.at(-1).source,'github');assert.ok(before.github.bindings[0].last_received_at);
 assert.equal(store.ingestGitHub(d.verified()).duplicate,true);assert.deepEqual(store.snapshot(p.id),before);
 const changed=delivery({...payload(),action:'closed'},'test-delivery-0001');assert.throws(()=>store.ingestGitHub(changed.verified()),e=>e.status===409);
});
test('unknown repository, mismatched installation, and other projects cannot receive evidence',t=>{
 const {store,p}=setup(t),other=store.createProject({name:'Other'});
 assert.throws(()=>store.ingestGitHub(delivery({...payload(),repository:{...repository,id:999}}).verified()),e=>e.status===403);
 assert.throws(()=>store.ingestGitHub(delivery({...payload(),installation:{id:99}}).verified()),e=>e.status===403);
 assert.equal(store.snapshot(p.id).github.evidence.length,0);assert.equal(store.snapshot(other.id).events.length,1);
 assert.throws(()=>store.bindGitHub(other.id,{repository_id:repository.id,full_name:repository.full_name}),e=>e.status===409);
});
test('evidence links validate task scope and version, and never auto-complete tasks',t=>{
 const {store,p}=setup(t),other=store.createProject({name:'Other'}),task=store.createTask(p.id,{title:'Real task'}),foreign=store.createTask(other.id,{title:'Foreign task'});
 const record=store.ingestGitHub(delivery().verified());
 assert.throws(()=>store.linkEvidence(p.id,record.evidence_id,{task_id:foreign.id,version:1}),e=>e.status===404);
 store.linkEvidence(p.id,record.evidence_id,{task_id:task.id,version:1});
 assert.equal(store.snapshot(p.id).github.evidence[0].task_id,task.id);assert.equal(store.snapshot(p.id).tasks[0].status,'Queued');
 assert.throws(()=>store.linkEvidence(p.id,record.evidence_id,{task_id:null,version:1}),e=>e.status===409);
 assert.throws(()=>store.linkEvidence(other.id,record.evidence_id,{task_id:null,version:2}),e=>e.status===404);
});
test('late provider updates cannot revert newer evidence',t=>{
 const {store,p}=setup(t);store.ingestGitHub(delivery().verified());
 const older=payload();older.pull_request.updated_at='2026-01-01T00:00:00Z';older.pull_request.title='Older title';
 assert.equal(store.ingestGitHub(delivery(older,'test-delivery-0002').verified()).outcome,'stale');assert.equal(store.snapshot(p.id).github.evidence[0].title,'PR #7: Add persistent tasks');
});
test('normalization limits links to the bound repository and supports check/workflow/deployment/push events',()=>{
 const invalid=payload();invalid.pull_request.html_url='https://untrusted.example/pull/7';assert.throws(()=>normalizeGitHub('pull_request',invalid,repository.full_name),e=>e.status===400);
 const cross=payload();cross.pull_request.html_url='https://github.com/other/repo/pull/7';assert.throws(()=>normalizeGitHub('pull_request',cross,repository.full_name),e=>e.status===400);
 const base='https://github.com/'+repository.full_name;
 assert.equal(normalizeGitHub('check_run',{action:'completed',check_run:{id:1,name:'Tests',conclusion:'success',html_url:base+'/runs/1',head_sha:'a'.repeat(40)}},repository.full_name).status,'success');
 assert.equal(normalizeGitHub('workflow_run',{action:'completed',workflow_run:{id:1,name:'Build',conclusion:'failure',html_url:base+'/actions/runs/1',head_sha:'a'.repeat(40)}},repository.full_name).status,'failure');
 assert.equal(normalizeGitHub('deployment_status',{deployment:{id:1,environment:'staging',sha:'a'.repeat(40)},deployment_status:{id:2,state:'success',log_url:base+'/actions/runs/1'}},repository.full_name).status,'success');
 assert.equal(normalizeGitHub('push',{ref:'refs/heads/main',after:'a'.repeat(40)},repository.full_name).status,'updated');
 assert.equal(normalizeGitHub('push',{ref:'refs/heads/old',after:'0'.repeat(40),deleted:true},repository.full_name).status,'deleted');
 assert.equal(normalizeGitHub('issues',{},repository.full_name),null);
});
test('deduplication survives a file-backed receiver restart',()=>{
 const dir=mkdtempSync(join(tmpdir(),'qr8-github-')),file=join(dir,'test.sqlite');let store;
 try{store=createStore(file);const p=store.listProjects()[0];store.bindGitHub(p.id,{repository_id:repository.id,full_name:repository.full_name,installation_id:42});store.ingestGitHub(delivery().verified());store.close();store=createStore(file);assert.equal(store.ingestGitHub(delivery().verified()).duplicate,true);assert.equal(store.snapshot(p.id).github.evidence.length,1);}finally{store?.close();rmSync(dir,{recursive:true,force:true});}
});
test('HTTP ingestion requires a signature and commits a verified delivery',async t=>{
 const {store,p}=setup(t),server=createApi(store,{webhookSecret:secret});server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(r=>server.close(r)));
 const url=`http://127.0.0.1:${server.address().port}/api/webhooks/github`,d=delivery();
 assert.equal((await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:d.raw})).status,401);
 const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...d.headers},body:d.raw});assert.equal(response.status,200);assert.equal((await response.json()).outcome,'recorded');assert.equal(store.snapshot(p.id).github.evidence.length,1);
});

test('standalone receiver exposes no operator routes and rejects unsigned delivery',async t=>{
 const {store,p}=setup(t);
 assert.throws(()=>createGitHubReceiver(store,''),e=>e.status===503);
 const server=createGitHubReceiver(store,secret);server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(r=>server.close(r)));
 const url=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(url+'/api/projects')).status,404);
 assert.equal((await fetch(url+'/webhooks/github')).status,404);
 const d=delivery();assert.equal((await fetch(url+'/webhooks/github',{method:'POST',headers:{'Content-Type':'application/json'},body:d.raw})).status,401);
 assert.equal((await fetch(url+'/webhooks/github',{method:'POST',headers:{'Content-Type':'application/json',...d.headers},body:d.raw})).status,200);
 assert.equal(store.snapshot(p.id).github.evidence.length,1);
});

test('mapping edits preserve repository identity and reset readiness with version protection',t=>{
 const {store,p}=setup(t);store.ingestGitHub(delivery().verified());const binding=store.snapshot(p.id).github.bindings[0];
 const other=store.createProject({name:'Other'});
 assert.throws(()=>store.updateGitHubBinding(other.id,binding.id,{version:1,full_name:repository.full_name}),e=>e.status===404);
 store.updateGitHubBinding(p.id,binding.id,{version:1,full_name:repository.full_name,installation_id:43});
 const changed=store.snapshot(p.id).github.bindings[0];assert.equal(changed.version,2);assert.equal(changed.last_received_at,null);assert.equal(changed.repository_id,repository.id);
 assert.throws(()=>store.updateGitHubBinding(p.id,binding.id,{version:1,full_name:repository.full_name}),e=>e.status===409);
 assert.throws(()=>store.ingestGitHub(delivery(payload(),'test-old-installation').verified()),e=>e.status===403);
 const next=payload();next.installation.id=43;assert.equal(store.ingestGitHub(delivery(next,'test-new-installation').verified()).outcome,'recorded');
});
