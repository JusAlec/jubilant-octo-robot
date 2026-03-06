// ─── Before/After Website Transformation Mockup ───
// Pure CSS/React rendered mini-websites inside device frames.
// No external images required.

import { useState } from "react";

export function BrowserFrame({ children, url, label, labelColor }) {
  return (
    <div style={{
      borderRadius: 12,
      overflow: "hidden",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      background: "var(--color-surface)",
      maxWidth: 420,
      width: "100%",
    }}>
      {/* Browser chrome */}
      <div style={{
        height: 28,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: 5,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-border-hover)" }} />
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-border-hover)" }} />
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-border-hover)" }} />
        <div style={{
          flex: 1, height: 16, marginLeft: 6,
          background: "var(--pill-bg)",
          borderRadius: 4,
          display: "flex", alignItems: "center",
          padding: "0 8px",
        }}>
          <span style={{ fontSize: 9, color: "var(--color-text-faint)", fontFamily: "var(--font-family)" }}>{url}</span>
        </div>
      </div>
      {/* Label badge */}
      {label && (
        <div style={{
          position: "relative",
        }}>
          <span style={{
            position: "absolute", top: 8, left: 8, zIndex: 2,
            padding: "3px 10px",
            background: labelColor || "var(--color-text-muted)",
            borderRadius: 6,
            fontSize: 10, fontWeight: 700, color: "#fff",
            letterSpacing: "0.03em", textTransform: "uppercase",
          }}>{label}</span>
        </div>
      )}
      {/* Website content */}
      <div style={{ height: 260, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Plumber (original) ───

function PlumberBefore() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#1a1a2e",
      fontFamily: "Georgia, 'Times New Roman', serif",
      color: "#d4d4d4",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(180deg, #16213e 0%, #0f3460 100%)",
        padding: "6px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #e94560",
      }}>
        <span style={{ fontSize: 11, fontWeight: "bold", color: "#e94560", fontFamily: "Impact, sans-serif", letterSpacing: "0.05em" }}>
          JOE'S PLUMBING
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {["Home", "About Us", "Services", "Gallery", "Reviews", "Blog", "Contact", "FAQ"].map((item) => (
            <span key={item} style={{ fontSize: 6.5, color: "#a0a0cc", textDecoration: "underline" }}>{item}</span>
          ))}
        </div>
      </div>
      <div style={{
        background: "linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)",
        padding: "14px 10px 10px",
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          width: "100%", height: 60,
          background: "linear-gradient(135deg, #2a2a4a 0%, #1a1a3e 50%, #2a2a4a 100%)",
          borderRadius: 2,
          marginBottom: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid #333355",
        }}>
          <span style={{ fontSize: 7, color: "#555577" }}>[ stock-photo-handshake.jpg ]</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: "bold", color: "#e94560",
          fontFamily: "Impact, sans-serif", textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 4,
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        }}>
          WELCOME TO OUR WEBSITE!!!
        </div>
        <div style={{ fontSize: 7, color: "#7777aa", lineHeight: 1.4, maxWidth: 200, margin: "0 auto 6px" }}>
          We have been serving the community since 1998. Call us today for all your plumbing needs!
        </div>
        <div style={{
          display: "inline-block", padding: "4px 12px",
          background: "linear-gradient(180deg, #e94560 0%, #c0392b 100%)",
          color: "#fff", fontSize: 7, fontWeight: "bold", borderRadius: 2,
          border: "1px solid #ff6b6b", textTransform: "uppercase",
          letterSpacing: "0.1em", boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}>
          CLICK HERE TO CALL NOW!!!
        </div>
      </div>
      <div style={{ padding: "6px 10px", display: "flex", gap: 6 }}>
        {[
          { title: "SERVICES", items: ["Drain Cleaning", "Pipe Repair", "Water Heaters", "Emergency 24/7"] },
          { title: "WHY CHOOSE US?", items: ["Licensed & Insured", "30+ Years Exp", "Free Estimates", "Best Prices!!"] },
        ].map((col) => (
          <div key={col.title} style={{
            flex: 1, background: "#16213e",
            border: "1px solid #333355", borderRadius: 2, padding: "5px 6px",
          }}>
            <div style={{
              fontSize: 7, fontWeight: "bold", color: "#ff6b82",
              textTransform: "uppercase", marginBottom: 3,
              borderBottom: "1px solid #333355", paddingBottom: 2,
            }}>{col.title}</div>
            {col.items.map((item) => (
              <div key={item} style={{ fontSize: 6, color: "#8888aa", marginBottom: 1.5 }}>* {item}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        background: "#0f3460", padding: "3px 10px",
        textAlign: "center", fontSize: 6, color: "#8a8ab0",
        borderTop: "1px solid #333355",
      }}>
        You are visitor #14,823 | Best viewed in Internet Explorer
      </div>
    </div>
  );
}

function PlumberAfter() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#F8FAFC",
      fontFamily: "Inter, -apple-system, sans-serif",
      color: "#0F172A",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em" }}>Joe's Plumbing</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Services", "About", "Reviews"].map((item) => (
            <span key={item} style={{ fontSize: 7, color: "#556275", fontWeight: 500 }}>{item}</span>
          ))}
          <span style={{
            fontSize: 7, fontWeight: 600, color: "#fff",
            background: "#2563EB", padding: "3px 8px", borderRadius: 6,
          }}>Get a Quote</span>
        </div>
      </div>
      <div style={{ padding: "18px 14px 14px", maxWidth: 280 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", background: "rgba(37,99,235,0.06)",
          borderRadius: 20, marginBottom: 8,
        }}>
          <span style={{ color: "#f59e0b", fontSize: 7 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span style={{ fontSize: 6.5, color: "#556275", fontWeight: 500 }}>Rated 5.0 by 120+ customers</span>
        </div>
        <div style={{
          fontSize: 16, fontWeight: 700, color: "#0F172A",
          lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 6,
        }}>Plumbing Done Right, Every Time</div>
        <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.5, marginBottom: 10 }}>
          Licensed plumbers serving your area for 25+ years. Fast response, fair pricing, guaranteed work.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 600, color: "#fff",
            background: "#2563EB", padding: "5px 12px", borderRadius: 8,
            boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
          }}>Schedule Service</span>
          <span style={{
            fontSize: 7.5, fontWeight: 500, color: "#475569",
            border: "1px solid rgba(15,23,42,0.1)", padding: "5px 12px", borderRadius: 8,
          }}>View Pricing</span>
        </div>
      </div>
      <div style={{ padding: "0 14px 10px", display: "flex", gap: 6 }}>
        {[
          { icon: "\uD83D\uDD27", title: "Emergency Repair", desc: "Same-day service" },
          { icon: "\u26A1", title: "Installation", desc: "Modern fixtures" },
          { icon: "\uD83D\uDEE0\uFE0F", title: "Maintenance", desc: "Prevent costly repairs" },
        ].map((card) => (
          <div key={card.title} style={{
            flex: 1, padding: "8px", background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.06)", borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}>
            <div style={{ fontSize: 12, marginBottom: 3 }}>{card.icon}</div>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{card.title}</div>
            <div style={{ fontSize: 6.5, color: "#556275" }}>{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Restaurant ───

function RestaurantBefore() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#2d0a0a",
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(180deg, #3d0c0c 0%, #1a0505 100%)",
        padding: "5px 10px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "2px solid #cc9933",
      }}>
        <span style={{ fontSize: 11, fontWeight: "bold", color: "#cc9933", fontFamily: "Palatino, serif", letterSpacing: "0.1em" }}>
          TONY'S TRATTORIA
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {["Home", "Menu", "Catering", "Gallery", "Directions", "Contact"].map((item) => (
            <span key={item} style={{ fontSize: 6.5, color: "#aa8866", textDecoration: "underline" }}>{item}</span>
          ))}
        </div>
      </div>
      {/* Cluttered menu page */}
      <div style={{
        padding: "8px 10px", textAlign: "center",
        background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"4\" height=\"4\"><rect width=\"4\" height=\"4\" fill=\"%231a0505\"/><rect width=\"1\" height=\"1\" fill=\"%23220808\"/></svg>')",
      }}>
        <div style={{
          fontSize: 11, fontWeight: "bold", color: "#cc9933",
          fontFamily: "Palatino, serif", letterSpacing: "0.15em",
          textTransform: "uppercase", marginBottom: 4,
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        }}>~ OUR MENU ~</div>
        <div style={{ fontSize: 6, color: "#886644", marginBottom: 6, fontStyle: "italic" }}>
          *Prices subject to change* | *Ask about daily specials*
        </div>
      </div>
      <div style={{ padding: "0 8px", display: "flex", gap: 4, fontSize: 6 }}>
        <div style={{
          flex: 1, background: "#1a0505", border: "1px solid #3d1515",
          borderRadius: 2, padding: "4px 5px",
        }}>
          <div style={{ fontSize: 7, fontWeight: "bold", color: "#cc9933", borderBottom: "1px solid #3d1515", paddingBottom: 2, marginBottom: 3 }}>APPETIZERS</div>
          {["Bruschetta.......$8", "Calamari.........$12", "Meatballs........$10", "Antipasto........$14"].map(item => (
            <div key={item} style={{ color: "#aa8866", marginBottom: 1.5, fontFamily: "Courier, monospace", fontSize: 5.5 }}>{item}</div>
          ))}
        </div>
        <div style={{
          flex: 1, background: "#1a0505", border: "1px solid #3d1515",
          borderRadius: 2, padding: "4px 5px",
        }}>
          <div style={{ fontSize: 7, fontWeight: "bold", color: "#cc9933", borderBottom: "1px solid #3d1515", paddingBottom: 2, marginBottom: 3 }}>PASTA</div>
          {["Spaghetti........$14", "Fettuccine.......$16", "Lasagna..........$18", "Ravioli..........$17"].map(item => (
            <div key={item} style={{ color: "#aa8866", marginBottom: 1.5, fontFamily: "Courier, monospace", fontSize: 5.5 }}>{item}</div>
          ))}
        </div>
        <div style={{
          flex: 1, background: "#1a0505", border: "1px solid #3d1515",
          borderRadius: 2, padding: "4px 5px",
        }}>
          <div style={{ fontSize: 7, fontWeight: "bold", color: "#cc9933", borderBottom: "1px solid #3d1515", paddingBottom: 2, marginBottom: 3 }}>ENTREES</div>
          {["Chicken Parm.....$22", "Veal Marsala.....$28", "Salmon...........$26", "Eggplant.........$18"].map(item => (
            <div key={item} style={{ color: "#aa8866", marginBottom: 1.5, fontFamily: "Courier, monospace", fontSize: 5.5 }}>{item}</div>
          ))}
        </div>
      </div>
      <div style={{
        padding: "4px 10px", textAlign: "center", fontSize: 6, color: "#664433",
        borderTop: "1px solid #3d1515", marginTop: 4,
      }}>
        Call (555) 867-5309 for reservations | Open Tue-Sun 5pm-10pm
      </div>
    </div>
  );
}

function RestaurantAfter() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#FFFBF5",
      fontFamily: "Inter, -apple-system, sans-serif",
      color: "#1C1917",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(180,83,9,0.08)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", letterSpacing: "-0.02em" }}>Tony's Trattoria</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Menu", "About", "Events"].map(item => (
            <span key={item} style={{ fontSize: 7, color: "#635C57", fontWeight: 500 }}>{item}</span>
          ))}
          <span style={{
            fontSize: 7, fontWeight: 600, color: "#fff",
            background: "#B45309", padding: "3px 8px", borderRadius: 6,
          }}>Reserve a Table</span>
        </div>
      </div>
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: "#1C1917",
          lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 4,
        }}>Tonight's Menu</div>
        <div style={{ fontSize: 7, color: "#635C57", marginBottom: 8 }}>Updated daily by Chef Tony</div>
      </div>
      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          { name: "Cacio e Pepe", desc: "Handmade tonnarelli, pecorino, black pepper", price: "$18", tag: "Popular" },
          { name: "Margherita DOP", desc: "San Marzano, fior di latte, fresh basil", price: "$16", tag: "" },
          { name: "Osso Buco", desc: "Braised veal shank, gremolata, risotto", price: "$34", tag: "Chef's Pick" },
        ].map(item => (
          <div key={item.name} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 10px", background: "#FFFFFF",
            border: "1px solid rgba(180,83,9,0.06)", borderRadius: 8,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 7.5, fontWeight: 600, color: "#1C1917" }}>{item.name}</span>
                {item.tag && <span style={{
                  fontSize: 5.5, fontWeight: 600, color: "#B45309",
                  background: "rgba(180,83,9,0.06)", padding: "1px 5px", borderRadius: 4,
                }}>{item.tag}</span>}
              </div>
              <div style={{ fontSize: 6.5, color: "#635C57", marginTop: 1 }}>{item.desc}</div>
            </div>
            <span style={{ fontSize: 8, fontWeight: 700, color: "#92400E" }}>{item.price}</span>
          </div>
        ))}
      </div>
      <div style={{
        margin: "8px 14px 0", padding: "8px 12px",
        background: "rgba(180,83,9,0.04)", borderRadius: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 7.5, fontWeight: 600, color: "#1C1917" }}>Reserve Tonight</div>
          <div style={{ fontSize: 6.5, color: "#635C57" }}>3 tables available for 7:30pm</div>
        </div>
        <span style={{
          fontSize: 7, fontWeight: 600, color: "#fff",
          background: "#B45309", padding: "4px 10px", borderRadius: 6,
        }}>Book Now</span>
      </div>
    </div>
  );
}

