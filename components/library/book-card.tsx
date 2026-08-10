import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { STATUS_CONFIG } from "@/lib/book-status";
import { coverGradient, type MockBook } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookCard({ book, index }: { book: MockBook; index: number }) {
  const status = STATUS_CONFIG[book.status];

  return (
    <Link href={`/library/${book.id}`} className="group block">
      <div
        className={cn(
          "relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md transition-transform group-hover:-translate-y-1",
          !book.coverImageUrl && `bg-gradient-to-br ${coverGradient(index)}`
        )}
      >
        {book.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-pasted URLs, not worth whitelisting every possible cover host in next.config
          <img
            src={book.coverImageUrl}
            alt={`${book.title} cover`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <span
          className={cn(
            "absolute right-2 top-2 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium",
            status.className
          )}
        >
          {status.label}
        </span>
        {book.isFavorite && (
          <Heart className="absolute left-2 top-2 size-3.5 fill-rose-400 text-rose-400 drop-shadow" />
        )}
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
