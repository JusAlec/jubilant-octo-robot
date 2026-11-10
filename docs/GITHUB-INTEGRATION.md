# GitHub development events

## Implemented
- Project-to-repository mappings keyed by immutable numeric repository ID and expected owner/name.
- Optional GitHub App installation binding. App deliveries must match the configured installation ID. Repository webhook mappings leave it blank and do not accept App installation payloads.
- HMAC-SHA256 verification against the exact request bytes, with constant-time comparison. Verification runs before parsing or changing any records.
- Supported evidence: pull requests, check runs, workflow runs, deployment status, and branch pushes/deletions.
- Durable delivery deduplication; reused IDs with different payloads are rejected. Recorded deliveries and evidence/history updates commit in one transaction.
- Upstream timestamps, where supplied, prevent older observations from replacing newer evidence. These are event observations, not an authoritative remote-state reconciliation service. A future GitHub API adapter should reconcile missing or ambiguous updates.
- Evidence can be linked to an existing task in the same project with a version check. A passing check or merged PR never silently completes the task.
- Connections view, signed-delivery status, GitHub evidence links, task evidence, and source-labeled activity.
- Database migrations 2–4 preserve existing workspace data.

## What is not connected yet
No real webhook secret, public receiver, or GitHub hook/App installation is configured in this session. The GitHub API request to list repository hooks returned Forbidden; existing Git HTTPS access does not establish API access. Do not interpret the implemented receiver or a repository mapping as an active connection.

All automated delivery tests use explicitly synthetic fixtures in memory or a separate temporary database. They are not exported as genuine project activity. The public Pages review snapshot does not become live simply because this code is deployed.

## Connection setup
1. In the internal workspace's Connections view, map the project to the GitHub repository's numeric ID and exact owner/name. For this repository, the task-provided identity is `1171152130`, `JusAlec/jubilant-octo-robot`. Use an installation ID only when configuring a GitHub App. Use Edit mapping to change the expected name or installation later; edits reset delivery readiness and require the observed version. The immutable repository ID is preserved.
2. Configure a cryptographically random 32+ character `QR8_GITHUB_WEBHOOK_SECRET` through secure server environment settings. Never put its real value in source, browser code, public snapshots, chat, or logs. It must be a raw server-side value suitable for local HMAC verification, not a proxy-only placeholder.
3. Run `npm run start:webhooks` on Node 24. The dedicated process defaults to loopback port 3002 and exposes only `POST /webhooks/github`. The operator API remains private on its own loopback listener.
4. For external delivery, put only the dedicated receiver behind HTTPS. `QR8_WEBHOOK_HOST` and `QR8_WEBHOOK_PORT` configure its listener. `QR8_DB_PATH` must refer to the same persistent SQLite database used by the internal workspace, on one host/local filesystem. Do not use ephemeral disk, separate unshared databases, or multi-host/network-filesystem SQLite. A hosted Postgres implementation is required before scaling this topology across services/hosts.
5. In GitHub repository Settings -> Webhooks, configure the HTTPS receiver URL, JSON content type, and the same secret using secure entry. Select Pull requests, Check runs, Workflow runs, Deployment statuses, and Pushes as appropriate. Alternatively configure a GitHub App subscribed to these events with minimum relevant read permissions and the expected installation binding.
6. Check GitHub Recent Deliveries. A mapped signed ping may be acknowledged as ignored; a supported real event should be recorded. Connections reports only that a signed delivery was received, not that the remote service is continuously healthy.
7. Confirm actual evidence appears with its GitHub URL and `VERIFIED GITHUB` source. Link it to a project task. Redeliver the same GitHub delivery and confirm it does not duplicate evidence/activity.

The public receiver process can be exposed independently of the private app. It offers no project browsing or mutation endpoints. External customer access to the workspace still requires the authentication/authorization phase.

## Endpoints
- Private operator API: `POST /api/projects/:project/github-bindings` with `repository_id`, `full_name`, optional `installation_id`.
- Private operator API: `PATCH /api/projects/:project/github-bindings/:binding` updates the expected name/installation with a `version` check.
- Private operator API: `PATCH /api/projects/:project/github-evidence/:evidence` with `task_id` (or null) and the observed `version`.
- Local test/loopback receiver: `POST /api/webhooks/github`, available only if the API process has the server-side secret.
- Dedicated externally routable receiver: `POST /webhooks/github`.

Signatures require `X-Hub-Signature-256`; event/delivery metadata requires `X-GitHub-Event` and `X-GitHub-Delivery`. Requests must be JSON and at most 1 MiB. Unmapped repositories/installations fail closed. Malformed supported events are rejected. Valid unsupported event types are acknowledged and recorded as ignored without inventing evidence.

Only normalized metadata is retained: title, status, commit reference, repository-scoped GitHub URL, source timestamps, delivery digest, and safe source labels. Raw payloads, commit diffs, credentials, and arbitrary external deployment URLs are not persisted. A deployment with an external log URL links to its GitHub repository deployment page instead. Titles may still contain private project information, so evidence is not automatically published to the public snapshot.

## Validation
`npm test` includes signing/tampering, provider identity, wrong-project links, stale edit and stale observation handling, idempotent delivery/restart, evidence normalization, and HTTP receiver boundary checks.

For browser verification use a separate database and an explicitly test-only secret in both server and test environment, then run `python scripts/github-browser-smoke.py`. The test creates synthetic repository data and verifies mapping, ingestion, task linking, source labels, and responsive layouts. Never use these fixtures as real development history.

A real end-to-end delivery remains pending until the external setup above is completed. No model execution or autonomous worker is implemented in this step.

### Current validation results
- All 24 Node tests passed, including the standalone receiver boundary and versioned mapping edits.
- Synthetic browser flow passed: create a project/task, map and edit a repository, inject a signed test event, link evidence, inspect it from the task, verify source labels, and check Connections layouts at 320–1440px.
- Pages build and nested-path browser checks passed, including the read-only Connections view. No API/write requests were made by the static preview.
- Real provider delivery and public receiver hosting remain unverified and unconfigured.
