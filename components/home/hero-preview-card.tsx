"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useSpring } from "motion/react";
import { BookOpen, Flame, Sparkles, TrendingUp } from "lucide-react";

const SPINE_COLORS = [
  "bg-gold/70",
  "bg-rose-400/60",
  "bg-emerald-400/50",
  "bg-sky-400/50",
  "bg-amber-200/60",
  "bg-violet-400/50",
  "bg-gold/40",
  "bg-orange-300/55",
  "bg-teal-300/50",
  "bg-gold/60",
  "bg-rose-300/45",
  "bg-sky-300/45",
];

const STATS = [
  { icon: BookOpen, label: "Books catalogued", value: "2,148" },
  { icon: Flame, label: "Reading streak", value: "46 days" },
  { icon: TrendingUp, label: "Added this month", value: "+12" },
];

export function HeroPreviewCard() {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });
  const transform = useMotionTemplate`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 6);
    rotateX.set(py * -6);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform }}
      className="glass overflow-hidden rounded-3xl border border-border/70 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose-400/70" />
          <span className="size-2.5 rounded-full bg-amber-300/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-gold" />
          Good evening, welcome back
        </div>
      </div>

      <div className="grid gap-px bg-border/50 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-card px-6 py-5">
            <stat.icon className="mb-3 size-4 text-gold" />
            <div className="font-display text-2xl text-foreground">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            SHELF · LITERATURE, A&ndash;F
          </span>
          <span className="text-xs text-gold">View library map →</span>
        </div>
        <div className="flex h-24 items-end gap-1 rounded-xl border border-border/50 bg-secondary/30 p-3">
          {SPINE_COLORS.map((color, i) => (
            <div
              key={i}
              className={`${color} rounded-[3px]`}
              style={{
                width: `${100 / SPINE_COLORS.length - 0.6}%`,
                height: `${55 + ((i * 37) % 45)}%`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
