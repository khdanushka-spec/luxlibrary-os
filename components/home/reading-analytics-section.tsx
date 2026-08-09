"use client";

import { motion } from "motion/react";
import { BookMarked, Flame } from "lucide-react";
import { Reveal } from "./reveal";

const CURRENTLY_READING = [
  { title: "Project Hail Mary", author: "Andy Weir", progress: 72 },
  { title: "The Overstory", author: "Richard Powers", progress: 34 },
  { title: "Klara and the Sun", author: "Kazuo Ishiguro", progress: 91 },
];

const DECADE_BARS = [
  { label: "'70s", value: 18 },
  { label: "'80s", value: 32 },
  { label: "'90s", value: 46 },
  { label: "'00s", value: 68 },
  { label: "'10s", value: 100 },
  { label: "'20s", value: 74 },
];

export function ReadingAnalyticsSection() {
  return (
    <section className="border-t border-border/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-medium tracking-[0.2em] text-gold">
            YOUR READING LIFE
          </span>
          <h2 className="font-display mt-4 text-balance text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Beautiful by the numbers
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal id="reading-life">
            <div className="h-full rounded-2xl border border-border/70 bg-card/60 p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookMarked className="size-4 text-gold" />
                  Currently Reading
                </h3>
                <span className="flex items-center gap-1 text-xs text-gold">
                  <Flame className="size-3.5" />
                  46-day streak
                </span>
              </div>
              <div className="space-y-5">
                {CURRENTLY_READING.map((book) => (
                  <div key={book.title}>
                    <div className="mb-1.5 flex items-baseline justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {book.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {book.author}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${book.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} id="analytics">
            <div className="h-full rounded-2xl border border-border/70 bg-card/60 p-7">
              <h3 className="mb-6 text-sm font-medium text-foreground">
                Collection by Decade
              </h3>
              <div className="flex h-40 items-end gap-4">
                {DECADE_BARS.map((bar, i) => (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.value}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="w-full rounded-t-md bg-gradient-to-t from-gold/30 to-gold"
                      style={{ maxHeight: "9rem" }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
