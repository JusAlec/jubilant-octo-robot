import { useState, useEffect } from "react";

export default function AuroraMesh() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "var(--aurora-base)",
        transition: "background 0.5s ease",
      }} />
      {isDark && (
        <>
          <div style={{
            position: "absolute", width: 800, height: 800, left: "-10%", top: "-30%",
            background: `radial-gradient(circle, var(--aurora-blob-1) 0%, transparent 65%)`,
            filter: "blur(80px)", animation: "drift1 18s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 700, height: 700, right: "-5%", top: "10%",
            background: `radial-gradient(circle, var(--aurora-blob-2) 0%, transparent 65%)`,
            filter: "blur(80px)", animation: "drift2 22s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 0, opacity: "var(--aurora-noise-opacity)",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }} />
          <div style={{ position: "absolute", inset: 0, opacity: "var(--aurora-grid-opacity)" }}>
            <svg width="100%" height="100%"><defs>
              <pattern id="gr" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="var(--aurora-grid-color)" strokeWidth="0.5"/>
              </pattern>
            </defs><rect width="100%" height="100%" fill="url(#gr)"/></svg>
          </div>
        </>
      )}
    </div>
  );
}
