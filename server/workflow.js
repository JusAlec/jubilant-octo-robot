import { randomUUID } from 'node:crypto';
import { AppError } from './errors.js';

export const requestStages=['Received','Product review','Engineering review','Scope approval','Ready for build','In progress','Internal review','Customer review','Changes requested','Approved','Released','Closed'];
export function createWorkflow(db,{project,text,transaction,event}){
 db.exec(`CREATE TABLE IF NOT EXISTS requests(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),title TEXT NOT NULL,description TEXT NOT NULL,requester TEXT NOT NULL,stage TEXT NOT NULL DEFAULT 'Received',scope_revision INTEGER NOT NULL DEFAULT 0,approved_scope_revision INTEGER,current_delivery_id TEXT,version INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS request_scopes(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),request_id TEXT NOT NULL REFERENCES requests(id),revision INTEGER NOT NULL,summary TEXT NOT NULL,criteria TEXT NOT NULL,created_at TEXT NOT NULL,UNIQUE(request_id,revision));
 CREATE TABLE IF NOT EXISTS request_deliveries(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),request_id TEXT NOT NULL REFERENCES requests(id),revision INTEGER NOT NULL,scope_revision INTEGER NOT NULL,summary TEXT NOT NULL,preview_url TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL,UNIQUE(request_id,revision));
 CREATE TABLE IF NOT EXISTS request_history(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),request_id TEXT NOT NULL REFERENCES requests(id),action TEXT NOT NULL,from_stage TEXT NOT NULL,to_stage TEXT NOT NULL,reviewer TEXT NOT NULL,notes TEXT NOT NULL,scope_revision INTEGER,delivery_id TEXT,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS request_comments(id TEXT PRIMARY KEY,project_id TEXT NOT NULL REFERENCES projects(id),request_id TEXT NOT NULL REFERENCES requests(id),author TEXT NOT NULL,body TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS requests_by_project ON requests(project_id,updated_at);
 CREATE INDEX IF NOT EXISTS request_history_by_request ON request_history(request_id,created_at);`);
 for(const table of ['tasks','events'])if(!db.prepare(`PRAGMA table_info(${table})`).all().some(c=>c.name==='request_id'))db.exec(`ALTER TABLE ${table} ADD COLUMN request_id TEXT REFERENCES requests(id)`);
 db.prepare('INSERT OR IGNORE INTO schema_migrations VALUES(5,?)').run(new Date().toISOString());
 function find(projectId,id){project(projectId);if(typeof id!=='string')throw new AppError(400,'Invalid request ID.');const row=db.prepare('SELECT * FROM requests WHERE project_id=? AND id=?').get(projectId,id);if(!row)throw new AppError(404,'Request not found in this project.');return row;}
 function record(row,action,to,reviewer,notes,scopeRevision=row.scope_revision,deliveryId=row.current_delivery_id){
  const now=new Date().toISOString();
  db.prepare('INSERT INTO request_history VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(randomUUID(),row.project_id,row.id,action,row.stage,to,reviewer,notes,scopeRevision,deliveryId,now);
  event(row.project_id,`request.${action}`,`${row.title} → ${to}`,`${notes}\nRecorded by the local operator${reviewer?` for ${reviewer} (identity not authenticated)`:''}.`,null,null,row.id);
 }
 function allComplete(row){const tasks=db.prepare('SELECT status FROM tasks WHERE project_id=? AND request_id=?').all(row.project_id,row.id);if(!tasks.length||tasks.some(t=>t.status!=='Complete'))throw new AppError(409,'Complete every linked task before submitting or approving this deliverable.');}
 function preview(value){if(!value)return '';if(typeof value!=='string'||value.length>2000)throw new AppError(400,'Invalid preview URL.');try{const u=new URL(value);if(u.username||u.password||!(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname))))throw Error();return u.href;}catch{throw new AppError(400,'Use an HTTPS preview URL, or a local HTTP preview.');}}
 const api={
  snapshot(projectId){return {requests:db.prepare('SELECT * FROM requests WHERE project_id=? ORDER BY updated_at DESC,id').all(projectId),scopes:db.prepare('SELECT * FROM request_scopes WHERE project_id=? ORDER BY revision').all(projectId),deliveries:db.prepare('SELECT * FROM request_deliveries WHERE project_id=? ORDER BY revision DESC').all(projectId),history:db.prepare('SELECT * FROM request_history WHERE project_id=? ORDER BY rowid').all(projectId),comments:db.prepare('SELECT * FROM request_comments WHERE project_id=? ORDER BY rowid').all(projectId)};},
  create(projectId,input){project(projectId);const title=text(input.title,'Request title',160),description=text(input.description,'Request details',5000),requester=text(input.requester,'Requested by',100);return transaction(()=>{const id=randomUUID(),now=new Date().toISOString();db.prepare('INSERT INTO requests(id,project_id,title,description,requester,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').run(id,projectId,title,description,requester,now,now);const row=find(projectId,id);record(row,'received','Received',requester,'Enhancement request recorded.');return row;});},
  comment(projectId,id,input){const row=find(projectId,id);const author=text(input.author,'Comment author',100),body=text(input.body,'Comment',5000);return transaction(()=>{if(row.stage==='Closed')throw new AppError(409,'This request is closed. Create a follow-up request.');const id=randomUUID();db.prepare('INSERT INTO request_comments VALUES(?,?,?,?,?,?)').run(id,projectId,row.id,author,body,new Date().toISOString());event(projectId,'request.comment',`Comment on: ${row.title}`,`${author} (recorded by operator): ${body}`,null,null,row.id);return {id};});},
  action(projectId,id,input){return transaction(()=>{
   const row=find(projectId,id);
   if(!Number.isInteger(input.version)||input.version!==row.version)throw new AppError(409,'This request changed in another session. Close and reopen it before continuing.');
   const action=input.action;let to,reviewer='',notes=text(input.notes??'','Decision or handoff note',5000,false),scopeRevision=row.scope_revision,deliveryId=row.current_delivery_id;
   const allowed={start_product_review:['Received','Product review'],consult_engineering:['Product review','Engineering review'],start_build:['Ready for build','In progress'],resume_build:['Changes requested','In progress'],close:['Released','Closed']};
   if(allowed[action]){const [from,next]=allowed[action];if(row.stage!==from)throw new AppError(409,'This action is not available at the current stage.');to=next;if(!notes)throw new AppError(400,'Add a handoff or completion note.');if(action==='start_build'&&!db.prepare('SELECT 1 FROM tasks WHERE project_id=? AND request_id=?').get(projectId,id))throw new AppError(409,'Plan at least one linked task before starting the build.');}
   else if(action==='propose_scope'){
    if(!['Product review','Engineering review'].includes(row.stage))throw new AppError(409,'Scope can be proposed during product or engineering review.');
    const summary=text(input.summary,'Scope summary',5000),criteria=text(input.criteria,'Acceptance criteria',5000);scopeRevision++;
    db.prepare('INSERT INTO request_scopes VALUES(?,?,?,?,?,?,?)').run(randomUUID(),projectId,id,scopeRevision,summary,criteria,new Date().toISOString());
    db.prepare('UPDATE requests SET approved_scope_revision=NULL WHERE id=?').run(id);notes=summary;to='Scope approval';
   }else if(['approve_scope','scope_changes'].includes(action)){
    if(row.stage!=='Scope approval'||input.scope_revision!==row.scope_revision)throw new AppError(409,'Review the current scope revision before deciding.');
    reviewer=text(input.reviewer,'Reviewer name',100);notes=text(input.notes,'Decision note',5000);to=action==='approve_scope'?'Ready for build':'Product review';
    db.prepare('UPDATE requests SET approved_scope_revision=? WHERE id=?').run(action==='approve_scope'?row.scope_revision:null,id);
   }else if(action==='submit_delivery'){
    if(row.stage!=='In progress')throw new AppError(409,'Submit a deliverable from the implementation stage.');allComplete(row);
    const summary=text(input.summary,'Delivery summary',5000),url=preview(input.preview_url);const revision=db.prepare('SELECT COALESCE(MAX(revision),0)+1 AS next FROM request_deliveries WHERE request_id=?').get(id).next;
    deliveryId=randomUUID();db.prepare('INSERT INTO request_deliveries VALUES(?,?,?,?,?,?,?,?)').run(deliveryId,projectId,id,revision,row.scope_revision,summary,url,new Date().toISOString());notes=summary;to='Internal review';
   }else if(['approve_internal','internal_changes','approve_delivery','delivery_changes'].includes(action)){
    const internal=action==='approve_internal'||action==='internal_changes';
    if(row.stage!==(internal?'Internal review':'Customer review')||!row.current_delivery_id||input.delivery_id!==row.current_delivery_id)throw new AppError(409,'Review the current deliverable revision before deciding.');
    reviewer=text(input.reviewer,'Reviewer name',100);notes=text(input.notes,'Review note',5000);
    if(action==='approve_internal'||action==='approve_delivery')allComplete(row);
    to=action==='approve_internal'?'Customer review':action==='internal_changes'?'In progress':action==='approve_delivery'?'Approved':'Changes requested';
    if(action==='internal_changes'||action==='delivery_changes')deliveryId=null;
   }else if(action==='record_release'){
    if(row.stage!=='Approved'||!row.current_delivery_id)throw new AppError(409,'Approve the current deliverable before recording a release.');allComplete(row);
    reviewer=text(input.reviewer,'Release operator',100);const url=preview(input.preview_url);if(!url)throw new AppError(400,'Add the released feature URL.');notes=text(input.notes,'Release verification note',5000)+'\nRelease URL: '+url;to='Released';
   }else throw new AppError(400,'Unknown workflow action.');
   if(['In progress','Internal review','Customer review','Approved','Released','Closed'].includes(to)&&row.approved_scope_revision!==row.scope_revision)throw new AppError(409,'The current scope must be approved first.');
   record(row,action,to,reviewer,notes,scopeRevision,row.current_delivery_id||deliveryId);
   db.prepare('UPDATE requests SET stage=?,scope_revision=?,current_delivery_id=?,version=version+1,updated_at=? WHERE id=?').run(to,scopeRevision,deliveryId,new Date().toISOString(),id);
   return find(projectId,id);
  });},
  validateTask(projectId,requestId){if(!requestId)return null;const row=find(projectId,requestId);if(row.approved_scope_revision!==row.scope_revision||!['Ready for build','In progress','Changes requested'].includes(row.stage))throw new AppError(409,'Tasks can be planned after scope approval and before deliverable review.');return row.id;},
  beforeTaskUpdate(task,status,agentId){if(!task.request_id||(status===task.status&&agentId===task.agent_id))return;const row=find(task.project_id,task.request_id);if(!['Ready for build','In progress','Internal review','Changes requested'].includes(row.stage))throw new AppError(409,'This request is under review or already approved. Record requested changes before changing its tasks.');if(['Ready for build','Changes requested'].includes(row.stage)&&status!=='Queued')throw new AppError(409,'Start or resume the request build before changing task progress.');if(row.stage==='Internal review'){record(row,'task_reopened','In progress','','Linked work changed. The previous deliverable must be reviewed again.');db.prepare("UPDATE requests SET stage='In progress',current_delivery_id=NULL,version=version+1,updated_at=? WHERE id=?").run(new Date().toISOString(),row.id);}},
 };
 return api;
}
