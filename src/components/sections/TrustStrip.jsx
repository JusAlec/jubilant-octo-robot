import Counter from "../ui/Counter.jsx";
import { techLogos } from "../../data/techLogos.jsx";

export default function TrustStrip() {
  return (
    <section style={{
      position: "relative", zIndex: 10,
      borderTop: "1px solid var(--divider)",
      borderBottom: "1px solid var(--divider)",
      background: "var(--color-surface-glass)",
    }}>
      <div className="trust-stats" style={{
        maxWidth: "var(--container-max-width)", margin: "0 auto",
        padding: "32px var(--section-px) 20px",
        display: "flex", justifyContent: "space-around", alignItems: "center",
        flexWrap: "wrap", gap: 24,
      }}>
        {[
          { value: <Counter to={10} suffix="+" />, label: "Projects Delivered" },
          { value: "5.0", label: "Average Rating" },
          { value: "14-Day", label: "Turnaround" },
          { value: "100%", label: "Satisfaction" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center", minWidth: 120 }}>
            <div style={{
              fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)",
              letterSpacing: "-0.03em", lineHeight: 1,
            }}>{stat.value}</div>
            <div style={{
              fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)",
              marginTop: 6,
            }}>{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Built with tech logos */}
      <div style={{
        maxWidth: "var(--container-max-width)", margin: "0 auto",
        padding: "0 var(--section-px) 28px",
      }}>
        <div className="tech-logos" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 28, flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: "var(--color-text-faint)",
            textTransform: "uppercase", letterSpacing: "0.06em",
            marginRight: 4,
          }}>Built with</span>
          {techLogos.map((tech) => (
            <div
              key={tech.name}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                opacity: 0.65,
                transition: "opacity 0.2s ease",
              }}
              title={tech.name}
            >
              {tech.svg}
              <span style={{
                fontSize: 12, fontWeight: 500,
                color: "var(--color-text-faint)",
              }}>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
