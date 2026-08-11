import { LiveClock, LiveDate, LiveGreeting } from "@/components/dashboard/live-clock";
import { EditableStreakBadge } from "@/components/dashboard/editable-streak-badge";

export function WelcomeBanner({ name, streakDays }: { name: string; streakDays: number }) {
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
      <EditableStreakBadge initialDays={streakDays} />
    </div>
  );
}
