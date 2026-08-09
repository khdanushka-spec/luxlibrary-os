"use client";

import { motion } from "motion/react";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { HeroPreviewCard } from "./hero-preview-card";

export function HeroSection() {
  return (
    <section
      id="top"
      className="bg-radial-glow bg-noise relative overflow-hidden pt-36 pb-28 sm:pt-44 sm:pb-36"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-1.5 text-xs font-medium tracking-wide text-gold"
        >
          <Sparkles className="size-3.5" />
          An AI-first operating system for book collectors
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-balance text-5xl leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          The world&apos;s most{" "}
          <span className="italic text-gold">beautiful</span>
          <br className="hidden sm:block" /> personal library.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground"
        >
          LuxLibrary OS turns a 2,000&#8209;volume collection into a living,
          intelligent library — every book catalogued, mapped, and understood
          by an AI librarian that knows your shelves better than you do.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href="#cta"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-[0.95rem] font-medium text-gold-foreground shadow-[0_0_0_1px_rgba(212,166,87,0.3),0_8px_30px_-8px_rgba(212,166,87,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Enter your library
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#ai-librarian"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-7 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <PlayCircle className="size-4" />
            See the AI Librarian
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-20 max-w-5xl px-6"
      >
        <HeroPreviewCard />
      </motion.div>
    </section>
  );
}
