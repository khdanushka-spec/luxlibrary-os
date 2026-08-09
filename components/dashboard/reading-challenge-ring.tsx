import { MOCK_READING_CHALLENGE } from "@/lib/mock-data";

type ReadingChallengeRingProps = {
  completed: number;
};

export function ReadingChallengeRing({ completed }: ReadingChallengeRingProps) {
  const { goal, year } = MOCK_READING_CHALLENGE;
  const pct = Math.min(100, Math.round((completed / goal) * 100));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <h3 className="mb-5 text-sm font-medium text-foreground">
        {year} Reading Challenge
      </h3>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 100 100" className="size-24 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-secondary"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-gold"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div>
          <div className="font-display text-2xl text-foreground">
            {completed}
            <span className="text-base text-muted-foreground"> / {goal}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            books read this year
          </p>
        </div>
      </div>
    </div>
  );
}
