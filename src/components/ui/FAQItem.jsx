import { useState } from "react";

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "1px solid var(--color-border)",
    }}>
      <button
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "20px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span style={{
          fontSize: 16, fontWeight: 600, color: "var(--color-text-primary)",
          textAlign: "left",
        }}>{question}</span>
        <svg
          aria-hidden="true"
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          style={{
            flexShrink: 0, marginLeft: 16,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <path d="M5 7.5l5 5 5-5" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        maxHeight: open ? 300 : 0,
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <p style={{
          fontSize: 16, lineHeight: 1.65, color: "var(--color-text-muted)",
          margin: "0 0 20px", maxWidth: 680,
        }}>{answer}</p>
      </div>
    </div>
  );
}
