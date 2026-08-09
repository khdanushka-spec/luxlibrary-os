import { LogoMark } from "./logo-mark";

const COLUMNS = [
  {
    title: "Product",
    links: ["Library", "Library Map", "AI Librarian", "Analytics"],
  },
  {
    title: "Collection",
    links: ["Wishlist", "Reading Life", "Notes", "Timeline"],
  },
  {
    title: "Company",
    links: ["Design Principles", "Roadmap", "Security", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-5 w-5" />
              <span className="font-display text-base text-foreground">
                LuxLibrary <span className="text-gold">OS</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The world&apos;s most beautiful personal library — built for
              those who love books.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-medium text-foreground">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} LuxLibrary OS. Crafted for book collectors.</span>
          <span>Designed to feel like Apple, Notion, and a beloved reading room.</span>
        </div>
      </div>
    </footer>
  );
}
