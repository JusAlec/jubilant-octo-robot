import { useState } from 'react';
import Dialog from './Dialog';
import { Avatar, Status, Icon } from './Primitives';
const statuses=['Queued','In progress','In review','Blocked','Complete'];
export function TaskDetails({ task, snapshot, save, close, openArtifact, openRequest, readOnly = false }) {
  const [status,setStatus]=useState(task.status),[agentId,setAgentId]=useState(task.agent_id || ''),[version]=useState(task.version),[pending,setPending]=useState(false),[error,setError]=useState('');
  const linkedRequest=snapshot.workflow?.requests.find(r=>r.id===task.request_id);
  const locked=linkedRequest&&!['Ready for build','In progress','Internal review','Changes requested'].includes(linkedRequest.stage);
  const history=snapshot.events.filter(e=>e.task_id===task.id);
  async function submit(e){e.preventDefault();setPending(true);setError('');try{await save(task.id,{status,agent_id:agentId||null,version});close();}catch(e){setError(e.message);setPending(false);}}
  return <Dialog title={task.title} close={close} eyebrow="TASK DETAILS"><p className="inspector-sub">{task.id.slice(0,8).toUpperCase()} · Created {new Date(task.created_at).toLocaleString()}</p><Status>{task.status}</Status>{linkedRequest&&<button className="related-note" onClick={()=>openRequest(linkedRequest.id)}>Request: {linkedRequest.title}<Icon name="arrow" size={14}/></button>}<p className="inspector-description">{task.description || 'No description added yet.'}</p><form className="support-form" onSubmit={submit}><fieldset className="task-edit-fields" disabled={readOnly||locked}><label htmlFor="task-status">Status</label><select id="task-status" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select><label htmlFor="task-assignee">Assigned specialist</label><select id="task-assignee" value={agentId} onChange={e=>setAgentId(e.target.value)}><option value="">Unassigned</option>{snapshot.agents.map(a=><option key={a.id} value={a.id}>{a.name} · {a.role}</option>)}</select><p className="muted">Status is managed by the workspace operator. No AI execution is connected.</p>{error&&<p role="alert" className="error-message">{error}</p>}<button type="submit" className="primary-button" disabled={pending||readOnly||locked}>{readOnly?'Read-only preview':locked?'Manage from request':pending?'Saving…':'Save changes'}<Icon name="check" size={15}/></button></fieldset></form>
    <h3>Related project notes</h3>{snapshot.artifacts.filter(a=>a.task_id===task.id).map(a=><button key={a.id} className="related-note" onClick={()=>openArtifact(a.id)}>{a.title}<Icon name="arrow" size={14}/></button>)}{!snapshot.artifacts.some(a=>a.task_id===task.id)&&<p className="muted">No notes attached.</p>}
    <h3>GitHub evidence</h3>{(snapshot.github?.evidence||[]).filter(e=>e.task_id===task.id).map(e=><a className="related-note" key={e.id} href={e.url} target="_blank" rel="noopener noreferrer">{e.title} · {e.status}<Icon name="external" size={14}/></a>)}{!(snapshot.github?.evidence||[]).some(e=>e.task_id===task.id)&&<p className="muted">No verified development evidence linked.</p>}
    <h3>Recorded activity</h3><div className="detail-history">{[...history].reverse().map(e=><div key={e.id}><time>{new Date(e.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</time><p>{e.summary}</p></div>)}</div>
  </Dialog>;
}
export function AgentDetails({ agent, snapshot, close, openTask }) {
  const assigned=snapshot.tasks.filter(t=>t.agent_id===agent.id&&t.status!=='Complete');
  return <Dialog title={agent.name} close={close} eyebrow="TEAM SPECIALIST"><Avatar agent={agent}/><p className="inspector-sub">{agent.role}</p><p className="inspector-description">{agent.description}</p><div className="detail-callout"><span className="eyebrow">ROLE DEFINITION · EXECUTION NOT CONNECTED</span><p>Assignments show planned responsibility. This specialist is not running an autonomous agent.</p></div><h3>Assigned work · {assigned.length}</h3>{assigned.map(t=><button className="related-note" key={t.id} onClick={()=>openTask(t.id)}><span>{t.title}<Status>{t.status}</Status></span><Icon name="arrow" size={14}/></button>)}{!assigned.length&&<p className="muted">No open tasks assigned.</p>}</Dialog>;
}
export function ArtifactDetails({ artifact, snapshot, close, openTask }) {
  const task=snapshot.tasks.find(t=>t.id===artifact.task_id);
  return <Dialog title={artifact.title} close={close} eyebrow="OPERATOR-AUTHORED PROJECT NOTE"><p className="inspector-sub">Saved {new Date(artifact.created_at).toLocaleString()}</p><p className="note-content">{artifact.content}</p>{task&&<button className="related-note" onClick={()=>openTask(task.id)}>Related task: {task.title}<Icon name="arrow" size={14}/></button>}</Dialog>;
}
