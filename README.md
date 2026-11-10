# QR8 / Visual Agent Office

A visual AI delivery studio, starting with an interactive public demonstration of the QR8 build. React 18 + Vite 6; no additional runtime packages.

## Develop

```bash
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

## Validate

```bash
node --test tests/office.test.js
npm run build
```

For browser coverage, use an environment with Python Playwright and Chromium at `/usr/bin/chromium`. Start the development server above, then run:

```bash
python scripts/browser-smoke.py
```

`QR8_TEST_URL` can point the same browser checks at a local production preview. Run `npm run preview -- --host 0.0.0.0 --port 4173 --strictPort`, then `QR8_TEST_URL=http://127.0.0.1:4173/ python scripts/browser-smoke.py`.

## First-build scope

- A new landing page, configurable office departments, and six inspectable agents.
- An ordered replay fixture drives task ownership, statuses, activity, and demonstration deliverable notes.
- Play/pause, speed, restart, and seek controls. These control visualization only.
- Tasks, activity, deliverables, and a local support draft experience.
- Responsive office/team views, keyboard tab navigation, native dialogs, and reduced motion.

The replay is authored demonstration content, not captured historical telemetry or live development. Agent identities, timestamps, and deliverable notes are illustrative. Support drafts remain in local browser storage; they are not sent or monitored. No login, customer isolation, actual artifact delivery, or agent execution is implemented. Do not enter confidential information in the prototype.

## Implementation plan

See [the high-level implementation plan](docs/IMPLEMENTATION-PLAN.md) for secure project access, event ingestion, real agent/GitHub integration, customer support, and multi-team operations.

Key files:

- `src/App.jsx`: landing, project navigation, office, inspectors, local support.
- `src/data/office.js`: demonstration data and pure event projection.
- `src/styles/office.css`: responsive visual system.
- `tests/office.test.js`: event projection and ownership checks.
- `scripts/browser-smoke.py`: functional browser checks.

## Deployment

The existing GitHub Actions workflow builds and deploys `dist/` to GitHub Pages on a push to `main`. No deployment is performed by local builds. Future authenticated services and execution workers require separate backend hosting. Optional Google Fonts have local system fallbacks.
