# QR8 Agency Site -- Implementation Master Plan

> **Project:** jubilant-octo-robot (QR8 marketing site)
> **Stack:** React 18 + Vite 6 + GitHub Pages
> **Source:** `C:/QR8/jubilant-octo-robot/`
> **Created:** 2026-03-05

---

## Table of Contents

1. [Current State Summary](#current-state-summary)
2. [Theme Research & Strategy](#theme-research--strategy)
3. [Phase 0: Foundation & Cleanup](#phase-0-foundation--cleanup)
4. [Phase 1: Theme System & Light/Dark Mode](#phase-1-theme-system--lightdark-mode)
5. [Phase 2: Component Architecture Refactor](#phase-2-component-architecture-refactor)
6. [Phase 3: Responsive Design](#phase-3-responsive-design)
7. [Phase 4: Accessibility (a11y)](#phase-4-accessibility-a11y)
8. [Phase 5: Contact Form & Functionality](#phase-5-contact-form--functionality)
9. [Phase 6: Performance & Polish](#phase-6-performance--polish)
10. [Phase 7: QA & Launch](#phase-7-qa--launch)

---

## Current State Summary

### Architecture Grades

| Category | Grade | Notes |
|---|---|---|
| Visual Design | A | Polished glassmorphic dark theme |
| Component Architecture | D | 1,707-line monolith `App.jsx` |
| Styling | D | 100% inline styles, massive duplication |
| Accessibility | F | No semantic HTML, no ARIA, no keyboard nav |
| Performance | B- | Good foundations, late font load |
| Data Management | D | All content hardcoded inline |
| Functionality | D | Contact form non-functional, dead links |
| CI/CD | A- | Clean GitHub Actions pipeline |

### Critical Issues

- Single 1,707-line component file
- Zero mobile responsiveness
- Contact form has no submit handler / backend
- No accessibility support
- Dark-only theme alienates 30-60 age demographic (70% of 50+ users find dark mode harder to read)
- 100+ lines of commented-out dead code
- All styles inline with heavy duplication
- Font loaded via late `@import` in bottom `<style>` tag

---

## Theme Research & Strategy

### Problem Statement

The current site uses an exclusively dark glassmorphic theme (#09090b background). Research shows this is a significant barrier for the target client demographic (small business owners aged 30-60):

- **70% of people over age 50 find dark mode more difficult to read** ([WifiTalents, 2026](https://wifitalents.com/dark-mode-usage-statistics/))
- **Younger users (18-34) adopt dark themes at 70%+ rates, but older users remain more comfortable with light interfaces** ([NN/G](https://www.nngroup.com/articles/dark-mode/))
- **Between ages 25-60, website task performance declines 0.8% per year**, largely due to reading comprehension speed ([NN/G](https://www.nngroup.com/articles/middle-aged-web-users/))
- **Vision loss is the most common disability in adults; high contrast and readability are non-negotiable** ([Toptal](https://www.toptal.com/designers/ui/ui-design-for-older-adults))

### Solution: Light-Default with Dark Mode Toggle

**Default to a warm, professional light theme.** Retain the dark theme as an opt-in toggle.

#### Why Light-Default

1. **Broader accessibility** -- Light mode more easily achieves WCAG-compliant contrast levels
2. **Trust & warmth** -- Light backgrounds with warm neutrals feel approachable and professional; dark sites can feel "robotic" to non-tech audiences
3. **Reading performance** -- Positive polarity (dark text on light background) is proven to be faster for reading comprehension
4. **Astigmatism** -- ~50% of people have some degree of astigmatism; light mode is measurably easier for them
5. **Industry norm for service businesses** -- Professional services, healthcare, wellness, and B2B sites overwhelmingly use light themes

#### Design Direction: "Warm Professional"

| Property | Light Mode | Dark Mode |
|---|---|---|
| Background | `#FAFAF9` (warm off-white) | `#121214` (not pure black) |
| Surface/Cards | `#FFFFFF` | `#1C1C20` |
| Text Primary | `#1A1A1A` | `#E8E8E8` |
| Text Secondary | `#6B6B6B` | `#9A9A9A` |
| Accent Primary | `#7C3AED` (violet-600) | `#A78BFA` (violet-400) |
| Accent Secondary | `#0891B2` (cyan-600) | `#22D3EE` (cyan-400) |
| Borders | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |
| Shadows | Soft, warm `rgba(0,0,0,0.04)` | None (use borders) |

#### Typography for 30-60 Demographic

- **Minimum 16px body text** (currently 13-14px in many places -- too small)
- **Inter font retained** -- excellent readability, professional feel
- **Line height 1.6-1.75** for body content
- **Font weight contrast** -- 700 for headings, 400-500 for body (avoid light weights)
- **Letter spacing** -- slightly looser for body text vs current tight tracking

#### Trust Signals to Add

Per research on what makes service websites trustworthy for business owners:

- Real team photos or professional avatars (not just initials)
- Clear, prominent contact information (not hidden in a modal)
- Social proof with real names and businesses
- Transparent pricing (already present -- good)
- Professional certifications or partner logos if applicable
- Clear process explanation (already present -- good)

---

## Phase 0: Foundation & Cleanup

> **Goal:** Clean up the codebase and establish the foundation for refactoring.
> **Estimated scope:** Small
> **Status:** [x] Complete

### Tasks

- [x] **0.1** Remove commented-out code (stats section ~lines 573-596, about section ~lines 1260-1350)
  - Removed 125 lines: stats block + `hovStat` state + `stats` array + about section + commented nav link
- [x] **0.2** Remove committed `dist/` directory from git tracking (already in `.gitignore`)
  - Verified `dist/` was already untracked
- [x] **0.3** Move Google Fonts `@import` from bottom `<style>` tag to `<link>` in `index.html` `<head>` with `preconnect`
  - Removed `@import` from line 1703 of App.jsx, added `<link rel="stylesheet">` to index.html head
- [x] **0.4** Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
  - Both preconnect links added to index.html before the stylesheet link
- [x] **0.5** Create `.claude/CLAUDE.md` with project-specific conventions and context
- [x] **0.6** Verify `npm run dev` and `npm run build` work cleanly
  - Build: 204.08 KB bundle (60.01 KB gzip), built in 683ms, zero warnings
  - Dev: Vite v6.4.1 starts in 298ms on localhost:5173
- [ ] **0.7** Create initial commit checkpoint before refactoring begins
  - Pending user approval

### Implementation Details

**Changes made:**

1. `src/App.jsx` (1,707 -> 1,582 lines, -125 lines)
   - Removed `hovStat` state variable (line 344) -- only used in commented-out stats
   - Removed `stats` array constant (lines 368-372) -- only used in commented-out stats
   - Removed commented-out `// { label: "About", href: "#about" }` nav link
   - Removed commented-out stats section (lines 573-596, 24 lines)
   - Removed commented-out about section (lines 1260-1350, 91 lines)
   - Removed `@import url(...)` for Google Fonts from bottom `<style>` tag

2. `index.html`
   - Added `<link rel="preconnect" href="https://fonts.googleapis.com" />`
   - Added `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
   - Added `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />`

3. `.claude/CLAUDE.md` -- Created with project context and conventions
4. `.claude/implementation-master-plan.md` -- Created with full 8-phase plan

### Manual Test Plan

1. Run `npm run dev` and open http://localhost:5173
2. Verify the site loads with Inter font (not system fallback) -- check in DevTools Network tab that fonts.googleapis.com loads early
3. Scroll through all sections: Hero, Process, Pricing, Portfolio, Testimonials, Footer
4. Verify no visual differences from before (stats and about were already hidden)
5. Click "Let's Talk" button -- verify contact modal opens
6. Click "Privacy" and "Terms" in footer -- verify legal modals open
7. Run `npm run build` -- verify zero errors/warnings

---

## Phase 1: Theme System & Light/Dark Mode

> **Goal:** Implement a CSS custom property-based theme system with light (default) and dark modes plus a user-facing toggle.
> **Estimated scope:** Large
> **Status:** [ ] Not started

### Tasks

- [ ] **1.1** Define CSS custom properties (design tokens) for both themes
  - Colors: background, surface, text-primary, text-secondary, accent-primary, accent-secondary, border, shadow
  - Typography: font-size-base, font-size-sm, font-size-lg, font-size-xl, line-height-body, line-height-heading
  - Spacing: section-padding, card-padding, card-radius, container-max-width
  - Effects: glass-bg, glass-border, glass-blur (dark mode only), card-shadow (light mode only)
- [ ] **1.2** Create `src/theme.css` with `:root` (light) and `[data-theme="dark"]` variable sets
- [ ] **1.3** Implement theme toggle component with localStorage persistence
- [ ] **1.4** Respect `prefers-color-scheme` as initial default, with user override
- [ ] **1.5** Migrate inline background/text colors in `App.jsx` to use `var(--token-name)` references
- [ ] **1.6** Design light-mode versions of glassmorphic cards (subtle shadows + borders instead of backdrop-filter)
- [ ] **1.7** Ensure accent gradient works in both modes (adjust opacity/saturation for light backgrounds)
- [ ] **1.8** Create light/dark variants of the AuroraMesh background (softer for light mode)
- [ ] **1.9** Update portfolio images to work on both backgrounds (add subtle shadows or card frames)
- [ ] **1.10** Increase base font size to 16px minimum for all body text
- [ ] **1.11** Audit and fix all WCAG AA contrast ratios in both modes

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Phase 2: Component Architecture Refactor

> **Goal:** Break the monolithic `App.jsx` into a clean, maintainable component tree.
> **Estimated scope:** Large
> **Status:** [ ] Not started

### Tasks

- [ ] **2.1** Create project directory structure:
  ```
  src/
    components/
      layout/
        Nav.jsx
        Footer.jsx
      sections/
        Hero.jsx
        Process.jsx
        Pricing.jsx
        Portfolio.jsx
        Testimonials.jsx
      ui/
        GlassCard.jsx
        FadeIn.jsx
        Counter.jsx
        RevealWords.jsx
        AuroraMesh.jsx
        ThemeToggle.jsx
      modals/
        ContactModal.jsx
        LegalModal.jsx
    data/
      testimonials.js
      projects.js
      processSteps.js
      pricingTiers.js
      legalContent.js
      navLinks.js
    styles/
      theme.css
      animations.css
    App.jsx
    main.jsx
  ```
- [ ] **2.2** Extract data arrays into `src/data/` modules
- [ ] **2.3** Extract CSS keyframes and global styles into `src/styles/animations.css`
- [ ] **2.4** Extract `AuroraMesh` component
- [ ] **2.5** Extract `GlassCard`, `FadeIn`, `Counter`, `RevealWords` utility components
- [ ] **2.6** Extract `Nav` component with scroll-to logic
- [ ] **2.7** Extract `Hero` section
- [ ] **2.8** Extract `Process` section
- [ ] **2.9** Extract `Pricing` section (refactor 3 hardcoded cards into data-driven rendering)
- [ ] **2.10** Extract `Portfolio` section (eliminate IIFE pattern)
- [ ] **2.11** Extract `Testimonials` section + `TestimonialCarousel`
- [ ] **2.12** Extract `Footer` component
- [ ] **2.13** Extract `ContactModal` component
- [ ] **2.14** Extract `LegalModal` component
- [ ] **2.15** Refactor `App.jsx` to be composition-only (import + render sections)
- [ ] **2.16** Replace inline hover state management with CSS `:hover` where possible
- [ ] **2.17** Run regression check -- visual parity with pre-refactor site

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Phase 3: Responsive Design

> **Goal:** Make the site fully responsive and usable on all devices.
> **Estimated scope:** Large
> **Status:** [ ] Not started

### Tasks

- [ ] **3.1** Define breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- [ ] **3.2** Implement mobile hamburger menu for `Nav`
- [ ] **3.3** Make `Hero` section responsive (text sizing, button stacking, card wrapping)
- [ ] **3.4** Make `Process` section responsive (stack cards vertically on mobile, accordion behavior)
- [ ] **3.5** Make `Pricing` section responsive (stack cards vertically, maintain visual hierarchy)
- [ ] **3.6** Make `Portfolio` section responsive (full-width cards, touch-friendly navigation)
- [ ] **3.7** Make `Testimonials` carousel touch-friendly with swipe gestures
- [ ] **3.8** Make `ContactModal` responsive (single-column form on mobile, full-screen modal)
- [ ] **3.9** Make `LegalModal` responsive (full-screen on mobile with scroll)
- [ ] **3.10** Make `Footer` responsive (stack vertically on mobile)
- [ ] **3.11** Test on real devices or emulation: iPhone SE, iPhone 14, iPad, Android

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Phase 4: Accessibility (a11y)

> **Goal:** Achieve WCAG 2.1 AA compliance across the site.
> **Estimated scope:** Medium
> **Status:** [ ] Not started

### Tasks

- [ ] **4.1** Add semantic HTML: `<main>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<section>` with proper headings
- [ ] **4.2** Add ARIA labels to all interactive elements (buttons, carousel controls, close buttons)
- [ ] **4.3** Implement focus trapping in modals (Contact, Legal)
- [ ] **4.4** Add keyboard navigation for carousel (arrow keys, Enter/Space for cards)
- [ ] **4.5** Add visible focus indicators (outline styles) for all interactive elements
- [ ] **4.6** Add `aria-live` regions for dynamic content (carousel position, form feedback)
- [ ] **4.7** Add `alt` text for portfolio images
- [ ] **4.8** Mark decorative SVG icons with `aria-hidden="true"`
- [ ] **4.9** Ensure heading hierarchy is correct (h1 > h2 > h3, no skips)
- [ ] **4.10** Add skip-to-content link
- [ ] **4.11** Ensure all form inputs have associated `<label>` elements (currently labels exist but lack `htmlFor`)
- [ ] **4.12** Add `role="dialog"` and `aria-modal="true"` to modals
- [ ] **4.13** Run axe-core audit and resolve all violations
- [ ] **4.14** Test with screen reader (NVDA or VoiceOver)

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Phase 5: Contact Form & Functionality

> **Goal:** Make the contact form functional with a free backend service, and fix all placeholder links.
> **Estimated scope:** Medium
> **Status:** [ ] Not started

### Tasks

- [ ] **5.1** Research and select free form backend (candidates: Formspree free tier, Web3Forms, EmailJS free tier, Getform)
- [ ] **5.2** Implement form state management (controlled inputs with useState)
- [ ] **5.3** Add client-side validation (required fields, email format, phone format)
- [ ] **5.4** Integrate selected form backend (POST submission)
- [ ] **5.5** Add form submission states: idle, submitting (loading spinner), success, error
- [ ] **5.6** Add success confirmation UI (replace form with thank-you message)
- [ ] **5.7** Add error handling UI with retry option
- [ ] **5.8** Wire up social media links to actual QR8 profiles (or remove if no profiles exist)
- [ ] **5.9** Add `mailto:hello@qr8.dev` link in footer or contact section
- [ ] **5.10** Test form submission end-to-end

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Phase 6: Performance & Polish

> **Goal:** Optimize load times, assets, and final visual polish.
> **Estimated scope:** Medium
> **Status:** [ ] Not started

### Tasks

- [ ] **6.1** Optimize portfolio images (compress, convert to WebP, add `loading="lazy"`)
- [ ] **6.2** Add `<link rel="preload">` for critical font weights
- [ ] **6.3** Verify Vite code splitting is working (check bundle size)
- [ ] **6.4** Add proper `<meta>` tags: Open Graph, Twitter Card for social sharing
- [ ] **6.5** Add a proper favicon set (currently inline SVG data URI -- works but no PWA support)
- [ ] **6.6** Smooth out all transition timing curves for theme switching
- [ ] **6.7** Add subtle micro-interactions for light mode (hover card lift, button press feedback)
- [ ] **6.8** Review animation performance (check for layout thrashing, compositor-friendly transforms)
- [ ] **6.9** Run Lighthouse audit -- target 90+ on all four categories
- [ ] **6.10** Test on slow 3G network throttle

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Phase 7: QA & Launch

> **Goal:** Final testing, bug fixes, and production deployment.
> **Estimated scope:** Small
> **Status:** [ ] Not started

### Tasks

- [ ] **7.1** Cross-browser testing: Chrome, Firefox, Safari, Edge
- [ ] **7.2** Cross-device testing: iOS Safari, Android Chrome
- [ ] **7.3** Final accessibility audit (axe-core + manual screen reader)
- [ ] **7.4** Final Lighthouse audit (all categories 90+)
- [ ] **7.5** Final WCAG AA contrast check in both themes
- [ ] **7.6** Verify GitHub Actions deployment pipeline
- [ ] **7.7** Test production build on GitHub Pages
- [ ] **7.8** Update README with new project structure and development instructions
- [ ] **7.9** Create final commit and tag as v2.0.0

### Implementation Details

_To be detailed when this phase begins._

### Manual Test Plan

_To be defined when this phase begins._

---

## Research Sources

### Theme & Demographics Research

- [Middle-Aged Users' Declining Web Performance -- NN/G](https://www.nngroup.com/articles/middle-aged-web-users/)
- [Dark Mode vs. Light Mode: Which Is Better? -- NN/G](https://www.nngroup.com/articles/dark-mode/)
- [Dark Mode Usage: Data Reports 2026 -- WifiTalents](https://wifitalents.com/dark-mode-usage-statistics/)
- [A Guide to Interface Design for Older Adults -- Toptal](https://www.toptal.com/designers/ui/ui-design-for-older-adults)
- [Designing for Different Age Groups -- WebFX](https://www.webfx.com/blog/web-design/designing-for-different-age-groups/)
- [Dark Mode or Light Mode? Exploring Impact on Age Groups -- arXiv](https://arxiv.org/html/2409.10841v1)
- [Accessible Color Schemes for Seniors -- NumberAnalytics](https://www.numberanalytics.com/blog/ultimate-guide-color-scheme-seniors)
- [Trust Signals in Modern Website Design -- Humane Design](https://humanedesignthinking.com/trust-signals-in-modern-website-design/)
- [The 7 Trust Signals Missing From Most Professional Service Websites](https://www.codeconspirators.com/the-7-trust-signals-missing-from-most-professional-service-websites-with-examples/)
- [Best Practices for Dark Mode in Web Design 2026](https://natebal.com/best-practices-for-dark-mode/)
- [Designing for Dark Mode and Light Mode -- Perspecta Agency](https://perspectaagency.com/blog/designing-for-dark-mode-and-light-mode/)
- [30+ Essential UX Stats for 2026 -- Maze](https://maze.co/blog/ux-statistics/)
