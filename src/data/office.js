// Authored product demonstration. These events are not live or historical telemetry.
export const departments = [
  { id: 'product', name: 'Product & strategy', color: 'green', subtitle: 'THE BIG PICTURE' },
  { id: 'engineering', name: 'Engineering', color: 'blue', subtitle: 'MAKING IT REAL' },
  { id: 'quality', name: 'Quality & release', color: 'amber', subtitle: 'THE FINAL DETAILS' },
];
export const agents = [
  { id: 'nova', name: 'Nova', role: 'Product lead', initials: 'NO', department: 'product', color: 'green', description: 'Turns the brief into a clear plan, prioritizes the backlog, and keeps the team moving in the same direction.' },
  { id: 'sage', name: 'Sage', role: 'UX designer', initials: 'SA', department: 'product', color: 'green', description: 'Shapes the customer journey, explores the interface, and makes the complex feel simple.' },
  { id: 'atlas', name: 'Atlas', role: 'Lead engineer', initials: 'AT', department: 'engineering', color: 'blue', description: 'Connects product decisions to implementation and builds the foundations of the QR8 office.' },
  { id: 'pixel', name: 'Pixel', role: 'Frontend engineer', initials: 'PI', department: 'engineering', color: 'blue', description: 'Brings the office to life with responsive interfaces, interaction, and thoughtful motion.' },
  { id: 'echo', name: 'Echo', role: 'QA engineer', initials: 'EC', department: 'quality', color: 'amber', description: 'Checks the experience, tests the edge cases, and gives every release a second look.' },
  { id: 'orbit', name: 'Orbit', role: 'Release engineer', initials: 'OR', department: 'quality', color: 'amber', description: 'Prepares builds, tracks release readiness, and keeps the path to delivery clear.' },
];
export const tasks = [
  { id: 'QR8-001', title: 'Define the visual office', category: 'Product', description: 'Translate the agent office concept into a focused first experience: a public self-build project and an inspectable team.', criteria: ['Clear public demo boundaries', 'Project-centered navigation', 'A useful mobile experience'], artifact: 'Product direction', artifactType: 'Brief', artifactText: 'A visual AI delivery studio where every handoff connects to a task, a decision, or a deliverable. The first project is QR8 itself.' },
  { id: 'QR8-002', title: 'Build the interactive workspace', category: 'Engineering', description: 'Create the office floor, agent inspectors, and an event-driven replay of the development workflow.', criteria: ['Inspectable agents and tasks', 'Replay pause, speed, and restart', 'State derived from ordered events'], artifact: 'Office interaction study', artifactType: 'Design note', artifactText: 'Departments group work by purpose. Selecting an agent opens their current assignment. A shared review table makes handoffs visible without inventing agent conversation.' },
  { id: 'QR8-003', title: 'Review the mobile experience', category: 'Quality', description: 'Make project progress easy to follow on smaller screens with a list-first alternative to the office.', criteria: ['No horizontal page overflow', 'Readable task and status labels', 'Keyboard and reduced-motion support'], artifact: 'Mobile review checklist', artifactType: 'Checklist', artifactText: 'Check the office and list views at 390px. Confirm that tasks, inspectors, support, and replay controls remain usable. Record real test results separately from this demonstration.' },
  { id: 'QR8-004', title: 'Prepare the first release', category: 'Release', description: 'Package the initial frontend prototype for review. Authentication and live execution follow in later phases.', criteria: ['Production bundle generated', 'Demo labels remain visible', 'Outstanding infrastructure documented'], artifact: 'Release scope', artifactType: 'Release note', artifactText: 'First build scope: landing page, office visualization, replay, task and activity views, and local-only support. Private customer access, live integrations, and execution infrastructure are next.' },
];
export const events = [
  { id: 'e01', taskId: 'QR8-001', agentId: 'nova', type: 'started', time: '09:00', summary: 'Nova picked up the office brief.', detail: 'Defining the first QR8 project and its customer journey.' },
  { id: 'e02', taskId: 'QR8-001', agentId: 'sage', type: 'review', time: '09:04', summary: 'Nova and Sage met for a design review.', detail: 'Reviewing the department layout and the project inspector.' },
  { id: 'e03', taskId: 'QR8-001', agentId: 'nova', type: 'completed', time: '09:08', summary: 'Product direction ready for review.', detail: 'The first demonstration deliverable is available.', evidence: true },
  { id: 'e04', taskId: 'QR8-002', agentId: 'atlas', type: 'started', time: '09:10', summary: 'Atlas started the interactive workspace.', detail: 'Connecting the office layout to a shared event model.' },
  { id: 'e05', taskId: 'QR8-002', agentId: 'pixel', type: 'handoff', time: '09:14', summary: 'Atlas handed the interface to Pixel.', detail: 'Agent selection and replay controls are the next milestone.' },
  { id: 'e06', taskId: 'QR8-003', agentId: 'echo', type: 'started', time: '09:16', summary: 'Echo opened the mobile review.', detail: 'Checking the compact activity and team views.' },
  { id: 'e07', taskId: 'QR8-002', agentId: 'sage', type: 'review', time: '09:19', summary: 'Sage and Pixel are reviewing the office.', detail: 'A shared review of the floor plan, agent labels, and task inspector.' },
  { id: 'e08', taskId: 'QR8-003', agentId: 'echo', type: 'review', time: '09:22', summary: 'Mobile checklist is ready for review.', detail: 'Review criteria are recorded; this is not a claim of completed testing.', evidence: true },
  { id: 'e09', taskId: 'QR8-002', agentId: 'pixel', type: 'completed', time: '09:25', summary: 'Workspace interaction study completed.', detail: 'The demonstration design note is available.', evidence: true },
  { id: 'e10', taskId: 'QR8-003', agentId: 'echo', type: 'completed', time: '09:28', summary: 'Mobile review demonstration completed.', detail: 'The replay advances to release preparation.', evidence: true },
  { id: 'e11', taskId: 'QR8-004', agentId: 'orbit', type: 'started', time: '09:30', summary: 'Orbit is preparing the first release.', detail: 'Collecting the frontend scope and next infrastructure steps.' },
  { id: 'e12', taskId: 'QR8-004', agentId: 'orbit', type: 'review', time: '09:34', summary: 'First-build scope is ready for your review.', detail: 'The next step is a real GitHub integration and private project access.', evidence: true },
].map((event, sequence) => ({ ...event, sequence }));

export function projectOffice(stream, cursor) {
  const visible = stream.slice(0, cursor + 1);
  const taskStates = Object.fromEntries(tasks.map(t => [t.id, { status: 'Queued', agentId: null }]));
  const agentStates = Object.fromEntries(agents.map(a => [a.id, { status: 'Available', taskId: null }]));
  for (const event of visible) {
    const previous = taskStates[event.taskId].agentId;
    if (previous && previous !== event.agentId) agentStates[previous] = { status: 'Available', taskId: null };
    const status = event.type === 'completed' ? 'Complete' : event.type === 'review' ? 'In review' : 'In progress';
    taskStates[event.taskId] = { status, agentId: event.agentId };
    agentStates[event.agentId] = { status: status === 'Complete' ? 'Available' : status, taskId: status === 'Complete' ? null : event.taskId };
  }
  return { visible, taskStates, agentStates, completed: Object.values(taskStates).filter(t => t.status === 'Complete').length };
}
