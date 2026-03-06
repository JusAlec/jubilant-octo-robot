// ─── CSS-Rendered Portfolio Site Previews ───
// Mini-website renderings for the portfolio carousel.
// No external images required — pure CSS/React.

// Solace Wellness — calm wellness studio with booking
export function SolaceWellnessPreview() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#FAFAF9",
      fontFamily: "Inter, -apple-system, sans-serif",
      fontSize: 8,
      overflow: "hidden",
    }}>
      {/* Nav */}
      <div style={{
        padding: "8px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(120,80,200,0.08)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#5B21B6", letterSpacing: "-0.02em" }}>
          Solace Wellness
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Classes", "Schedule", "About"].map((item) => (
            <span key={item} style={{ fontSize: 7, color: "#635C57", fontWeight: 500 }}>{item}</span>
          ))}
          <span style={{
            fontSize: 7, fontWeight: 600, color: "#fff",
            background: "#7C3AED", padding: "3px 8px", borderRadius: 6,
          }}>Book Now</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        padding: "16px 14px 12px",
        background: "linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(34,211,238,0.04) 100%)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px",
          background: "rgba(139,92,246,0.08)",
          borderRadius: 20,
          marginBottom: 8,
        }}>
          <span style={{ color: "#7C3AED", fontSize: 7 }}>&#10024;</span>
          <span style={{ fontSize: 6.5, color: "#635C57", fontWeight: 500 }}>AI-Powered Class Matching</span>
        </div>

        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1C1917",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginBottom: 6,
        }}>
          Find Your Perfect Class
        </div>
        <div style={{
          fontSize: 8,
          color: "#57534E",
          lineHeight: 1.5,
          marginBottom: 10,
          maxWidth: 220,
        }}>
          Yoga, pilates, meditation & more. Our AI matches you to classes based on your goals and schedule.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 600, color: "#fff",
            background: "#7C3AED", padding: "5px 12px", borderRadius: 8,
            boxShadow: "0 1px 3px rgba(124,58,237,0.3)",
          }}>Take the Quiz</span>
          <span style={{
            fontSize: 7.5, fontWeight: 500, color: "#57534E",
            border: "1px solid rgba(28,25,23,0.1)", padding: "5px 12px", borderRadius: 8,
          }}>View Schedule</span>
        </div>
      </div>

      {/* Class cards */}
      <div style={{
        padding: "8px 14px",
        display: "flex",
        gap: 6,
      }}>
        {[
          { emoji: "\uD83E\uDDD8", title: "Vinyasa Flow", time: "Mon/Wed 9am", spots: "3 spots left" },
          { emoji: "\uD83E\uDDD1\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1", title: "Power Pilates", time: "Tue/Thu 7am", spots: "5 spots left" },
          { emoji: "\uD83D\uDE4F", title: "Guided Meditation", time: "Daily 6pm", spots: "Open" },
        ].map((cls) => (
          <div key={cls.title} style={{
            flex: 1,
            padding: "8px",
            background: "#FFFFFF",
            border: "1px solid rgba(139,92,246,0.08)",
            borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}>
            <div style={{ fontSize: 12, marginBottom: 3 }}>{cls.emoji}</div>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#1C1917", marginBottom: 2 }}>{cls.title}</div>
            <div style={{ fontSize: 6.5, color: "#635C57", marginBottom: 2 }}>{cls.time}</div>
            <div style={{ fontSize: 6, color: "#7C3AED", fontWeight: 600 }}>{cls.spots}</div>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div style={{
        padding: "6px 14px",
        display: "flex",
        justifyContent: "space-around",
        borderTop: "1px solid rgba(139,92,246,0.08)",
        background: "rgba(139,92,246,0.03)",
      }}>
        {[
          { val: "140%", label: "More Bookings" },
          { val: "0.8s", label: "Load Time" },
          { val: "#1", label: "Local SEO" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED" }}>{stat.val}</div>
            <div style={{ fontSize: 6, color: "#635C57" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Brick & Vine — Italian restaurant with menu & reservations
export function BrickVinePreview() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#FFFBF5",
      fontFamily: "Inter, -apple-system, sans-serif",
      fontSize: 8,
      overflow: "hidden",
    }}>
      {/* Nav */}
      <div style={{
        padding: "8px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(180,83,9,0.08)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", letterSpacing: "-0.02em" }}>
          Brick & Vine
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Menu", "About", "Events"].map((item) => (
            <span key={item} style={{ fontSize: 7, color: "#635C57", fontWeight: 500 }}>{item}</span>
          ))}
          <span style={{
            fontSize: 7, fontWeight: 600, color: "#fff",
            background: "#B45309", padding: "3px 8px", borderRadius: 6,
          }}>Reserve</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{
        padding: "14px 14px 10px",
        background: "linear-gradient(135deg, rgba(180,83,9,0.04) 0%, rgba(239,68,68,0.03) 100%)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px",
          background: "rgba(180,83,9,0.06)",
          borderRadius: 20,
          marginBottom: 6,
        }}>
          <span style={{ color: "#f59e0b", fontSize: 7 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span style={{ fontSize: 6.5, color: "#635C57", fontWeight: 500 }}>200+ 5-Star Reviews</span>
        </div>

        <div style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1C1917",
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          marginBottom: 6,
        }}>
          Authentic Italian, Made Fresh Daily
        </div>
        <div style={{
          fontSize: 8,
          color: "#57534E",
          lineHeight: 1.5,
          marginBottom: 8,
          maxWidth: 220,
        }}>
          Handmade pasta, wood-fired pizza, and wines from small Italian producers. Family-owned since 2015.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 600, color: "#fff",
            background: "#B45309", padding: "5px 12px", borderRadius: 8,
            boxShadow: "0 1px 3px rgba(180,83,9,0.3)",
          }}>Make a Reservation</span>
          <span style={{
            fontSize: 7.5, fontWeight: 500, color: "#57534E",
            border: "1px solid rgba(28,25,23,0.1)", padding: "5px 12px", borderRadius: 8,
          }}>See Menu</span>
        </div>
      </div>

      {/* Menu preview */}
      <div style={{
        padding: "8px 14px",
        display: "flex",
        gap: 6,
      }}>
        {[
          { emoji: "\uD83C\uDF5D", title: "Cacio e Pepe", price: "$18", tag: "Popular" },
          { emoji: "\uD83C\uDF55", title: "Margherita DOP", price: "$16", tag: "Classic" },
          { emoji: "\uD83E\uDD69", title: "Osso Buco", price: "$34", tag: "Chef's Pick" },
        ].map((item) => (
          <div key={item.title} style={{
            flex: 1,
            padding: "8px",
            background: "#FFFFFF",
            border: "1px solid rgba(180,83,9,0.06)",
            borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 12 }}>{item.emoji}</span>
              <span style={{
                fontSize: 5.5, fontWeight: 600, color: "#B45309",
                background: "rgba(180,83,9,0.06)", padding: "1px 5px", borderRadius: 4,
              }}>{item.tag}</span>
            </div>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#1C1917", marginBottom: 2 }}>{item.title}</div>
            <div style={{ fontSize: 7, color: "#B45309", fontWeight: 600 }}>{item.price}</div>
          </div>
        ))}
      </div>

      {/* Reservation strip */}
      <div style={{
        padding: "6px 14px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid rgba(180,83,9,0.06)",
        background: "rgba(180,83,9,0.02)",
      }}>
        {[
          { val: "200%", label: "Traffic Growth" },
          { val: "2x", label: "Weekday Bookings" },
          { val: "98", label: "Lighthouse" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#B45309" }}>{stat.val}</div>
            <div style={{ fontSize: 6, color: "#635C57" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
