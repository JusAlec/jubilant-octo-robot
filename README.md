# QR8 -- AI-Powered Web Development Agency

Marketing site for QR8. React 18 + Vite 6, deployed to GitHub Pages.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy

### GitHub Pages (Automatic)

Every push to `main` auto-deploys via GitHub Actions.

1. In your repo: **Settings -> Pages -> Source -> GitHub Actions**
2. Push to `main` -- site goes live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Manual

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

## Project Structure

```
src/
  App.jsx                          # Composition root
  main.jsx                         # React entry point
  ThemeToggle.jsx                  # Light/dark mode toggle
  BeforeAfterMockup.jsx            # Before/after website mockups
  PortfolioPreview.jsx             # CSS-rendered mini-sites
  components/
    layout/   Nav.jsx, Footer.jsx
    sections/ Hero, TrustStrip, ProblemSolution, Portfolio,
              Testimonials, Process, Pricing, FAQ
    modals/   ContactModal, LegalModal (lazy-loaded)
    ui/       AuroraMesh, FadeIn, Counter, Stars, FAQItem
  data/       navLinks, faqData, testimonials, projects,
              processSteps, pricingTiers, techLogos
  styles/
    theme.css       # Design tokens (55+ CSS custom properties)
    responsive.css  # Media queries (mobile/tablet/desktop)
index.html          # HTML template with theme flash prevention
vite.config.js      # Vite config (relative base path)
.github/workflows/  # GitHub Actions deployment
```

## Tech Stack

- **React 18** -- component library
- **Vite 6** -- build tool
- **CSS Custom Properties** -- theming (light/dark mode)
- **Web3Forms** -- contact form submission
- **GitHub Actions** -- CI/CD deployment

## Design System

- **Colors:** Slate/Blue system with light-default + dark mode toggle
- **Font:** Inter (400/500/600/700)
- **Breakpoints:** Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- **Accessibility:** WCAG 2.1 AA compliant
