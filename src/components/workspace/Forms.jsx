import { useState } from 'react';
import Dialog from './Dialog';
import { Icon } from './Primitives';
export default function CreateDialog({ kind, agents, tasks, requests=[], selectedRequest, save, close }) {
  const [pending,setPending]=useState(false),[error,setError]=useState('');
  const names={project:'New project',task:'New task',artifact:'Add a project note',ticket:'New support ticket'};
  async function submit(e){
    e.preventDefault();const values=Object.fromEntries(new FormData(e.currentTarget));
    for(const key of Object.keys(values))values[key]=values[key].trim();
    if(Object.values(values).some(v=>v.length>10000))return;
    setPending(true);setError('');
    try{await save(values);close();}catch(e){setError(e.message);setPending(false);}
  }
  return <Dialog title={names[kind]} close={close}><p className="muted form-intro">{kind==='project'?'Start a separate workspace with its own tasks, notes, and activity.':kind==='task'?'Define the work and assign a specialist. Assignments track responsibility; they do not start an AI run.':kind==='artifact'?'Keep a brief, decision, or deliverable note with your project.': 'Save a ticket for this internal project. Customer notifications are not connected yet.'}</p><form className="support-form" onSubmit={submit}>
    <label htmlFor="entry-title">{kind==='project'?'Project name':kind==='ticket'?'Subject':kind==='artifact'?'Note title':'Task title'}</label><input id="entry-title" name={kind==='project'?'name':kind==='ticket'?'subject':'title'} required maxLength={kind==='project'?100:160} autoComplete="off" />
    <label htmlFor="entry-description">{kind==='artifact'?'Note content':kind==='ticket'?'Message':'Description'}</label><textarea id="entry-description" name={kind==='artifact'?'content':'description'} rows={5} required={kind==='artifact'||kind==='ticket'} maxLength={kind==='artifact'?10000:kind==='project'?2000:5000} />
    {kind==='task'&&<><label htmlFor="entry-agent">Assign to</label><select name="agent_id" id="entry-agent"><option value="">Unassigned</option>{agents.map(a=><option value={a.id} key={a.id}>{a.name} · {a.role}</option>)}</select></>}
    {kind==='task'&&<><label htmlFor="entry-request">Related enhancement request</label><select id="entry-request" name="request_id" defaultValue={selectedRequest||''}><option value="">Standalone task</option>{requests.filter(r=>['Ready for build','In progress','Changes requested'].includes(r.stage)).map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></>}
    {kind==='artifact'&&<><label htmlFor="entry-task">Related task (optional)</label><select id="entry-task" name="task_id"><option value="">Project-wide note</option>{tasks.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}</select></>}
    {error&&<p role="alert" className="error-message">{error}</p>}<button className="primary-button" disabled={pending} type="submit">{pending?'Saving…':kind==='project'?'Create project':kind==='task'?'Create task':kind==='artifact'?'Save note':'Save ticket'}<Icon name="arrow" size={15} /></button>
  </form></Dialog>;
}
