import { useState } from "react";
import BeforeAfterMockup from "../../BeforeAfterMockup.jsx";

export default function Hero({ onContact, onScrollTo }) {
  const [ctaHov, setCtaHov] = useState(false);
  const accentGrad = "var(--accent-gradient)";

  return (
    <section style={{
      position: "relative", zIndex: 10, maxWidth: "var(--container-max-width)", margin: "0 auto",
      padding: "var(--hero-pt) var(--section-px) var(--hero-pb)", display: "flex", flexDirection: "column",
      alignItems: "center", textAlign: "center",
    }}>
      {/* Status pill */}
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "7px 18px 7px 14px",
          background: "var(--color-surface-glass)",

          border: "1px solid var(--color-border)",
          borderRadius: "var(--pill-radius)", fontSize: 13, fontWeight: 500,
          color: "var(--color-text-secondary)",
        }}>
          <span aria-hidden="true" style={{
            width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
            boxShadow: "0 0 10px rgba(74,222,128,0.5)", animation: "pulse 2s ease-in-out infinite",
          }} />
          Now booking new projects
        </span>
      </div>

      <h1 style={{
        fontSize: "clamp(36px, 5.2vw, 64px)", fontWeight: 700,
        lineHeight: "var(--line-height-heading)", letterSpacing: "-0.04em",
        margin: "0 0 28px", maxWidth: 900, color: "var(--color-text-primary)",
      }}>
        Websites That Bring Customers{" "}
        <br />
        to Your Business.
      </h1>

      <p style={{
        fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.6,
        color: "var(--color-text-secondary)", maxWidth: 720, margin: "0 0 44px",
        letterSpacing: "-0.01em",
      }}>
        Your website should do more than look good — it should bring in customers.
        We design and build fast, modern sites that turn visitors into paying clients.
      </p>

      <div className="hero-buttons" style={{
        display: "flex", gap: 14, marginBottom: 72, flexWrap: "wrap", justifyContent: "center",
      }}>
        <button style={{
          padding: "15px 34px", background: accentGrad,
          color: "#fff", border: "none", borderRadius: "var(--pill-radius)",
          fontSize: 16, fontWeight: 600, cursor: "pointer",
          letterSpacing: "-0.01em", transition: "box-shadow 0.3s ease, transform 0.3s ease",
          boxShadow: ctaHov ? "var(--shadow-accent-hover)" : "var(--shadow-accent)",
          transform: ctaHov ? "translateY(-2px)" : "translateY(0)",
        }} onMouseEnter={() => setCtaHov(true)} onMouseLeave={() => setCtaHov(false)}
          onClick={onContact}>
          Get Started
        </button>
        <button style={{
          padding: "15px 34px", background: "transparent", color: "var(--color-text-secondary)",
          border: "1px solid var(--color-border)", borderRadius: "var(--pill-radius)", fontSize: 16, fontWeight: 500,
          cursor: "pointer", transition: "border-color 0.25s, color 0.25s",

          display: "flex", alignItems: "center", gap: 8,
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-border-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
          onClick={() => onScrollTo("pricing")}
        >
          See Pricing
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Before/After Device Mockup */}
      <BeforeAfterMockup />
    </section>
  );
}
