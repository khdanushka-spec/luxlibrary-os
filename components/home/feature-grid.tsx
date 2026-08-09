import {
  BarChart3,
  Bot,
  LayoutDashboard,
  Map,
  ScanLine,
  Search,
} from "lucide-react";
import { Reveal } from "./reveal";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Home Dashboard",
    description:
      "Today's reading suggestion, collection growth, streaks, and AI insights — the pulse of your library in one glance.",
    span: "sm:col-span-3",
  },
  {
    icon: Bot,
    title: "AI Librarian",
    description:
      "Ask it anything: “Which books mention quantum physics?” It knows your entire collection.",
    span: "sm:col-span-3",
  },
  {
    icon: Map,
    title: "Library Map",
    description:
      "A visual bookshelf that mirrors your physical shelves. Drag, locate, and label instantly.",
    span: "sm:col-span-2",
  },
  {
    icon: Search,
    title: "Spotlight Search",
    description:
      "Instant search across titles, notes, quotes, and covers — semantic, voice, and image search included.",
    span: "sm:col-span-2",
  },
  {
    icon: ScanLine,
    title: "Effortless Import",
    description:
      "Scan a barcode or ISBN and metadata, covers, and summaries arrive automatically.",
    span: "sm:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Reading speed, collection value, favorite genres, and growth — visualized beautifully.",
    span: "sm:col-span-2",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-medium tracking-[0.2em] text-gold">
            EVERYTHING, IN ITS PLACE
          </span>
          <h2 className="font-display mt-4 text-balance text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            One home for a lifetime of books
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Every module is designed around a single idea: your library
            should feel as alive and considered as the books on its shelves.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={i * 0.06}
              className={feature.span}
            >
              <div className="group h-full rounded-2xl border border-border/70 bg-card/60 p-7 transition-colors hover:border-gold/40 hover:bg-card">
                <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold/15">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
