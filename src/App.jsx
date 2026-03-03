import { useState, useEffect, useRef } from "react";

// ─── Animated gradient mesh background ───
function AuroraMesh() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 20% 50%, #0f0a1a 0%, #09090b 100%)",
      }} />
      <div style={{
        position: "absolute", width: 800, height: 800, left: "-10%", top: "-30%",
        background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)",
        filter: "blur(80px)", animation: "drift1 18s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 700, height: 700, right: "-5%", top: "10%",
        background: "radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 65%)",
        filter: "blur(80px)", animation: "drift2 22s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 600, height: 600, left: "30%", bottom: "-20%",
        background: "radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 65%)",
        filter: "blur(90px)", animation: "drift3 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, right: "25%", top: "40%",
        background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)",
        filter: "blur(70px)", animation: "drift1 25s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        <svg width="100%" height="100%"><defs>
          <pattern id="gr" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs><rect width="100%" height="100%" fill="url(#gr)"/></svg>
      </div>
    </div>
  );
}

// ─── Glass card for hero services ───
function GlassCard({ icon, title, desc, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, [delay]);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 220px", maxWidth: 280,
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "22px 22px 24px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease, border 0.25s ease",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{
          flex: "0 0 40px", height: 40, borderRadius: 11,
          background: hovered ? "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(34,211,238,0.08))" : "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.3s ease",
        }}>{icon}</div>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#f4f4f5" }}>{title}</span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(244,244,245,0.4)" }}>{desc}</div>
    </div>
  );
}

// ─── Word reveal ───
function RevealWords({ text, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), delay); }, [delay]);
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.28em",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(28px)",
          transition: `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`,
        }}>{w}</span>
      ))}
    </>
  );
}

// ─── Counter ───
function Counter({ to, suffix = "", duration = 2200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Scroll fade-in ───
function FadeIn({ children, delay = 0, style = {} }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      ...style,
    }}>{children}</div>
  );
}


// ─── Testimonial Carousel ───
function TestimonialCarousel({ accentGrad }) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const dragStartX = useRef(0);
  const savedOffset = useRef(0);

  const testimonials = [
    {
      quote: "We went from a Wix site nobody visited to a platform that books out our classes two weeks in advance. The AI recommendations alone changed our business.",
      name: "Maya Torres",
      role: "Founder, Solace Wellness",
      initials: "MT",
      color: "#a78bfa",
    },
    {
      quote: "They built our site in a week and it looks like we spent ten times what we paid. Reservations are up, the menu updates itself, and I haven't thought about the website since launch. That's the dream.",
      name: "Marco DeLuca",
      role: "Owner, Brick & Vine",
      initials: "MD",
      color: "#f472b6",
    },
    {
      quote: "Our old quoting process was killing deals. QR8 built us a dashboard that does in seconds what used to take hours. We closed more freight in the first month than the entire previous quarter.",
      name: "James Whitfield",
      role: "CEO, Apex Freight",
      initials: "JW",
      color: "#22d3ee",
    },
    {
      quote: "I needed a portfolio that felt like my photography — clean, elegant, no clutter. They nailed it on the first pass. The client proofing portal was a bonus I didn't even know I needed.",
      name: "Sarah Kim",
      role: "Creative Director, Lumine Studio",
      initials: "SK",
      color: "#c084fc",
    },
    {
      quote: "The AI product recommendations they built into our Shopify store are outperforming every marketing campaign we've ever run. Our conversion rate nearly doubled and customers keep coming back.",
      name: "Priya Anand",
      role: "Co-founder, GreenThread",
      initials: "PA",
      color: "#4ade80",
    },
  ];

  const CARD_WIDTH = 340;
  const GAP = 16;
  const SET_WIDTH = testimonials.length * (CARD_WIDTH + GAP);
  const DURATION = 30;
  const doubled = [...testimonials, ...testimonials];

  const getTrackOffset = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const matrix = new DOMMatrix(getComputedStyle(track).transform);
    return matrix.m41;
  };

  const normalizeOffset = (offset) => {
    let n = offset % SET_WIDTH;
    if (n > 0) n -= SET_WIDTH;
    return n;
  };

  const pauseAnimation = () => {
    const track = trackRef.current;
    if (!track) return;
    const offset = getTrackOffset();
    savedOffset.current = normalizeOffset(offset);
    track.style.animation = "none";
    track.style.transform = `translateX(${savedOffset.current}px)`;
  };

  const resumeAnimation = () => {
    const track = trackRef.current;
    if (!track) return;
    const offset = normalizeOffset(savedOffset.current);
    const progress = Math.abs(offset) / SET_WIDTH;
    track.style.transform = "";
    track.style.animation = "none";
    void track.offsetHeight;
    track.style.animation = `scrollTestimonials ${DURATION}s linear infinite`;
    track.style.animationDelay = `-${progress * DURATION}s`;
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
    if (!isDragging.current) pauseAnimation();
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    if (!isDragging.current) resumeAnimation();
  };

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    pauseAnimation();
    trackRef.current.style.cursor = "grabbing";
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStartX.current;
    const newOffset = normalizeOffset(savedOffset.current + dx);
    trackRef.current.style.transform = `translateX(${newOffset}px)`;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    savedOffset.current = normalizeOffset(getTrackOffset());
    trackRef.current.style.cursor = "grab";
    if (!isHovered.current) resumeAnimation();
  };

  const renderCard = (t, i) => (
    <div key={i} style={{
      flex: `0 0 ${CARD_WIDTH}px`,
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 18, padding: "28px 26px 26px",
      display: "flex", flexDirection: "column",
      transition: "border-color 0.3s ease, background 0.3s ease",
      userSelect: "none",
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 16, opacity: 0.15 }}>
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="#f4f4f5"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="#f4f4f5"/>
      </svg>
      <p style={{
        fontSize: 14, lineHeight: 1.65, color: "rgba(244,244,245,0.55)",
        margin: "0 0 24px", flex: 1,
      }}>"{t.quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.color}, ${t.color}66)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.85)",
        }}>{t.initials}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>{t.name}</div>
          <div style={{ fontSize: 12, color: "rgba(244,244,245,0.35)" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex", gap: GAP,
          animation: `scrollTestimonials ${DURATION}s linear infinite`,
          cursor: "grab",
          willChange: "transform",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {doubled.map(renderCard)}
      </div>

      {/* Fade edges */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 140,
        background: "linear-gradient(90deg, #09090b 0%, #09090b 20%, transparent 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: 140,
        background: "linear-gradient(270deg, #09090b 0%, #09090b 20%, transparent 100%)",
        pointerEvents: "none", zIndex: 1,
      }} />
    </div>
  );
}


