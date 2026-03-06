import FadeIn from "../ui/FadeIn.jsx";
import { pricingTiers } from "../../data/pricingTiers.js";

export default function Pricing({ onSelectPackage }) {
  const accentGrad = "var(--accent-gradient)";

  return (
    <section id="pricing" style={{ scrollMarginTop: 80,
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
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Pricing
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--color-text-primary)",
            margin: "0 0 16px",
          }}>Honest pricing, no surprises</h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
            maxWidth: 620, margin: "0 auto",
          }}>
            Every project includes a one-time build. Want us to stick around after launch? Add a monthly retainer and we'll keep things running and improving.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="cards-row" style={{
          display: "flex", gap: 16, maxWidth: 960, margin: "0 auto",
          alignItems: "stretch",
        }}>
          {pricingTiers.map((tier) => (
            <div key={tier.id} style={{
              flex: 1,
              background: tier.highlighted ? "var(--color-surface-glass-hover)" : "var(--color-surface-glass)",

              border: tier.highlighted ? "1px solid var(--color-accent-border)" : "1px solid var(--color-border)",
              borderRadius: "var(--card-radius-lg)", padding: "32px 28px 36px",
              boxShadow: tier.highlighted ? "var(--shadow-accent)" : "var(--shadow-card)",
              display: "flex", flexDirection: "column",
              position: "relative",
            }}>
              {tier.highlighted && (
                <div style={{
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  padding: "5px 18px",
                  background: "var(--color-accent)",
                  borderRadius: "var(--pill-radius)", fontSize: 11, fontWeight: 700,
                  color: "#fff", letterSpacing: "0.03em",
                  boxShadow: "var(--shadow-accent)",
                }}>MOST POPULAR</div>
              )}

              <div style={{
                fontSize: 14, fontWeight: 600, color: "var(--color-text-muted)",
                marginBottom: 4, marginTop: tier.highlighted ? 8 : 0, letterSpacing: "0.01em",
              }}>{tier.name}</div>
              <div style={{
                fontSize: 12, color: "var(--color-text-faint)", marginBottom: 16,
              }}>{tier.subtitle}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: tier.priceNote ? 6 : 0, marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.03em" }}>{tier.price}</span>
                {tier.priceNote && <span style={{ fontSize: 14, color: "var(--color-text-muted)" }}>{tier.priceNote}</span>}
              </div>
              <div style={{
                fontSize: 16, color: "var(--color-text-muted)", marginBottom: 28, lineHeight: 1.5,
              }}>{tier.description}</div>

              <div style={{ height: 1, background: tier.dividerColor, marginBottom: 24 }} />

              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {tier.featuresLabel || "What's included"}
              </div>
              {tier.features.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: "0 0 16px", marginTop: 1 }}>
                    <path d="M3.5 8.5l3 3 6-6" stroke={tier.checkColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 16, color: tier.highlighted ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>{item}</span>
                </div>
              ))}

              <div style={{ flex: 1 }} />

              <div style={{
                marginTop: 24, padding: "14px 16px",
                background: tier.highlighted ? "var(--color-accent-soft)" : "var(--pill-bg)",
                border: tier.highlighted ? "1px solid var(--color-accent-border)" : "1px solid var(--pill-border)",
                borderRadius: 12,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  {tier.retainer.price ? "Optional retainer" : "Retainer"}
                </div>
                {tier.retainer.price ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-secondary)" }}>{tier.retainer.price}</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-faint)" }}>{tier.retainer.period}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-faint)", marginTop: 4 }}>{tier.retainer.desc}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 16, color: "var(--color-text-muted)", lineHeight: 1.5 }}>{tier.retainer.desc}</div>
                )}
              </div>

              {tier.highlighted ? (
                <button style={{
                  padding: "13px 0", width: "100%",
                  background: accentGrad,
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--pill-radius)", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "box-shadow 0.3s, transform 0.3s",
                  boxShadow: "var(--shadow-accent)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-accent)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  onClick={() => onSelectPackage(tier.id)}
                >{tier.buttonLabel}</button>
              ) : (
                <button style={{
                  padding: "13px 0", width: "100%",
                  background: "var(--nav-btn-bg)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--pill-radius)", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.25s, color 0.25s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nav-btn-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--nav-btn-bg)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                  onClick={() => onSelectPackage(tier.id)}
                >{tier.buttonLabel}</button>
              )}
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={300}>
        <p style={{
          textAlign: "center", fontSize: 14, color: "var(--color-text-faint)",
          marginTop: 32, maxWidth: 540, margin: "32px auto 0",
        }}>
          Standard and Premium are fixed-rate — what you see is what you pay.<br/>
          Custom projects are scoped and quoted after our initial consult.<br/>
          No surprises, ever.
        </p>
      </FadeIn>
    </section>
  );
}
