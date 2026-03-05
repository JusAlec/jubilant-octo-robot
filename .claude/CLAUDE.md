# QR8 Agency Site -- Project Context

## Overview
Marketing/landing page for the QR8 AI-powered web development agency. React 18 + Vite 6, deployed to GitHub Pages.

## Key Files
- `src/App.jsx` -- Monolithic main component (1,707 lines, being refactored)
- `src/main.jsx` -- React entry point
- `index.html` -- HTML template
- `vite.config.js` -- Vite config with relative base path
- `.github/workflows/deploy.yml` -- GitHub Actions deployment
- `.claude/implementation-master-plan.md` -- Full refactoring plan with phases 0-7

## Design Tokens (Target)
- Accent primary: violet (#7C3AED light / #A78BFA dark)
- Accent secondary: cyan (#0891B2 light / #22D3EE dark)
- Light background: #FAFAF9, Dark background: #121214
- Font: Inter, minimum 16px body text
- Theme: Light-default with dark mode toggle

## Conventions
- Components go in `src/components/{layout,sections,ui,modals}/`
- Static data goes in `src/data/`
- Styles go in `src/styles/`
- Use CSS custom properties for theming, not inline styles
- WCAG 2.1 AA compliance target
- All content must be extracted from components into data files
