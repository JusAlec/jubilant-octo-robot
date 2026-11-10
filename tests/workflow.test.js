import test from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../server/store.js';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
function fixture(t){const store=createStore(':memory:');t.after(()=>store.close());const p=store.listProjects()[0],r=store.createRequest(p.id,{title:'Consultation booking',description:'Customers should be able to book a consultation.',requester:'Recorded requester'});return{store,p,id:r.id};}
function current(f){return f.store.snapshot(f.p.id).workflow.requests.find(r=>r.id===f.id);}
function action(f,name,fields={}){const r=current(f);return f.store.requestAction(f.p.id,f.id,{version:r.version,scope_revision:r.scope_revision,delivery_id:r.current_delivery_id,notes:'Recorded decision and verification.',reviewer:'Recorded reviewer',action:name,...fields});}
function approved(f){action(f,'start_product_review');action(f,'consult_engineering');action(f,'propose_scope',{summary:'Integrate the booking provider.',criteria:'Mobile booking works.\nConfirmation is visible.'});action(f,'approve_scope');}
function build(f){approved(f);const t=f.store.createTask(f.p.id,{title:'Implement booking',request_id:f.id,agent_id:'atlas'});action(f,'start_build');f.store.updateTask(f.p.id,t.id,{version:1,status:'Complete'});action(f,'submit_delivery',{summary:'Booking implementation ready.',preview_url:'https://example.com/review'});return t;}
test('request follows the complete recorded workflow with immutable scope and deliverable evidence',t=>{
 const f=fixture(t);build(f);action(f,'approve_internal');action(f,'approve_delivery');action(f,'record_release',{preview_url:'https://example.com/booking'});action(f,'close');
 const s=f.store.snapshot(f.p.id);assert.equal(current(f).stage,'Closed');assert.equal(s.workflow.scopes.length,1);assert.equal(s.workflow.deliveries.length,1);assert.equal(s.workflow.history.at(-1).to_stage,'Closed');assert.equal(s.workflow.history.find(h=>h.action==='approve_delivery').delivery_id,s.workflow.deliveries[0].id);assert.equal(s.workflow.history.find(h=>h.action==='approve_scope').scope_revision,1);assert.ok(s.events.some(e=>e.request_id===f.id));
});
test('gates reject skipping scope, missing tasks, unfinished work, and release before approval',t=>{
 const f=fixture(t);assert.throws(()=>action(f,'start_build'),e=>e.status===409);assert.throws(()=>f.store.createTask(f.p.id,{title:'Too soon',request_id:f.id}),e=>e.status===409);approved(f);assert.throws(()=>action(f,'start_build'),e=>e.status===409);
 const task=f.store.createTask(f.p.id,{title:'Do the work',request_id:f.id});assert.throws(()=>f.store.updateTask(f.p.id,task.id,{version:1,status:'Complete'}),e=>e.status===409);action(f,'start_build');assert.throws(()=>action(f,'submit_delivery',{summary:'Not done'}),e=>e.status===409);assert.throws(()=>action(f,'record_release',{preview_url:'https://example.com'}),e=>e.status===409);
});
test('scope rejection requires a new immutable revision and stale scope decisions fail',t=>{
 const f=fixture(t);action(f,'start_product_review');action(f,'propose_scope',{summary:'First proposal',criteria:'First criteria'});action(f,'scope_changes');action(f,'propose_scope',{summary:'Revised proposal',criteria:'Revised criteria'});
 assert.throws(()=>action(f,'approve_scope',{scope_revision:1}),e=>e.status===409);action(f,'approve_scope');const s=f.store.snapshot(f.p.id);assert.equal(s.workflow.scopes.length,2);assert.equal(s.workflow.scopes[0].summary,'First proposal');assert.equal(current(f).approved_scope_revision,2);
});
test('customer change requests invalidate the old deliverable and require another QA/customer review',t=>{
 const f=fixture(t);const task=build(f),old=current(f).current_delivery_id;action(f,'approve_internal');assert.throws(()=>f.store.updateTask(f.p.id,task.id,{version:2,status:'In progress'}),e=>e.status===409);action(f,'delivery_changes');assert.equal(current(f).current_delivery_id,null);action(f,'resume_build');f.store.updateTask(f.p.id,task.id,{version:2,status:'In progress'});f.store.updateTask(f.p.id,task.id,{version:3,status:'Complete'});action(f,'submit_delivery',{summary:'Updated booking flow'});assert.notEqual(current(f).current_delivery_id,old);assert.throws(()=>action(f,'approve_internal',{delivery_id:old}),e=>e.status===409);action(f,'approve_internal');action(f,'approve_delivery');assert.equal(f.store.snapshot(f.p.id).workflow.deliveries.length,2);
});
test('reopening work during internal review returns to implementation and clears the submitted version',t=>{
 const f=fixture(t),task=build(f);f.store.updateTask(f.p.id,task.id,{version:2,status:'In progress'});assert.equal(current(f).stage,'In progress');assert.equal(current(f).current_delivery_id,null);assert.throws(()=>action(f,'approve_internal'),e=>e.status===409);
});
test('request commands, comments, and task links cannot cross projects',t=>{
 const f=fixture(t),other=f.store.createProject({name:'Other'});assert.throws(()=>f.store.requestAction(other.id,f.id,{version:1,action:'start_product_review',notes:'No'}),e=>e.status===404);assert.throws(()=>f.store.commentRequest(other.id,f.id,{author:'A',body:'No'}),e=>e.status===404);assert.throws(()=>f.store.createTask(other.id,{title:'No',request_id:f.id}),e=>e.status===404);assert.equal(f.store.snapshot(other.id).workflow.requests.length,0);
});
test('stale edits and invalid preview URLs roll back without phantom history',t=>{
 const f=fixture(t);action(f,'start_product_review');const before=f.store.snapshot(f.p.id);assert.throws(()=>f.store.requestAction(f.p.id,f.id,{action:'consult_engineering',version:1,notes:'Old'}),e=>e.status===409);assert.equal(f.store.snapshot(f.p.id).workflow.history.length,before.workflow.history.length);
 const g=fixture(t);build(g);action(g,'internal_changes');assert.throws(()=>action(g,'submit_delivery',{summary:'Unsafe link',preview_url:'javascript:alert(1)'}),e=>e.status===400);assert.equal(g.store.snapshot(g.p.id).workflow.deliveries.length,1);
});
test('comments preserve recorded attribution, and closed requests reject further conversation',t=>{
 const f=fixture(t);f.store.commentRequest(f.p.id,f.id,{author:'Recorded customer',body:'Please include mobile support.'});assert.equal(f.store.snapshot(f.p.id).workflow.comments[0].author,'Recorded customer');build(f);action(f,'approve_internal');action(f,'approve_delivery');action(f,'record_release',{preview_url:'https://example.com'});action(f,'close');assert.throws(()=>f.store.commentRequest(f.p.id,f.id,{author:'A',body:'No'}),e=>e.status===409);
});
test('request workflow and revision history survive a real file-backed restart',()=>{
 const dir=mkdtempSync(join(tmpdir(),'qr8-workflow-')),file=join(dir,'workspace.sqlite');let store;
 try{store=createStore(file);const p=store.listProjects()[0],r=store.createRequest(p.id,{title:'Persist workflow',description:'Persist all decisions.',requester:'Operator'});store.requestAction(p.id,r.id,{version:1,action:'start_product_review',notes:'Triage started.'});store.commentRequest(p.id,r.id,{author:'Operator',body:'Clarifying question.'});const before=store.snapshot(p.id).workflow;store.close();store=createStore(file);assert.deepEqual(store.snapshot(p.id).workflow,before);}finally{store?.close();rmSync(dir,{recursive:true,force:true});}
});
