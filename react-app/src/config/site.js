/**
 * Site Configuration
 * 
 * Centralised configuration for site-wide metadata, canonical domain,
 * OpenGraph previews, and educational organization info.
 * 
 * NOTE: Update `url` with your production domain before launching
 * (e.g., "https://gtumaths.vercel.app" or your custom domain).
 */

export const SITE_CONFIG = {
  name: "GTU Mathematics Question Bank",
  shortName: "GTU Maths QB",
  description:
    "Free GTU previous year exam questions for Mathematics 1, Mathematics 2, Probability & Statistics, and Discrete Mathematics. Searchable, filterable question bank with exam session filters.",
  // Production base URL (no trailing slash)
  url: "https://your-domain.com",
  ogImage: "/og-image.png",
  author: "GTU Question Bank",
  themeColor: "#152238",
  supportedSubjects: ["m1", "m2", "ps", "dm"],
  university: {
    name: "Gujarat Technological University",
    shortName: "GTU",
    url: "https://www.gtu.ac.in",
  },
};
