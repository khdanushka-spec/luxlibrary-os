import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BringBooks — The world's most beautiful personal library",
    short_name: "BringBooks",
    description:
      "The operating system for passionate book collectors — an elegant, AI-first home for a 2,000+ volume personal library.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#100d0a",
    theme_color: "#100d0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
