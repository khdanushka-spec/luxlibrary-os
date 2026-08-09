"use client";

import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { Reveal } from "./reveal";

const SHELF_ROW_COLORS = [
  ["bg-rose-400/50", "bg-gold/60", "bg-emerald-400/45", "bg-sky-400/45", "bg-gold/35", "bg-orange-300/50", "bg-violet-400/40", "bg-teal-300/45"],
  ["bg-gold/45", "bg-sky-300/50", "bg-rose-300/45", "bg-emerald-300/40", "bg-gold/60", "bg-amber-200/55", "bg-violet-300/45", "bg-gold/30"],
  ["bg-emerald-400/40", "bg-gold/55", "bg-sky-400/40", "bg-rose-400/40", "bg-orange-300/45", "bg-gold/40", "bg-teal-300/50", "bg-violet-400/35"],
];

export function LibraryMapSection() {
  return (
    <section id="library-map" className="border-t border-border/60 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-medium tracking-[0.2em] text-gold">
            LIBRARY MAP
          </span>
          <h2 className="font-display mt-4 text-balance text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Every shelf, exactly as it stands in your room
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            The Library Map mirrors your physical shelves — drag a book to a
            new spot and it moves in real life, too. Empty spaces are marked,
            shelf labels and QR tags print in one click, and any of your 2,000
            books is a search away from being found.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
            {[
              "Drag-and-drop shelf editing that mirrors reality",
              "Printable shelf labels and QR codes",
              "Instant “where is this book” lookup",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass rounded-2xl border border-border/70 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>SHELF B4 &middot; HISTORY &amp; PHILOSOPHY</span>
              <span className="text-gold">32 books</span>
            </div>
            <div className="space-y-3">
              {SHELF_ROW_COLORS.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex h-16 items-end gap-1 rounded-lg border border-border/50 bg-secondary/25 p-2"
                >
                  {row.map((color, i) => {
                    const highlighted = rowIndex === 1 && i === 4;
                    return (
                      <motion.div
                        key={i}
                        className={`relative ${color} rounded-[2px]`}
                        style={{
                          width: `${100 / row.length - 1}%`,
                          height: `${50 + ((i * 29) % 45)}%`,
                        }}
                        animate={
                          highlighted
                            ? { boxShadow: [
                                "0 0 0 0 rgba(212,166,87,0)",
                                "0 0 0 4px rgba(212,166,87,0.45)",
                                "0 0 0 0 rgba(212,166,87,0)",
                              ] }
                            : undefined
                        }
                        transition={
                          highlighted
                            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
