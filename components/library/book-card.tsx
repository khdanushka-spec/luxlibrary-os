import Link from "next/link";
import { Star } from "lucide-react";
import { STATUS_CONFIG } from "@/lib/book-status";
import { coverGradient, type MockBook } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookCard({ book, index }: { book: MockBook; index: number }) {
  const status = STATUS_CONFIG[book.status];

  return (
    <Link href={`/library/${book.id}`} className="group block">
      <div
        className={cn(
          "relative aspect-[2/3] w-full rounded-lg bg-gradient-to-br shadow-md transition-transform group-hover:-translate-y-1",
          coverGradient(index)
        )}
      >
        <span
          className={cn(
            "absolute right-2 top-2 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium",
            status.className
          )}
        >
          {status.label}
        </span>
      </div>
      <p className="mt-2.5 truncate text-sm font-medium text-foreground">
        {book.title}
      </p>
      <p className="truncate text-xs text-muted-foreground">{book.author}</p>
      {book.rating && (
        <div className="mt-1 flex items-center gap-0.5">
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
      )}
    </Link>
  );
}
