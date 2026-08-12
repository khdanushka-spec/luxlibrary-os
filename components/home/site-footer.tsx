import { LogoMark } from "./logo-mark";
import { CONTACT_EMAIL } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Library", href: "#library-map" },
      { label: "Library Map", href: "#library-map" },
      { label: "AI Librarian", href: "#ai-librarian" },
      { label: "Analytics", href: "#analytics" },
    ],
  },
  {
    title: "Collection",
    links: [
      { label: "Wishlist", href: "#" },
      { label: "Reading Life", href: "#reading-life" },
      { label: "Notes", href: "#" },
      { label: "Timeline", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Design Principles", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Security", href: "#" },
      { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-5 w-5" />
              <span className="font-display text-base text-foreground">
                Bring<span className="text-gold">Books</span>
              </span>
            </div>
            <p className="mt-4 text-sm italic text-muted-foreground">
              Your books. Your library. Your world.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-medium text-foreground">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} BringBooks. Crafted for book collectors.</span>
          <span>Designed to feel like Apple, Notion, and a beloved reading room.</span>
        </div>
      </div>
    </footer>
  );
}
