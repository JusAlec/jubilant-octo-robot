import { useEffect, useRef, useState, useCallback } from "react";

const WEB3FORMS_KEY = "daa54b6b-5e5d-4154-aa9a-bf685e720ecf";

// Module-level style objects -- created once, never recreated on re-render
const inputStyle = {
  width: "100%", padding: "12px 16px",
  background: "var(--input-bg)",
  border: "1px solid var(--input-border)",
  borderRadius: 12, fontSize: 14, color: "var(--color-text-primary)",
  outline: "none", transition: "border-color 0.2s",
  fontFamily: "inherit",
};
const errorInputStyle = { ...inputStyle, borderColor: "#dc2626" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.02em" };
const fieldErrorStyle = { fontSize: 11, color: "#dc2626", marginTop: 4 };
const selectStyle = { ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6l4 4 4-4' stroke='rgba(107,107,107,0.6)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" };
const textareaStyle = { ...inputStyle, resize: "vertical", minHeight: 120 };

export default function ContactModal({ selectedPackage, onPackageChange, onClose }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "", email: "", company: "", phone: "", website: "", details: "",
  });

  // Focus trap + Escape -- runs ONCE on mount, never re-runs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") { onCloseRef.current(); return; }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
    // Auto-focus first input on mount
    const firstInput = panelRef.current?.querySelector("input");
    if (firstInput) firstInput.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (form.phone && !/^[\d\s()+-]{7,}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (form.website && !/^https?:\/\/.+/.test(form.website) && form.website.trim()) {
      newErrors.website = "URL must start with http:// or https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New QR8 inquiry from ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          company: form.company || "Not provided",
          phone: form.phone || "Not provided",
          website: form.website || "Not provided",
          package: selectedPackage || "Not sure yet",
          message: form.details || "No details provided",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

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
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 640,
          background: "var(--modal-bg)",
          border: "1px solid var(--modal-border)",
          borderRadius: 24,
          padding: "40px 36px 36px",
          boxShadow: "var(--shadow-card-hover)",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          marginBottom: 28,
        }}>
          <div>
            <h2 id="contact-modal-title" style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              {status === "success" ? "Message sent!" : "Let's talk about your project"}
            </h2>
            {status !== "success" && (
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", margin: 0 }}>We'll get back to you within 24 hours.</p>
            )}
          </div>
          <button
            aria-label="Close dialog"
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "var(--pill-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, color 0.2s", flexShrink: 0, marginLeft: 12,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nav-btn-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--pill-bg)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Success state */}
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--color-accent-soft)",
              border: "1px solid var(--color-accent-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 8px" }}>
              Thanks, {form.name.split(" ")[0]}!
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--color-text-muted)", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              We've received your message and will get back to you within 24 hours. Check your inbox at <strong style={{ color: "var(--color-text-secondary)" }}>{form.email}</strong>.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: "13px 32px",
                background: "var(--nav-btn-bg)",
                color: "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--pill-radius)", fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "background 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nav-btn-bg-hover)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--nav-btn-bg)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}
            >Close</button>
          </div>
        ) : (
          /* Form */
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Error banner */}
            {status === "error" && (
              <div style={{
                padding: "12px 16px",
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                borderRadius: 12,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke="#dc2626" strokeWidth="1.5" opacity="0.5"/>
                  <path d="M9 5.5v4M9 12h.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 13, color: "#dc2626" }}>{errorMsg}</span>
              </div>
            )}

            <div className="form-row" style={{ display: "flex", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="contact-name" style={labelStyle}>Full Name <span style={{ color: "var(--color-accent)" }}>*</span></label>
                <input
                  className="modal-input"
                  id="contact-name" type="text" placeholder="Your full name" required
                  value={form.name} onChange={(e) => updateField("name", e.target.value)}
                  style={errors.name ? errorInputStyle : inputStyle}
                />
                {errors.name && <div style={fieldErrorStyle}>{errors.name}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="contact-email" style={labelStyle}>Email <span style={{ color: "var(--color-accent)" }}>*</span></label>
                <input
                  className="modal-input"
                  id="contact-email" type="email" placeholder="you@company.com" required
                  value={form.email} onChange={(e) => updateField("email", e.target.value)}
                  style={errors.email ? errorInputStyle : inputStyle}
                />
                {errors.email && <div style={fieldErrorStyle}>{errors.email}</div>}
              </div>
            </div>
            <div className="form-row" style={{ display: "flex", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="contact-company" style={labelStyle}>Company Name</label>
                <input
                  className="modal-input"
                  id="contact-company" type="text" placeholder="Your company"
                  value={form.company} onChange={(e) => updateField("company", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="contact-phone" style={labelStyle}>Phone Number</label>
                <input
                  className="modal-input"
                  id="contact-phone" type="tel" placeholder="(555) 000-0000"
                  value={form.phone} onChange={(e) => updateField("phone", e.target.value)}
                  style={errors.phone ? errorInputStyle : inputStyle}
                />
                {errors.phone && <div style={fieldErrorStyle}>{errors.phone}</div>}
              </div>
            </div>
            <div className="form-row" style={{ display: "flex", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="contact-website" style={labelStyle}>Current Website</label>
                <input
                  className="modal-input"
                  id="contact-website" type="url" placeholder="https://yoursite.com (if any)"
                  value={form.website} onChange={(e) => updateField("website", e.target.value)}
                  style={errors.website ? errorInputStyle : inputStyle}
                />
                {errors.website && <div style={fieldErrorStyle}>{errors.website}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="contact-package" style={labelStyle}>Package</label>
                <select
                  className="modal-input"
                  id="contact-package"
                  value={selectedPackage}
                  onChange={(e) => onPackageChange(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Not sure yet</option>
                  <option value="standard">Standard — $250</option>
                  <option value="premium">Premium — $1,000</option>
                  <option value="custom">Custom — $1,500+</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="contact-details" style={labelStyle}>Project Details</label>
              <textarea
                className="modal-input"
                id="contact-details"
                placeholder="Tell us about your project — goals, timeline, budget, anything helpful..."
                rows={5}
                value={form.details} onChange={(e) => updateField("details", e.target.value)}
                style={textareaStyle}
              />
            </div>
            <button
              disabled={status === "submitting"}
              onClick={handleSubmit}
              style={{
                padding: "14px 0", width: "100%", marginTop: 4,
                background: status === "submitting" ? "var(--color-text-muted)" : "var(--accent-gradient)",
                color: "#fff", border: "none",
                borderRadius: "var(--pill-radius)", fontSize: 15, fontWeight: 600,
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                transition: "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
                boxShadow: status === "submitting" ? "none" : "var(--shadow-accent)",
                opacity: status === "submitting" ? 0.7 : 1,
              }}
              onMouseEnter={(e) => { if (status !== "submitting") { e.currentTarget.style.boxShadow = "var(--shadow-accent-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={(e) => { if (status !== "submitting") { e.currentTarget.style.boxShadow = "var(--shadow-accent)"; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              {status === "submitting" ? "Sending..." : status === "error" ? "Try Again" : "Send Message"}
            </button>
            <p style={{ fontSize: 12, color: "var(--color-text-faint)", textAlign: "center", margin: 0 }}>
              No spam. No mailing list. Just a real reply from a real person.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
