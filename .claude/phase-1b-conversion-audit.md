# Phase 1b: Small Business Conversion Audit

> **Purpose:** Evaluate the current QR8 site against a proven small-business conversion framework
> **Benchmark:** "Look trustworthy, modern, and easy to understand within 3 seconds"
> **Date:** 2026-03-05

---

## Grading Summary

| Category | Grade | Verdict |
|---|---|---|
| 1. Clean / Professional / Trustworthy | C+ | Too much visual complexity; reads "creative agency" not "trusted partner" |
| 2. Color Strategy | C | Violet-cyan is creative, not calming; heavy gradient use |
| 3. Typography | B+ | Inter is excellent; scale is close but body text still undersized |
| 4. Layout Structure | C- | Missing critical conversion sections; wrong CTA language |
| 5. Imagery Strategy | D | 1 real screenshot, 2 gradient placeholders, no device mockups |
| 6. Motion & Effects | D+ | AuroraMesh, word reveals, drift animations = too much flash |
| 7. Before/After Transformations | F | Completely absent -- biggest missed conversion opportunity |
| 8. Visual Style Match | C | Leans "startup hype site" not "Modern SaaS + Local Service" |
| 9. Positioning Message | C+ | Copy is clever but speaks agency language, not business-owner language |
| 10. Website ROI Section | F | Completely absent |

**Overall: C-** -- The site looks polished but is optimized for impressing designers, not converting small business owners.

---

## Detailed Analysis

### 1. Clean, Professional, and Trustworthy

**Framework says:** White/light backgrounds, lots of whitespace, clean typography, clear sections, simple iconography. Think: Modern SaaS / professional service firm. NOT: artistic portfolio, startup hype site, overly animated UI.

**Current state:**
- [+] Light mode now exists (Phase 1 work)
- [+] Clean typography (Inter)
- [+] Clear section separation
- [-] AuroraMesh background with 4 animated gradient blobs + noise texture + grid overlay = visual noise
- [-] Glassmorphic card treatment adds complexity without clarity
- [-] Word-by-word reveal animation on the headline delays comprehension
- [-] Hero has too many elements competing: status pill + headline + subtext + 2 CTAs + 4 service cards
- [-] The overall aesthetic says "we are a cool agency" not "we are professionals you can trust with your money"

**Verdict:** The site is designed to impress other designers. Small business owners need to feel safe, not dazzled. The visual complexity creates cognitive load where there should be clarity.

**Recommendations:**
- Simplify or remove AuroraMesh in light mode (keep subtle version for dark mode only)
- Replace glassmorphic cards with clean solid cards in light mode
- Remove or drastically simplify the word reveal animation -- let the headline load instantly
- Reduce hero to: headline + subtext + 1 primary CTA + trust bar
- Move service cards to their own section below the trust bar

---

### 2. Color Strategy

**Framework says:** Calm + trustworthy palettes. Blue-based or navy-based. Avoid too many colors, neon palettes, heavy gradients everywhere. Goal: "this company builds serious websites."

