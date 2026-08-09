import { Star } from "lucide-react";
import { STATUS_CONFIG } from "@/lib/book-status";
import { coverGradient, type MockBook } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookListRow({ book, index }: { book: MockBook; index: number }) {
  const status = STATUS_CONFIG[book.status];

  return (
    <div className="flex items-center gap-4 border-b border-border/60 py-3 last:border-b-0">
      <div
        className={cn(
          "h-14 w-10 shrink-0 rounded bg-gradient-to-br",
          coverGradient(index)
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {book.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {book.author} · {book.genre} · {book.year}
        </p>
      </div>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {book.format}
      </span>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {book.pages}p
      </span>
      {book.rating ? (
        <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-3",
                i < book.rating! ? "fill-gold text-gold" : "text-border"
              )}
            />
          ))}
        </div>
      ) : (
        <span className="hidden w-[70px] shrink-0 sm:block" />
      )}
      <span
        className={cn(
          "shrink-0 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium",
          status.className
        )}
      >
        {status.label}
      </span>
    </div>
  );
}