// ═══════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════
export default function QR8Page() {
  const [loaded, setLoaded] = useState(false);
  const [hovStat, setHovStat] = useState(null);
  const [ctaHov, setCtaHov] = useState(false);
  const [navBtnHov, setNavBtnHov] = useState(false);
  const [navHov, setNavHov] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [showLegal, setShowLegal] = useState(null); // 'privacy' or 'terms'
  const [showContact, setShowContact] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => { setTimeout(() => setLoaded(true), 150); }, []);

  const navLinks = [
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Testimonials", href: "#testimonials" },
    // { label: "About", href: "#about" },
  ];
  const stats = [
    { n: 150, s: "+", l: "Projects Shipped" },
    { n: 40, s: "+", l: "Happy Teams" },
    { n: 4.9, s: "★", l: "Avg. Rating", decimal: true },
  ];
  const accentGrad = "linear-gradient(135deg, #8b5cf6, #22d3ee)";

  const processSteps = [
    {
      number: "01",
      title: "Consult",
      subtitle: "Let's talk about what you actually need",
      details: "No questionnaires, no 47-slide decks. We hop on a call, you tell us what's working, what's not, and where you want to go. We'll poke around your competitors, ask the uncomfortable questions, and by the end you'll have a clear game plan — not a sales pitch.",
      deliverables: ["Discovery call", "Goal alignment", "Competitive audit", "Project roadmap"],
    },
    {
      number: "02",
      title: "Curate",
      subtitle: "This is where it gets fun",
      details: "We let AI do the heavy lifting on exploration — generating layouts, testing copy, trying ideas we'd never have time for manually. Then we step in, cherry-pick the best bits, and shape it all into something that actually feels like your brand. Think of it as creative brainstorming on fast-forward.",
      deliverables: ["AI-assisted wireframes", "Brand-aligned UI", "Content strategy", "Prototype review"],
    },
    {
      number: "03",
      title: "Build",
      subtitle: "Where ideas become real, clickable things",
      details: "This is our happy place. We write clean React & Next.js code that loads fast, ranks well, and doesn't break when someone opens it on a phone from 2019. You'll get a staging link to play with, and we'll iterate together until it feels just right.",
      deliverables: ["React / Next.js build", "CMS integration", "SEO optimization", "QA & testing"],
    },
    {
      number: "04",
      title: "Optimize",
      subtitle: "Your site gets smarter, not stale",
      details: "Launching is exciting, but it's not the finish line. We set up analytics, watch how real people use your site, and make data-backed tweaks that keep improving results. You'll get monthly check-ins with actual insights — not vanity metrics nobody cares about.",
      deliverables: ["Analytics setup", "A/B testing", "Performance tuning", "Monthly insights"],
    },
  ];

  return (
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: "#09090b", position: "relative",
      overflow: "hidden", color: "#f4f4f5",
    }}>
      <AuroraMesh />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: "rgba(9,9,11,0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 40px", maxWidth: 1200, margin: "0 auto",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.6s ease 0.1s",
        }}>
          <div
            style={{ display: "flex", alignItems: "baseline", gap: 0, cursor: "pointer" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span style={{ fontSize: 25.5, fontWeight: 700, letterSpacing: "-0.03em", color: "#f4f4f5" }}>QR</span>
            <span style={{
              fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em",
              background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>8</span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navLinks.map((l, i) => (
              <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); scrollTo(l.href.slice(1)); }} style={{
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                color: navHov === i ? "#f4f4f5" : "rgba(244,244,245,0.5)",
                transition: "color 0.2s",
              }} onMouseEnter={() => setNavHov(i)} onMouseLeave={() => setNavHov(null)}>{l.label}</a>
            ))}
            <button style={{
              padding: "9px 22px",
              background: navBtnHov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
              color: "#f4f4f5", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 980, fontSize: 14, fontWeight: 500,
              cursor: "pointer", transition: "all 0.2s",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            }} onMouseEnter={() => setNavBtnHov(true)} onMouseLeave={() => setNavBtnHov(false)}
              onClick={() => { setSelectedPackage(""); setShowContact(true); }}>
              Let's Talk
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{
        position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto",
        padding: "140px 40px 60px", display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
      }}>
        {/* Status pill */}
        <div style={{
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.6s ease 0.3s", marginBottom: 36,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "7px 18px 7px 14px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 980, fontSize: 13, fontWeight: 500,
            color: "rgba(244,244,245,0.7)",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
              boxShadow: "0 0 10px rgba(74,222,128,0.5)", animation: "pulse 2s ease-in-out infinite",
            }} />
            Now taking on new partners
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 5.2vw, 64px)", fontWeight: 700,
          lineHeight: 1.1, letterSpacing: "-0.04em",
          margin: "0 0 28px", maxWidth: 900, color: "#f4f4f5",
        }}>
          <RevealWords text="Curating AI-Powered Sites That" delay={450} />
          <br />
          <RevealWords text="Convert Clicks Into Clients." delay={750} />
        </h1>

        <p style={{
          fontSize: "clamp(16px, 1.8vw, 20px)", fontWeight: 400, lineHeight: 1.6,
          color: "rgba(244,244,245,0.55)", maxWidth: 720, margin: "0 0 44px",
          letterSpacing: "-0.01em",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.7s ease 1.1s",
        }}>
          Your website should do more than look good — it should bring in customers.
          We design and build fast, modern sites that turn visitors into paying clients.
        </p>

        <div style={{
          display: "flex", gap: 14, marginBottom: 72, flexWrap: "wrap", justifyContent: "center",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.7s ease 1.3s",
        }}>
          <button style={{
            padding: "15px 34px", background: accentGrad,
            color: "#fff", border: "none", borderRadius: 980,
            fontSize: 16, fontWeight: 600, cursor: "pointer",
            letterSpacing: "-0.01em", transition: "all 0.3s ease",
            boxShadow: ctaHov
              ? "0 0 40px rgba(139,92,246,0.35), 0 0 80px rgba(34,211,238,0.15)"
              : "0 0 30px rgba(139,92,246,0.2), 0 0 60px rgba(34,211,238,0.08)",
            transform: ctaHov ? "translateY(-2px)" : "translateY(0)",
          }} onMouseEnter={() => setCtaHov(true)} onMouseLeave={() => setCtaHov(false)}
            onClick={() => scrollTo("portfolio")}>
            See Our Work
          </button>
          <button style={{
            padding: "15px 34px", background: "transparent", color: "rgba(244,244,245,0.7)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 980, fontSize: 16, fontWeight: 500,
            cursor: "pointer", transition: "all 0.25s",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#f4f4f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(244,244,245,0.7)"; }}
            onClick={() => scrollTo("process")}
          >
            How We Work
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Service cards */}
        <div style={{
          display: "flex", gap: 14, width: "100%", maxWidth: 960,
          marginBottom: 72, flexWrap: "wrap", justifyContent: "center",
        }}>
          <GlassCard delay={1600}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="ig1" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>}
            title="Mobile-First"
            desc="Every site starts on the small screen. Responsive, touch-friendly, and pixel-perfect on every device."
          />
          <GlassCard delay={1750}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="ig2" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
            title="AI Solutions"
            desc="We leverage AI to rapidly optimize content, accelerate development, and personalize user experiences."
          />
          <GlassCard delay={1900}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="ig3" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>}
            title="SEO Optimization"
            desc="Page-one rankings aren't a goal — they're our baseline. Built-in SEO from day one, not bolted on later."
          />
          <GlassCard delay={2050}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ig4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><defs><linearGradient id="ig4" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
            title="Performance"
            desc="Clean code, fast load times, and optimized experiences. Your users won't wait — and they won't have to."
          />
        </div>

        {/* Stats — hidden until we have real clientele
        <div style={{
          display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap",
          opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 2.2s",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center", cursor: "default", transition: "transform 0.3s",
              transform: hovStat === i ? "translateY(-4px)" : "translateY(0)", minWidth: 100,
            }} onMouseEnter={() => setHovStat(i)} onMouseLeave={() => setHovStat(null)}>
              <div style={{
                fontSize: 44, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1,
                transition: "all 0.3s",
                ...(hovStat === i ? {
                  background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                } : { color: "#f4f4f5" }),
              }}>
                {s.decimal ? <span>{s.n}{s.s}</span> : <Counter to={s.n} suffix={s.s} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8, color: "rgba(244,244,245,0.4)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        */}

      </section>

      {/* ═══════════════════════════════════════ */}
      {/* HOW WE WORK                            */}
      {/* ═══════════════════════════════════════ */}
      <section id="process" style={{ scrollMarginTop: 80,
        position: "relative", zIndex: 10,
        maxWidth: 1200, margin: "0 auto",
        padding: "100px 40px 80px",
      }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", marginBottom: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 980, fontSize: 12, fontWeight: 600,
              color: "rgba(244,244,245,0.5)", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#igp)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="igp" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Process
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "#f4f4f5",
              margin: "0 0 16px",
            }}>How We Work</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: "rgba(244,244,245,0.45)",
              maxWidth: 520, margin: "0 auto",
            }}>
              Four steps. No mysteries. Click each to see what actually happens.
            </p>
          </div>
        </FadeIn>

        {/* Process steps — horizontal cards */}
        <FadeIn>
          <div style={{
            display: "flex", gap: 12, maxWidth: 960, margin: "0 auto",
          }}>
            {processSteps.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <div
                  key={i}
                  onClick={() => setActiveStep(isActive ? -1 : i)}
                  style={{
                    flex: isActive ? "1.8 1 0" : "1 1 0",
                    background: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    border: `1px solid ${isActive ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 18,
                    padding: isActive ? "24px 24px 28px" : "24px 20px",
                    cursor: "pointer",
                    transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                    overflow: "hidden",
                    display: "flex", flexDirection: "column",
                    minWidth: 0,
                  }}
                >
                  {/* Number badge */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: isActive ? accentGrad : "rgba(255,255,255,0.04)",
                    border: isActive ? "none" : "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                    color: isActive ? "#fff" : "rgba(244,244,245,0.4)",
                    marginBottom: 16,
                    transition: "all 0.4s ease",
                    boxShadow: isActive ? "0 0 24px rgba(139,92,246,0.2)" : "none",
                  }}>
                    {step.number}
                  </div>

                  {/* Title */}
                  <div style={{
                    fontSize: 17, fontWeight: 600,
                    color: isActive ? "#f4f4f5" : "rgba(244,244,245,0.6)",
                    marginBottom: 4, transition: "color 0.3s",
                    whiteSpace: "nowrap",
                  }}>{step.title}</div>

                  {/* Subtitle */}
                  <div style={{
                    fontSize: 13, color: "rgba(244,244,245,0.35)",
                    marginBottom: isActive ? 20 : 0,
                    whiteSpace: isActive ? "normal" : "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis",
                  }}>{step.subtitle}</div>

                  {/* Expandable content */}
                  <div style={{
                    maxHeight: isActive ? 400 : 0,
                    opacity: isActive ? 1 : 0,
                    transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: 1, marginBottom: 18,
                      background: "linear-gradient(90deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2), transparent)",
                    }} />
                    <p style={{
                      fontSize: 13.5, lineHeight: 1.65, color: "rgba(244,244,245,0.5)",
                      margin: "0 0 18px",
                    }}>{step.details}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {step.deliverables.map((d, j) => (
                        <span key={j} style={{
                          padding: "4px 12px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 980, fontSize: 11, fontWeight: 500,
                          color: "rgba(244,244,245,0.45)",
                        }}>{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* PRICING                                 */}
      {/* ═══════════════════════════════════════ */}
      <section id="pricing" style={{ scrollMarginTop: 80,
        position: "relative", zIndex: 10,
        maxWidth: 1200, margin: "0 auto",
        padding: "100px 40px 80px",
      }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", marginBottom: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 980, fontSize: 12, fontWeight: 600,
              color: "rgba(244,244,245,0.5)", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#igpr)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="igpr" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              Pricing
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "#f4f4f5",
              margin: "0 0 16px",
            }}>Honest pricing, no surprises</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: "rgba(244,244,245,0.45)",
              maxWidth: 620, margin: "0 auto",
            }}>
              Every project includes a one-time build. Want us to stick around after launch? Add a monthly retainer and we'll keep things running and improving.
            </p>
          </div>
        </FadeIn>

        {/* Pricing cards */}
        <FadeIn delay={150}>
          <div style={{
            display: "flex", gap: 16, maxWidth: 960, margin: "0 auto",
            alignItems: "stretch",
          }}>
            {/* ── Standard ── */}
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: "32px 28px 36px",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: "rgba(244,244,245,0.5)",
                marginBottom: 4, letterSpacing: "0.01em",
              }}>Standard</div>
              <div style={{
                fontSize: 12, color: "rgba(244,244,245,0.3)", marginBottom: 16,
              }}>Small Business Package</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0, marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#f4f4f5", letterSpacing: "-0.03em" }}>$250</span>
              </div>
              <div style={{
                fontSize: 13, color: "rgba(244,244,245,0.35)", marginBottom: 28, lineHeight: 1.5,
              }}>A polished, mobile-first single page website to get your business online — fast.</div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />

              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,244,245,0.4)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>What's included</div>
              {["Mobile-first single page website", "Lead capture form with email notifications", "Basic SEO setup", "Google Analytics setup", "Fast load times", "Unlimited revisions", "1 month post-launch support", "1-week turnaround"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: "0 0 16px", marginTop: 1 }}>
                    <path d="M3.5 8.5l3 3 6-6" stroke="rgba(244,244,245,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13.5, color: "rgba(244,244,245,0.5)" }}>{item}</span>
                </div>
              ))}

              <div style={{ flex: 1 }} />

              <div style={{
                marginTop: 24, padding: "14px 16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 12,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(244,244,245,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Optional retainer</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "rgba(244,244,245,0.7)" }}>+$50</span>
                  <span style={{ fontSize: 12, color: "rgba(244,244,245,0.3)" }}>/mo</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(244,244,245,0.3)", marginTop: 4 }}>Bug fixes, content updates, basic analytics</div>
              </div>

              <button style={{
                padding: "13px 0", width: "100%",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(244,244,245,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 980, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f4f4f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(244,244,245,0.8)"; }}
                onClick={() => { setSelectedPackage("standard"); setShowContact(true); }}
              >Get Started</button>
            </div>

            {/* ── Premium (highlighted) ── */}
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 20, padding: "32px 28px 36px",
              display: "flex", flexDirection: "column",
              position: "relative",
              boxShadow: "0 0 60px rgba(139,92,246,0.08), 0 0 120px rgba(34,211,238,0.04)",
            }}>
              <div style={{
                position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                padding: "5px 18px",
                background: accentGrad,
                borderRadius: 980, fontSize: 11, fontWeight: 700,
                color: "#fff", letterSpacing: "0.03em",
                boxShadow: "0 4px 16px rgba(139,92,246,0.3)",
              }}>MOST POPULAR</div>

              <div style={{
                fontSize: 14, fontWeight: 600, color: "rgba(244,244,245,0.5)",
                marginBottom: 4, marginTop: 8, letterSpacing: "0.01em",
              }}>Premium</div>
              <div style={{
                fontSize: 12, color: "rgba(244,244,245,0.3)", marginBottom: 16,
              }}>Growing Brand Package</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0, marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#f4f4f5", letterSpacing: "-0.03em" }}>$1,000</span>
              </div>
              <div style={{
                fontSize: 13, color: "rgba(244,244,245,0.35)", marginBottom: 28, lineHeight: 1.5,
              }}>A full multi-page website with custom design, animations, and conversion strategy.</div>

              <div style={{ height: 1, background: "rgba(139,92,246,0.15)", marginBottom: 24 }} />

              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,244,245,0.4)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>What's included</div>
              {["5–10 page website (Home, About, Services, etc.)", "Landing page with high-level overview", "Custom animations & interactions", "Portfolio or blog section", "Advanced SEO setup", "Google Analytics & Business profile optimization", "Fast load times", "Unlimited revisions", "1 month post-launch support", "2–4 week turnaround"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: "0 0 16px", marginTop: 1 }}>
                    <path d="M3.5 8.5l3 3 6-6" stroke="url(#checkGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs><linearGradient id="checkGrad" x1="3" y1="5" x2="13" y2="12"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
                  </svg>
                  <span style={{ fontSize: 13.5, color: "rgba(244,244,245,0.6)" }}>{item}</span>
                </div>
              ))}

              <div style={{ flex: 1 }} />

              <div style={{
                marginTop: 24, padding: "14px 16px",
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.12)",
                borderRadius: 12,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(244,244,245,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Optional retainer</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "rgba(244,244,245,0.8)" }}>+$100</span>
                  <span style={{ fontSize: 12, color: "rgba(244,244,245,0.3)" }}>/mo</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(244,244,245,0.3)", marginTop: 4 }}>Bug fixes, content updates, performance tuning, advanced analytics</div>
              </div>

              <button style={{
                padding: "13px 0", width: "100%",
                background: accentGrad,
                color: "#fff",
                border: "none",
                borderRadius: 980, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.3s",
                boxShadow: "0 0 24px rgba(139,92,246,0.2)",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(139,92,246,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
                onClick={() => { setSelectedPackage("premium"); setShowContact(true); }}
              >Get Started</button>
            </div>

            {/* ── Custom ── */}
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20, padding: "32px 28px 36px",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{
                fontSize: 14, fontWeight: 600, color: "rgba(244,244,245,0.5)",
                marginBottom: 4, letterSpacing: "0.01em",
              }}>Custom</div>
              <div style={{
                fontSize: 12, color: "rgba(244,244,245,0.3)", marginBottom: 16,
              }}>Tailored Solutions</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 40, fontWeight: 700, color: "#f4f4f5", letterSpacing: "-0.03em" }}>$1,500</span>
                <span style={{ fontSize: 14, color: "rgba(244,244,245,0.35)" }}>starts at</span>
              </div>
              <div style={{
                fontSize: 13, color: "rgba(244,244,245,0.35)", marginBottom: 28, lineHeight: 1.5,
              }}>For projects that need something unique — custom AI features, integrations, or full-scale platforms.</div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />

              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,244,245,0.4)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Everything in Premium, plus</div>
              {["Custom AI integrations", "E-commerce or SaaS features", "Third-party API connections", "Advanced animations & interactions", "Dedicated project manager", "Custom CMS setup", "Full brand & design system", "Scoped timeline based on project"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flex: "0 0 16px", marginTop: 1 }}>
                    <path d="M3.5 8.5l3 3 6-6" stroke="rgba(244,244,245,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13.5, color: "rgba(244,244,245,0.5)" }}>{item}</span>
                </div>
              ))}

              <div style={{ flex: 1 }} />

              <div style={{
                marginTop: 24, padding: "14px 16px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 12,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(244,244,245,0.35)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Retainer</div>
                <div style={{ fontSize: 13, color: "rgba(244,244,245,0.4)", lineHeight: 1.5 }}>Scoped to your project needs — we'll figure this out together during the consult.</div>
              </div>

              <button style={{
                padding: "13px 0", width: "100%",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(244,244,245,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 980, fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.25s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f4f4f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(244,244,245,0.8)"; }}
                onClick={() => { setSelectedPackage("custom"); setShowContact(true); }}
              >Let's Talk</button>
            </div>
          </div>
        </FadeIn>

        {/* Bottom note */}
        <FadeIn delay={300}>
          <p style={{
            textAlign: "center", fontSize: 13, color: "rgba(244,244,245,0.3)",
            marginTop: 32, maxWidth: 540, margin: "32px auto 0",
          }}>
            Standard and Premium are fixed-rate — what you see is what you pay.<br/>
            Custom projects are scoped and quoted after our initial consult.<br/>
            No surprises, ever.
          </p>
        </FadeIn>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* PORTFOLIO                               */}
      {/* ═══════════════════════════════════════ */}
      <section id="portfolio" style={{ scrollMarginTop: 80,
        position: "relative", zIndex: 10,
        maxWidth: 1200, margin: "0 auto",
        padding: "100px 40px 80px",
      }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", marginBottom: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 980, fontSize: 12, fontWeight: 600,
              color: "rgba(244,244,245,0.5)", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#igpf)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="igpf" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
                <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
              </svg>
              Portfolio
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "#f4f4f5",
              margin: "0 0 16px",
            }}>Work we're proud of</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: "rgba(244,244,245,0.45)",
              maxWidth: 680, margin: "0 auto",
            }}>
              Real results for real businesses. Here's a look at what we've been building lately.
            </p>
          </div>
        </FadeIn>

        {/* Featured project carousel */}
        <FadeIn delay={100}>
          {(() => {
            const projects = [
              {
                name: "Fostering B.R.A.I.N. Connections",
                url: "fosteringbrainconnections.com",
                image: `${import.meta.env.BASE_URL}img/rIwcZfT.png`,
                tags: [{ label: "Healthcare", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.15)", text: "rgba(74,222,128,0.8)" }, { label: "Education", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.15)", text: "rgba(251,146,60,0.8)" }],
                desc: "A therapy practice empowering children and families through gentle, transformative MNRI therapy. We designed and built their entire web presence from the ground up — from team bios and therapy breakdowns to testimonials and integrated booking — giving their practice a warm, professional digital home.",
                tech: ["React", "Tailwind CSS", "Vite"],
                gradient: "rgba(74,222,128,0.12) 0%, rgba(251,146,60,0.08) 50%, rgba(34,211,238,0.06) 100%",
              },
              {
                name: "Solace Wellness",
                url: "solacewellness.com",
                tags: [{ label: "Web App", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.15)", text: "rgba(167,139,250,0.8)" }, { label: "AI Integration", bg: "rgba(34,211,238,0.06)", border: "rgba(34,211,238,0.12)", text: "rgba(103,232,249,0.7)" }],
                desc: "A full-service wellness studio needed a site that matched their calm, premium brand. We built a booking-integrated platform with AI-powered class recommendations that boosted online bookings by 140%.",
                stats: [{ val: "+140%", label: "Online Bookings" }, { val: "0.8s", label: "Load Time" }, { val: "#1", label: "Local SEO Rank" }],
                tech: ["Next.js", "Tailwind CSS", "OpenAI API", "Stripe"],
                gradient: "rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.08) 50%, rgba(244,114,182,0.06) 100%",
              },
              {
                name: "Brick & Vine",
                url: "brickandvine.com",
                tags: [{ label: "Restaurant", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.15)", text: "rgba(244,114,182,0.8)" }, { label: "Automation", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.12)", text: "rgba(167,139,250,0.7)" }],
                desc: "A neighborhood Italian spot with incredible food but zero online presence. We built a self-updating menu site with integrated reservations — traffic jumped 200% and weekday bookings doubled.",
                stats: [{ val: "+200%", label: "Traffic" }, { val: "2x", label: "Weekday Bookings" }, { val: "98", label: "Lighthouse Score" }],
                tech: ["React", "Framer Motion", "OpenTable API", "Cloudflare"],
                gradient: "rgba(244,114,182,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(34,211,238,0.06) 100%",
              },
            ];
            const p = projects[featuredIdx];
            return (
              <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
                <div
                  key={featuredIdx}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 20,
                    overflow: "hidden",
                    animation: "fadeIn 0.4s ease",
                  }}
                >
                  {/* Project preview */}
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <div style={{
                      height: 32, background: "rgba(9,9,11,0.9)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      display: "flex", alignItems: "center", padding: "0 12px", gap: 6,
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                      <div style={{
                        flex: 1, height: 18, marginLeft: 8,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 6, display: "flex", alignItems: "center",
                        padding: "0 10px",
                      }}>
                        <span style={{ fontSize: 10, color: "rgba(244,244,245,0.25)" }}>{p.url}</span>
                      </div>
                    </div>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={`${p.name} website`}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    ) : (
                      <div style={{
                        height: 268,
                        background: `linear-gradient(135deg, ${p.gradient})`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
                      }}>
                        <div style={{ width: "60%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)" }} />
                        <div style={{ width: "40%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)" }} />
                        <div style={{ width: "30%", height: 24, borderRadius: 12, background: "rgba(255,255,255,0.06)", marginTop: 8 }} />
                      </div>
                    )}
                    {/* Counter badge */}
                    <div style={{
                      position: "absolute", top: 44, left: 12,
                      padding: "5px 14px",
                      background: accentGrad,
                      borderRadius: 980, fontSize: 11, fontWeight: 700,
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
                          borderRadius: 980, fontSize: 11, fontWeight: 600, color: tag.text,
                        }}>{tag.label}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{p.name}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(244,244,245,0.45)", margin: "0 0 20px", maxWidth: 600 }}>{p.desc}</p>
                    {p.stats && (
                      <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
                        {p.stats.map((s, si) => (
                          <div key={si}>
                            <div style={{ fontSize: 20, fontWeight: 700, color: "#f4f4f5", letterSpacing: "-0.02em" }}>{s.val}</div>
                            <div style={{ fontSize: 12, color: "rgba(244,244,245,0.35)", marginTop: 2 }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.tech.map((t, i) => (
                        <span key={i} style={{
                          padding: "4px 11px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 980, fontSize: 11, fontWeight: 500,
                          color: "rgba(244,244,245,0.4)",
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={() => setFeaturedIdx((featuredIdx - 1 + projects.length) % projects.length)}
                  style={{
                    position: "absolute", left: -20, top: 180, transform: "translateY(-50%)",
                    width: 40, height: 40, borderRadius: 12,
                    background: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f4f4f5", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(9,9,11,0.85)"}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  onClick={() => setFeaturedIdx((featuredIdx + 1) % projects.length)}
                  style={{
                    position: "absolute", right: -20, top: 180, transform: "translateY(-50%)",
                    width: 40, height: 40, borderRadius: 12,
                    background: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f4f4f5", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(9,9,11,0.85)"}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                {/* Dot indicators */}
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                  {projects.map((_, di) => (
                    <button key={di} onClick={() => setFeaturedIdx(di)} style={{
                      width: di === featuredIdx ? 24 : 8, height: 8,
                      borderRadius: 4, border: "none", cursor: "pointer",
                      background: di === featuredIdx ? accentGrad : "rgba(255,255,255,0.12)",
                      transition: "all 0.3s ease",
                    }} />
                  ))}
                </div>
              </div>
            );
          })()}
        </FadeIn>

      </section>

      {/* ═══════════════════════════════════════ */}
      {/* TESTIMONIALS                            */}
      {/* ═══════════════════════════════════════ */}
      <section id="testimonials" style={{ scrollMarginTop: 80,
        position: "relative", zIndex: 10,
        padding: "100px 0 80px",
        overflow: "hidden",
      }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 48, padding: "0 40px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", marginBottom: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 980, fontSize: 12, fontWeight: 600,
              color: "rgba(244,244,245,0.5)", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#igtm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="igtm" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Testimonials
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "#f4f4f5",
              margin: "0 0 16px",
            }}>Don't take our word for it</h2>
            <p style={{
              fontSize: 17, lineHeight: 1.6, color: "rgba(244,244,245,0.45)",
              maxWidth: 520, margin: "0 auto",
            }}>
              Here's what our partners have to say about working with QR8.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <TestimonialCarousel accentGrad={accentGrad} />
        </FadeIn>
      </section>

      {/* ABOUT section hidden — re-enable when ready
      <section id="about" style={{ scrollMarginTop: 80,
        position: "relative", zIndex: 10,
        maxWidth: 1200, margin: "0 auto",
        padding: "100px 40px 80px",
      }}>
        <FadeIn>
          <div style={{
            maxWidth: 740, margin: "0 auto",
            textAlign: "center",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", marginBottom: 20,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 980, fontSize: 12, fontWeight: 600,
              color: "rgba(244,244,245,0.5)", letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#igab)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <defs><linearGradient id="igab" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              About Us
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
              letterSpacing: "-0.03em", color: "#f4f4f5",
              margin: "0 0 32px",
            }}>We started QR8 because <span style={{ whiteSpace: "nowrap" }}>we were tired</span><br/>of the same old agency playbook.</h2>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div style={{
            maxWidth: 800, margin: "0 auto",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20, padding: "40px 44px",
          }}>
            <p style={{
              fontSize: 16, lineHeight: 1.75, color: "rgba(244,244,245,0.55)",
              margin: "0 0 24px",
            }}>
              Most agencies sell you a template, slap your logo on it, and call it "custom." We thought that was kind of garbage. So we built something different.
            </p>
            <p style={{
              fontSize: 16, lineHeight: 1.75, color: "rgba(244,244,245,0.55)",
              margin: "0 0 24px",
            }}>
              QR8 is a small team of designers and engineers who actually care about the sites we ship. We use AI where it makes things genuinely better — smarter design exploration, faster iteration, real personalization — not as a gimmick to cut corners. Every pixel is intentional. Every line of code has a reason.
            </p>
            <p style={{
              fontSize: 16, lineHeight: 1.75, color: "rgba(244,244,245,0.55)",
              margin: "0 0 32px",
            }}>
              We're not trying to be the biggest agency. We're trying to be the one you actually enjoy working with — the team that picks up the phone, ships on time, and builds something you're proud to show people.
            </p>

            <div style={{
              height: 1, marginBottom: 32,
              background: "linear-gradient(90deg, rgba(139,92,246,0.2), rgba(34,211,238,0.15), transparent)",
            }} />

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 24,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5" }}>Small team, big standards.</div>
                <div style={{ fontSize: 12, color: "rgba(244,244,245,0.35)", marginTop: 2 }}>Based in South Florida. Working with partners everywhere.</div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Ship fast", "Stay honest", "Sweat the details"].map((v, i) => (
                  <span key={i} style={{
                    padding: "6px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 980, fontSize: 12, fontWeight: 600,
                    color: "rgba(244,244,245,0.45)",
                  }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
      */}

      {/* ═══════════════════════════════════════ */}
      {/* FOOTER (with CTA)                       */}
      {/* ═══════════════════════════════════════ */}
      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 40px",
        }}>

          {/* CTA block */}
          <FadeIn>
            <div style={{
              textAlign: "center",
              padding: "64px 0 56px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <h2 style={{
                fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700,
                letterSpacing: "-0.03em", color: "#f4f4f5",
                margin: "0 0 14px",
              }}>Ready to build something great?</h2>
              <p style={{
                fontSize: 17, lineHeight: 1.6, color: "rgba(244,244,245,0.45)",
                maxWidth: 480, margin: "0 auto 28px",
              }}>
                Tell us about your project and we'll get back to you within 24 hours. No pressure, no commitment.
              </p>
              <button
                onClick={() => { setSelectedPackage(""); setShowContact(true); }}
                style={{
                  padding: "14px 36px",
                  background: accentGrad,
                  color: "#fff", border: "none",
                  borderRadius: 980, fontSize: 15, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.3s",
                  boxShadow: "0 0 24px rgba(139,92,246,0.2)",
                  letterSpacing: "-0.01em",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(139,92,246,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Let's Talk</button>
            </div>
          </FadeIn>

          {/* Minimal footer content */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 16,
            padding: "28px 0",
          }}>
            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
                <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "#f4f4f5" }}>QR</span>
                <span style={{
                  fontSize: 20.5, fontWeight: 700, letterSpacing: "-0.03em",
                  background: accentGrad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>8</span>
              </div>
              <span style={{ fontSize: 12, color: "rgba(244,244,245,0.2)" }}>© 2025 QR8. All rights reserved.</span>
            </div>

            {/* Social + legal */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* Social icons */}
              {[
                { label: "X", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "Instagram", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01", rect: true },
                { label: "LinkedIn", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z", circle: true },
              ].map((s, i) => (
                <a key={i} href="#" style={{ color: "rgba(244,244,245,0.25)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#f4f4f5"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "rgba(244,244,245,0.25)"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {s.rect && <rect x="2" y="2" width="20" height="20" rx="5"/>}
                    {s.circle && <circle cx="4" cy="4" r="2"/>}
                    <path d={s.icon}/>
                  </svg>
                </a>
              ))}

              <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.08)" }} />

              {/* Legal links */}
              <a href="#" onClick={(e) => { e.preventDefault(); setShowLegal("privacy"); }} style={{
                fontSize: 12, color: "rgba(244,244,245,0.25)", textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(244,244,245,0.5)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(244,244,245,0.25)"}
              >Privacy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setShowLegal("terms"); }} style={{
                fontSize: 12, color: "rgba(244,244,245,0.25)", textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(244,244,245,0.5)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(244,244,245,0.25)"}
              >Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════ */}
      {/* LEGAL MODAL                             */}
      {/* ═══════════════════════════════════════ */}
      {showLegal && (
        <div
          onClick={() => setShowLegal(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 40,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 600, maxHeight: "80vh",
              background: "rgba(15,10,26,0.95)",
              backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "36px 32px 32px",
              animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f4f4f5", margin: 0, letterSpacing: "-0.02em" }}>
                {showLegal === "privacy" ? "Privacy Policy" : "Terms of Service"}
              </h3>
              <button
                onClick={() => setShowLegal(null)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(244,244,245,0.5)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f4f4f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(244,244,245,0.5)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.75, color: "rgba(244,244,245,0.45)" }}>
              <p style={{ color: "rgba(244,244,245,0.3)", marginBottom: 20 }}>Last updated: January 1, 2025</p>
              {showLegal === "privacy" ? (<>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>1. Information We Collect</strong><br/>We collect information you voluntarily provide through our contact form, including your name, email address, company name, phone number, and project details. We also collect standard analytics data such as pages visited, browser type, and device information to improve our services.</p>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>2. How We Use Your Information</strong><br/>Your information is used solely to respond to your inquiries, provide project proposals, deliver services, and communicate about ongoing projects. We do not sell, trade, or rent your personal information to third parties.</p>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>3. Data Security</strong><br/>We implement industry-standard security measures to protect your personal information. All form submissions are encrypted in transit via TLS/SSL. We retain your data only as long as necessary to fulfill the purposes described in this policy.</p>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>4. Cookies & Analytics</strong><br/>We use anonymized analytics to understand how visitors interact with our website. No personally identifiable information is collected through cookies. You may disable cookies in your browser settings at any time.</p>
                <p style={{ marginBottom: 0 }}><strong style={{ color: "#f4f4f5" }}>5. Contact</strong><br/>If you have questions about this privacy policy or wish to request deletion of your data, please contact us at hello@qr8.dev.</p>
              </>) : (<>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>1. Services</strong><br/>QR8 provides web design, development, and related digital services as agreed upon in individual project proposals. All project scopes, timelines, and deliverables are defined during our consultation process and documented in a project agreement prior to commencement of work.</p>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>2. Payment Terms</strong><br/>Standard and Premium packages are billed at fixed rates as listed on our website. Custom projects are quoted individually. A 50% deposit is required to begin work, with the remaining balance due upon project completion. All payments are non-refundable once work has commenced.</p>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>3. Intellectual Property</strong><br/>Upon full payment, clients receive full ownership of all custom code, designs, and content created specifically for their project. QR8 retains the right to showcase completed work in our portfolio unless otherwise agreed in writing.</p>
                <p style={{ marginBottom: 16 }}><strong style={{ color: "#f4f4f5" }}>4. Post-Launch Support</strong><br/>All packages include the post-launch support period specified in the project agreement. Additional support beyond this period is available through our optional retainer plans. Emergency fixes for critical bugs are addressed as a priority regardless of retainer status.</p>
                <p style={{ marginBottom: 0 }}><strong style={{ color: "#f4f4f5" }}>5. Limitation of Liability</strong><br/>QR8's total liability for any claim arising from our services shall not exceed the total amount paid for the project in question. We are not liable for indirect, incidental, or consequential damages including lost revenue or data. For questions about these terms, contact us at hello@qr8.dev.</p>
              </>)}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* CONTACT FORM MODAL                      */}
      {/* ═══════════════════════════════════════ */}
      {showContact && (() => {
        const inputStyle = {
          width: "100%", padding: "12px 16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, fontSize: 14, color: "#f4f4f5",
          outline: "none", transition: "border 0.2s",
          fontFamily: "inherit",
        };
        const labelStyle = { fontSize: 12, fontWeight: 600, color: "rgba(244,244,245,0.4)", display: "block", marginBottom: 6, letterSpacing: "0.02em" };
        const focus = (e) => e.target.style.borderColor = "rgba(139,92,246,0.4)";
        const blur = (e) => e.target.style.borderColor = "rgba(255,255,255,0.08)";
        return (
        <div
          onClick={() => setShowContact(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 40,
            animation: "fadeIn 0.25s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 640,
              background: "rgba(15,10,26,0.95)",
              backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "40px 36px 36px",
              animation: "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              marginBottom: 28,
            }}>
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#f4f4f5", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Let's talk about your project</h3>
                <p style={{ fontSize: 14, color: "rgba(244,244,245,0.4)", margin: 0 }}>We'll get back to you within 24 hours.</p>
              </div>
              <button
                onClick={() => setShowContact(false)}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(244,244,245,0.5)",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0, marginLeft: 12,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#f4f4f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(244,244,245,0.5)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Row 1: Name + Email */}
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Full Name <span style={{ color: "rgba(139,92,246,0.6)" }}>*</span></label>
                  <input type="text" placeholder="Your full name" required style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Email <span style={{ color: "rgba(139,92,246,0.6)" }}>*</span></label>
                  <input type="email" placeholder="you@company.com" required style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </div>
              {/* Row 2: Company + Phone */}
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Company Name</label>
                  <input type="text" placeholder="Your company" style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" placeholder="(555) 000-0000" style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
              </div>
              {/* Row 3: Current website + Package */}
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Current Website</label>
                  <input type="url" placeholder="https://yoursite.com (if any)" style={inputStyle} onFocus={focus} onBlur={blur} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Package</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6l4 4 4-4' stroke='rgba(244,244,245,0.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                    onFocus={focus}
                    onBlur={blur}
                  >
                    <option value="">Not sure yet</option>
                    <option value="standard">Standard — $250</option>
                    <option value="premium">Premium — $1,000</option>
                    <option value="custom">Custom — $1,500+</option>
                  </select>
                </div>
              </div>
              {/* Project details */}
              <div>
                <label style={labelStyle}>Project Details</label>
                <textarea placeholder="Tell us about your project — goals, timeline, budget, anything helpful..." rows={5} style={{
                  ...inputStyle, resize: "vertical", minHeight: 120,
                }} onFocus={focus} onBlur={blur} />
              </div>
              {/* Submit */}
              <button style={{
                padding: "14px 0", width: "100%", marginTop: 4,
                background: accentGrad,
                color: "#fff", border: "none",
                borderRadius: 980, fontSize: 15, fontWeight: 600,
                cursor: "pointer", transition: "all 0.3s",
                boxShadow: "0 0 24px rgba(139,92,246,0.2)",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 24px rgba(139,92,246,0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >Send Message</button>
              <p style={{ fontSize: 12, color: "rgba(244,244,245,0.25)", textAlign: "center", margin: 0 }}>
                No spam. No mailing list. Just a real reply from a real person.
              </p>
            </div>
          </div>
        </div>
        );
      })()}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.05); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 50px) scale(1.08); }
          66% { transform: translate(40px, -20px) scale(0.96); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -50px) scale(1.06); }
        }
        @keyframes scrollTestimonials {
          from { transform: translateX(0); }
          to { transform: translateX(-1780px); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        *::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: rgba(244,244,245,0.2); }
        select option { background: #0f0a1a; color: #f4f4f5; }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
