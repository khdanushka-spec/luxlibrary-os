import { Reveal } from "./reveal";

export function QuoteSection() {
  return (
    <section className="border-t border-border/60 py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="font-display text-balance text-3xl italic leading-snug text-foreground sm:text-4xl">
            &ldquo;Never think like a developer. Think like the person who
            loves every book on the shelf.&rdquo;
          </p>
          <p className="mt-6 text-sm tracking-wide text-muted-foreground">
            THE LUXLIBRARY OS DESIGN PRINCIPLE
          </p>
        </Reveal>
      </div>
    </section>
  );
}