**Current state:**
- [-] Primary accent is violet (#7C3AED) -- creative/playful, not trustworthy/calm
- [-] Secondary accent is cyan (#0891B2) -- tech-forward but cold
- [-] Violet-to-cyan gradient used heavily: CTAs, badges, process numbers, "MOST POPULAR" tag, portfolio counter, every section icon
- [-] Portfolio tags use 5+ different colors (green, orange, pink, purple, cyan)
- [-] Testimonial avatars use 5 different colors (violet, pink, cyan, purple, green)
- [+] Light background (#FAFAF9) is warm and professional
- [+] Text colors are well-structured (primary/secondary/muted/faint hierarchy)

**Verdict:** The violet-cyan palette reads "creative studio" or "Web3 startup" -- not "trusted business partner." The gradient is overused and makes the site feel like everything is trying to be the accent.

**Recommendations:**
- Consider shifting primary accent toward blue (#2563EB / #3B82F6) -- the universal trust color
- Keep a secondary accent (could keep violet or shift to a warmer complement)
- Reserve gradient for ONE high-priority element (primary CTA button only)
- Use the primary accent as a solid color for everything else (badges, icons, borders)
- Reduce the number of unique colors in portfolio tags and testimonial avatars
- Evaluate "Option A - Professional Tech" or "Option B - Modern Business" from the framework

---

### 3. Typography

**Framework says:** Two fonts max. Hero 48-64px, sections 28-36px, body 16-18px, small text 14px.

**Current state:**
- [+] Single font family (Inter) -- excellent choice, listed as recommended
- [+] Hero: clamp(36px, 5.2vw, 64px) -- matches framework range
- [+] Section titles: clamp(28px, 4vw, 48px) -- matches framework range
- [-] Body text: 14px in many places -- framework says 16-18px
- [-] Card descriptions: 14px -- should be 16px
- [-] Process step details: 14px -- should be 16px
- [-] Pricing descriptions: 14px -- should be 16px
- [-] Testimonial quotes: 14px -- should be 16px
- [+] Section subheadings: 17px -- good
- [+] Hero subtitle: clamp(16px, 1.8vw, 20px) -- good

**Verdict:** Close but body text is consistently 2px too small. At 14px, text feels "tech startup" tight. At 16px it feels "professional service" readable. This matters for the 30-60 age demographic.

**Recommendations:**
- Bump all body/description text from 14px to 16px
- Bump testimonial quotes from 14px to 16px
- Keep 14px only for genuinely small UI elements (tags, labels)
- Consider adding a second font for headings (Sora, Manrope, Poppins) to add warmth -- optional, Inter works alone

---

### 4. Layout Structure (Conversion Flow)

**Framework says:** Hero (clear promise + CTA) -> Trust Section -> Services -> Portfolio/Examples -> Pricing -> CTA

**Current layout order:**
1. Hero (headline + 2 CTAs + 4 service cards)
2. Process ("How We Work" -- 4 expandable steps)
3. Pricing (3 tiers)
4. Portfolio (project carousel)
5. Testimonials (auto-scroll carousel)
6. Footer CTA + footer

**Issues identified:**

**A. Missing: Trust Bar / Social Proof Section**
- No trust bar below the hero. No "Trusted by X businesses", no client logos, no stats
- Trust signals are buried: testimonials are section 5, portfolio is section 4
- First-time visitors see: headline -> "how we work" -> pricing. They haven't been given any reason to trust QR8 yet before being asked to commit

**B. Wrong section order**
- Pricing comes BEFORE portfolio and testimonials. The visitor is being asked to choose a package before seeing any proof of work or social validation
- Framework order: Hero -> Trust -> Services -> Portfolio -> Pricing -> CTA
- Current order skips trust, shows process (methodology), then jumps to money

**C. Hero CTAs are wrong**
- "See Our Work" sends to portfolio (section 4 -- long scroll)
- "How We Work" sends to process (section 2)
- Framework recommends: "Get a Website" (or "Get Started") + "See Pricing"
- Neither current CTA directly starts the conversion. "Let's Talk" in the nav is the real CTA but it's visually deprioritized

**D. Service cards are capability-focused, not outcome-focused**
- Current: "Mobile-First", "AI Solutions", "SEO Optimization", "Performance"
- These describe what QR8 does, not what the business owner gets
- Framework suggests outcome labels: "Website Design", "Online Ordering Integration", "Local SEO Setup", "Branding Packages"
- Better for SMB: "Get Found on Google", "Turn Visitors Into Customers", "Look Professional on Every Device", "Launch in Under 2 Weeks"

**E. Process section is too complex**
- 4 expandable accordion-style cards with click interaction
- The content is good but the interaction pattern is unusual -- most visitors won't click
- Framework doesn't even have a process section as a primary element

**F. Missing: Call to action urgency**
- Footer CTA: "Ready to build something great?" -- vague
- Framework suggests: "Get Your Business Online in 14 Days" -- specific, time-bound

**Recommendations:**
- Add a Trust Bar immediately below the hero (stats + client logos or partner count)
- Reorder sections: Hero -> Trust -> Services -> Portfolio -> Testimonials -> Pricing -> CTA
- Change hero CTAs to: "Get Started" (primary, opens contact) + "See Pricing" (secondary, scrolls)
- Rewrite service cards to focus on business outcomes, not technical capabilities
- Simplify process section (numbered list or simple cards, not expandable accordion)
- Add urgency to CTAs: specific timelines, guarantees

---

### 5. Imagery Strategy

**Framework says:** Use website mockups, real small business imagery, device mockups, dashboard visuals. Avoid stock photos, handshakes, corporate meetings.

**Current state:**
- [+] 1 real portfolio screenshot (Fostering BRAIN Connections)
- [-] 2 portfolio items have gradient placeholder backgrounds instead of real images
- [-] Zero device mockups (laptop, phone, tablet frames)
- [-] Zero before/after comparisons
- [-] Testimonials use colored initial circles (MT, MD, JW) instead of photos
- [-] No visual proof of results anywhere
- [-] No imagery in hero section at all

**Verdict:** The site is almost entirely text + colored shapes. For a web design agency, this is a major credibility gap. "Show, don't tell" is critical -- visitors want to see the work.

**Recommendations:**
- Add device mockup frames around portfolio screenshots (laptop + phone side by side)
- Get real screenshots for ALL portfolio items (no gradient placeholders)
- Add a hero image: device mockup showing a client site, or split-screen before/after
- Replace testimonial initials with real photos (or professional illustrated avatars at minimum)
- Consider adding a "Results" section with stat cards + associated imagery

---

### 6. Motion & Effects

**Framework says:** Good: hover effects, soft fades, subtle scroll animations. Avoid: heavy parallax, flashy transitions, chaotic animation. "Small businesses prefer stability over flash."

**Current state:**
- [-] AuroraMesh: 4 constantly-animating gradient blobs (drift1/drift2/drift3, 18-25s cycles)
- [-] Word reveal animation on hero headline (each word slides up individually with staggered delay)
- [-] Hero subtitle, CTAs, and service cards all have delayed entrance animations (0.3s-2.05s delays)
- [-] Full page doesn't render for ~2 seconds due to staggered animations
- [-] Testimonial carousel auto-scrolls with drag interaction
- [-] Process cards have complex expand/collapse with cubic-bezier transitions
- [+] FadeIn on scroll is subtle and appropriate
- [+] Card hover effects are clean
- [+] Pricing button hover lifts are professional

**Verdict:** The site takes ~2 seconds to fully appear due to staggered entrance animations. This is the opposite of "understand within 3 seconds." The aurora background is mesmerizing but distracting. Small business owners aren't here to be impressed by animation -- they want to quickly assess trustworthiness.

**Recommendations:**
- Remove or drastically reduce hero entrance animation delays (content should be visible immediately)
- Remove word-by-word reveal -- render headline instantly
- Simplify AuroraMesh: remove in light mode entirely, or reduce to 1-2 very subtle blobs
- Keep: scroll FadeIn, hover effects, smooth transitions
- Remove: continuous background animations, staggered entrance timings, drag-to-scroll testimonials
- Total time to full content visibility should be < 0.5s, not 2s+

---

### 7. Before/After Transformations -- MISSING

**Framework says:** "This alone can dramatically increase conversions." Show: outdated site -> modern responsive site.

**Current state:** Completely absent. The portfolio shows finished projects but never shows the transformation. There's no visual proof of improvement.

**Recommendations:**
- Add a dedicated "Transformations" section or integrate before/after into the portfolio
- Format: side-by-side or slider showing the old site vs the new site
- Even 2-3 before/after examples would be powerful
- Include a brief stat with each: "Bookings up 140%" next to the transformation
- This section should come BEFORE pricing -- it's the proof that justifies the investment

---

### 8. Visual Style Match

**Framework says:** Build a "Modern SaaS + Local Service Business Hybrid." Light background, strong typography, blue accent, card-based layout, device mockups, clear pricing, trust signals.

**Scorecard:**
- [+] Light background (Phase 1)
- [~] Strong typography (Inter is good, but sizes still need bumping)
- [-] Blue accent (currently violet-cyan -- creative, not trustworthy)
- [+] Card-based layout
- [-] Device mockups (none)
- [+] Clear pricing (3 tiers, well-structured)
- [-] Trust signals (no trust bar, no stats, no logos)

**Verdict:** The site currently reads as "creative portfolio + startup landing page." The framework target is "SaaS marketing page + local service business." The gap is mostly in trust signals, color palette, imagery, and animation restraint.

---

### 9. Positioning Message

**Framework says:** Communicate "We help small businesses get more customers online." NOT "We design beautiful websites." Business owners buy results, not design.

**Current messaging audit:**

| Element | Current | Issue |
|---|---|---|
| Headline | "Curating AI-Powered Sites That Convert Clicks Into Clients" | "Curating" is agency jargon. "AI-Powered" leads with tech, not benefit. |
| Subtitle | "Your website should do more than look good -- it should bring in customers." | Good! This is results-oriented. |
| Status pill | "Now taking on new partners" | "Partners" is agency-speak. SMBs think "clients" or "projects" |
| CTA 1 | "See Our Work" | Doesn't start conversion |
| CTA 2 | "How We Work" | Process-focused, not results-focused |
| Nav CTA | "Let's Talk" | Good but vague |
| Process title | "How We Work" | Process-centric |
| Pricing title | "Honest pricing, no surprises" | Good! Builds trust |
| Portfolio title | "Work we're proud of" | Agency-centric ("we're proud") vs client-centric |
| Footer CTA | "Ready to build something great?" | Vague, no urgency |

**Verdict:** The subtitle is the strongest line on the site and it's buried under a weaker headline. The messaging leans "agency talking about itself" rather than "agency talking about what the client will get."

**Recommendations:**
- Lead with the benefit, not the method: "Websites That Bring Customers to Your Business"
- Or keep the conversion angle but simplify: "Get a Website That Actually Brings In Customers"
- Change "Now taking on new partners" -> "Now booking new projects" or just remove
- CTA 1: "Get Started" or "Get a Free Quote"
- CTA 2: "See Pricing"
- Portfolio title: "Real Results for Real Businesses" (already used as subtitle -- promote it)
- Footer CTA: "Get Your Business Online in 14 Days" (specific + urgent)

---

### 10. Website ROI Section -- MISSING

**Framework says:** Add a section that speaks the business owner's language about concrete outcomes.

Example:
- Increase customer inquiries
- Rank on Google
- Enable online ordering
- Build trust instantly

**Current state:** Nothing like this exists. The closest is the stats on individual portfolio items (+140% bookings, +200% traffic) but these are buried in a carousel that most visitors won't fully explore.

**Recommendations:**
- Add a "Why Your Business Needs a Professional Website" or "What a Great Website Does for You" section
- 4 benefit cards with icons:
  - "Get Found on Google" -- Local SEO that puts you in front of customers searching for your services
  - "Turn Visitors Into Customers" -- Conversion-focused design that drives inquiries, bookings, and sales
  - "Look Professional on Any Device" -- Mobile-first sites that build trust from the first click
  - "Save Time With Automation" -- Online booking, forms, and tools that run while you focus on your business
- Position this BEFORE the portfolio section -- set the frame, then show the proof
- This replaces the current "service cards" in the hero (which are capability-focused)

---

## Recommended Section Order (New)

| # | Section | Purpose |
|---|---|---|
| 1 | **Hero** | Clear promise + primary CTA + trust stat |
| 2 | **Trust Bar** | Client count, rating, turnaround time -- instant credibility |
| 3 | **ROI / Benefits** | "What a professional website does for your business" -- 4 outcome cards |
| 4 | **Portfolio** | Real work with device mockups + before/after |
| 5 | **Testimonials** | Social proof with real photos |
| 6 | **Process** | Simplified "How it works" -- 4 numbered steps (no accordion) |
| 7 | **Pricing** | 3 tiers (after trust is established) |
| 8 | **Final CTA** | Urgency-driven: "Get your business online in 14 days" |
| 9 | **Footer** | Contact, legal, social |

---

## Priority Changes (Impact vs Effort)

### High Impact, Low Effort
1. **Rewrite hero headline** to benefit-focused language
2. **Change CTA buttons** to "Get Started" + "See Pricing"
3. **Remove hero entrance animation delays** (show content immediately)
4. **Add trust bar** below hero (even placeholder stats)
5. **Reorder sections** to trust-building flow

### High Impact, Medium Effort
6. **Add ROI/Benefits section** replacing hero service cards
7. **Simplify AuroraMesh** for light mode
8. **Add device mockup frames** around portfolio screenshots
9. **Bump all body text to 16px**
10. **Simplify process section** to non-interactive numbered steps

### High Impact, High Effort
11. **Create before/after transformations** section
12. **Get real portfolio screenshots** for all projects
13. **Evaluate color palette shift** toward blue-primary
14. **Replace testimonial initials** with real photos/avatars

### Consider but Lower Priority
15. Add more portfolio items with real imagery
16. Add client logos to trust bar
17. Second font for headings (Sora/Manrope)
18. "Website ROI calculator" interactive element

---

## Implementation as Phase 1b

Phase 1b should address items 1-10 (high impact, low-medium effort) as content/structure changes BEFORE the Phase 2 architecture refactor. This way, Phase 2 extracts the *correct* components with the *correct* content, rather than refactoring a structure we're about to change.

The architecture refactor (Phase 2) will be cleaner if the content and section order are finalized first.
