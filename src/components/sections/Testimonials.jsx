import FadeIn from "../ui/FadeIn.jsx";
import Stars from "../ui/Stars.jsx";
import { testimonials } from "../../data/testimonials.js";

function TestimonialGrid() {
  return (
    <div className="cards-row" style={{
      display: "flex", gap: 20, maxWidth: 960, margin: "0 auto",
      padding: "0 var(--section-px)",
    }}>
      {testimonials.map((t, i) => (
        <div key={i} style={{
          flex: 1,
          background: "var(--color-surface-glass)",

          border: "1px solid var(--color-border)",
          borderRadius: 18, padding: "28px 26px 26px",
          boxShadow: "var(--shadow-card)",
          display: "flex", flexDirection: "column",
          transition: "border-color 0.3s ease, background 0.3s ease",
        }}>
          <Stars />
          <p style={{
            fontSize: 16, lineHeight: 1.65, color: "var(--color-text-muted)",
            margin: "0 0 24px", flex: 1,
          }}>"{t.quote}"</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={t.avatar}
              alt={t.name}
              width={38}
              height={38}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "var(--pill-bg)",
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-faint)" }}>{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ scrollMarginTop: 80,
      position: "relative", zIndex: 10,
      padding: "var(--section-py) 0 var(--section-py-sm)",
      overflow: "hidden",
    }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 48, padding: "0 var(--section-px)" }}>
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
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Testimonials
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--color-text-primary)",
            margin: "0 0 16px",
          }}>Don't take our word for it</h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
            maxWidth: 520, margin: "0 auto",
          }}>
            Here's what our clients have to say about working with QR8.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <TestimonialGrid />
      </FadeIn>
    </section>
  );
}