// ─── Salon / Spa ───

function SalonBefore() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#fff0f5",
      fontFamily: "Comic Sans MS, cursive, sans-serif",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        background: "linear-gradient(180deg, #ff69b4 0%, #ff1493 100%)",
        padding: "6px 10px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
          ~* Glamour Nails & Spa *~
        </span>
        <div style={{ display: "flex", gap: 5 }}>
          {["Home", "Services", "Prices", "Gallery", "Contact"].map(item => (
            <span key={item} style={{ fontSize: 6.5, color: "#ffe4e9", textDecoration: "underline" }}>{item}</span>
          ))}
        </div>
      </div>
      <div style={{
        padding: "10px", textAlign: "center",
        background: "linear-gradient(135deg, #ffe4ec 0%, #ffd6e7 50%, #ffe4ec 100%)",
      }}>
        <div style={{
          fontSize: 12, fontWeight: "bold", color: "#ff1493",
          marginBottom: 4, fontFamily: "Papyrus, fantasy, serif",
        }}>
          Welcome to Our Salon!
        </div>
        <div style={{ fontSize: 7, color: "#cc6699", marginBottom: 6, lineHeight: 1.4 }}>
          We offer the BEST nail services in town!! Walk-ins welcome!! Gift certificates available!!
        </div>
        <div style={{
          display: "inline-block", padding: "4px 10px",
          background: "#ff69b4", color: "#fff", fontSize: 7, fontWeight: "bold",
          borderRadius: 20, border: "2px solid #ff1493",
        }}>CALL NOW: (555) 234-5678</div>
      </div>
      <div style={{ padding: "6px 8px", display: "flex", gap: 4 }}>
        <div style={{
          flex: 1, background: "#ffe4ec", border: "2px dashed #ff69b4",
          borderRadius: 4, padding: "5px", textAlign: "center",
        }}>
          <div style={{ fontSize: 7, fontWeight: "bold", color: "#ff1493", marginBottom: 3 }}>SPECIALS!!!</div>
          {["Gel Manicure $35", "Pedicure $45", "Full Set $55", "Fill-in $30"].map(item => (
            <div key={item} style={{ fontSize: 6, color: "#cc6699", marginBottom: 1.5 }}>{item}</div>
          ))}
        </div>
        <div style={{
          flex: 1, background: "#ffe4ec", border: "2px dashed #ff69b4",
          borderRadius: 4, padding: "5px", textAlign: "center",
        }}>
          <div style={{ fontSize: 7, fontWeight: "bold", color: "#ff1493", marginBottom: 3 }}>HOURS</div>
          {["Mon-Fri: 9am-7pm", "Saturday: 9am-6pm", "Sunday: 11am-5pm", ""].map((item, i) => (
            <div key={i} style={{ fontSize: 6, color: "#cc6699", marginBottom: 1.5 }}>{item || "\u00A0"}</div>
          ))}
          <div style={{ fontSize: 6, color: "#ff69b4", fontWeight: "bold" }}>Walk-ins Welcome!!</div>
        </div>
      </div>
      <div style={{
        padding: "3px", textAlign: "center", fontSize: 5.5, color: "#cc6699",
        background: "#ffd6e7",
      }}>
        Created with Wix | Follow us on Facebook!
      </div>
    </div>
  );
}

