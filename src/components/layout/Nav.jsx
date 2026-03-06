import { useState } from "react";
import ThemeToggle from "../../ThemeToggle.jsx";
import { navLinks } from "../../data/navLinks.js";

export default function Nav({ onContact }) {
  const [navBtnHov, setNavBtnHov] = useState(false);
  const [navHov, setNavHov] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accentGrad = "var(--accent-gradient)";

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <>
      <nav aria-label="Main navigation" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <div className="nav-container" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px var(--nav-px)", maxWidth: "var(--container-max-width)", margin: "0 auto",
        }}>
          <a
            href="#"
            aria-label="QR8 — Back to top"
            style={{ display: "flex", alignItems: "baseline", gap: 0, cursor: "pointer", textDecoration: "none" }}
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <span style={{ fontSize: 25.5, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-primary)" }}>QR</span>
            <span style={{
              fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em",
              background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>8</span>
          </a>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {navLinks.map((l, i) => (
                <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); scrollTo(l.href.slice(1)); }} style={{
                  fontSize: 14, fontWeight: 500, textDecoration: "none",
                  color: navHov === i ? "var(--color-text-primary)" : "var(--color-text-muted)",
                  transition: "color 0.2s",
                }} onMouseEnter={() => setNavHov(i)} onMouseLeave={() => setNavHov(null)}>{l.label}</a>
              ))}
            </div>
            <ThemeToggle />
            <button className="nav-links" style={{
              padding: "9px 22px",
              background: navBtnHov ? "var(--nav-btn-bg-hover)" : "var(--nav-btn-bg)",
              color: "var(--color-text-primary)", border: "1px solid var(--nav-btn-border)",
              borderRadius: "var(--pill-radius)", fontSize: 14, fontWeight: 500,
              cursor: "pointer", transition: "background 0.2s, color 0.2s, border-color 0.2s",

            }} onMouseEnter={() => setNavBtnHov(true)} onMouseLeave={() => setNavBtnHov(false)}
              onClick={onContact}>
              Let's Talk
            </button>
            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                width: 40, height: 40, borderRadius: 10,
                background: "var(--nav-btn-bg)",
                border: "1px solid var(--nav-btn-border)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                {mobileOpen ? (
                  <><line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/></>
                ) : (
                  <><line x1="3" y1="5" x2="15" y2="5"/><line x1="3" y1="9" x2="15" y2="9"/><line x1="3" y1="13" x2="15" y2="13"/></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-nav-panel" role="dialog" aria-label="Navigation menu">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)" }}>QR</span>
                <span style={{ fontSize: 20, fontWeight: 700, background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>8</span>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "var(--pill-bg)", border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            {navLinks.map((l) => (
              <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); scrollTo(l.href.slice(1)); }}>{l.label}</a>
            ))}
            <button className="mobile-nav-cta" onClick={() => { setMobileOpen(false); onContact(); }}>
              Let's Talk
            </button>
          </div>
        </>
      )}
    </>
  );
}
