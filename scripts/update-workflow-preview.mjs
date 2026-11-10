// Explicitly regenerate an illustrative public example, never export private workspace data.
import { readFileSync,writeFileSync } from 'node:fs';
import { createStore } from '../server/store.js';
const file=new URL('../public/preview/workspace.json',import.meta.url);
const published=JSON.parse(readFileSync(file,'utf8'));
const oldExamples=new Set((published.workflow?.requests||[]).filter(r=>r.is_example).map(r=>r.id));
published.tasks=published.tasks.filter(t=>!t.is_example);
published.events=published.events.filter(e=>!oldExamples.has(e.request_id));
const store=createStore(':memory:'),project=store.listProjects()[0];
const initial=store.createRequest(project.id,{title:'[Example] Add consultation booking',description:'Illustrative workflow, not a real customer request or delivery. Visitors should be able to book a consultation through the website. Open this example to explore scope, task handoffs, QA, and customer feedback.',requester:'Example customer (illustrative)'});
const id=initial.id;
function step(action,input={}){const r=store.snapshot(project.id).workflow.requests[0];return store.requestAction(project.id,id,{action,version:r.version,scope_revision:r.scope_revision,delivery_id:r.current_delivery_id,notes:'Illustrative workflow step; no real customer decision or deployment.',reviewer:'Example reviewer (illustrative)',...input});}
step('start_product_review',{notes:'Example: clarify appointment types, availability, and confirmation details.'});
step('consult_engineering',{notes:'Example consultation: reuse an existing booking provider and review mobile behavior.'});
store.commentRequest(project.id,id,{author:'Example customer (illustrative)',body:'Please make the confirmation clear on mobile. This is sample feedback.'});
step('propose_scope',{summary:'Example scope: embed the existing booking provider and provide a confirmation state.',criteria:'Booking works at mobile widths.\nA confirmation explains the next step.\nThe customer can return to the website.'});
step('approve_scope');
let task=store.createTask(project.id,{title:'[Example] Build the consultation flow',description:'Illustrative task for reviewing the request workflow. This is not actual implementation evidence.',agent_id:'pixel',request_id:id});
step('start_build');task=store.updateTask(project.id,task.id,{version:task.version,status:'Complete'});
step('submit_delivery',{summary:'Example deliverable v1: booking flow prepared for a review walkthrough. No working customer feature is asserted.'});
step('approve_internal');step('delivery_changes',{notes:'Example feedback: make the confirmation message more explicit.'});step('resume_build');
step('submit_delivery',{summary:'Example deliverable v2: confirmation copy revised. The example is waiting for customer review; no real deployment has occurred.'});step('approve_internal');
const snapshot=store.snapshot(project.id),mapRow=row=>({...row,project_id:published.project.id,is_example:true});
published.workflow=Object.fromEntries(Object.entries(snapshot.workflow).map(([key,rows])=>[key,rows.map(mapRow)]));
published.tasks.push(...snapshot.tasks.map(mapRow));
published.events.push(...snapshot.events.filter(e=>e.request_id===id).map(e=>({...mapRow(e),summary:'[Illustrative] '+e.summary,source:'example'})));
published.published_at=new Date().toISOString();published.contains_example_workflow=true;
writeFileSync(file,JSON.stringify(published,null,2)+'\n');store.close();
console.log('Updated an explicitly labeled, in-memory example. No internal database or customer data was read.');
