# Internal workspace: steps 1 and 2

## What works now
QR8 opens directly into a project workspace. The operator can create projects, create and assign tasks, change task status, inspect assignments in the office, search/filter work, read real recorded activity, save linked project notes, and record project support tickets. Data lives in a server database, not browser localStorage. Independent browser sessions see the same state; the browser refreshes the current project every five seconds while visible.

This is an internal single-operator development application. Role definitions are not autonomous agents. Status changes do not start jobs or verify code completion. The old replay is retained only as a reference fixture and is not imported into real project history. Nothing in this phase implements customer login, organization memberships, RLS, production multi-tenancy, notifications, file uploads, or AI execution.

## Why SQLite now
The cloud environment has no configured Supabase project, database URL, or credentials. Node 24 provides SQLite directly, allowing a functioning persistent API without inventing credentials or waiting for infrastructure. SQLite is the development database for this phase, not a claim of hosted Supabase readiness. `server/store.js` owns persistence and `server/http.js` owns HTTP; the frontend consumes JSON endpoints through `src/api.js`. A future Postgres implementation must preserve these contracts and add authenticated scope enforcement.

## Run
Use Node 24 (minimum 22.13). From the repository:

```
npm ci
npm run dev
```

This starts the API on loopback port 3001 and Vite on loopback port 5173. Vite proxies `/api` to the local API. `npm run start:api` and `npm run dev:web` start each separately. `QR8_DB_PATH` selects a database path; default is `.data/qr8.sqlite` relative to the repository, independent of shell working directory. `QR8_API_PORT` changes the API/proxy port. These are local configuration variables, not secrets.

`npm run build` creates frontend assets. With the API running, `npm run preview -- --port 4173 --strictPort` serves the production assets and proxies API requests. Only the documented localhost origins on 5173/4173 are accepted. Do not expose the dev/preview server through a public listener or tunnel: it would bypass the intended single-machine boundary.

## Storage and consistency
- SQLite uses foreign keys, WAL mode, a busy timeout, project indexes, and an exclusive active-assignment index.
- Schema setup is repeatable and recorded in `schema_migrations`.
- The first boot creates `Building QR8` and six project role assignments. It does not fabricate tasks, deliverables, or execution events.
- Projects scope tasks, assigned roles, events, notes, and support tickets.
- Each task has a version. PATCH requires the observed version; stale updates return 409 without overwriting newer state.
- Only one active task per specialist per project is permitted. Queued tasks may share an assignee. Completion/requeue releases active capacity.
- A mutation and its activity entry commit in one transaction. Failed updates roll back both.
- Reload and process restart do not reseed existing state. The database and its sidecars are ignored by Git.
- Read models are snapshots, including the latest 500 activity entries. Pagination and push/realtime subscriptions are future work.

To back up an idle development database, stop the API cleanly before copying `.data/`. For a running database, use SQLite's online backup facility; do not copy only the `.sqlite` file while ignoring active WAL data. Backups and migrations must be operationalized before a customer pilot.

## API
All responses are JSON and non-cacheable. Mutations accept JSON objects, validate field type/length and project references, and return structured errors.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Internal mode and storage readiness |
| GET | `/api/projects` | List operator projects |
| POST | `/api/projects` | Create project and role assignments |
| GET | `/api/projects/:project/snapshot` | Project, agents, tasks, activity, notes, tickets |
| POST | `/api/projects/:project/tasks` | Create queued task |
| PATCH | `/api/projects/:project/tasks/:task` | Change status/assignee with version check |
| POST | `/api/projects/:project/artifacts` | Save an operator-authored text note, optionally linked to a task |
| POST | `/api/projects/:project/tickets` | Save an internal support ticket |

Task status: Queued, In progress, In review, Blocked, Complete. Ticket status currently starts Open; replies/status workflows remain in the customer collaboration phase. Notes are text, not executable HTML or build evidence. Internal tickets do not send email.

## Local access boundary
The API binds to 127.0.0.1 only. It rejects foreign Host/Origin values and cross-site browser requests. There is no CORS wildcard, service key in browser code, or client-selected identity. This protects the local development surface; it is **not authentication or tenant isolation**. Any authorized local operator can access all projects. Project-scoped API validation is correctness protection, not a substitute for customer access policies.

Before external use, add authenticated users, explicit project membership, role checks at every endpoint, database policies, private storage, protected previews, audited operations, retention, backups, and appropriate production hosting. Do not place customer confidential data into this local prototype.

## Failure handling
An unavailable API produces a connection error instead of loading a replay or pretending writes succeeded. A failed save preserves form input. Failed polling leaves the last saved view visible with a stale-state warning and retry. A successful write followed by failed refresh is reported as saved-but-not-refreshed. Request generation guards prevent older reads from replacing a newer project snapshot. A stale edit is rejected and must be reopened against current state.

## Deployment status
GitHub Pages cannot run the API or database. The Pages workflow now builds with `npm run build:pages`, publishing a read-only workspace for review. This mode loads only `public/preview/workspace.json`, a deliberately reviewed snapshot of the QR8 self-build backlog and implementation note. It disables mutation controls, rejects write requests in the data adapter, and labels the app as a published snapshot. It does not call the internal API, imply database connectivity, or use browser storage to pretend writes succeeded.

The snapshot is a checked-in allowlisted artifact, not an automatic export of the database during builds. Updating it requires an explicit content review. The default development and production builds remain backend-enabled; editable external access still requires suitable hosting and authentication.

## Validation
`npm test` covers API behavior, project scoping, rejected foreign browser origins/hosts, task version conflicts, exclusive active assignments, atomic event history, validation, and real file-backed database restart persistence, plus the retained replay fixture tests.

Browser tests use an isolated database:

```
QR8_DB_PATH=/tmp/qr8-browser.sqlite npm run dev
python scripts/browser-smoke.py
```

The browser script creates uniquely named test projects. It exercises app-first navigation, task creation/validation/assignment/status, independent browser sessions, stale-edit conflicts, related notes, server-saved support tickets, recorded activity, project switching, filters, responsive views from 320–1440px, reduced motion, and offline write/recovery behavior. It does not test production authentication or AI execution, which do not yet exist.

### Current check results
- Production build passed.
- All 14 Node tests passed, including file-backed restart persistence and API boundary tests.
- Functional browser script passed against both development and production-preview servers.
- Desktop/mobile visual review completed; no runtime errors or page overflow observed in the tested flows.
- Browser tests used a separate `/tmp` database. The actual internal workspace uses `.data/qr8.sqlite`, with three authored next-step backlog tasks and one implementation note. These records describe future work and the current implementation; they are not fabricated execution history.
- Customer authentication, hosted deployment, and real AI execution remain unimplemented and unverified.

### Pages review checks
- All 14 Node tests passed before publication.
- `npm run build:pages` and `python scripts/pages-smoke.py` passed.
- The static bundle was tested at `/jubilant-octo-robot/`, including task, agent, and note inspection; activity; disabled writes; mobile layouts; zero backend/write requests; and no runtime errors.
- A separate browser check confirmed the internal backend-enabled app retains editable task controls.
