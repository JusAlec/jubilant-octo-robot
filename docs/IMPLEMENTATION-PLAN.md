# QR8 implementation plan

## Current direction
Focus on a useful editable project workflow. Marketing and live GitHub automation are deferred. The office visualizes recorded work; the conventional request/task views remain the source of clarity.

## Delivered: internal workspace and persistence
App-first navigation; persistent projects, task assignments/status, notes, support tickets, and activity; version conflict protection; cross-session and restart persistence. The local backend uses SQLite behind a JSON API because no hosted database is configured. Project scoping is implemented for correctness, not as authenticated customer isolation.

## Delivered: manual request-to-release workflow
Requests -> product review -> optional engineering consultation -> versioned scope approval -> linked implementation tasks -> versioned deliverable -> QA -> customer review -> recorded release -> closure. Includes comments, change requests, decision history, guarded transitions, and review-stage office visualization. Approval attribution is manually recorded by the operator; it is not customer authentication. See [workflow documentation](REQUEST-WORKFLOW.md).

The public Pages review is read-only and includes an explicitly illustrative booking workflow. The internal app is editable. No AI execution or real deployment is triggered by workflow actions.

## Next priority: hosted editable pilot
Deploy the API and persistent database behind authentication. Implement explicit project memberships and reviewer permissions, protect all data/file/preview channels, add backups/restore and operational monitoring, and verify two customer accounts plus revocation. Avoid exposing the local single-operator API publicly. GitHub Pages cannot run the backend.

## Next product milestone: one real agent workflow
Once the human workflow is validated, connect one isolated agent runner to a task. Capture actual execution, failures, artifacts, tests, and human review. Add bounded retries, cancellation, scoped credentials, budgets, and recovery without duplicate external effects. Keep planned specialist roles distinct from executing agents.

## Collaboration expansion
Add authenticated customer conversation, support ticket replies/internal notes, file uploads, notifications, and reviewer-specific approval rights. Expand scope/budget/dependency handling from observed pilot needs.

## Deferred: GitHub automation
The signed receiver, repository mappings, and evidence/task links are implemented and tested with synthetic fixtures. Live activation is not required for the current workflow and remains deferred. It still needs a hosted HTTPS receiver, secure webhook secret, and GitHub configuration. See [integration documentation](GITHUB-INTEGRATION.md).

## Later: multiple teams and public marketing
Editable team layouts and scheduling, per-project quotas, larger-scale operations, and a marketing landing page follow a validated product experience. Isolate project data, memory, secrets, and artifacts. Profile before adding a game engine or a large streaming stack.
