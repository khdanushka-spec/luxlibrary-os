import { Flame } from "lucide-react";
import { LiveClock, LiveDate, LiveGreeting } from "@/components/dashboard/live-clock";
import { MOCK_STATS } from "@/lib/mock-data";

export function WelcomeBanner({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">
          <LiveGreeting name={name} />
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <LiveDate />
          <span className="text-border">·</span>
          <LiveClock />
        </p>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/[0.06] px-4 py-2 text-sm font-medium text-gold">
        <Flame className="size-4" />
        {MOCK_STATS.readingStreakDays}-day reading streak
      </div>
    </div>
  );
}