function SalonAfter() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#FAF9F7",
      fontFamily: "Inter, -apple-system, sans-serif",
      color: "#1C1917",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(168,85,247,0.08)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#7E22CE", letterSpacing: "-0.02em" }}>Glamour Studio</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Services", "Pricing", "About"].map(item => (
            <span key={item} style={{ fontSize: 7, color: "#635C57", fontWeight: 500 }}>{item}</span>
          ))}
          <span style={{
            fontSize: 7, fontWeight: 600, color: "#fff",
            background: "#9333EA", padding: "3px 8px", borderRadius: 6,
          }}>Book Online</span>
        </div>
      </div>
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", background: "rgba(147,51,234,0.06)",
          borderRadius: 20, marginBottom: 8,
        }}>
          <span style={{ fontSize: 6.5, color: "#635C57", fontWeight: 500 }}>Next available: Today 2:30pm</span>
        </div>
        <div style={{
          fontSize: 15, fontWeight: 700, color: "#1C1917",
          lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 6,
        }}>Your Self-Care, Simplified</div>
        <div style={{ fontSize: 8, color: "#57534E", lineHeight: 1.5, marginBottom: 10, maxWidth: 220 }}>
          Premium nail care and spa services. Book instantly online, earn rewards, get reminders.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 600, color: "#fff",
            background: "#9333EA", padding: "5px 12px", borderRadius: 8,
            boxShadow: "0 1px 3px rgba(147,51,234,0.3)",
          }}>Book Appointment</span>
          <span style={{
            fontSize: 7.5, fontWeight: 500, color: "#57534E",
            border: "1px solid rgba(28,25,23,0.1)", padding: "5px 12px", borderRadius: 8,
          }}>See Services</span>
        </div>
      </div>
      <div style={{ padding: "0 14px", display: "flex", gap: 6 }}>
        {[
          { title: "Gel Manicure", time: "45 min", price: "$35" },
          { title: "Spa Pedicure", time: "60 min", price: "$55" },
          { title: "Full Set", time: "90 min", price: "$65" },
        ].map(s => (
          <div key={s.title} style={{
            flex: 1, padding: "8px", background: "#FFFFFF",
            border: "1px solid rgba(147,51,234,0.06)", borderRadius: 8,
          }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#1C1917", marginBottom: 2 }}>{s.title}</div>
            <div style={{ fontSize: 6.5, color: "#635C57", marginBottom: 3 }}>{s.time}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 7, fontWeight: 700, color: "#7E22CE" }}>{s.price}</span>
              <span style={{
                fontSize: 6, fontWeight: 600, color: "#9333EA",
                background: "rgba(147,51,234,0.06)", padding: "1px 5px", borderRadius: 4,
              }}>Book</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        margin: "8px 14px", padding: "6px 10px",
        background: "rgba(147,51,234,0.04)", borderRadius: 8,
        display: "flex", justifyContent: "space-around",
      }}>
        {[
          { val: "500+", label: "Happy Clients" },
          { val: "4.9", label: "Rating" },
          { val: "0", label: "Wait Walk-ins" },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#9333EA" }}>{stat.val}</div>
            <div style={{ fontSize: 6, color: "#635C57" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contractor ───

function ContractorBefore() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#f5f0eb",
      fontFamily: "Arial, sans-serif",
      fontSize: 8,
      overflow: "hidden",
    }}>
      {/* Craigslist-style header */}
      <div style={{
        background: "#5f3a82",
        padding: "4px 10px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 9, color: "#fff", fontWeight: "bold" }}>craigslist</span>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 6.5, color: "#d4c4e8", textDecoration: "underline" }}>post</span>
          <span style={{ fontSize: 6.5, color: "#d4c4e8", textDecoration: "underline" }}>account</span>
        </div>
      </div>
      <div style={{ padding: "3px 10px", fontSize: 6, color: "#888", borderBottom: "1px solid #ddd" }}>
        services &gt; skilled trades &gt; general contractor
      </div>
      <div style={{ padding: "8px 10px" }}>
        <div style={{
          fontSize: 11, fontWeight: "bold", color: "#00009f",
          marginBottom: 4, textDecoration: "underline",
        }}>
          *** MIKE'S CONTRACTING - Kitchen/Bath/Decks - FREE ESTIMATES ***
        </div>
        <div style={{ fontSize: 7, color: "#333", lineHeight: 1.6, marginBottom: 6 }}>
          Licensed general contractor, 20+ yrs experience. We do it all!!!{"\n"}
          - Kitchen remodels{"\n"}
          - Bathroom renovations{"\n"}
          - Deck building & repair{"\n"}
          - Basement finishing{"\n"}
          - Drywall, painting, flooring{"\n\n"}
          CALL/TEXT MIKE: (555) 456-7890{"\n"}
          email: mikescontracting@yahoo.com
        </div>
        <div style={{
          padding: "4px 8px", background: "#ffe4c4",
          border: "1px solid #ddcc99", fontSize: 6.5, color: "#886600",
          marginBottom: 4,
        }}>
          SPRING SPECIAL: 10% off all deck projects!! Call today!!
        </div>
        <div style={{ fontSize: 6, color: "#888", borderTop: "1px solid #ddd", paddingTop: 4 }}>
          Posted 3 months ago | Flagged for repost | Location: Metro area
        </div>
        <div style={{ fontSize: 6, color: "#aaa", marginTop: 4 }}>
          do NOT contact me with unsolicited services or offers
        </div>
      </div>
    </div>
  );
}

function ContractorAfter() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#F8FAFC",
      fontFamily: "Inter, -apple-system, sans-serif",
      color: "#0F172A",
      fontSize: 8,
      overflow: "hidden",
    }}>
      <div style={{
        padding: "8px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(15,23,42,0.06)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em" }}>Mike's Contracting</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {["Services", "Projects", "Reviews"].map(item => (
            <span key={item} style={{ fontSize: 7, color: "#556275", fontWeight: 500 }}>{item}</span>
          ))}
          <span style={{
            fontSize: 7, fontWeight: 600, color: "#fff",
            background: "#16A34A", padding: "3px 8px", borderRadius: 6,
          }}>Free Quote</span>
        </div>
      </div>
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "2px 8px", background: "rgba(22,163,74,0.06)",
          borderRadius: 20, marginBottom: 8,
        }}>
          <span style={{ fontSize: 6.5, color: "#556275", fontWeight: 500 }}>Licensed & Insured | 20+ Years</span>
        </div>
        <div style={{
          fontSize: 15, fontWeight: 700, color: "#0F172A",
          lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 6,
        }}>Quality Remodels You'll Love</div>
        <div style={{ fontSize: 8, color: "#475569", lineHeight: 1.5, marginBottom: 10, maxWidth: 240 }}>
          Kitchens, bathrooms, decks & more. Get a detailed quote in 24 hours with 3D project visualization.
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{
            fontSize: 7.5, fontWeight: 600, color: "#fff",
            background: "#16A34A", padding: "5px 12px", borderRadius: 8,
            boxShadow: "0 1px 3px rgba(22,163,74,0.3)",
          }}>Get a Free Quote</span>
          <span style={{
            fontSize: 7.5, fontWeight: 500, color: "#475569",
            border: "1px solid rgba(15,23,42,0.1)", padding: "5px 12px", borderRadius: 8,
          }}>See Our Work</span>
        </div>
      </div>
      <div style={{ padding: "0 14px", display: "flex", gap: 6 }}>
        {[
          { icon: "\uD83C\uDFE0", title: "Kitchen", desc: "Full remodels" },
          { icon: "\uD83D\uDEC1", title: "Bathroom", desc: "Modern updates" },
          { icon: "\uD83C\uDF05", title: "Decks", desc: "Custom builds" },
        ].map(card => (
          <div key={card.title} style={{
            flex: 1, padding: "8px", background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.06)", borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, marginBottom: 3 }}>{card.icon}</div>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{card.title}</div>
            <div style={{ fontSize: 6.5, color: "#556275" }}>{card.desc}</div>
          </div>
        ))}
      </div>
      {/* Quote form preview */}
      <div style={{
        margin: "8px 14px", padding: "8px 10px",
        background: "rgba(22,163,74,0.04)", borderRadius: 8,
        border: "1px solid rgba(22,163,74,0.08)",
      }}>
        <div style={{ fontSize: 7.5, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Quick Quote</div>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{
            flex: 1, height: 14, background: "#fff",
            border: "1px solid rgba(15,23,42,0.08)", borderRadius: 4,
            padding: "0 4px", display: "flex", alignItems: "center",
          }}>
            <span style={{ fontSize: 6, color: "#94A3B8" }}>Your name</span>
          </div>
          <div style={{
            flex: 1, height: 14, background: "#fff",
            border: "1px solid rgba(15,23,42,0.08)", borderRadius: 4,
            padding: "0 4px", display: "flex", alignItems: "center",
          }}>
            <span style={{ fontSize: 6, color: "#94A3B8" }}>Project type</span>
          </div>
          <span style={{
            fontSize: 6.5, fontWeight: 600, color: "#fff",
            background: "#16A34A", padding: "3px 8px", borderRadius: 4,
            display: "flex", alignItems: "center",
          }}>Submit</span>
        </div>
      </div>
    </div>
  );
}

