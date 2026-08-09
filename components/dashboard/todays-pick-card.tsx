import { Sparkles } from "lucide-react";
import { MOCK_TODAYS_PICK } from "@/lib/mock-data";

export function TodaysPickCard() {
  return (
    <div className="flex gap-5 rounded-2xl border border-gold/20 bg-gold/[0.05] p-6">
      <div
        className={`h-28 w-20 shrink-0 rounded-lg bg-gradient-to-br ${MOCK_TODAYS_PICK.coverColor} shadow-lg`}
      />
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide text-gold">
          <Sparkles className="size-3.5" />
          TODAY&apos;S READING SUGGESTION
        </div>
        <h3 className="font-display text-xl text-foreground">
          {MOCK_TODAYS_PICK.title}
        </h3>
        <p className="text-sm text-muted-foreground">{MOCK_TODAYS_PICK.author}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {MOCK_TODAYS_PICK.reason}
        </p>
      </div>
    </div>
  );
}
