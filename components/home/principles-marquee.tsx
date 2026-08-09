const PRINCIPLES = [
  "Elegant",
  "Minimal",
  "Premium",
  "Fast",
  "AI First",
  "Emotionally Engaging",
  "Future Proof",
  "Zero Clutter",
  "Timeless",
];

export function PrinciplesMarquee() {
  const items = [...PRINCIPLES, ...PRINCIPLES];
  return (
    <div className="relative overflow-hidden border-y border-border/60 bg-secondary/20 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-10">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm font-medium tracking-wide text-muted-foreground"
          >
            {item}
            <span className="text-gold/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
