# QR8 Agency Site -- Project Context

## Overview
Marketing/landing page for the QR8 AI-powered web development agency. React 18 + Vite 6, deployed to GitHub Pages.

## Key Files
- `src/App.jsx` -- Composition-only root (68 lines, imports + renders all sections)
- `src/components/layout/` -- Nav.jsx, Footer.jsx
- `src/components/sections/` -- Hero, TrustStrip, ProblemSolution, Portfolio, Testimonials, Process, Pricing, FAQ
- `src/components/ui/` -- AuroraMesh, FadeIn, Counter, Stars, FAQItem
- `src/components/modals/` -- ContactModal, LegalModal
- `src/data/` -- navLinks, faqData, testimonials, projects, processSteps, pricingTiers, techLogos
- `src/BeforeAfterMockup.jsx` -- Before/after device mockups with 4 industry tabs
- `src/PortfolioPreview.jsx` -- CSS-rendered mini-sites for portfolio carousel
- `src/ThemeToggle.jsx` -- Light/dark mode toggle
- `src/styles/theme.css` -- All CSS custom properties (55+ tokens, slate/blue system)
- `index.html` -- HTML template with flash-prevention script
- `vite.config.js` -- Vite config with relative base path
- `.github/workflows/deploy.yml` -- GitHub Actions deployment
- `.claude/implementation-master-plan.md` -- Full refactoring plan with phases 0-7

## Design Tokens (Current -- Slate/Blue system)
- Accent primary: blue (#2563EB light / #60A5FA dark)
- Accent secondary: cyan (#06B6D4 light / #22D3EE dark)
- Light background: #F8FAFC (slate-50), Dark background: #0F172A (slate-900)
- Text: slate scale (#0F172A/#334155/#475569/#64748B light, #F1F5F9/#CBD5E1/#94A3B8/#8494A7 dark)
- Font: Inter, 16px minimum body text, 14px for UI labels/buttons
- Theme: Light-default with dark mode toggle
- Gradient reserved for primary CTAs + brand logo only; solid accent elsewhere
- All text/bg combos verified WCAG AA 4.5:1+

## Conventions
- Components go in `src/components/{layout,sections,ui,modals}/`
- Static data goes in `src/data/`
- Styles go in `src/styles/`
- Use CSS custom properties for theming, not inline styles
- WCAG 2.1 AA compliance target
- All content must be extracted from components into data files
- Data files with JSX content use .jsx extension (projects.jsx, techLogos.jsx)
