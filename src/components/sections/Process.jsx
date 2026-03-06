import FadeIn from "../ui/FadeIn.jsx";
import { processSteps } from "../../data/processSteps.js";

export default function Process() {
  return (
    <section id="process" style={{ scrollMarginTop: 80,
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
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Process
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--color-text-primary)",
            margin: "0 0 16px",
          }}>Three Steps to Your New Website</h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
            maxWidth: 560, margin: "0 auto",
          }}>
            No 47-slide decks. No month-long timelines. Just a straightforward path from idea to launch.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="cards-row" style={{
          display: "flex", gap: 20, maxWidth: 960, margin: "0 auto",
        }}>
          {processSteps.map((step) => (
            <div
              key={step.number}
              style={{
                flex: 1,
                background: "var(--color-surface-glass)",

                border: "1px solid var(--color-border)",
                borderRadius: 18,
                padding: "28px 24px",
                boxShadow: "var(--shadow-card)",
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "var(--color-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: "#fff",
                marginBottom: 16,
                boxShadow: "var(--shadow-accent)",
              }}>
                {step.number}
              </div>

              <div style={{
                fontSize: 18, fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: 8,
              }}>{step.title}</div>

              <p style={{
                fontSize: 16, lineHeight: 1.65, color: "var(--color-text-muted)",
                margin: "0 0 20px", flex: 1,
              }}>{step.desc}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {step.deliverables.map((d, j) => (
                  <span key={j} style={{
                    padding: "4px 12px",
                    background: "var(--pill-bg)",
                    border: "1px solid var(--pill-border)",
                    borderRadius: "var(--pill-radius)", fontSize: 11, fontWeight: 500,
                    color: "var(--color-text-muted)",
                  }}>{d}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
