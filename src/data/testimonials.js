// Inline SVG avatar data URIs -- eliminates external DiceBear API calls
const avatar = (initials, bg) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="${bg}"/><text x="24" y="25" text-anchor="middle" dominant-baseline="central" font-family="Inter,system-ui,sans-serif" font-size="18" font-weight="600" fill="#fff">${initials}</text></svg>`)}`;

export const testimonials = [
  {
    quote: "We went from a Wix site nobody visited to a platform that books out our classes two weeks in advance. The AI recommendations alone changed our business.",
    name: "Maya Torres",
    role: "Founder, Solace Wellness",
    avatar: avatar("MT", "#3b82f6"),
  },
  {
    quote: "They built our site in a week and it looks like we spent ten times what we paid. Reservations are up, the menu updates itself, and I haven't thought about the website since launch.",
    name: "Marco DeLuca",
    role: "Owner, Brick & Vine",
    avatar: avatar("MD", "#8b5cf6"),
  },
  {
    quote: "Our old quoting process was killing deals. QR8 built us a dashboard that does in seconds what used to take hours. We closed more freight in the first month than the entire previous quarter.",
    name: "James Whitfield",
    role: "CEO, Apex Freight",
    avatar: avatar("JW", "#6366f1"),
  },
];
