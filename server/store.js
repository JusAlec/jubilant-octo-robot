import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { agents, departments } from '../src/data/office.js';

export class AppError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const statuses = ['Queued', 'In progress', 'In review', 'Blocked', 'Complete'];
function text(value, name, max, required = true) {
  if (typeof value !== 'string' || (required && !value.trim()) || value.length > max) throw new AppError(400, `${name} must be ${required ? 'nonempty text' : 'text'} up to ${max} characters.`);
  return value.trim();
}

export function createStore(filename) {
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS project_agents (project_id TEXT NOT NULL REFERENCES projects(id), agent_id TEXT NOT NULL, PRIMARY KEY(project_id, agent_id));
    CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', status TEXT NOT NULL CHECK(status IN ('Queued','In progress','In review','Blocked','Complete')), agent_id TEXT, version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY(project_id,agent_id) REFERENCES project_agents(project_id,agent_id));
    CREATE TABLE IF NOT EXISTS events (sequence INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT NOT NULL UNIQUE, project_id TEXT NOT NULL REFERENCES projects(id), task_id TEXT, agent_id TEXT, type TEXT NOT NULL, summary TEXT NOT NULL, detail TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'operator', FOREIGN KEY(task_id) REFERENCES tasks(id));
    CREATE TABLE IF NOT EXISTS artifacts (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), task_id TEXT, title TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY(task_id) REFERENCES tasks(id));
    CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), subject TEXT NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Open', created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS tasks_by_project ON tasks(project_id, updated_at);
    CREATE INDEX IF NOT EXISTS events_by_project ON events(project_id, sequence);
    CREATE UNIQUE INDEX IF NOT EXISTS one_active_task_per_agent ON tasks(project_id,agent_id) WHERE agent_id IS NOT NULL AND status IN ('In progress','In review','Blocked');
  `);
  db.prepare('INSERT OR IGNORE INTO schema_migrations VALUES(1, ?)').run(new Date().toISOString());
  function transaction(fn) {
    db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); db.exec('COMMIT'); return result; } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  function project(id) { const row = db.prepare('SELECT * FROM projects WHERE id=?').get(id); if (!row) throw new AppError(404, 'Project not found.'); return row; }
  function task(projectId, id) { project(projectId); const row = db.prepare('SELECT * FROM tasks WHERE project_id=? AND id=?').get(projectId, id); if (!row) throw new AppError(404, 'Task not found in this project.'); return row; }
  function event(projectId, type, summary, detail = '', taskId = null, agentId = null) {
    db.prepare('INSERT INTO events(id,project_id,task_id,agent_id,type,summary,detail,created_at) VALUES(?,?,?,?,?,?,?,?)').run(randomUUID(),projectId,taskId,agentId,type,summary,detail,new Date().toISOString());
  }
  function agent(projectId, id) {
    if (id === null) return null;
    if (typeof id !== 'string') throw new AppError(400, 'Invalid agent assignment.');
    if (!db.prepare('SELECT 1 FROM project_agents WHERE project_id=? AND agent_id=?').get(projectId,id)) throw new AppError(400, 'Agent is not assigned to this project.');
    return id;
  }
  function checkAvailability(projectId, agentId, status, taskId = '') {
    if (agentId && ['In progress','In review','Blocked'].includes(status) && db.prepare("SELECT id FROM tasks WHERE project_id=? AND agent_id=? AND id<>? AND status IN ('In progress','In review','Blocked')").get(projectId,agentId,taskId)) throw new AppError(409,'This agent already has an active task. Complete, queue, or reassign that task first.');
  }
  function createProject(input) {
    const name = text(input.name, 'Project name', 100);
    const description = text(input.description ?? '', 'Description', 2000, false);
    return transaction(() => {
      const id = randomUUID();
      db.prepare('INSERT INTO projects VALUES(?,?,?,?)').run(id,name,description,new Date().toISOString());
      for (const a of agents) db.prepare('INSERT INTO project_agents VALUES(?,?)').run(id,a.id);
      event(id,'project.created',`Project created: ${name}`,'Created by the local workspace operator.');
      return project(id);
    });
  }
  // Initialize an actual internal project, never import the replay as real history.
  if (!db.prepare('SELECT 1 FROM projects LIMIT 1').get()) createProject({ name: 'Building QR8', description: 'Our internal workspace for building the visual AI office. Tasks and activity are managed by the operator; agent execution is not connected yet.' });
  return {
    close: () => db.close(),
    listProjects: () => db.prepare('SELECT p.*, (SELECT count(*) FROM tasks t WHERE t.project_id=p.id) AS task_count FROM projects p ORDER BY created_at,id').all(),
    createProject,
    snapshot(projectId) {
      const p = project(projectId);
      const assigned = new Set(db.prepare('SELECT agent_id FROM project_agents WHERE project_id=?').all(projectId).map(r=>r.agent_id));
      return { project: p, agents: agents.filter(a=>assigned.has(a.id)), departments, tasks: db.prepare('SELECT * FROM tasks WHERE project_id=? ORDER BY created_at,id').all(projectId), events: db.prepare('SELECT * FROM events WHERE project_id=? ORDER BY sequence DESC LIMIT 500').all(projectId).reverse(), artifacts: db.prepare('SELECT * FROM artifacts WHERE project_id=? ORDER BY created_at DESC,id').all(projectId), tickets: db.prepare('SELECT * FROM tickets WHERE project_id=? ORDER BY created_at DESC,id').all(projectId) };
    },
    createTask(projectId, input) {
      project(projectId);
      const title = text(input.title,'Task title',160);
      const description = text(input.description ?? '', 'Description',5000,false);
      const agentId = agent(projectId,input.agent_id ?? null);
      return transaction(() => {
        const id = randomUUID(), now = new Date().toISOString();
        db.prepare('INSERT INTO tasks VALUES(?,?,?,?,?,?,1,?,?)').run(id,projectId,title,description,'Queued',agentId,now,now);
        event(projectId,'task.created',`Task created: ${title}`,description,id,agentId);
        return task(projectId,id);
      });
    },
    updateTask(projectId,id,input) {
      return transaction(() => {
        const current = task(projectId,id);
        if (!Number.isInteger(input.version) || input.version !== current.version) throw new AppError(409,'This task changed in another session. Refresh and try again.');
        const status = input.status ?? current.status;
        if (!statuses.includes(status)) throw new AppError(400,'Unknown task status.');
        const agentId = agent(projectId,Object.hasOwn(input,'agent_id') ? input.agent_id : current.agent_id);
        checkAvailability(projectId,agentId,status,id);
        if (status === current.status && agentId === current.agent_id) return current;
        db.prepare('UPDATE tasks SET status=?,agent_id=?,version=version+1,updated_at=? WHERE id=? AND project_id=?').run(status,agentId,new Date().toISOString(),id,projectId);
        const who = agents.find(a=>a.id===agentId)?.name || 'Unassigned';
        event(projectId,'task.updated',`${current.title} → ${status}`,`Assignment: ${who}. Updated by the local operator; no agent execution was triggered.`,id,agentId);
        return task(projectId,id);
      });
    },
    createArtifact(projectId,input) {
      project(projectId);
      const title = text(input.title,'Note title',160), content = text(input.content,'Note content',10000);
      const taskId = input.task_id || null;
      if (taskId) task(projectId,taskId);
      return transaction(() => {
        const id = randomUUID();
        db.prepare('INSERT INTO artifacts VALUES(?,?,?,?,?,?)').run(id,projectId,taskId,title,content,new Date().toISOString());
        event(projectId,'artifact.created',`Project note added: ${title}`,'Operator-authored note; not an automatically generated build artifact.',taskId);
        return {id};
      });
    },
    createTicket(projectId,input) {
      project(projectId);
      const subject=text(input.subject,'Subject',160), description=text(input.description,'Message',5000);
      return transaction(() => {
        const id=randomUUID();
        db.prepare('INSERT INTO tickets VALUES(?,?,?,?,?,?)').run(id,projectId,subject,description,'Open',new Date().toISOString());
        event(projectId,'ticket.created',`Support ticket saved: ${subject}`,'Saved to this internal workspace. External notifications and customer delivery are not connected.');
        return {id};
      });
    },
  };
}
