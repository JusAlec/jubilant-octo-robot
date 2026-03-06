# QR8 Performance Optimization Log

> **Date:** 2026-03-05
> **Context:** User reported slow page loading, delayed modal popup, and typing lag in contact form.

---

## Summary

Identified and resolved a compounding set of GPU, CSS, and React performance bottlenecks. The site went from noticeable lag on modal open/typing to instant, responsive interactions.

---

## Fixes Applied

### 1. Counter.jsx -- React re-renders eliminated
- **Before:** `useState` + `setVal()` called via `requestAnimationFrame` = ~132 React re-renders per counter animation
- **After:** Direct DOM mutation via `ref.current.textContent` -- zero React involvement during animation

### 2. FadeIn.jsx -- transition: all removed
- **Before:** `transition: "all 0.7s"` forced browser to check/transition every CSS property
- **After:** `transition: "opacity 0.7s ..., transform 0.7s ..."` -- only specified properties

### 3. transition: "all" purged site-wide
- **Scope:** 14 occurrences across 10 files (ContactModal, LegalModal, FAQItem, ThemeToggle, Hero, Pricing, Portfolio, Footer, Nav, BeforeAfterMockup)
- **After:** Each replaced with specific properties (background, color, border-color, box-shadow, transform, opacity as appropriate)

### 4. Modals lazy-loaded (React.lazy + Suspense)
- **Before:** ContactModal (11KB) and LegalModal (7KB) bundled in main chunk, parsed on page load
- **After:** Separate chunks loaded on demand when user opens a modal

### 5. DiceBear API avatars replaced
- **Before:** 3 external network requests to `api.dicebear.com` on testimonial section load
- **After:** Inline SVG data URIs (colored circles with initials) -- zero network requests

### 6. Image optimization
- **rIwcZfT.png** (338KB) converted to WebP (77KB) -- 77% reduction
- **COYHX6u.png** (250KB) removed -- unused in any source file
- **Total savings:** 511KB

### 7. backdropFilter: blur() removed from 16 of 17 elements
- **Before:** 17 elements with `backdropFilter: blur()` creating GPU compositing layers (cards, buttons, modal panels, modal overlays, hero pill)
- **After:** Only nav bar retains blur (1 fixed element, acceptable cost)
- **Compensation:** Glass background CSS variables made more opaque to maintain visual quality without blur
  - Light: `--color-surface-glass` 75% -> 92% opacity
  - Dark: `--color-surface-glass` 4% -> 65% opacity
  - Modal backgrounds made fully opaque (#FFFFFF / #1E293B)

### 8. AuroraMesh light mode optimization
- **Before:** 4 animated blurred blobs rendered in light mode (all set to `transparent` via CSS vars -- invisible but still GPU-composited)
- **After:** Conditional rendering -- blobs only mount in dark mode. Light mode renders only the base gradient.
- **Implementation:** MutationObserver watches `data-theme` attribute changes

### 9. ContactModal complete rewrite
- **useEffect split:** Was `[onClose, status]` (re-ran on every status change, re-querying DOM and re-attaching listeners). Now `[]` with `onCloseRef` pattern -- runs once on mount.
- **Style objects:** 6 objects (inputStyle, errorInputStyle, labelStyle, etc.) moved from component body to module scope -- created once, never recreated on re-render.
- **Focus/blur handling:** Removed `handleFocus`/`handleBlur` inline JS that directly mutated `element.style`. Replaced with CSS class `.modal-input:focus` -- zero JS, no sync style recalc.
- **updateField:** Now short-circuits `setErrors` when no error exists for the field, avoiding unnecessary re-renders.

### 10. slideUp animation simplified
- **Before:** `from { opacity: 0; transform: translateY(30px) scale(0.97); }` -- `scale()` forces layout recalculation of all modal contents on every animation frame
- **After:** `from { opacity: 0; transform: translateY(24px); }` -- compositor-only, zero layout cost

### 11. Modal overlay blur removed
- **Before:** `backdropFilter: blur(8px)` on overlay + `fadeIn` animation = GPU compositing the entire page through a blur filter on every frame of the entrance animation
- **After:** Solid semi-transparent overlay. Light: `rgba(15,23,42,0.6)`, Dark: `rgba(0,0,0,0.7)`

### 12. Unused CSS keyframe removed
- `@keyframes scrollTestimonials` was defined but never referenced -- removed

---

## Visual Trade-offs (candidates for re-enabling)

These were disabled for performance but could be selectively restored with optimization:

### Glassmorphism blur on cards
- **What was lost:** Frosted glass backdrop blur on cards (ProblemSolution, Testimonials, Process, Pricing, Portfolio, TrustStrip)
- **Why removed:** 8+ simultaneous `backdropFilter: blur()` elements = massive GPU overhead
- **Re-enable strategy:** Apply to 1-2 key elements only (e.g., "Most Popular" pricing card). Use `will-change: transform` to promote to compositor layer. Test that total blur elements stay at 2-3 max.

### Modal backdrop blur
- **What was lost:** Blurred view of page behind modal overlay
- **Why removed:** `blur(8px)` + `fadeIn` animation = GPU compositing entire page blur on every animation frame (15 frames at 60fps)
- **Re-enable strategy:** Use `will-change: backdrop-filter` on the overlay, remove the fadeIn animation (just pop the overlay, animate only the panel). Or apply blur after animation completes via a delayed class.

### Modal scale entrance animation
- **What was lost:** Subtle 0.97->1.0 scale during slideUp animation
- **Why removed:** `scale()` forces layout recalculation of all modal contents per frame
- **Re-enable strategy:** Use `scale3d()` instead (forces GPU layer promotion, avoids layout). Test with Chrome DevTools Performance panel to verify no layout thrashing.

### DiceBear illustrated avatars
- **What was lost:** Cartoon-style avatar illustrations for testimonials
- **Why removed:** 3 external API network requests blocking render
- **Re-enable strategy:** Download the SVGs at build time and inline them as static assets, or self-host the DiceBear library.

---

## Build Metrics

| Metric | Before | After |
|--------|--------|-------|
| Main JS bundle | 252KB (71KB gzip) | 234.8KB (67KB gzip) |
| CSS | 9.4KB (2.6KB gzip) | 9.3KB (2.6KB gzip) |
| ContactModal chunk | (in main bundle) | 11KB separate chunk |
| LegalModal chunk | (in main bundle) | 6.8KB separate chunk |
| Images | 588KB (2 PNGs) | 77KB (1 WebP) |
| backdropFilter elements | 17 | 1 (nav only) |
| transition: "all" occurrences | 14 | 0 |
