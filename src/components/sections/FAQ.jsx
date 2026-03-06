import FadeIn from "../ui/FadeIn.jsx";
import FAQItem from "../ui/FAQItem.jsx";
import { faqData } from "../../data/faqData.js";

export default function FAQ() {
  return (
    <section id="faq" style={{ scrollMarginTop: 80,
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
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
            FAQ
          </div>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
            letterSpacing: "-0.03em", color: "var(--color-text-primary)",
            margin: "0 0 16px",
          }}>Common Questions</h2>
          <p style={{
            fontSize: 18, lineHeight: 1.6, color: "var(--color-text-muted)",
            maxWidth: 520, margin: "0 auto",
          }}>
            Everything you need to know before getting started.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {faqData.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
