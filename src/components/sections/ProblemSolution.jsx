import FadeIn from "../ui/FadeIn.jsx";

export default function ProblemSolution() {
  return (
    <section style={{
      position: "relative", zIndex: 10,
      maxWidth: "var(--container-max-width)", margin: "0 auto",
      padding: "var(--section-py) var(--section-px) var(--section-py-sm)",
    }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", marginBottom: 20,
            background: "var(--pill-bg)",
            border: "1px solid var(--pill-border)",
            borderRadius: "var(--pill-radius)", fontSize: 12, fontWeight: 600,
            color: "var(--color-text-muted)", letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Why It Matters
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--color-text-primary)",
            margin: "0 0 16px",
          }}>Your Website Should Work as Hard as You Do</h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
            maxWidth: 600, margin: "0 auto",
          }}>
            Most small business websites look outdated, load slowly, and don't show up on Google. That's costing you customers every day.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="cards-row" style={{
          display: "flex", gap: 24, maxWidth: 960, margin: "0 auto",
          alignItems: "stretch",
        }}>
          {/* Problem side */}
          <div style={{
            flex: 1,
            background: "var(--color-surface-glass)",

            border: "1px solid var(--color-border)",
            borderRadius: "var(--card-radius-lg)", padding: "32px 28px",
            boxShadow: "var(--shadow-card)",
          }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "#dc2626",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20,
            }}>Your current website might be...</div>
            {[
              "Slow to load, frustrating visitors before they even see your services",
              "Invisible on Google, so customers can't find you when they search",
              "Not mobile-friendly, losing 60%+ of traffic that comes from phones",
              "Outdated design that makes your business look less trustworthy",
              "Missing clear calls to action, so visitors browse and leave",
            ].map((text, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16,
              }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flex: "0 0 18px", marginTop: 2 }}>
                  <circle cx="9" cy="9" r="8" stroke="#dc2626" strokeWidth="1.5" opacity="0.3"/>
                  <path d="M6 6l6 6M12 6l-6 6" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-text-muted)" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Solution side */}
          <div style={{
            flex: 1,
            background: "var(--color-surface-glass-hover)",

            border: "1px solid var(--color-accent-border)",
            borderRadius: "var(--card-radius-lg)", padding: "32px 28px",
            boxShadow: "var(--shadow-card)",
          }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: "#16a34a",
              textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20,
            }}>We fix that.</div>
            {[
              "Lightning-fast load times that keep visitors engaged and reduce bounce rates",
              "Built-in SEO so you rank on Google when customers search for your services",
              "Mobile-first design that looks perfect on every device, every screen size",
              "Modern, professional look that builds instant trust with new visitors",
              "Conversion-focused layout with clear CTAs that turn browsers into buyers",
            ].map((text, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16,
              }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flex: "0 0 18px", marginTop: 2 }}>
                  <circle cx="9" cy="9" r="8" stroke="#16a34a" strokeWidth="1.5" opacity="0.3"/>
                  <path d="M5.5 9.5l2.5 2.5 4.5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
