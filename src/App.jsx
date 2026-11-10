import { useCallback, useEffect, useRef, useState } from 'react';
import { request, isStaticPreview } from './api';
import Office from './components/workspace/Office';
import { Brand, Icon, Status } from './components/workspace/Primitives';
import CreateDialog from './components/workspace/Forms';
import { TaskDetails, AgentDetails, ArtifactDetails } from './components/workspace/Details';
import './styles/workspace.css';

const tabs=[['Office','grid'],['Tasks','check'],['Activity','activity'],['Deliverables','folder'],['Support','ticket']];
function projectState(snapshot){
  const agentStates=Object.fromEntries(snapshot.agents.map(a=>[a.id,{status:'Available',taskId:null}]));
  const taskStates=Object.fromEntries(snapshot.tasks.map(t=>[t.id,{status:t.status,agentId:t.agent_id}]));
  for(const task of [...snapshot.tasks].sort((a,b)=>Number(a.status!=='Queued')-Number(b.status!=='Queued'))){
    if(task.agent_id&&task.status!=='Complete')agentStates[task.agent_id]={status:task.status,taskId:task.id.slice(0,8).toUpperCase()};
  }
  return {agentStates,taskStates,visible:[],completed:snapshot.tasks.filter(t=>t.status==='Complete').length};
}
function Empty({icon='folder',title,children,action}) { return <div className="workspace-empty"><span><Icon name={icon} size={28}/></span><h3>{title}</h3><p>{children}</p>{action}</div>; }
export default function App(){
  const [projects,setProjects]=useState([]),[projectId,setProjectId]=useState(''),[snapshot,setSnapshot]=useState(null),[tab,setTab]=useState('Office'),[view,setView]=useState(()=>matchMedia('(max-width:600px)').matches?'list':'floor'),[selection,setSelection]=useState(null),[create,setCreate]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[filter,setFilter]=useState('All'),[search,setSearch]=useState(''),[expandedTicket,setExpandedTicket]=useState(null),[lastSync,setLastSync]=useState(null),[syncError,setSyncError]=useState('');
  const activeProject=useRef('');
  const inFlight=useRef(false), readGeneration=useRef(0);
  const refresh=useCallback(async(id,{signal}={})=>{
    const generation=++readGeneration.current;
    const data=await request(`/projects/${id}/snapshot`,{signal});
    if(activeProject.current===id&&readGeneration.current===generation){setSnapshot(data);setLastSync(new Date());setSyncError('');}
    return data;
  },[]);
  const loadProjects=useCallback(async()=>{
    setLoading(true);setError('');
    try{const data=await request('/projects');setProjects(data.projects);const wanted=new URLSearchParams(location.search).get('project');const id=data.projects.some(p=>p.id===wanted)?wanted:data.projects[0]?.id;setProjectId(id||'');if(!id)setLoading(false);}
    catch(e){setError(e.message);setLoading(false);}
  },[]);
  useEffect(()=>{loadProjects();},[loadProjects]);
  useEffect(()=>{
    if(!projectId)return;
    const controller=new AbortController();activeProject.current=projectId;setSnapshot(null);setLoading(true);setError('');setSelection(null);setCreate(null);setFilter('All');setSearch('');setExpandedTicket(null);
    const url=new URL(location.href);url.searchParams.set('project',projectId);history.replaceState({},'',url);
    refresh(projectId,{signal:controller.signal}).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    if(isStaticPreview)return()=>controller.abort();
    const timer=setInterval(()=>{
      if(document.hidden||inFlight.current)return;
      inFlight.current=true;
      refresh(projectId,{signal:controller.signal}).catch(e=>{if(e.name!=='AbortError'&&activeProject.current===projectId)setSyncError('Updates paused. Showing the last saved state. Retry to reconnect.');}).finally(()=>{inFlight.current=false;});
    },5000);
    return()=>{controller.abort();clearInterval(timer);};
  },[projectId,refresh]);
  async function mutate(path,body,method='POST'){
    const id=projectId;
    const result=await request(`/projects/${id}/${path}`,{method,body});
    try{await refresh(id);}catch{setSyncError('Your change was saved, but the view could not refresh. Retry to load the latest state.');}
    return result;
  }
  function openCreate(kind){if(!isStaticPreview)setCreate(kind);}
  async function createRecord(values){
    if(create==='project'){
      const result=await request('/projects',{method:'POST',body:values});
      setProjects(current=>[...current,result]);selectProject(result.id);setTab('Tasks');
    }else{
      const resource={task:'tasks',artifact:'artifacts',ticket:'tickets'}[create];
      if(create==='task')values.agent_id=values.agent_id||null;
      await mutate(resource,values);
      setTab(create==='task'?'Tasks':create==='artifact'?'Deliverables':'Support');
    }
  }
  const state=snapshot?projectState(snapshot):null;
  const currentTask=selection?.kind==='task'?snapshot?.tasks.find(t=>t.id===selection.id):null;
  const currentAgent=selection?.kind==='agent'?snapshot?.agents.find(a=>a.id===selection.id):null;
  const currentArtifact=selection?.kind==='artifact'?snapshot?.artifacts.find(a=>a.id===selection.id):null;
  const filteredTasks=snapshot?.tasks.filter(t=>(filter==='All'||t.status===filter)&&`${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase()))||[];
  const active=snapshot?.tasks.filter(t=>['In progress','In review','Blocked'].includes(t.status)).length||0;
  function selectProject(id){activeProject.current=id;setSnapshot(null);setLoading(true);setProjectId(id);}
  function openTask(id){setSelection({kind:'task',id});}
  async function retry(){setSyncError('');try{await refresh(projectId);setError('');}catch(e){if(snapshot)setSyncError(e.message);else setError(e.message);}}
  return <div className="app-shell"><a className="skip-link" href="#project-main">Skip to workspace</a><aside className="app-sidebar"><Brand/><div className="sidebar-label">YOUR WORKSPACE <span>{isStaticPreview?'PREVIEW':'INTERNAL'}</span></div><label htmlFor="project-select" className="sr-only">Current project</label><select id="project-select" className="project-select" value={projectId} onChange={e=>selectProject(e.target.value)} disabled={!projects.length}>{projects.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}{!projects.length&&<option>Loading projects…</option>}</select><button className="sidebar-new" onClick={()=>openCreate('project')} disabled={!!error||isStaticPreview} title={isStaticPreview?'Read-only review preview':undefined}><Icon name="plus" size={14}/>New project</button><nav aria-label="Project navigation">{tabs.map(([name,icon])=><button key={name} className={tab===name?'active':''} aria-label={name} aria-current={tab===name?'page':undefined} onClick={()=>{setTab(name);setSelection(null);}}><Icon name={icon} size={18}/><span>{name}</span>{name==='Tasks'&&snapshot&&<small>{snapshot.tasks.length}</small>}</button>)}</nav><div className="sidebar-bottom"><Icon name="lock" size={17}/><strong>{isStaticPreview?'Public review preview':'Local operator workspace'}</strong><p>{isStaticPreview?'Published project snapshot. Saving and live execution are not enabled.':'Project data is saved on the server. Customer access is not enabled.'}</p></div></aside>
    <div className="app-body"><header className="app-topbar"><div className="breadcrumbs">Workspace <Icon name="chevron" size={12}/><strong>{snapshot?.project.name||'Projects'}</strong></div><div className="connection-status"><i className={error||syncError?'offline':''}/>{error?'Service unavailable':syncError?'Updates paused':loading?'Connecting…':isStaticPreview?'Read-only preview':'Database connected'}</div><span className="operator-avatar">Q</span></header><main id="project-main" className="app-main"><div className="app-page-heading"><div><span className="eyebrow">PROJECT WORKSPACE</span><h1>{snapshot?.project.name||'Your projects'}<span>.</span></h1><p>{snapshot?.project.description||'One place for your team, your tasks, and the work ahead.'}</p></div>{snapshot&&<button className="primary-button" disabled={isStaticPreview} title={isStaticPreview?'Read-only review preview':undefined} onClick={()=>openCreate('task')}><Icon name="plus" size={16}/>New task</button>}</div>
    <div className="internal-banner"><Icon name="info" size={15}/><span>{isStaticPreview?'Public review preview · Explore the workspace, tasks, and notes. This is a published snapshot; saving changes and live agent execution are not available on this site.':'Internal workspace · Changes are saved. Agent assignments and statuses are managed manually until execution is connected.'}</span></div>
    {syncError&&<div className="error-banner" role="alert"><span>{syncError}</span><button onClick={retry}>Retry</button></div>}
    {error?<div className="backend-error" role="alert"><Icon name="activity" size={30}/><h2>Let’s reconnect your workspace.</h2><p>{error}</p><button className="primary-button" onClick={()=>projectId?retry():loadProjects()}>Retry connection</button><p className="muted">No changes are saved while the workspace service is unavailable.</p></div>:loading?<div className="app-loading" role="status">Opening your workspace…</div>:snapshot?<>
    <div className="project-stats"><div><span>OPEN TASKS</span><strong>{snapshot.tasks.filter(t=>t.status!=='Complete').length}<small>to move forward</small></strong></div><div><span>IN PROGRESS</span><strong>{active}<small>assigned work</small></strong></div><div><span>COMPLETED</span><strong>{state.completed}<small>tasks wrapped up</small></strong></div><div><span>PROJECT NOTES</span><strong>{snapshot.artifacts.length}<small>ideas & decisions</small></strong></div></div>
    <div className="app-panel"><div className="app-panel-heading"><div><Icon name={tabs.find(t=>t[0]===tab)[1]} size={18}/><h2>{tab==='Office'?'The project office':tab==='Deliverables'?'Deliverables & notes':tab==='Support'?'Project support':tab}</h2><span className="panel-project-badge">{tab==='Office'?`${snapshot.agents.length} specialists`: isStaticPreview?'SNAPSHOT':'SERVER SAVED'}</span></div>{tab==='Office'?<div className="view-switch"><button className={view==='floor'?'selected':''} aria-pressed={view==='floor'} onClick={()=>setView('floor')}><Icon name="grid" size={14}/>Office</button><button className={view==='list'?'selected':''} aria-pressed={view==='list'} onClick={()=>setView('list')}><Icon name="people" size={14}/>Team</button></div>:tab!=='Activity'&&<button className="secondary-button" disabled={isStaticPreview} title={isStaticPreview?'Read-only review preview':undefined} onClick={()=>openCreate(tab==='Tasks'?'task':tab==='Deliverables'?'artifact':'ticket')}><Icon name="plus" size={14}/>{tab==='Tasks'?'New task':tab==='Deliverables'?'Add note':'New ticket'}</button>}</div>
    {tab==='Office'&&<><p className="panel-explanation">Your team’s current assignments. Select a specialist to inspect their work.</p><Office state={state} select={setSelection} view={view} agents={snapshot.agents} departments={snapshot.departments}/><div className="office-work-strip"><span><Icon name="check" size={15}/> {snapshot.tasks.filter(t=>t.status==='Queued').length} queued</span><span><Icon name="activity" size={15}/> {active} active</span><button onClick={()=>setTab('Tasks')}>Open task board <Icon name="arrow" size={14}/></button></div></>}
    {tab==='Tasks'&&<div className="app-task-view"><div className="task-filters"><label><Icon name="folder" size={14}/><input aria-label="Search tasks" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a task…"/></label><select aria-label="Filter tasks by status" value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Queued','In progress','In review','Blocked','Complete'].map(s=><option value={s} key={s}>{s==='All'?'All statuses':s}</option>)}</select></div>{filteredTasks.length?filteredTasks.map(t=><button className="task-row" key={t.id} onClick={()=>openTask(t.id)}><span className="task-check"><Icon name={t.status==='Complete'?'check':'folder'} size={17}/></span><span className="task-row-content"><small>{t.id.slice(0,8).toUpperCase()}</small><strong>{t.title}</strong><span>{snapshot.agents.find(a=>a.id===t.agent_id)?.name||'Unassigned'}</span></span><Status>{t.status}</Status><Icon name="chevron" size={15}/></button>):<Empty icon="check" title={snapshot.tasks.length?'No matching tasks':'Give the team its first task.'}>{snapshot.tasks.length?'Try a different search or status.':'Start with a clear goal. Assign a specialist and move the work forward.'}</Empty>}</div>}
    {tab==='Activity'&&<div className="app-activity"><p className="panel-explanation">Recorded workspace changes, newest first. These are operator actions, not AI execution logs.</p>{[...snapshot.events].reverse().map(e=><div className="saved-event" key={e.id}><span className="event-icon"><Icon name={e.type.startsWith('task')?'check':e.type.startsWith('ticket')?'ticket':'folder'} size={16}/></span><div><strong>{e.summary}</strong><p>{e.detail}</p><small>LOCAL OPERATOR · {new Date(e.created_at).toLocaleString()}</small></div>{e.task_id&&<button className="icon-button" aria-label={`Open task for ${e.summary}`} onClick={()=>openTask(e.task_id)}><Icon name="chevron" size={15}/></button>}</div>)}</div>}
    {tab==='Deliverables'&&<div className="app-deliverables"><p className="panel-explanation">Save briefs, decisions, and delivery notes. File uploads and automated build artifacts are not connected yet.</p>{snapshot.artifacts.length?<div className="artifact-grid">{snapshot.artifacts.map(a=><button className="artifact-card" key={a.id} onClick={()=>setSelection({kind:'artifact',id:a.id})}><span className="artifact-visual"><Icon name="folder" size={30}/><span>PROJECT NOTE</span></span><small>{new Date(a.created_at).toLocaleDateString()}</small><h4>{a.title}</h4><span>Read note <Icon name="arrow" size={14}/></span></button>)}</div>:<Empty title="A place for the thinking." action={<button className="secondary-button" disabled={isStaticPreview} title={isStaticPreview?'Read-only review preview':undefined} onClick={()=>openCreate('artifact')}>Add your first note <Icon name="plus" size={14}/></button>}>Keep a brief or decision alongside the work it belongs to.</Empty>}</div>}
    {tab==='Support'&&<div className="app-support"><p className="panel-explanation">Tickets are saved for this project. External notifications, replies, and customer delivery will come in the collaboration phase.</p>{snapshot.tickets.length?snapshot.tickets.map(t=><div className="ticket" key={t.id}><button aria-expanded={expandedTicket===t.id} onClick={()=>setExpandedTicket(expandedTicket===t.id?null:t.id)}><span><small>{t.id.slice(0,8).toUpperCase()} · {new Date(t.created_at).toLocaleString()}</small><strong>{t.subject}</strong><Status>{t.status}</Status></span><Icon name="chevron" size={16}/></button>{expandedTicket===t.id&&<p>{t.description}</p>}</div>):<Empty icon="ticket" title="A direct line to the work." action={<button className="secondary-button" disabled={isStaticPreview} title={isStaticPreview?'Read-only review preview':undefined} onClick={()=>openCreate('ticket')}>Create a ticket <Icon name="plus" size={14}/></button>}>Record a question, issue, or request without losing the project context.</Empty>}</div>}
    </div><footer className="app-statusbar"><span><i/>{isStaticPreview?'Published snapshot · Read only':'Changes saved to the workspace database'}</span><span>{lastSync?`${isStaticPreview?'Loaded':'Last synced'} ${lastSync.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`:''}<button onClick={retry} aria-label="Refresh project"><Icon name="reset" size={14}/></button></span></footer>
    </>:null}</main></div>
    {create&&<CreateDialog key={create} kind={create} agents={snapshot?.agents||[]} tasks={snapshot?.tasks||[]} close={()=>setCreate(null)} save={createRecord}/>}
    {currentTask&&<TaskDetails readOnly={isStaticPreview} key={currentTask.id} task={currentTask} snapshot={snapshot} close={()=>setSelection(null)} save={(id,body)=>mutate(`tasks/${id}`,body,'PATCH')} openArtifact={id=>setSelection({kind:'artifact',id})}/>}
    {currentAgent&&<AgentDetails key={currentAgent.id} agent={currentAgent} snapshot={snapshot} close={()=>setSelection(null)} openTask={openTask}/>}
    {currentArtifact&&<ArtifactDetails key={currentArtifact.id} artifact={currentArtifact} snapshot={snapshot} close={()=>setSelection(null)} openTask={openTask}/>}
  </div>;
}
