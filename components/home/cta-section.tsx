import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

export function CtaSection() {
  return (
    <section
      id="cta"
      className="bg-radial-glow relative overflow-hidden border-t border-border/60 py-32"
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <h2 className="font-display text-balance text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Your library, <span className="italic text-gold">reimagined.</span>
          </h2>
          <p className="mt-5 text-balance text-muted-foreground">
            Bring your 2,000 books into an operating system built to match
            how much you love them.
          </p>
          <a
            href="mailto:hello@bringbooks.com"
            className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-8 text-[0.95rem] font-medium text-gold-foreground shadow-[0_0_0_1px_rgba(212,166,87,0.3),0_8px_30px_-8px_rgba(212,166,87,0.55)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Request early access
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
