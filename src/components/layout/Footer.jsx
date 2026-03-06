import FadeIn from "../ui/FadeIn.jsx";

export default function Footer({ onContact, onLegal }) {
  const accentGrad = "var(--accent-gradient)";

  return (
    <footer style={{
      position: "relative", zIndex: 10,
      borderTop: "1px solid var(--divider)",
    }}>
      <div style={{
        maxWidth: "var(--container-max-width)", margin: "0 auto",
        padding: "0 var(--section-px)",
      }}>

        {/* CTA block */}
        <FadeIn>
          <div style={{
            textAlign: "center",
            padding: "64px 0 56px",
            borderBottom: "1px solid var(--divider)",
          }}>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "var(--color-text-primary)",
              margin: "0 0 14px",
            }}>Get Your Business Online in 14 Days</h2>
            <p style={{
              fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
              maxWidth: 480, margin: "0 auto 28px",
            }}>
              Tell us about your project and we'll get back to you within 24 hours. No commitment, no pressure — just a conversation about what's possible.
            </p>
            <button
              onClick={onContact}
              style={{
                padding: "14px 36px",
                background: accentGrad,
                color: "#fff", border: "none",
                borderRadius: "var(--pill-radius)", fontSize: 15, fontWeight: 600,
                cursor: "pointer", transition: "box-shadow 0.3s, transform 0.3s",
                boxShadow: "var(--shadow-accent)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-accent)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Start My Website</button>
          </div>
        </FadeIn>

        {/* Minimal footer content */}
        <div className="footer-bar" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
          padding: "28px 0",
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-primary)" }}>QR</span>
              <span style={{
                fontSize: 20.5, fontWeight: 700, letterSpacing: "-0.03em",
                background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>8</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-faint)" }}>&copy; 2025 QR8. All rights reserved.</span>
            <a href="mailto:hello@qr8.dev" style={{
              fontSize: 12, color: "var(--color-text-faint)", textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-faint)"}
            >hello@qr8.dev</a>
          </div>

          {/* Social + legal */}
          <div className="footer-social-legal" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { label: "X", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              { label: "Instagram", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01", rect: true },
              { label: "LinkedIn", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z", circle: true },
            ].map((s, i) => (
              <a key={i} href="#" aria-label={`Follow us on ${s.label}`} style={{ color: "var(--color-text-faint)", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-primary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-faint)"}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {s.rect && <rect x="2" y="2" width="20" height="20" rx="5"/>}
                  {s.circle && <circle cx="4" cy="4" r="2"/>}
                  <path d={s.icon}/>
                </svg>
              </a>
            ))}

            <span style={{ width: 1, height: 14, background: "var(--divider)" }} />

            <a href="#" onClick={(e) => { e.preventDefault(); onLegal("privacy"); }} style={{
              fontSize: 12, color: "var(--color-text-faint)", textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-faint)"}
            >Privacy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onLegal("terms"); }} style={{
              fontSize: 12, color: "var(--color-text-faint)", textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-faint)"}
            >Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
