import { Bot } from "lucide-react";
import { MOCK_AI_INSIGHTS } from "@/lib/mock-data";

export function AiInsightsCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
        <Bot className="size-4 text-gold" />
        AI Insights
      </h3>
      <ul className="space-y-3">
        {MOCK_AI_INSIGHTS.map((insight) => (
          <li
            key={insight}
            className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
