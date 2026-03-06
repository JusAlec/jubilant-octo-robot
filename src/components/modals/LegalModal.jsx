import { useEffect, useRef } from "react";

export default function LegalModal({ type, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const closeBtn = panelRef.current?.querySelector("button");
    if (closeBtn) closeBtn.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "var(--color-overlay)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 40,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        ref={panelRef}
        className="legal-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 600, maxHeight: "80vh",
          background: "var(--modal-bg)",

          border: "1px solid var(--modal-border)",
          borderRadius: 24,
          padding: "36px 32px 32px",
          boxShadow: "var(--shadow-card-hover)",
          animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <h2 id="legal-modal-title" style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
            {type === "privacy" ? "Privacy Policy" : "Terms of Service"}
          </h2>
          <button
            aria-label="Close dialog"
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--pill-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, color 0.2s", flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nav-btn-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--pill-bg)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.75, color: "var(--color-text-muted)" }}>
          <p style={{ color: "var(--color-text-faint)", marginBottom: 20 }}>Last updated: January 1, 2025</p>
          {type === "privacy" ? (<>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>1. Information We Collect</strong><br/>We collect information you voluntarily provide through our contact form, including your name, email address, company name, phone number, and project details. We also collect standard analytics data such as pages visited, browser type, and device information to improve our services.</p>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>2. How We Use Your Information</strong><br/>Your information is used solely to respond to your inquiries, provide project proposals, deliver services, and communicate about ongoing projects. We do not sell, trade, or rent your personal information to third parties.</p>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>3. Data Security</strong><br/>We implement industry-standard security measures to protect your personal information. All form submissions are encrypted in transit via TLS/SSL. We retain your data only as long as necessary to fulfill the purposes described in this policy.</p>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>4. Cookies & Analytics</strong><br/>We use anonymized analytics to understand how visitors interact with our website. No personally identifiable information is collected through cookies. You may disable cookies in your browser settings at any time.</p>
            <p style={{ marginBottom: 0 }}><strong style={{ color: "var(--color-text-primary)" }}>5. Contact</strong><br/>If you have questions about this privacy policy or wish to request deletion of your data, please contact us at hello@qr8.dev.</p>
          </>) : (<>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>1. Services</strong><br/>QR8 provides web design, development, and related digital services as agreed upon in individual project proposals. All project scopes, timelines, and deliverables are defined during our consultation process and documented in a project agreement prior to commencement of work.</p>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>2. Payment Terms</strong><br/>Standard and Premium packages are billed at fixed rates as listed on our website. Custom projects are quoted individually. A 50% deposit is required to begin work, with the remaining balance due upon project completion. All payments are non-refundable once work has commenced.</p>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>3. Intellectual Property</strong><br/>Upon full payment, clients receive full ownership of all custom code, designs, and content created specifically for their project. QR8 retains the right to showcase completed work in our portfolio unless otherwise agreed in writing.</p>
            <p style={{ marginBottom: 16 }}><strong style={{ color: "var(--color-text-primary)" }}>4. Post-Launch Support</strong><br/>All packages include the post-launch support period specified in the project agreement. Additional support beyond this period is available through our optional retainer plans. Emergency fixes for critical bugs are addressed as a priority regardless of retainer status.</p>
            <p style={{ marginBottom: 0 }}><strong style={{ color: "var(--color-text-primary)" }}>5. Limitation of Liability</strong><br/>QR8's total liability for any claim arising from our services shall not exceed the total amount paid for the project in question. We are not liable for indirect, incidental, or consequential damages including lost revenue or data. For questions about these terms, contact us at hello@qr8.dev.</p>
          </>)}
        </div>
      </div>
    </div>
  );
}
