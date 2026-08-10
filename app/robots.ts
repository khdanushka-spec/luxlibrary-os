import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The entire (os) app shell sits behind auth and is per-user private library
// data - disallowed explicitly (rather than relying on the login redirect)
// so crawlers don't waste budget on pages they can never actually see.
// Keep this list in sync with the top-level routes in lib/nav.ts + the
// admin/master-library/pending pages.
const PRIVATE_PATHS = [
  "/dashboard",
  "/search",
  "/library",
  "/collections",
  "/library-map",
  "/wishlist",
  "/authors",
  "/publishers",
  "/series",
  "/genres",
  "/reading",
  "/quotes",
  "/notes",
  "/timeline",
  "/ai",
  "/analytics",
  "/settings",
  "/profile",
  "/admin",
  "/master-library",
  "/pending",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