// ─── Industry Definitions ───
const INDUSTRIES = [
  { id: "plumber", label: "Plumber", beforeUrl: "joesplumbing.biz", afterUrl: "joesplumbing.com", Before: PlumberBefore, After: PlumberAfter },
  { id: "restaurant", label: "Restaurant", beforeUrl: "tonystrattoria.net", afterUrl: "tonystrattoria.com", Before: RestaurantBefore, After: RestaurantAfter },
  { id: "salon", label: "Salon", beforeUrl: "glamournails.wixsite.com", afterUrl: "glamourstudio.com", Before: SalonBefore, After: SalonAfter },
  { id: "contractor", label: "Contractor", beforeUrl: "craigslist.org/mikescontracting", afterUrl: "mikescontracting.com", Before: ContractorBefore, After: ContractorAfter },
];

export default function BeforeAfterMockup() {
  const [activeIdx, setActiveIdx] = useState(0);
  const industry = INDUSTRIES[activeIdx];

  return (
    <div style={{ maxWidth: 940, margin: "0 auto" }}>
      {/* Industry selector tabs */}
      <div className="industry-tabs" style={{
        display: "flex", justifyContent: "center", gap: 8,
        marginBottom: 20,
      }}>
        {INDUSTRIES.map((ind, i) => (
          <button
            key={ind.id}
            onClick={() => setActiveIdx(i)}
            style={{
              padding: "6px 16px",
              borderRadius: "var(--pill-radius)",
              border: i === activeIdx ? "1px solid var(--color-accent-border)" : "1px solid var(--color-border)",
              background: i === activeIdx ? "var(--color-accent-soft)" : "var(--pill-bg)",
              color: i === activeIdx ? "var(--color-accent)" : "var(--color-text-muted)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
            }}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* Before / After display */}
      <div
        className="before-after-display"
        key={industry.id}
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <BrowserFrame url={industry.beforeUrl} label="Before" labelColor="#dc2626">
          <industry.Before />
        </BrowserFrame>

        <div className="before-after-arrow" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}>
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap",
          }}>14 days</span>
        </div>

        <BrowserFrame url={industry.afterUrl} label="After" labelColor="#2563EB">
          <industry.After />
        </BrowserFrame>
      </div>
    </div>
  );
}
