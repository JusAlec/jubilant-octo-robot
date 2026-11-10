# QR8 Visual Agent Office: implementation plan

## Goal
Turn QR8 into a visual AI delivery studio. A public office demonstrates our own build; invited customers eventually receive project-specific offices, workstreams, deliverables, approvals, and support. The attached Agent Office mockup supplies the spatial metaphor, not production execution logic.

## Phase 1 — interactive first build (this change)
- Replace the agency marketing page with the QR8 studio landing and embedded office.
- Create configurable departments, agents, tasks, and an ordered demonstration event stream.
- Provide inspectable agents, task details, project activity, deliverables, and local demonstration support tickets.
- Add play/pause, replay reset, speed, and timeline navigation. Clearly distinguish replay from live execution.
- Support mobile list views, keyboard interaction, reduced motion, and text status.
- Document the event boundary so a real integration can replace the fixture.

Acceptance: production build passes; desktop/mobile render without overflow; replay controls change projected work; selections show associated evidence; local tickets validate, persist, and remain explicitly unsent. No authentication, customer isolation, live telemetry, actual file delivery, or execution is claimed.

## Phase 2 — secure private portal
Supabase Auth/Postgres/private Storage, project memberships, role policies, private realtime channels, API authorization, invitations, and access-controlled previews. Server credentials stay server-side. Build cross-project access and membership revocation tests before using customer information. Separate internal, customer, and public projections.

## Phase 3 — real delivery integration
Authenticated GitHub App webhooks and one agent adapter feed durable events. Validate signatures, derive project scope from trusted bindings, and deduplicate deliveries. Persist events before publication; support snapshots and cursor-based reconnection. Isolate project execution and credentials. Add cost/time/concurrency limits, cancellation, worker recovery, bounded retries, and human review for privileged actions.

## Phase 4 — customer collaboration
Replace local support fixtures with project-scoped tickets, replies, internal notes, private attachments, and notifications. Add version-bound approvals and verified artifact/preview links. Demonstrate ticket -> task -> PR -> CI -> review -> release with QR8 itself. Only explicitly published safe events appear publicly.

## Phase 5 — multiple teams and operations
Configurable teams and layouts, fair scheduling and quotas, observability, retention, backup/restore, and load tests. Team identities can span projects; execution state, memory, secrets, and artifacts cannot. Assess canvas rendering only after profiling larger scenes.

## Architecture
React/Vite frontend -> authorized API and subscriptions -> Postgres state/event store.
Agent workers/GitHub/customer commands -> authenticated ingestion -> durable events -> audience-specific projections -> office/list views.
Use a separate long-running worker with a durable job/workflow mechanism. Evaluate OpenAI Agents SDK for one runtime; Temporal or another durable runner handles restart/approval waits. Avoid operating multiple orchestration frameworks before requirements justify it.

## First-build event boundary
`src/data/office.js` contains authored replay fixtures, not captured historical telemetry. Each event has a stable id, sequence, taskId, agentId, type, time label, customer-safe summary, and optional evidence. `projectOffice(events, cursor)` derives visible agent/task states; rendering never invents completion from elapsed work time. The replay timer advances the cursor only. Pause and speed affect playback, not any external execution.
Production events additionally need tenant/project/run identifiers, schema version, trusted actor, timestamps, idempotency key, correlation/causation IDs, audience, and authorized artifact references. The backend must enforce all permissions; filtering fixtures in a browser is not security.

## Deployment and dependencies
Phase 1 remains a static Vite application with no new packages. `npm ci` and `npm run build`; `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort` for local development. Later phases require backend/worker hosting and securely configured providers. Publishing an environment does not deploy the application.

## Verification
Build and browser checks cover navigation, replay state, task/agent inspection, local support persistence/validation, accessible dialogs, keyboard controls, mobile layout, and reduced motion. Deployment, real delivery, real customer permissions, and model execution remain unverified until those phases exist.

## First-build validation results
- `npm run build`: passed, production assets generated.
- `node --test tests/office.test.js`: 5 passed, 0 failed.
- `python scripts/browser-smoke.py`: passed against the development server.
- `QR8_TEST_URL=http://127.0.0.1:4173/ python scripts/browser-smoke.py`: passed against the production preview.
- Browser coverage: desktop/mobile navigation; dialog open/close and focus restoration; replay restart/play/pause/speed/seek; task and deliverable evidence; ARIA tab keyboard navigation; local ticket whitespace validation and persistence; no support API submissions; reduced-motion styles; no horizontal page overflow at 320, 390, 600, 768, 1024, and 1440px. No browser runtime errors observed.
- Visual desktop/mobile review completed. No deployment or production backend verification performed.
