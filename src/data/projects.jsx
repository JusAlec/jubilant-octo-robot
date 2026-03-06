import { SolaceWellnessPreview, BrickVinePreview } from "../PortfolioPreview.jsx";

export const projects = [
  {
    name: "Fostering B.R.A.I.N. Connections",
    url: "fosteringbrainconnections.com",
    image: `${import.meta.env.BASE_URL}img/rIwcZfT.webp`,
    tags: [
      { label: "Healthcare", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.15)", text: "rgba(74,222,128,0.8)" },
      { label: "Education", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.15)", text: "rgba(251,146,60,0.8)" },
    ],
    desc: "A therapy practice empowering children and families through gentle, transformative MNRI therapy. We designed and built their entire web presence from the ground up \u2014 from team bios and therapy breakdowns to testimonials and integrated booking \u2014 giving their practice a warm, professional digital home.",
    tech: ["React", "Tailwind CSS", "Vite"],
    gradient: "rgba(74,222,128,0.12) 0%, rgba(251,146,60,0.08) 50%, rgba(34,211,238,0.06) 100%",
  },
  {
    name: "Solace Wellness",
    url: "solacewellness.com",
    Preview: SolaceWellnessPreview,
    tags: [
      { label: "Web App", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.15)", text: "rgba(167,139,250,0.8)" },
      { label: "AI Integration", bg: "rgba(34,211,238,0.06)", border: "rgba(34,211,238,0.12)", text: "rgba(103,232,249,0.7)" },
    ],
    desc: "A full-service wellness studio needed a site that matched their calm, premium brand. We built a booking-integrated platform with AI-powered class recommendations that boosted online bookings by 140%.",
    stats: [{ val: "+140%", label: "Online Bookings" }, { val: "0.8s", label: "Load Time" }, { val: "#1", label: "Local SEO Rank" }],
    tech: ["Next.js", "Tailwind CSS", "OpenAI API", "Stripe"],
    gradient: "rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.08) 50%, rgba(244,114,182,0.06) 100%",
  },
  {
    name: "Brick & Vine",
    url: "brickandvine.com",
    Preview: BrickVinePreview,
    tags: [
      { label: "Restaurant", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.15)", text: "rgba(244,114,182,0.8)" },
      { label: "Automation", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.12)", text: "rgba(167,139,250,0.7)" },
    ],
    desc: "A neighborhood Italian spot with incredible food but zero online presence. We built a self-updating menu site with integrated reservations \u2014 traffic jumped 200% and weekday bookings doubled.",
    stats: [{ val: "+200%", label: "Traffic" }, { val: "2x", label: "Weekday Bookings" }, { val: "98", label: "Lighthouse Score" }],
    tech: ["React", "Framer Motion", "OpenTable API", "Cloudflare"],
    gradient: "rgba(244,114,182,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(34,211,238,0.06) 100%",
  },
];
