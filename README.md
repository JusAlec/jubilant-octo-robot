# QR8 / Project workspace

An internal project application for the visual AI office. Open the workspace directly, manage tasks and assignments, record decisions, and follow saved project activity.

## Start

Node 24 recommended (minimum 22.13).

```bash
npm ci
npm run dev
```

This starts a loopback-only Node API and Vite frontend. SQLite data persists in `.data/qr8.sqlite` and is excluded from Git. `QR8_DB_PATH` can select another database. No hosted database credentials are required for this internal version.

## Validate

```bash
npm test
npm run build
```

For functional browser checks, use Python Playwright and `/usr/bin/chromium`. Start the app with a test database, then run the test script in a separate terminal:

```bash
QR8_DB_PATH=/tmp/qr8-browser.sqlite npm run dev
python scripts/browser-smoke.py
```

The script creates uniquely named test projects. `QR8_TEST_URL` can point it at a local production preview. With the API running, start `npm run preview -- --port 4173 --strictPort`, then run `QR8_TEST_URL=http://127.0.0.1:4173/ python scripts/browser-smoke.py`.

## Current functionality

- Project creation and switching, with project-specific tasks, notes, support, and history.
- Persistent tasks with assignment, status, search, and filtering.
- Office/team views driven by saved assignments rather than timed replay fixtures.
- Recorded operator activity, text project notes linked to tasks, and saved support tickets.
- Task version checks to prevent stale-session overwrites; transactional mutation/event writes.
- Independent browser sessions see the same database-backed state.
- Explicit offline errors and retry behavior; no fake browser-only success fallback.

This is a **local single-operator app**, not a private customer portal yet. Specialist definitions do not run AI jobs. Tickets do not send notifications. Customer authentication, membership policies, hosted persistence, uploads, execution integrations, and production operations are subsequent phases. Do not expose the local API or Vite proxy publicly.

## Documentation

- [Implementation plan](docs/IMPLEMENTATION-PLAN.md)
- [Architecture, API, storage, and operational notes](docs/WORKSPACE-ARCHITECTURE.md)

## Deployment

GitHub Pages uses `npm run build:pages` to publish an explicitly read-only workspace preview. It reads the reviewed QR8 self-build snapshot in `public/preview/workspace.json`, disables writes, and never calls the internal API. `python scripts/pages-smoke.py` validates the Pages build under the repository URL path.

The default `npm run build` retains the backend-enabled application. Pages cannot host the Node API or database; editable external use needs backend hosting and authentication. The snapshot is checked in deliberately; builds do not export the database or automatically publish new internal data. No deployment is performed by local builds.

## GitHub development evidence

The Connections view maps a repository and displays signed development evidence. See [GitHub integration setup](docs/GITHUB-INTEGRATION.md) for the dedicated receiver, secret handling, event subscriptions, local tests, and outstanding live setup. `npm run start:webhooks` runs only the signed receiver, not the operator API. No webhook secret or live connection is bundled with the app.

## Enhancement requests

Open **Requests** to work from a customer goal through product/engineering review, scope approval, linked tasks, QA, customer feedback, and recorded release. The internal app is editable and persists the workflow; GitHub integration is not required. See [request workflow](docs/REQUEST-WORKFLOW.md). `python scripts/workflow-browser-smoke.py` exercises a complete example against a separate test database.

The Pages preview includes a labeled illustrative booking scenario and remains read-only. Hosting and authenticating the editable app is the next infrastructure priority.
