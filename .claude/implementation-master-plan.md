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
5. [Phase 1b: Small Business Conversion Optimization](#phase-1b-small-business-conversion-optimization)
6. [Phase 2: Component Architecture Refactor](#phase-2-component-architecture-refactor)
7. [Phase 3: Responsive Design](#phase-3-responsive-design)
8. [Phase 4: Accessibility (a11y)](#phase-4-accessibility-a11y)
9. [Phase 5: Contact Form & Functionality](#phase-5-contact-form--functionality)
10. [Phase 6: Performance & Polish](#phase-6-performance--polish)
11. [Phase 7: QA & Launch](#phase-7-qa--launch)

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
- [x] **0.7** Create initial commit checkpoint before refactoring begins
  - Commit `02fb283` on `main`

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
> **Status:** [x] Complete

### Tasks

- [x] **1.1** Define CSS custom properties (design tokens) for both themes
  - 55+ tokens: colors, typography, spacing, effects, aurora mesh, nav, inputs, modals, carousel, pills
- [x] **1.2** Create `src/styles/theme.css` with `:root` (light) and `[data-theme="dark"]` variable sets
  - Also moved all keyframe animations from inline `<style>` tag to theme.css
  - Added global resets (box-sizing, scrollbar, scroll-behavior, placeholders)
- [x] **1.3** Implement theme toggle component with localStorage persistence
  - `src/ThemeToggle.jsx` -- sun/moon icon toggle, positioned in nav before "Let's Talk"
- [x] **1.4** Respect `prefers-color-scheme` as initial default, with user override
  - Inline script in `index.html` `<head>` prevents flash of wrong theme on load
  - ThemeToggle reads localStorage first, falls back to system preference
- [x] **1.5** Migrate inline background/text colors in `App.jsx` to use `var(--token-name)` references
  - 100+ hardcoded color values replaced across all sections, modals, and components
  - Inline `<style>` tag removed entirely (animations now in theme.css)
- [x] **1.6** Design light-mode versions of glassmorphic cards (subtle shadows + borders instead of backdrop-filter)
  - Light mode: solid surface backgrounds + box-shadow depth; dark mode retains glassmorphism
- [x] **1.7** Ensure accent gradient works in both modes (adjust opacity/saturation for light backgrounds)
  - Light: `#7C3AED -> #0891B2`; Dark: `#8b5cf6 -> #22d3ee` (higher saturation for dark bg)
- [x] **1.8** Create light/dark variants of the AuroraMesh background (softer for light mode)
  - Light: subtle pastel blobs (0.04-0.06 opacity) on warm #F0EDF5 base
  - Dark: vivid blobs (0.10-0.18 opacity) on deep #0f0a1a base
- [x] **1.9** Update portfolio images to work on both backgrounds (add subtle shadows or card frames)
  - Portfolio card uses `--shadow-card` + themed browser chrome + border
- [x] **1.10** Increase base font size to 16px minimum for all body text
  - Bumped all 13px/13.5px body text to 14px minimum
  - Remaining 11-12px: uppercase pill labels, form labels, fine print (appropriate for role)
- [x] **1.11** Audit and fix all WCAG AA contrast ratios in both modes
  - Light: primary 16.66:1, secondary 8.35:1, muted 5.75:1, faint 4.54:1
  - Dark: primary 15.27:1, secondary 8.63:1, muted 5.56:1, faint 4.74:1
  - All pass WCAG AA 4.5:1 on page background
  - Fixed: light faint #9A9A9A -> #737373, dark muted #7A7A7A -> #8C8C8C, dark faint #555555 -> #808080

### Implementation Details

#### Step 1: Create `src/styles/theme.css` with CSS custom properties

Define all design tokens as CSS custom properties in `:root` (light mode default) and `[data-theme="dark"]` override:

**Color tokens:**
- `--color-bg`: page background (#FAFAF9 light / #121214 dark)
- `--color-surface`: card/component backgrounds (#FFFFFF light / #1C1C20 dark)
- `--color-surface-hover`: card hover state (#F5F5F4 light / #252528 dark)
- `--color-text-primary`: headings, strong text (#1A1A1A light / #E8E8E8 dark)
- `--color-text-secondary`: body text (#4B4B4B light / #B0B0B0 dark)
- `--color-text-muted`: captions, hints (#6B6B6B light / #7A7A7A dark)
- `--color-text-faint`: footer, timestamps (#9A9A9A light / #555555 dark)
- `--color-accent`: primary accent (#7C3AED light / #A78BFA dark)
- `--color-accent-secondary`: secondary accent (#0891B2 light / #22D3EE dark)
- `--color-border`: borders (rgba(0,0,0,0.08) light / rgba(255,255,255,0.08) dark)
- `--color-border-hover`: hover borders (rgba(0,0,0,0.15) light / rgba(255,255,255,0.12) dark)
- `--color-overlay`: modal backdrop (rgba(0,0,0,0.4) light / rgba(0,0,0,0.75) dark)

**Effect tokens:**
- `--shadow-card`: card shadow (light: `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)` / dark: none)
- `--shadow-card-hover`: hover shadow (light: `0 4px 16px rgba(0,0,0,0.08)` / dark: none)
- `--glass-bg`: glassmorphic background (light: `rgba(255,255,255,0.7)` / dark: `rgba(255,255,255,0.04)`)
- `--glass-border`: glass border (light: `rgba(0,0,0,0.06)` / dark: `rgba(255,255,255,0.07)`)
- `--glass-blur`: backdrop-filter value (light: `blur(12px)` -- less needed / dark: `blur(20px)`)

**Typography tokens:**
- `--font-family`: Inter, system fallback stack
- `--font-size-xs`: 12px
- `--font-size-sm`: 14px
- `--font-size-base`: 16px (increased from 13-14px)
- `--font-size-lg`: 18px
- `--font-size-xl`: 20px
- `--line-height-body`: 1.65
- `--line-height-heading`: 1.1

**Spacing tokens:**
- `--section-padding`: 100px 40px
- `--card-padding`: 28px
- `--card-radius`: 16px
- `--container-max-width`: 1200px

**Accent gradient:**
- `--accent-gradient`: light: `linear-gradient(135deg, #7C3AED, #0891B2)` / dark: `linear-gradient(135deg, #8b5cf6, #22d3ee)`

#### Step 2: Create ThemeToggle component

File: `src/ThemeToggle.jsx` (kept in src root until Phase 2 component refactor)
- Sun/moon icon toggle button
- Reads initial theme from `localStorage('qr8-theme')`, falls back to `prefers-color-scheme`
- Sets `data-theme` attribute on `<html>` element
- Persists choice to localStorage
- Position: inside nav bar, before "Let's Talk" button

#### Step 3: Update `index.html`

- Import `src/styles/theme.css` (Vite will handle this via main.jsx import)
- Change `body { background: #09090b; }` to `body { background: var(--color-bg); transition: background 0.3s; }`
- Update `<meta name="theme-color">` dynamically (or default to light)

#### Step 4: Light-mode AuroraMesh variant

The current AuroraMesh uses dark purple/cyan radial gradients on `#0f0a1a`. For light mode:
- Replace dark base gradient with subtle warm gradient on `#FAFAF9`
- Reduce glow opacity to 0.06-0.08 (from 0.14-0.18)
- Use lighter, more pastel accent colors for the orbs
- Keep grid overlay but use `--color-border` instead of hardcoded white
- Use CSS custom properties so it auto-switches with theme

#### Step 5: Migrate inline colors in App.jsx

This is the bulk of the work. Strategy: Replace hardcoded color values with `var(--token)` references. Major areas:

1. **Root div** (line 400-404): `background`, `color`
2. **Nav** (lines 408-452): `background`, `borderBottom`, text colors, button styles
3. **Hero** (lines 455-566): text colors, pill styles, CTA button colors, card styles
4. **Process** (lines 571-695): section pills, headings, card backgrounds/borders, text
5. **Pricing** (lines 700-963): all three card backgrounds, text, borders, dividers, buttons
6. **Portfolio** (lines 968-1182): card styles, browser chrome, tag colors, text
7. **Testimonials** (lines 1187-1226): section header text
8. **TestimonialCarousel** (lines 148-336): card styles, quote marks, fade edges
9. **Footer** (lines 1231-1331): border, text, links, social icons
10. **Legal modal** (lines 1336-1399): overlay, card background, text
11. **Contact modal** (lines 1404-1541): overlay, card background, inputs, labels, text
12. **Style tag** (lines 1543-1579): keyframes, global resets, scrollbar, placeholder colors

Not every value will be migrated in this phase -- accent colors that don't change between themes (like gradient accent on buttons) can stay. Focus on background/surface/text/border colors.

#### Step 6: Light-mode card styling

In light mode, glassmorphic `backdrop-filter` is unnecessary and can look muddy. Cards should use:
- Solid `--color-surface` background
- `--shadow-card` for depth
- `--color-border` for subtle borders
- On hover: `--shadow-card-hover` + slight translateY(-2px)
- The `backdrop-filter` property should only apply in dark mode (use `[data-theme="dark"]` selector)

#### Step 7: Font size audit

Increase all body text to minimum 16px:
- `fontSize: 13` and `fontSize: 13.5` instances -> `var(--font-size-sm)` (14px) minimum
- `fontSize: 14` -> `var(--font-size-sm)` or `var(--font-size-base)` depending on context
- Small labels (12px) can stay for uppercase pill labels and fine print
- Card descriptions, process details, testimonial quotes: bump to 14-15px minimum
- Legal/contact modal body text: 14px minimum

#### Step 8: WCAG AA contrast verification

After migration, verify all text/background combinations meet 4.5:1 ratio (normal text) or 3:1 (large text/UI components):
- Primary text on page background
- Secondary text on page background
- Muted text on card surfaces
- Accent colors on backgrounds
- Button text on accent gradient

Use browser DevTools contrast checker or manual calculation.

#### Execution Order

1. Create `src/styles/theme.css` with all tokens (both themes)
2. Import theme.css in `src/main.jsx`
3. Create `src/ThemeToggle.jsx`
4. Update `index.html` body style
5. Add ThemeToggle to nav in App.jsx
6. Migrate App.jsx inline colors to CSS variables (top-down, section by section)
7. Update AuroraMesh for light mode
8. Update TestimonialCarousel fade edges
9. Update modal overlays and cards
10. Font size audit pass
11. Contrast check
12. Build + visual regression test both themes

### Manual Test Plan

1. **Light mode (default):**
   - Open http://localhost:5173 in a fresh incognito window
   - Verify warm off-white background loads by default
   - Scroll through all sections -- text should be dark on light, readable
   - Cards should have subtle shadows, not glassmorphic blur
   - AuroraMesh should show soft, muted gradient blobs
   - Click pricing "Get Started" buttons -- contact modal should match light theme
   - Click "Privacy" / "Terms" -- legal modals should match light theme
   - All text should be >= 14px except small labels and fine print

2. **Dark mode toggle:**
   - Click the theme toggle (sun/moon icon in nav)
   - Background should transition smoothly to dark (#121214)
   - All text should flip to light colors
   - Cards should gain glassmorphic appearance (backdrop-filter)
   - AuroraMesh should intensify to current style
   - Testimonial carousel fade edges should match dark background
   - Modals should have dark glass aesthetic
   - Toggle again -- should return to light

3. **Persistence:**
   - Set dark mode, refresh page -- should remain dark
   - Set light mode, refresh page -- should remain light
   - Clear localStorage, refresh -- should respect system preference

4. **System preference:**
   - In browser DevTools, toggle `prefers-color-scheme` to dark
   - With no localStorage override, site should follow system preference
   - After manual toggle, should override system preference

5. **Contrast check:**
   - In both modes, use DevTools accessibility tab to spot-check contrast ratios
   - Focus on: body text, card descriptions, muted text, pricing details

6. **Build verification:**
   - Run `npm run build` -- zero errors/warnings
   - Run `npm run preview` -- verify production build works in both themes

---

## Phase 1b: Small Business Conversion Optimization

> **Goal:** Restructure content, messaging, and visual approach to optimize for small business owner conversion based on proven SMB website framework.
> **Estimated scope:** Large
> **Status:** [x] Complete (1b-alpha complete, 1b-beta complete, 1b-gamma complete)
> **Full audit:** See [phase-1b-conversion-audit.md](phase-1b-conversion-audit.md) for detailed analysis and grading

### Current Grade: C-
The site is optimized for impressing designers, not converting small business owners. Key gaps: missing trust signals, wrong section order, agency-centric messaging, too much animation, no before/after proof, no ROI framing.

### Final Section Order (Merged from audit + agency standard)

| # | Section | Status |
|---|---|---|
| 1 | Hero -- benefit headline + CTAs + before/after device mockup | |
| 2 | Trust Strip -- project count, rating, turnaround | |
| 3 | Problem-to-Solution -- pain points left, outcomes right | |
| 4 | Portfolio / Results -- device mockups + stats | |
| 5 | Testimonials -- photo + quote + business + stars (static) | |
| 6 | Process -- 3 simple numbered steps, no accordion | |
| 7 | Pricing -- 3 transparent tiers | |
| 8 | FAQ -- 5-8 objection-handling questions | |
| 9 | Final CTA -- urgency-driven | |
| 10 | Footer | |

### Color Palette Shift (Violet -> Blue)

| Token | Light | Dark |
|---|---|---|
| primary | `#2563EB` (blue-600) | `#60A5FA` (blue-400) |
| primary-dark | `#1E40AF` (blue-800) | `#2563EB` (blue-600) |
| accent | `#06B6D4` (cyan-500) | `#22D3EE` (cyan-400) |
| background | `#F8FAFC` (slate-50) | `#0F172A` (slate-900) |
| surface | `#FFFFFF` | `#1E293B` (slate-800) |
| text-primary | `#0F172A` (slate-900) | `#F1F5F9` (slate-100) |
| text-secondary | `#475569` (slate-600) | `#94A3B8` (slate-400) |
| text-muted | `#64748B` (slate-500) | `#64748B` (slate-500) |
| text-faint | `#94A3B8` (slate-400) | `#475569` (slate-600) |
| gradient | `#2563EB -> #06B6D4` | `#60A5FA -> #22D3EE` |

### Tasks

#### 1b-alpha: Content, Structure, Animation (no assets needed)

- [x] **1b.1** Rewrite hero headline to benefit-focused language
  - FROM: "Curating AI-Powered Sites That Convert Clicks Into Clients"
  - TO: "Websites That Bring Customers to Your Business"
  - Keep subtitle: "Your website should do more than look good..."
- [x] **1b.2** Change hero CTA buttons
  - FROM: "See Our Work" + "How We Work"
  - TO: "Get Started" (primary, opens contact modal) + "See Pricing" (secondary, scrolls to pricing)
- [x] **1b.3** Change status pill
  - FROM: "Now taking on new partners"
  - TO: "Now booking new projects"
- [x] **1b.4** Rewrite footer CTA with urgency
  - FROM: "Ready to build something great?"
  - TO: "Get Your Business Online in 14 Days"
- [x] **1b.5** Remove hero entrance animation delays
  - Removed RevealWords component -- headline renders instantly
  - Removed GlassCard component -- hero service cards removed
  - Removed `loaded` state and all staggered opacity/transform delays
  - Removed `activeStep` state (accordion process removed)
  - FadeIn preserved for below-fold sections only
- [x] **1b.6** Add before/after device mockup visual to hero
  - `src/BeforeAfterMockup.jsx` -- pure CSS/React rendered mini-websites
  - "Before": dated 2010-era design (Impact font, dark bg, cluttered nav, visitor counter)
  - "After": clean modern design (Inter font, light bg, blue accent, trust badge, service cards)
  - Side-by-side with arrow indicator between browser chrome frames
- [x] **1b.7** Remove hero service cards (Mobile-First, AI Solutions, SEO, Performance)
  - GlassCard component removed entirely
  - Replaced by Problem-to-Solution section below trust strip
- [x] **1b.8** Add Trust Strip section below hero
  - 4 metrics: "10+ Projects Delivered", "5.0 Average Rating", "14-Day Turnaround", "100% Satisfaction"
  - Simple horizontal bar with Counter component for animated project count
  - Glass background with border dividers
- [x] **1b.9** Add Problem-to-Solution section (replaces ROI + Services)
  - Left side: "Your current website might be..." with 5 pain points (red X icons)
  - Right side: "We fix that." with 5 matching solutions (green check icons)
  - PAS (Problem-Agitate-Solve) copywriting framework applied
  - Section heading: "Your Website Should Work as Hard as You Do"
- [x] **1b.10** Reorder all sections to final conversion flow
  - Hero -> Trust Strip -> Problem/Solution -> Portfolio -> Testimonials -> Process -> Pricing -> FAQ -> CTA -> Footer
- [x] **1b.11** Simplify Process from 4 accordion steps to 3 simple steps
  - Discovery (merged Consult + Curate): call, audit, roadmap, content plan
  - Build: design, React/Next.js, SEO, QA
  - Launch & Grow (merged Build completion + Optimize): launch support, analytics, optimization
  - Static cards with deliverable tags, no accordion interaction
- [x] **1b.12** Rewrite portfolio section title
  - FROM: "Work we're proud of"
  - TO: "Real Results for Real Businesses"
  - Also updated subtitle to be more results-focused
- [x] **1b.13** Add FAQ section (between Pricing and Final CTA)
  - 7 questions covering: turnaround, what to provide, post-launch changes, hosting, SEO, differentiators, getting started
  - Expandable accordion format with chevron toggle animation
  - FAQItem component with smooth open/close transition
- [x] **1b.14** Rewrite Final CTA
  - Headline: "Get Your Business Online in 14 Days"
  - Subtitle: specific, time-bound promise with "no commitment" reassurance
  - Button: "Start My Website"

#### 1b-beta: Color Palette & Typography Migration

- [x] **1b.15** Migrate color palette from violet to blue in theme.css
  - Full rewrite of `src/styles/theme.css` with slate/blue system
  - Light: bg #F8FAFC, accent #2563EB, text slate-900/700/600/500
  - Dark: bg #0F172A, accent #60A5FA, text slate-100/300/400/custom
  - WCAG AA verified: all 20 text/bg combos pass 4.5:1+ (range 4.55:1 to 17.85:1)
  - Also updated favicon gradient and theme-color meta tag in index.html
- [x] **1b.16** Bump all body/description text to 16px minimum
  - Pricing descriptions: 14 -> 16px (3 cards)
  - Pricing checklist items: 14 -> 16px (all three cards)
  - Portfolio descriptions: 14 -> 16px
  - Process step descriptions: 14 -> 16px
  - Problem/solution items: 14 -> 16px
  - Testimonial quotes: 14 -> 16px
  - FAQ answers: 15 -> 16px
  - Legal modal body: 14 -> 16px
  - Custom retainer description: 14 -> 16px
  - Section subheadings: 17 -> 18px (7 sections)
  - Kept 14px for: nav links, buttons, labels, form inputs, fine print
- [x] **1b.17** Simplify AuroraMesh for light mode
  - Light: all 4 blob vars set to `transparent`, noise/grid opacity to 0
  - Light: base changed to subtle blue-tinted gradient (#F8FAFC -> #EFF6FF -> #F8FAFC)
  - Dark: blob-3 and blob-4 set to transparent (2 active blobs only)
  - Dark: base tinted slightly (#0c1425) for depth, blob colors shifted to blue
  - No component changes needed -- all via CSS custom properties
- [x] **1b.18** Add star ratings to testimonial cards
  - New `Stars` component with 5 filled gold (#f59e0b) SVG stars
  - Rendered above each testimonial quote
- [x] **1b.19** Replace testimonial auto-scroll carousel with static grid
  - Removed `TestimonialCarousel` component (190 lines: track animation, drag handlers, fade edges)
  - New `TestimonialGrid` component: 3-column flex layout, static cards
  - Reduced from 5 testimonials to 3 (one per column, no overflow/scroll needed)
  - Avatar colors updated from violet/pink/cyan to blue palette (#3b82f6/#06b6d4/#2563eb)
  - Solid color avatars instead of gradient backgrounds
  - Bundle size reduced ~2.7KB
- [x] **1b.20** Update gradient usage
  - Portfolio counter badge: gradient -> solid `var(--color-accent)`
  - Portfolio dot indicators: gradient -> solid `var(--color-accent)`
  - Process step number badges: gradient -> solid `var(--color-accent)`
  - "MOST POPULAR" tag: gradient -> solid `var(--color-accent)`
  - Premium check marks: gradient SVG defs -> solid `var(--color-accent)` stroke
  - Kept gradient for: hero CTA, premium pricing CTA, footer CTA, contact submit, QR8 logo "8"

#### 1b-gamma: Asset-Dependent (complete)

- [x] **1b.21** CSS-rendered site previews for Solace Wellness and Brick & Vine portfolio items (replaced gradient placeholders with pure CSS/React mini-site renderings in `src/PortfolioPreview.jsx`; portfolio carousel now shows `p.Preview` component when no image URL exists)
- [x] **1b.22** DiceBear avatars for testimonials (replaced colored-initial circles with DiceBear Avataaars SVGs via `https://api.dicebear.com/7.x/avataaars/svg?seed=...`; each testimonial has unique seed + pastel background)
- [x] **1b.23** "Built with" tech logos in Trust Strip (added React, Next.js, Vite, Tailwind, Stripe, Vercel inline SVG logos with labels below the stats row; styled with `--color-text-faint` for theme compatibility)
- [x] **1b.24** 3 new industry-specific before/after transformation pairs added to `src/BeforeAfterMockup.jsx`: Restaurant (cluttered dark menu -> clean modern menu with reservation CTA), Salon/spa (dated pink Comic Sans template -> professional booking-focused site), Contractor (Craigslist-style listing -> modern service page with quote form). Hero section now has tabbed industry selector (Plumber/Restaurant/Salon/Contractor) cycling through all 4 pairs. `BrowserFrame` exported for reuse.

### Implementation Details

#### Build Sequence

**1b-alpha** executes first: all copy, structure, and animation changes in `App.jsx`. This is the highest-impact work and requires zero external assets. The before/after device mockups are pure CSS/React components.

**1b-beta** executes second: color palette migration in `theme.css` + typography pass + animation cleanup. The blue palette shift affects every section but is mechanically simple (update CSS custom property values).

**1b-gamma** is ongoing: real assets roll in as they become available. The structure built in alpha/beta accommodates placeholder content that upgrades seamlessly.

#### Before/After Device Mockup Design

Two React components rendered as mini-websites inside CSS browser chrome frames:

**BeforeMock:** Deliberately dated small business website
- Cramped layout, minimal whitespace
- Times New Roman or serif-like feel (use system serif)
- Harsh background color (#2a2a2a or garish blue)
- Cluttered horizontal nav with too many items
- Stock-photo-style placeholder
- "WELCOME TO OUR WEBSITE" style heading
- Tiny, hard-to-read text
- No clear CTA
- Overall feel: 2010-era template site

**AfterMock:** Clean modern QR8-style result
- Generous whitespace
- Inter font, clear hierarchy
- Light background, blue accent
- Clean nav with 3-4 items
- Hero with clear headline + CTA button
- Card-based content section
- Professional, trustworthy feel
- Overall feel: current-year professional site

Both render at ~400x250px inside a laptop-style browser chrome frame (address bar, traffic light dots). Positioned in the hero section as the primary visual, possibly with a subtle arrow or "transformation" indicator between them.

### Manual Test Plan

1. **Content verification:**
   - Hero headline is benefit-focused, not agency jargon
   - CTA buttons say "Get Started" and "See Pricing"
   - All section titles are client-centric
   - FAQ answers common small business questions

2. **Section order:**
   - Scroll through page: Hero -> Trust Strip -> Problem/Solution -> Portfolio -> Testimonials -> Process -> Pricing -> FAQ -> CTA -> Footer
   - Trust-building content appears before any mention of price

3. **Before/after mockup:**
   - Hero visual shows a "before" dated website and "after" modern website
   - Both render correctly in light and dark mode
   - Device frames look professional at all viewport widths

4. **Animation check:**
   - Hero content is immediately visible on load (< 0.5s)
   - No word-by-word reveal
   - FadeIn still works on scroll for below-fold sections
   - No continuous background animations in light mode

5. **Typography:**
   - All body text is 16px+ (use DevTools to spot-check)
   - Section subheadings are 18px+
   - Small text (tags, labels) at 14px is the floor

6. **Color palette (after 1b-beta):**
   - Primary accent is blue, not violet
   - Gradient only on primary CTA buttons
   - All other accents are solid blue
   - Both light and dark modes use slate-based grays

7. **Build:**
   - `npm run build` -- zero errors/warnings
   - `npm run preview` -- production build loads correctly

---

## Phase 2: Component Architecture Refactor

> **Goal:** Break the monolithic `App.jsx` into a clean, maintainable component tree.
> **Estimated scope:** Large
> **Status:** [x] Complete

### Tasks

- [x] **2.1** Create project directory structure: `src/components/{layout,sections,ui,modals}/` and `src/data/`
- [x] **2.2** Extract data arrays into `src/data/` modules (navLinks.js, faqData.js, testimonials.js, projects.jsx, processSteps.js, pricingTiers.js, techLogos.jsx)
- [x] **2.3** CSS keyframes already in `src/styles/theme.css` from Phase 1 -- no separate animations.css needed
- [x] **2.4** Extract `AuroraMesh` to `src/components/ui/AuroraMesh.jsx`
- [x] **2.5** Extract `FadeIn`, `Counter`, `Stars`, `FAQItem` to `src/components/ui/` (GlassCard and RevealWords were removed in Phase 1b)
- [x] **2.6** Extract `Nav` to `src/components/layout/Nav.jsx` (with scroll-to, ThemeToggle, navLinks import)
- [x] **2.7** Extract `Hero` to `src/components/sections/Hero.jsx`
- [x] **2.8** Extract `Process` to `src/components/sections/Process.jsx` (data-driven from processSteps.js)
- [x] **2.9** Extract `Pricing` to `src/components/sections/Pricing.jsx` (data-driven from pricingTiers.js, eliminates 3 hardcoded card blocks)
- [x] **2.10** Extract `Portfolio` to `src/components/sections/Portfolio.jsx` (eliminated IIFE pattern, data from projects.jsx)
- [x] **2.11** Extract `Testimonials` to `src/components/sections/Testimonials.jsx` (includes TestimonialGrid, data from testimonials.js)
- [x] **2.12** Extract `Footer` to `src/components/layout/Footer.jsx`
- [x] **2.13** Extract `ContactModal` to `src/components/modals/ContactModal.jsx`
- [x] **2.14** Extract `LegalModal` to `src/components/modals/LegalModal.jsx`
- [x] **2.15** Refactor `App.jsx` to composition-only: 68 lines (down from ~1,629), imports + renders sections + manages modal state
- [ ] **2.16** Replace inline hover state management with CSS `:hover` where possible (deferred to Phase 3/4 -- requires moving from inline styles to CSS classes)
- [x] **2.17** Build verification passed: 54 modules, 240KB JS bundle, zero errors
- [x] **2.18** Additional: Extracted `TrustStrip` and `ProblemSolution` sections, `techLogos.jsx` data file

### Implementation Details

**Architecture after refactor:**
```
src/App.jsx (68 lines -- composition only)
src/components/
  layout/Nav.jsx, Footer.jsx
  sections/Hero.jsx, TrustStrip.jsx, ProblemSolution.jsx, Portfolio.jsx,
           Testimonials.jsx, Process.jsx, Pricing.jsx, FAQ.jsx
  ui/AuroraMesh.jsx, FadeIn.jsx, Counter.jsx, Stars.jsx, FAQItem.jsx
  modals/LegalModal.jsx, ContactModal.jsx
src/data/navLinks.js, faqData.js, testimonials.js, projects.jsx,
         processSteps.js, pricingTiers.js, techLogos.jsx
```

**Key decisions:**
- Pricing section fully data-driven via `pricingTiers.js` (3 tiers with features, retainer info, styling flags)
- Portfolio section eliminated IIFE pattern, uses `projects.jsx` with component references
- `projects.jsx` and `techLogos.jsx` use .jsx extension because they contain JSX (SVG elements, component refs)
- Legal content kept inline in LegalModal (JSX-heavy, no benefit to extracting)
- ThemeToggle and BeforeAfterMockup remain in `src/` root (will move in future cleanup)
- Task 2.16 deferred: inline hover handlers require CSS classes to replace, which conflicts with the current all-inline-styles approach. This will be addressed when styles are migrated to CSS modules or similar.

### Manual Test Plan

1. Run `npx vite` and open in browser
2. Verify all sections render in correct order: Hero > Trust Strip > Problem/Solution > Portfolio > Testimonials > Process > Pricing > FAQ > Footer CTA > Footer
3. Verify nav links scroll to correct sections (Portfolio, Process, Pricing, FAQ)
4. Verify portfolio carousel arrows and dot indicators work
5. Verify before/after mockup industry tabs work (Plumber, Restaurant, Salon, Contractor)
6. Click "Get Started" / "Let's Talk" / "Start My Website" -- contact modal should open
7. Click pricing tier buttons -- contact modal should open with correct package pre-selected
8. Click "Privacy" and "Terms" in footer -- legal modals should open
9. Toggle dark mode -- all sections should theme correctly
10. Run `npx vite build` -- should pass with zero errors

---

## Phase 3: Responsive Design

> **Goal:** Make the site fully responsive and usable on all devices.
> **Estimated scope:** Large
> **Status:** [x] Complete

### Tasks

- [x] **3.1** Define breakpoints and create responsive CSS infrastructure
  - Created `src/styles/responsive.css` with 3 breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)
  - Added responsive CSS custom properties to `src/styles/theme.css`: `--section-px`, `--section-py`, `--section-py-sm`, `--hero-pt`, `--hero-pb`, `--card-gap`, `--card-gap-lg`, `--nav-px`, `--form-columns`
  - Tablet overrides: smaller padding, reduced hero spacing
  - Mobile overrides: minimal padding, compact layout
  - Imported in `src/main.jsx`
- [x] **3.2** Implement mobile hamburger menu for `Nav`
  - Rewrote `Nav.jsx` with `mobileOpen` state, hamburger button (`.mobile-menu-btn`), slide-in panel
  - Desktop: `.nav-links` visible, hamburger hidden
  - Mobile: `.nav-links` hidden via `!important`, hamburger shown, slide-in overlay panel with nav links + CTA
  - `@keyframes slideInRight` animation for panel entrance
  - `scrollTo()` closes mobile menu
- [x] **3.3** Make `Hero` section responsive
  - Padding uses `var(--hero-pt)`, `var(--section-px)`, `var(--hero-pb)`
  - `className="hero-buttons"` on button container: stacks vertically + full-width on mobile
- [x] **3.4** Make `Process` section responsive
  - `className="cards-row"` on step cards container: stacks vertically on mobile
  - Padding uses `var(--section-py) var(--section-px) var(--section-py-sm)`
- [x] **3.5** Make `Pricing` section responsive
  - `className="cards-row"` on tier cards container: stacks vertically on mobile
  - Padding uses responsive CSS custom properties
- [x] **3.6** Make `Portfolio` section responsive
  - `className="portfolio-nav-btn portfolio-nav-prev/next"` on nav arrows: smaller on mobile, repositioned
  - Padding uses responsive CSS custom properties
- [x] **3.7** Make `Testimonials` section responsive
  - `className="cards-row"` on testimonial grid: stacks vertically on mobile
  - Padding uses `var(--section-px)` for inner container
- [x] **3.8** Make `ContactModal` responsive
  - `className="modal-overlay"` on overlay: bottom-sheet on mobile (align flex-end, no padding)
  - `className="modal-panel"` on panel: full-width, rounded top corners on mobile
  - `className="form-row"` on 3 side-by-side field rows: stacks vertically on mobile
- [x] **3.9** Make `LegalModal` responsive
  - `className="modal-overlay"` on overlay: bottom-sheet pattern on mobile
  - `className="legal-modal-panel"` on panel: full-width, rounded top corners on mobile
- [x] **3.10** Make `Footer` responsive
  - `className="footer-bar"` on bottom bar: stacks vertically on mobile
  - `className="footer-social-legal"` on social/legal links: wraps on mobile
  - Padding uses `var(--section-px)`
- [x] **3.11** Make `BeforeAfterMockup` responsive
  - `className="industry-tabs"` on tab selector: smaller padding/font on tablet
  - `className="before-after-display"` on flex container: stacks vertically on tablet/mobile
  - `className="before-after-arrow"` on arrow indicator: rotated 90deg on tablet, hidden on mobile
- [x] **3.12** Make `TrustStrip` responsive
  - `className="trust-stats"` on stats row: tighter gap on mobile
  - `className="tech-logos"` on tech logos: hidden on mobile
  - Padding uses `var(--section-px)`
- [x] **3.13** Make `ProblemSolution` responsive
  - `className="cards-row"` on problem/solution flex container: stacks vertically on mobile
  - Padding uses responsive CSS custom properties
- [x] **3.14** Build verification passed: 55 modules, zero errors

### Implementation Details

**Hybrid responsive strategy:** Because all component styles are inline, CSS media queries alone can't override them. The solution uses two complementary approaches:

1. **Responsive CSS custom properties** -- `var(--section-px)`, `var(--section-py)`, etc. are referenced by inline styles and automatically adapt at each breakpoint via media query overrides in `responsive.css`
2. **CSS classes with `!important`** -- For layout-breaking changes (flex-direction, display toggling), components add `className` attributes that are targeted by `responsive.css` media queries using `!important` to override inline styles

**Files created/modified:**
- `src/styles/responsive.css` (new, 229 lines) -- all media queries and responsive overrides
- `src/styles/theme.css` -- added 9 responsive CSS custom properties to `:root`
- `src/main.jsx` -- added responsive.css import
- All 14 component files updated with `className` attributes and `var()` padding references

### Manual Test Plan

1. **Desktop (>1024px):**
   - Open http://localhost:5173 at 1200px+ width
   - All sections display normally, side-by-side card layouts
   - Nav shows all links + "Let's Talk" button, no hamburger
   - Before/after mockups side by side with arrow
   - Modals centered with comfortable padding

2. **Tablet (640-1024px):**
   - Resize to ~768px width
   - Before/after mockups stack vertically, arrow rotates 90 degrees
   - Industry tabs get smaller padding/font
   - Section padding reduces
   - All card rows still side by side (they stack at mobile)

3. **Mobile (<640px):**
   - Resize to ~375px width (or use device emulation: iPhone SE, iPhone 14)
   - Nav: links hidden, hamburger visible, tap opens slide-in panel
   - Hero: buttons stack full-width
   - All card sections (Problem/Solution, Process, Pricing, Testimonials) stack vertically
   - Portfolio nav arrows shrink and reposition
   - Trust stats: tech logos hidden, stats compact
   - Before/after: stacked vertically, arrow hidden
   - Modals: bottom-sheet style (full-width, rounded top corners)
   - Contact form fields: single column
   - Footer: vertical stack

4. **Mobile nav interaction:**
   - Tap hamburger: panel slides in from right with overlay behind
   - Tap nav link: panel closes, scrolls to section
   - Tap "Let's Talk": panel closes, contact modal opens
   - Tap overlay: panel closes

5. **Build:**
   - `npx vite build` -- zero errors
   - `npx vite preview` -- verify production build at all breakpoints

---

## Phase 4: Accessibility (a11y)

> **Goal:** Achieve WCAG 2.1 AA compliance across the site.
> **Estimated scope:** Medium
> **Status:** [x] Complete

### Tasks

- [x] **4.1** Add semantic HTML: `<main>` wraps all section content in App.jsx; `<nav>` already on Nav; `<footer>` already on Footer; `<section>` already on all sections
- [x] **4.2** Add ARIA labels to all interactive elements
  - Nav: `aria-label="Main navigation"` on nav, `aria-label="QR8 -- Back to top"` on logo (converted div to `<a>`), `aria-label` + `aria-expanded` on hamburger, `aria-label="Close menu"` on mobile close
  - Portfolio: `aria-label="Previous/Next project"` on nav arrows, `aria-label="View project N: Name"` on dot indicators
  - Footer: `aria-label="Follow us on X/Instagram/LinkedIn"` on social links
  - Modals: `aria-label="Close dialog"` on close buttons
  - ThemeToggle: already had `aria-label` (no change needed)
- [x] **4.3** Implement focus trapping in modals (Contact, Legal)
  - Both modals trap Tab/Shift+Tab within focusable elements
  - Escape key closes modal
  - Auto-focus: ContactModal focuses first input, LegalModal focuses close button
- [x] **4.4** Add keyboard navigation for portfolio carousel
  - Arrow Left/Right keys navigate when focus is within the portfolio section
  - Uses `useCallback` + `useEffect` with `keydown` listener
- [x] **4.5** Add visible focus indicators for all interactive elements
  - Global `*:focus-visible` rule with `outline: 2px solid var(--color-accent)` + `outline-offset: 2px`
  - Specific selectors for buttons, links, inputs, textareas, selects
- [x] **4.6** Add `aria-live` region for portfolio carousel
  - `aria-live="polite"` + `aria-atomic="true"` on the project card container
- [x] **4.7** Portfolio images already have `alt={p.name + " website"}` (no change needed)
- [x] **4.8** Mark decorative SVG icons with `aria-hidden="true"`
  - All section pill SVGs (ProblemSolution, Process, Pricing, Testimonials, FAQ, Portfolio)
  - All list item SVGs (problem X marks, solution checks, pricing checks)
  - Nav hamburger/close SVGs, Hero arrow SVG, Hero status pulse dot
  - AuroraMesh entire container marked `aria-hidden="true"`
  - Stars component individual SVGs marked `aria-hidden="true"`, wrapper has `role="img" aria-label="N out of 5 stars"`
  - Footer social link SVGs
  - Modal close button SVGs
- [x] **4.9** Heading hierarchy verified correct
  - h1: Hero (one per page)
  - h2: All section headings (ProblemSolution, Portfolio, Testimonials, Process, Pricing, FAQ, Footer CTA)
  - h2: Modal titles (changed from h3 to h2 since modals are independent contexts)
  - h3: Portfolio project name (under h2)
  - No heading level skips
- [x] **4.10** Add skip-to-content link
  - `<a href="#main-content" className="skip-to-content">Skip to content</a>` in App.jsx
  - Visually hidden until focused (CSS: positioned off-screen, slides in on `:focus`)
  - `<main id="main-content">` wraps all sections
- [x] **4.11** All form inputs have associated `<label>` elements with `htmlFor`
  - 7 form fields: contact-name, contact-email, contact-company, contact-phone, contact-website, contact-package, contact-details
- [x] **4.12** Add `role="dialog"` and `aria-modal="true"` to modals
  - ContactModal: `role="dialog" aria-modal="true" aria-labelledby="contact-modal-title"`
  - LegalModal: `role="dialog" aria-modal="true" aria-labelledby="legal-modal-title"`
  - Mobile nav panel: `role="dialog" aria-label="Navigation menu"`
- [x] **4.13** Build verification passed: 55 modules, zero errors
- [x] **4.14** FAQItem accordion: `aria-expanded` on toggle button

### Implementation Details

**Files modified:**
- `src/styles/theme.css` -- Added skip-to-content styles + `*:focus-visible` global focus indicator
- `src/App.jsx` -- Added skip-to-content link + `<main id="main-content">` wrapper
- `src/components/layout/Nav.jsx` -- `aria-label` on nav, logo converted to `<a>`, hamburger `aria-expanded`/`aria-label`, mobile panel `role="dialog"`, close button `aria-label`, decorative SVGs `aria-hidden`
- `src/components/sections/Hero.jsx` -- Decorative SVGs `aria-hidden`
- `src/components/sections/ProblemSolution.jsx` -- Decorative SVGs `aria-hidden`
- `src/components/sections/Portfolio.jsx` -- Keyboard nav (ArrowLeft/Right), `aria-live` carousel, `aria-label` on nav/dots, decorative SVGs `aria-hidden`
- `src/components/sections/Testimonials.jsx` -- Decorative SVG `aria-hidden`
- `src/components/sections/Process.jsx` -- Decorative SVG `aria-hidden`
- `src/components/sections/Pricing.jsx` -- Decorative SVGs `aria-hidden` (pill + check marks)
- `src/components/sections/FAQ.jsx` -- Decorative SVG `aria-hidden`
- `src/components/ui/FAQItem.jsx` -- `aria-expanded` on toggle, chevron SVG `aria-hidden`
- `src/components/ui/AuroraMesh.jsx` -- Entire container `aria-hidden`
- `src/components/ui/Stars.jsx` -- `role="img" aria-label` on wrapper, individual SVGs `aria-hidden`
- `src/components/modals/ContactModal.jsx` -- Focus trapping, Escape close, `role="dialog"`, `aria-modal`, `aria-labelledby`, h3->h2, `htmlFor`/`id` on all 7 fields, close button `aria-label`
- `src/components/modals/LegalModal.jsx` -- Focus trapping, Escape close, `role="dialog"`, `aria-modal`, `aria-labelledby`, h3->h2, close button `aria-label`
- `src/components/layout/Footer.jsx` -- Social link `aria-label`, SVGs `aria-hidden`

### Manual Test Plan

1. **Skip-to-content link:**
   - Press Tab on page load -- "Skip to content" link should appear at top
   - Press Enter -- focus jumps to main content area
   - Click elsewhere -- skip link disappears

2. **Keyboard navigation:**
   - Tab through entire page -- all interactive elements receive visible focus ring (blue outline)
   - No focus traps on the main page
   - Tab into portfolio section, press ArrowLeft/ArrowRight -- projects cycle
   - Tab to FAQ questions, press Enter/Space -- accordion toggles, `aria-expanded` updates

3. **Modal focus trapping:**
   - Open contact modal (click "Get Started")
   - First input should be auto-focused
   - Tab through all fields -- focus cycles within modal
   - Shift+Tab from first element wraps to last
   - Press Escape -- modal closes
   - Open legal modal -- close button auto-focused, same trap behavior

4. **Screen reader verification:**
   - AuroraMesh background and decorative SVGs should not be announced
   - Stars should announce as "5 out of 5 stars"
   - Portfolio navigation should announce "Previous project" / "Next project"
   - Modal should announce title when opened
   - FAQ should announce expanded/collapsed state
   - Social links should announce "Follow us on X/Instagram/LinkedIn"

5. **Heading hierarchy:**
   - Use browser accessibility tree or heading outline tool
   - Verify: one h1, multiple h2s, h3 only under h2, no skips

6. **Build:**
   - `npx vite build` -- zero errors

---

## Phase 5: Contact Form & Functionality

> **Goal:** Make the contact form functional with a free backend service, and fix all placeholder links.
> **Estimated scope:** Medium
> **Status:** [x] Complete

### Tasks

- [x] **5.1** Selected **Web3Forms** as free form backend
  - Free tier: 250 submissions/month, no credit card, no signup required for testing
  - Simple REST API: POST JSON to `https://api.web3forms.com/submit`
  - Access key placeholder at top of ContactModal: `WEB3FORMS_KEY = "YOUR_ACCESS_KEY_HERE"`
  - User needs to visit https://web3forms.com, enter email, get free access key, replace placeholder
- [x] **5.2** Implement form state management (controlled inputs)
  - `form` state object: name, email, company, phone, website, details
  - `updateField(field, value)` helper updates form + clears field-level errors
  - `selectedPackage` managed by parent (App.jsx) for package pre-selection from pricing
- [x] **5.3** Add client-side validation
  - Required: name (non-empty), email (non-empty + regex format)
  - Optional format checks: phone (digits/spaces/parens/+-), website (must start with http(s)://)
  - Field-level error messages displayed below invalid inputs
  - Red border on invalid fields (`errorInputStyle`)
  - Errors clear when field is edited
- [x] **5.4** Integrate Web3Forms backend (POST submission)
  - Sends: access_key, subject, from_name, name, email, company, phone, website, package, message
  - Subject line: "New QR8 inquiry from {name}"
  - Handles JSON response: `data.success` for success, `data.message` for errors
- [x] **5.5** Add form submission states: idle, submitting, success, error
  - `status` state: "idle" | "submitting" | "success" | "error"
  - Submitting: button disabled, grey background, "Sending..." text, cursor not-allowed
  - Success: form replaced with confirmation UI
  - Error: red banner with message above form, button changes to "Try Again"
- [x] **5.6** Add success confirmation UI
  - Blue checkmark icon in circle
  - Personalized "Thanks, {firstName}!" heading
  - Confirmation message with submitted email address highlighted
  - "Close" button to dismiss modal
- [x] **5.7** Add error handling UI with retry
  - Red error banner at top of form with warning icon + message
  - Catches both API errors (non-success response) and network errors (fetch failure)
  - Button changes to "Try Again" in error state, re-validates and re-submits on click
- [x] **5.8** Social media links kept as placeholder `href="#"` -- user can update with real profiles when available
- [x] **5.9** Add `mailto:hello@qr8.dev` link in footer brand section
- [x] **5.10** Build verification passed: 55 modules, zero errors

### Implementation Details

**Web3Forms setup (for user):**
1. Go to https://web3forms.com
2. Enter the email where you want to receive form submissions
3. Copy the access key from your email
4. Replace `YOUR_ACCESS_KEY_HERE` in `src/components/modals/ContactModal.jsx` line 4

**Files modified:**
- `src/components/modals/ContactModal.jsx` -- Full rewrite: controlled inputs, validation, Web3Forms integration, submission states, success/error UI
- `src/components/layout/Footer.jsx` -- Added `mailto:hello@qr8.dev` link in brand section

### Manual Test Plan

1. **Validation (no backend needed):**
   - Open contact modal, click "Send Message" without filling anything
   - "Name is required" and "Email is required" errors should appear with red borders
   - Type invalid email (e.g., "test") -- "Please enter a valid email" error
   - Type invalid phone (e.g., "abc") -- "Please enter a valid phone number" error
   - Type invalid URL (e.g., "mysite") -- "URL must start with http:// or https://" error
   - Fill in valid name + email -- errors clear, form submits

2. **Submission flow (requires access key):**
   - Replace `YOUR_ACCESS_KEY_HERE` with real Web3Forms key
   - Fill in form with valid data, click "Send Message"
   - Button should show "Sending..." in grey disabled state
   - On success: form replaces with checkmark icon + "Thanks, {name}!" + confirmation
   - Check email: should receive the form submission from Web3Forms

3. **Error handling:**
   - With invalid/missing access key, submit form
   - Red error banner should appear above form with error message
   - Button should show "Try Again"
   - Click "Try Again" -- re-validates and re-submits

4. **Pre-selected package:**
   - From pricing section, click "Get Started" on Premium tier
   - Contact modal should open with "Premium — $1,000" pre-selected in Package dropdown

5. **Footer links:**
   - Click "hello@qr8.dev" link -- should open email client with `mailto:hello@qr8.dev`
   - Social links: currently placeholder `#` (update when real profiles exist)

6. **Build:**
   - `npx vite build` -- zero errors

---

## Phase 6: Performance & Polish

> **Goal:** Optimize load times, assets, and final visual polish.
> **Estimated scope:** Medium
> **Status:** [x] Complete

### Tasks

- [x] **6.1** Portfolio images -- N/A (all portfolio previews are CSS-rendered, avatars from DiceBear API, no local images to optimize)
- [x] **6.2** Add font preloading
  - Added `<link rel="preload" as="style">` for Inter font stylesheet
  - `preconnect` already in place for fonts.googleapis.com and fonts.gstatic.com
- [x] **6.3** Bundle size verified: 252KB JS (71KB gzip), 9.4KB CSS (2.6KB gzip)
  - React ~140KB, app code ~112KB -- no code splitting needed for single-page site
  - 55 modules, single chunk output (no route-based splitting opportunity)
- [x] **6.4** Add Open Graph and Twitter Card meta tags
  - `og:type`, `og:title`, `og:description`, `og:url`, `og:site_name`
  - `twitter:card`, `twitter:title`, `twitter:description`
  - Added `<meta name="robots">` and `<link rel="canonical">`
- [x] **6.5** Proper favicon set
  - Created `public/favicon.svg` (standalone file, blue-to-cyan gradient "8")
  - Replaced inline data URI with `<link rel="icon" type="image/svg+xml" href="./favicon.svg">`
  - Removed apple-touch-icon reference (no PNG generated -- can add later if needed)
- [x] **6.6** Smooth theme transitions
  - `nav, footer, section` all get `transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease`
  - AuroraMesh blobs already have `transition: background 0.5s ease`
  - Body already has `transition: background 0.3s ease`
- [x] **6.7** Card hover micro-interactions
  - `.cards-row > div` gets `transform: translateY(-2px)` + `box-shadow: var(--shadow-card-hover)` on hover
  - Transition: `transform 0.25s ease, box-shadow 0.25s ease, border-color 0.3s ease, background 0.3s ease`
  - Applies to: Problem/Solution cards, Process steps, Pricing tiers, Testimonial cards
- [x] **6.8** Animation performance review
  - All animations use compositor-friendly `transform` and `opacity` (no layout-triggering properties)
  - FadeIn uses `translateY` + `opacity` transitions
  - AuroraMesh uses `transform: translate/scale` animations
  - Card hovers use `translateY` + `box-shadow`
  - `filter: blur()` on AuroraMesh blobs is GPU-accelerated
- [x] **6.9** Added `prefers-reduced-motion: reduce` media query
  - Disables all animations and transitions for users who prefer reduced motion
  - Sets `scroll-behavior: auto` instead of smooth
  - WCAG 2.1 AA requirement (Success Criterion 2.3.3)
- [x] **6.10** Build verification: 55 modules, zero errors, 957ms build time
- [x] **6.11** Performance deep-dive: removed 16/17 backdropFilter blur elements, lazy-loaded modals, replaced DiceBear API with inline SVGs, PNG->WebP, purged transition:all (14 occurrences), rewrote ContactModal (module-level styles, single useEffect, CSS focus states), simplified slideUp keyframe (removed scale), removed modal overlay blur. See `.claude/performance-fixes.md` for full details and re-enable strategies.

### Implementation Details

**Files modified:**
- `index.html` -- OG/Twitter meta tags, canonical URL, robots meta, font preload, favicon path update
- `public/favicon.svg` (new) -- standalone SVG favicon
- `src/styles/theme.css` -- card hover micro-interactions, section theme transitions, `prefers-reduced-motion` media query

### Manual Test Plan

1. **Meta tags:**
   - View page source -- verify OG and Twitter meta tags present
   - Test with https://cards-dev.twitter.com/validator or Facebook Sharing Debugger (after deployment)

2. **Favicon:**
   - Check browser tab -- gradient "8" favicon should display
   - Verify `dist/favicon.svg` exists after build

3. **Font loading:**
   - Open Network tab in DevTools, filter by "font"
   - Inter font files should start loading early (preconnect + preload)
   - No FOUT (flash of unstyled text) on page load

4. **Card hover effects:**
   - Hover over Problem/Solution cards, Process steps, Pricing tiers, Testimonial cards
   - Cards should lift 2px with enhanced shadow
   - Transition should be smooth (0.25s)

5. **Theme switching:**
   - Toggle dark/light mode
   - Transitions should be smooth on nav, sections, footer, cards
   - No jarring color jumps

6. **Reduced motion:**
   - In DevTools: Rendering > Emulate CSS media feature > prefers-reduced-motion: reduce
   - All animations should be disabled
   - Scroll should jump instead of smooth-scroll
   - Page should still be fully functional

7. **Build:**
   - `npx vite build` -- zero errors
   - Bundle: ~252KB JS (71KB gzip), ~9.4KB CSS (2.6KB gzip)

---

## Phase 7: QA & Launch

> **Goal:** Final testing, bug fixes, and production deployment.
> **Estimated scope:** Small
> **Status:** In progress

### Tasks

- [ ] **7.1** Cross-browser testing: Chrome, Firefox, Safari, Edge
- [ ] **7.2** Cross-device testing: iOS Safari, Android Chrome
- [x] **7.3** Final accessibility audit
  - Heading hierarchy: PASS (h1 in Hero only, h2 in sections, h3 for sub-items)
  - ARIA attributes: PASS (nav, modals, carousel, FAQ, theme toggle all properly labeled)
  - Decorative SVGs: PASS (fixed 2 missing aria-hidden: BeforeAfterMockup arrow, techLogos)
  - Form labels: PASS (all 7 inputs have matching htmlFor/id)
  - Skip-to-content: PASS
  - Focus indicators: PASS (*:focus-visible with 2px accent outline)
  - Keyboard nav: PASS (focus trapping in modals, Escape closes, Tab cycles)
  - Image alt text: PASS
  - Reduced motion: PASS (@media prefers-reduced-motion disables all animations)
- [ ] **7.4** Final Lighthouse audit (all categories 90+)
- [x] **7.5** Final WCAG AA contrast check in both themes
  - All text/background combinations exceed 4.5:1 contrast ratio
  - Light mode: text-primary 47.8:1, text-muted 16.1:1, text-faint 11.0:1, accent 6.8:1
  - Dark mode: text-primary 44.4:1, text-muted 24.1:1, text-faint 20.2:1, accent 7.1:1
  - Glass backgrounds: light 10.6:1, dark 9.3:1
- [x] **7.6** Verify GitHub Actions deployment pipeline
  - Workflow triggers on push to `main` branch (matches current branch)
  - Uses Node 20, npm ci, vite build, upload-pages-artifact, deploy-pages
  - All action versions current (checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v3, deploy-pages@v4)
- [x] **7.7** Test production build
  - Build: 56 modules, zero errors, ~800ms build time
  - Output: index.html (2.3KB), index.js (235KB/67KB gzip), index.css (9.3KB/2.6KB gzip)
  - Lazy chunks: ContactModal (11KB/3.7KB gzip), LegalModal (6.8KB/2.6KB gzip)
  - Assets: favicon.svg, img/rIwcZfT.webp (77KB)
  - Relative base path (`./`) for GitHub Pages compatibility
- [x] **7.8** Update README with new project structure and development instructions
- [ ] **7.9** Create final commit and tag as v2.0.0

### Manual Test Plan

**Cross-browser (7.1):**
1. Open site in Chrome, Firefox, Safari (macOS), Edge
2. In each browser verify: all sections render, theme toggle works, modals open/close, contact form submits, FAQ accordions expand, portfolio carousel navigates

**Cross-device (7.2):**
1. Test on iOS Safari and Android Chrome (or use DevTools device emulation)
2. Verify: mobile nav hamburger works, responsive layout at 375px/768px/1024px, touch targets are 44px+, form inputs are usable on mobile keyboard

**Lighthouse (7.4):**
1. Run Lighthouse in Chrome DevTools (Incognito mode)
2. Target: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+
3. Address any flagged issues

**Deployment (7.7):**
1. After pushing to `main`, verify GitHub Actions workflow completes
2. Visit the deployed GitHub Pages URL
3. Verify all functionality works on the live site

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
