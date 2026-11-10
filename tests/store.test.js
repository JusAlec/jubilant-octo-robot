import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from '../server/store.js';

function memory(t){const store=createStore(':memory:');t.after(()=>store.close());return store;}
test('initial project has persisted team assignments without fabricated replay history',t=>{
 const store=memory(t),[project]=store.listProjects(),snapshot=store.snapshot(project.id);
 assert.equal(project.name,'Building QR8');assert.equal(snapshot.agents.length,6);assert.equal(snapshot.tasks.length,0);assert.equal(snapshot.artifacts.length,0);assert.equal(snapshot.events.length,1);assert.equal(snapshot.events[0].type,'project.created');assert.equal(snapshot.events[0].source,'operator');
});
test('projects scope tasks, events, notes, and tickets',t=>{
 const store=memory(t),p=store.listProjects()[0],q=store.createProject({name:'Another project'});
 const task=store.createTask(p.id,{title:'Build API',agent_id:'atlas'});
 store.createArtifact(p.id,{title:'Decision',content:'Use an event log',task_id:task.id});
 store.createTicket(p.id,{subject:'Question',description:'Can we add persistence?'});
 const first=store.snapshot(p.id),second=store.snapshot(q.id);
 assert.equal(first.tasks.length,1);assert.equal(first.artifacts.length,1);assert.equal(first.tickets.length,1);
 assert.equal(second.tasks.length,0);assert.equal(second.artifacts.length,0);assert.equal(second.tickets.length,0);assert.equal(second.events.length,1);
 assert.throws(()=>store.updateTask(q.id,task.id,{status:'Complete',version:1}),e=>e.status===404);
 assert.throws(()=>store.createArtifact(q.id,{title:'Wrong project',content:'No',task_id:task.id}),e=>e.status===404);
});
test('task version conflicts preserve newer data and do not append phantom events',t=>{
 const store=memory(t),p=store.listProjects()[0],task=store.createTask(p.id,{title:'Test task'});
 const changed=store.updateTask(p.id,task.id,{status:'In progress',agent_id:'echo',version:1});assert.equal(changed.version,2);
 const count=store.snapshot(p.id).events.length;
 assert.throws(()=>store.updateTask(p.id,task.id,{status:'Complete',version:1}),e=>e.status===409);
 assert.equal(store.snapshot(p.id).tasks[0].status,'In progress');assert.equal(store.snapshot(p.id).events.length,count);
});
test('active ownership is exclusive within a project and released on completion',t=>{
 const store=memory(t),p=store.listProjects()[0];
 const a=store.createTask(p.id,{title:'First'}),b=store.createTask(p.id,{title:'Second'});
 store.updateTask(p.id,a.id,{status:'In progress',agent_id:'atlas',version:1});
 assert.throws(()=>store.updateTask(p.id,b.id,{status:'In progress',agent_id:'atlas',version:1}),e=>e.status===409);
 store.updateTask(p.id,a.id,{status:'Complete',version:2});
 assert.equal(store.updateTask(p.id,b.id,{status:'In progress',agent_id:'atlas',version:1}).status,'In progress');
});
test('invalid input and unavailable references cannot alter saved state',t=>{
 const store=memory(t),p=store.listProjects()[0];
 assert.throws(()=>store.createProject({name:'   '}),e=>e.status===400);
 assert.throws(()=>store.createTask(p.id,{title:' ',agent_id:'atlas'}),e=>e.status===400);
 assert.throws(()=>store.createTask(p.id,{title:'Unknown agent',agent_id:'external'}),e=>e.status===400);
 assert.throws(()=>store.createTask('missing',{title:'Unknown project'}),e=>e.status===404);
 const task=store.createTask(p.id,{title:'Valid'});
 assert.throws(()=>store.updateTask(p.id,task.id,{status:'Imaginary',version:1}),e=>e.status===400);
 assert.equal(store.snapshot(p.id).tasks[0].status,'Queued');
});
test('tasks, events, notes, and tickets survive a database restart without duplicate seeding',()=>{
 const dir=mkdtempSync(join(tmpdir(),'qr8-store-')),file=join(dir,'test.sqlite');let store;
 try{
  store=createStore(file);const p=store.listProjects()[0],task=store.createTask(p.id,{title:'Persistent work',description:'Survives restart',agent_id:'pixel'});
  store.updateTask(p.id,task.id,{status:'Blocked',version:1});store.createArtifact(p.id,{title:'A note',content:'Persist me',task_id:task.id});store.createTicket(p.id,{subject:'Saved ticket',description:'A real database entry'});
  const before=store.snapshot(p.id);store.close();store=createStore(file);assert.deepEqual(store.snapshot(p.id),before);assert.equal(store.listProjects().length,1);
 }finally{store?.close();rmSync(dir,{recursive:true,force:true});}
});
