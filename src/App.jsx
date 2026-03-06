import { useState, lazy, Suspense } from "react";

// Layout
import Nav from "./components/layout/Nav.jsx";
import Footer from "./components/layout/Footer.jsx";

// UI
import AuroraMesh from "./components/ui/AuroraMesh.jsx";

// Sections
import Hero from "./components/sections/Hero.jsx";
import TrustStrip from "./components/sections/TrustStrip.jsx";
import ProblemSolution from "./components/sections/ProblemSolution.jsx";
import Portfolio from "./components/sections/Portfolio.jsx";
import Testimonials from "./components/sections/Testimonials.jsx";
import Process from "./components/sections/Process.jsx";
import Pricing from "./components/sections/Pricing.jsx";
import FAQ from "./components/sections/FAQ.jsx";

// Modals (lazy-loaded -- not needed until user clicks)
const LegalModal = lazy(() => import("./components/modals/LegalModal.jsx"));
const ContactModal = lazy(() => import("./components/modals/ContactModal.jsx"));

export default function QR8Page() {
  const [showLegal, setShowLegal] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openContact = (pkg) => {
    setSelectedPackage(pkg || "");
    setShowContact(true);
  };

  return (
    <div style={{
      fontFamily: "var(--font-family)",
      background: "var(--color-bg)", position: "relative",
      overflow: "hidden", color: "var(--color-text-primary)",
      transition: "background 0.3s ease, color 0.3s ease",
    }}>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <AuroraMesh />
      <Nav onContact={() => openContact()} />
      <main id="main-content">
        <Hero onContact={() => openContact()} onScrollTo={scrollTo} />
        <TrustStrip />
        <ProblemSolution />
        <Portfolio />
        <Testimonials />
        <Process />
        <Pricing onSelectPackage={(id) => openContact(id)} />
        <FAQ />
      </main>
      <Footer onContact={() => openContact()} onLegal={setShowLegal} />

      <Suspense fallback={null}>
        {showLegal && <LegalModal type={showLegal} onClose={() => setShowLegal(null)} />}
        {showContact && (
          <ContactModal
            selectedPackage={selectedPackage}
            onPackageChange={setSelectedPackage}
            onClose={() => setShowContact(false)}
          />
        )}
      </Suspense>
    </div>
  );
}
