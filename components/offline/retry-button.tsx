"use client";

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="inline-flex h-10 items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-medium text-gold-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      Try again
    </button>
  );
}
