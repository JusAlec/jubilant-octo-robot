# Request-to-release workflow

## Purpose
Validate one complete project workflow before investing further in GitHub automation or a large autonomous team. No GitHub integration is required. The backend-enabled internal app is editable; Pages remains a clearly labeled read-only review.

## Use the workflow
1. Open **Requests** and create an enhancement request with the desired outcome and recorded requester.
2. Begin product review. Record questions and answers in the request conversation.
3. Consult engineering when needed. A small request can move from product review directly to a scope proposal.
4. Propose scope and acceptance criteria. Scope proposals are immutable revisions. Record the reviewer's decision against the current revision; requested changes return to product review.
5. After scope approval, plan linked tasks. Assign specialists and start implementation explicitly.
6. Complete the linked work, then submit a deliverable summary and optional preview URL for internal QA.
7. Record internal review. Failed review returns to implementation; passing review opens customer review.
8. Record customer approval or requested changes against the current deliverable. Requested changes require implementation and a new deliverable revision, followed by QA and customer review again.
9. After approval, record an already verified release URL and verification notes. This action does not deploy code.
10. Close the request with a completion note. The scope, deliverables, decisions, and conversation remain available.

The first version is operated manually. Names on approvals/comments are recorded attribution, not authenticated customer accounts or proof of identity. No AI work or external deployment is triggered by these controls.

## Model and safeguards
Migration 5 adds requests, immutable scope revisions, immutable deliverable revisions, comments, and decision history. Tasks and project activity gain an optional request reference. Existing project/task data is preserved.

- All workflow writes and their history/activity entries are transactional.
- State-changing commands require the observed request version. Concurrent changes return 409; reopen the request before retrying.
- Scope approval identifies the exact scope revision. A scope rejection requires a new proposal revision.
- Work can only be linked after scope approval. At least one linked task is required before implementation starts.
- Every linked task must be complete before submitting a deliverable or approving it.
- Review decisions identify the current immutable deliverable. An old version cannot be approved instead.
- Changing linked work during internal review returns the request to implementation and invalidates the submitted version.
- Task edits are blocked while awaiting customer review or after approval/release. Record requested changes before resuming implementation.
- Customer/internal change requests invalidate the current deliverable. Prior versions and decisions remain as history.
- Release recording requires an approved deliverable, completed work, a safe URL, and verification notes.
- Closed requests reject new comments or further transitions. New requirements should become follow-up requests.
- Project references are checked on every request/action/comment/task link. These correctness checks do not replace future customer authorization.
- Preview/release URLs must use HTTPS, with HTTP allowed only for local loopback previews. They are operator-supplied links, not assertions that the app verified access or deployed a feature.

Major scope changes after implementation begins are not silently folded into the original approval; create a follow-up request. General task dependencies, budgets, files, external notifications, authenticated reviewer roles, and automatic deployment remain future work.

## Office visualization
The review table reflects the current recorded review stage and relevant specialist roles. It does not imply that autonomous agents are talking or that a live meeting is taking place. Tasks continue to drive desk assignments. Requests and tasks link back to each other so the visual office is grounded in inspectable records.

## API
- `POST /api/projects/:project/requests`: `title`, `description`, `requester`.
- `POST /api/projects/:project/requests/:request/comments`: recorded `author`, `body`.
- `POST /api/projects/:project/requests/:request/actions`: `action`, observed `version`, and the fields required by that action.
- Existing task creation accepts optional `request_id` from the same project.
- Project snapshots include `workflow.requests`, `workflow.scopes`, `workflow.deliveries`, `workflow.history`, and `workflow.comments`.

Actions: `start_product_review`, `consult_engineering`, `propose_scope`, `approve_scope`, `scope_changes`, `start_build`, `resume_build`, `submit_delivery`, `approve_internal`, `internal_changes`, `approve_delivery`, `delivery_changes`, `record_release`, `close`.

## Public review example
Pages includes `[Example] Add consultation booking`, generated in an isolated in-memory store by `scripts/update-workflow-preview.mjs`. It is explicitly labeled illustrative in the card, detail view, task title, and activity source. Its sample decisions/deliverables are not actual customer approvals or completed work. The generator never reads the internal database or exports private customer data. It is not run automatically during deployment.

The public snapshot demonstrates customer review after a change request and revised deliverable. It cannot save edits. The backend-enabled app persists the actual editable workflow in SQLite.

## Validation
- All 34 Node tests pass, including workflow state gates, immutable revisions, requested changes, stale edits, project references, unsafe URL rejection, HTTP routes, and file-backed restart persistence.
- `python scripts/workflow-browser-smoke.py` passed the entire workflow, including comments, a deliberately rejected premature delivery, customer-requested changes, a second revision, approval, recorded release, closure, reload persistence, office review visualization, and 320–1440px layouts.
- The workflow test uses its own database and explicitly illustrative people and release URLs; no actual deployment or customer authentication is claimed.
- Pages checks cover the labeled example and disabled writes at the nested repository URL.

## Remaining priority
Host and authenticate the editable app before inviting customers. A deployed Node API, persistent database, reviewer identities/project roles, private artifacts/previews, and operational safeguards are required. GitHub event automation is optional and deferred; marketing work also remains deferred.
