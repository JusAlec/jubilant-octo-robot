# QR8 implementation plan

## Product goal
Build a functional visual delivery workspace first. Explore marketing later. The office is one view over project work; tasks, activity, notes, support, and eventually execution remain useful independently of the visual floor plan.

## Steps 1 and 2 — implemented for internal development

### 1. App workspace
- Open directly into project navigation, not the marketing landing page.
- Create and switch projects; use Office, Tasks, Activity, Deliverables, and Support.
- Inspect team assignments, create tasks, and update their status/assignee.
- Use mobile team/list views, keyboard-accessible controls, native dialogs, and reduced motion.

### 2. Persistent project data
- Server-backed SQLite storage for projects, project role assignments, tasks, activity, notes, and support tickets.
- JSON API boundary independent of the database implementation.
- Transactional task/history writes, task version conflict checks, and unique active assignments.
- Project-scoped data reads/writes and linked-note validation.
- Shared state across independent browser sessions and server restarts.
- Five-second foreground polling; visible errors/stale state when the backend is unavailable.

No Supabase binding is configured. SQLite makes this phase operational without requiring credentials. It is an internal development store; hosted Postgres and authenticated customer access are not claimed complete. See [workspace architecture](WORKSPACE-ARCHITECTURE.md).

## Step 3 — real development events
Connect a scoped GitHub App; validate webhook signatures, bind repository installations to project scope, deduplicate deliveries, and save events durably before publication. Link PRs, checks, and deployment evidence to tasks. Replace polling with authorized subscriptions and cursor recovery as needed. Keep operator updates distinct from verified integration events.

## Step 4 — executable agent workflow
Implement one narrowly scoped runtime adapter and an isolated worker. Connect task -> execution -> artifact/PR -> tests -> review. Add bounded retries, checkpoints, cancellation, per-project credentials and budgets, and recovery without duplicate external effects. Privileged actions and deployment require appropriate human review. Do not represent role assignments as running agents until this exists.

## Step 5 — customer collaboration
Expand persisted tickets to replies, internal notes, status workflows, private attachments, and notifications. Add approvals bound to specific artifact versions. Capture QR8's own development as actual evidence, with an explicitly safe public projection if later desired.

## Step 6 — secure external pilot
Add hosted persistence and deployable API/worker infrastructure. Implement user authentication, explicit project memberships, roles, database policies, protected previews, and private artifact storage. Test two customers, revocation, and every data channel. Existing project-scoped queries alone are not a security boundary. GitHub Pages cannot run the API/database.

## Later — multiple teams and operations
Make team/office configuration editable, add fair scheduling and per-project quotas, and validate backup/restore, monitoring, retention, and concurrent workloads. Isolate project memory, files, credentials, and artifacts. Profile before adopting a canvas renderer or larger streaming infrastructure.

## Validation approach
API/store tests must demonstrate validation, project-scoped references, correct task ownership, conflict rejection, atomic event writes, and file-backed restart persistence. Browser checks must exercise independent sessions, notes/tickets, project switching, network failure, and responsive views. Production identity, customer permissions, execution, and remote deployment require their own later validation.
