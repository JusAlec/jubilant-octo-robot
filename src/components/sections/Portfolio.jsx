import { useState, useCallback, useEffect } from "react";
import FadeIn from "../ui/FadeIn.jsx";
import { projects } from "../../data/projects.jsx";

export default function Portfolio() {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const p = projects[featuredIdx];

  const goPrev = useCallback(() => setFeaturedIdx((i) => (i - 1 + projects.length) % projects.length), []);
  const goNext = useCallback(() => setFeaturedIdx((i) => (i + 1) % projects.length), []);

  useEffect(() => {
    const handleKey = (e) => {
      const section = document.getElementById("portfolio");
      if (!section || !section.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [goPrev, goNext]);

  return (
    <section id="portfolio" style={{ scrollMarginTop: 80,
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
              <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
            </svg>
            Portfolio
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--color-text-primary)",
            margin: "0 0 16px",
          }}>Real Results for Real Businesses</h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
            maxWidth: 680, margin: "0 auto",
          }}>
            Every project starts with a real business problem and ends with measurable results. Here's what we've been building.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
          <div
            key={featuredIdx}
            aria-live="polite"
            aria-atomic="true"
            style={{
              background: "var(--color-surface-glass)",

              border: "1px solid var(--color-border)",
              borderRadius: "var(--card-radius-lg)",
              boxShadow: "var(--shadow-card)",
              overflow: "hidden",
              animation: "fadeIn 0.4s ease",
            }}
          >
            {/* Project preview */}
            <div style={{ position: "relative", overflow: "hidden" }}>
              <div style={{
                height: 32, background: "var(--color-surface)",
                borderBottom: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", padding: "0 12px", gap: 6,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-border-hover)" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-border-hover)" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-border-hover)" }} />
                <div style={{
                  flex: 1, height: 18, marginLeft: 8,
                  background: "var(--pill-bg)",
                  borderRadius: 6, display: "flex", alignItems: "center",
                  padding: "0 10px",
                }}>
                  <span style={{ fontSize: 10, color: "var(--color-text-faint)" }}>{p.url}</span>
                </div>
              </div>
              {p.image ? (
                <img
                  src={p.image}
                  alt={`${p.name} website`}
                  width={2560}
                  height={1229}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              ) : p.Preview ? (
                <div style={{ height: 268, overflow: "hidden" }}>
                  <p.Preview />
                </div>
              ) : (
                <div style={{
                  height: 268,
                  background: `linear-gradient(135deg, ${p.gradient})`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <div style={{ width: "60%", height: 8, borderRadius: 4, background: "var(--color-border)" }} />
                  <div style={{ width: "40%", height: 6, borderRadius: 3, background: "var(--pill-bg)" }} />
                  <div style={{ width: "30%", height: 24, borderRadius: 12, background: "var(--pill-bg)", marginTop: 8 }} />
                </div>
              )}
              {/* Counter badge */}
              <div style={{
                position: "absolute", top: 44, left: 12,
                padding: "5px 14px",
                background: "var(--color-accent)",
                borderRadius: "var(--pill-radius)", fontSize: 11, fontWeight: 700,
                color: "#fff", letterSpacing: "0.03em",
              }}>{featuredIdx + 1} / {projects.length}</div>
            </div>
            {/* Info */}
            <div style={{ padding: "28px 32px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {p.tags.map((tag, ti) => (
                  <span key={ti} style={{
                    padding: "4px 12px", background: tag.bg,
                    border: `1px solid ${tag.border}`,
                    borderRadius: "var(--pill-radius)", fontSize: 11, fontWeight: 600, color: tag.text,
                  }}>{tag.label}</span>
                ))}
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{p.name}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-text-muted)", margin: "0 0 20px", maxWidth: 600 }}>{p.desc}</p>
              {p.stats && (
                <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
                  {p.stats.map((s, si) => (
                    <div key={si}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>{s.val}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-faint)", marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.tech.map((t, i) => (
                  <span key={i} style={{
                    padding: "4px 11px",
                    background: "var(--pill-bg)",
                    border: "1px solid var(--pill-border)",
                    borderRadius: "var(--pill-radius)", fontSize: 11, fontWeight: 500,
                    color: "var(--color-text-muted)",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            className="portfolio-nav-btn portfolio-nav-prev"
            aria-label="Previous project"
            onClick={goPrev}
            style={{
              position: "absolute", left: -20, top: 180, transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: 12,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              color: "var(--color-text-primary)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-hover)"; e.currentTarget.style.boxShadow = "var(--shadow-card-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            className="portfolio-nav-btn portfolio-nav-next"
            aria-label="Next project"
            onClick={goNext}
            style={{
              position: "absolute", right: -20, top: 180, transform: "translateY(-50%)",
              width: 40, height: 40, borderRadius: 12,
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
              color: "var(--color-text-primary)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-hover)"; e.currentTarget.style.boxShadow = "var(--shadow-card-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-surface)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {projects.map((_, di) => (
              <button key={di} aria-label={`View project ${di + 1}: ${projects[di].name}`} onClick={() => setFeaturedIdx(di)} style={{
                width: di === featuredIdx ? 24 : 8, height: 8,
                borderRadius: 4, border: "none", cursor: "pointer",
                background: di === featuredIdx ? "var(--color-accent)" : "var(--color-border-hover)",
                transition: "width 0.3s ease, background 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
