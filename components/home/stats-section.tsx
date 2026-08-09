import { AnimatedCounter } from "./animated-counter";
import { Reveal } from "./reveal";

const STATS = [
  { value: 2148, suffix: "", label: "Books catalogued" },
  { value: 46, suffix: " days", label: "Current reading streak" },
  { value: 128, suffix: "ms", prefix: "<", label: "Average search time" },
  { value: 61, suffix: "", label: "Countries represented" },
];

export function StatsSection() {
  return (
    <section className="border-b border-border/60 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 sm:grid-cols-4 sm:gap-6">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center">
            <div className="font-display text-4xl text-gold sm:text-5xl">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix ?? ""}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {stat.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
