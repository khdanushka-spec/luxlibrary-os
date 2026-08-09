import { Sparkles } from "lucide-react";
import { hashCode } from "@/lib/book-detail";
import { coverGradient, type MockBook } from "@/lib/mock-data";

type TodaysPickCardProps = {
  pick: { book: MockBook; reason: string } | null;
};

export function TodaysPickCard({ pick }: TodaysPickCardProps) {
  if (!pick) return null;
  const { book, reason } = pick;

  return (
    <div className="flex gap-5 rounded-2xl border border-gold/20 bg-gold/[0.05] p-6">
      <div
        className={`h-28 w-20 shrink-0 rounded-lg bg-gradient-to-br shadow-lg ${coverGradient(
          hashCode(book.id)
        )}`}
      />
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wide text-gold">
          <Sparkles className="size-3.5" />
          TODAY&apos;S READING SUGGESTION
        </div>
        <h3 className="font-display text-xl text-foreground">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {reason}
        </p>
      </div>
    </div>
  );
}
