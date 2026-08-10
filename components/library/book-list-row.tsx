import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { STATUS_CONFIG } from "@/lib/book-status";
import { coverGradient, type MockBook } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function BookListRow({ book, index }: { book: MockBook; index: number }) {
  const status = STATUS_CONFIG[book.status];

  return (
    <Link
      href={`/library/${book.id}`}
      className="flex items-center gap-4 border-b border-border/60 py-3 transition-colors last:border-b-0 hover:bg-secondary/30"
    >
      {book.coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-pasted URLs, not worth whitelisting every possible cover host in next.config
        <img
          src={book.coverImageUrl}
          alt={`${book.title} cover`}
          className="h-14 w-10 shrink-0 rounded object-cover"
        />
      ) : (
        <div
          className={cn(
            "h-14 w-10 shrink-0 rounded bg-gradient-to-br",
            coverGradient(index)
          )}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
          {book.isFavorite && (
            <Heart className="size-3 shrink-0 fill-rose-400 text-rose-400" />
          )}
          <span className="truncate">{book.title}</span>
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
    </Link>
  );
}
