import Link from "next/link";
import { coverGradient, type MockBook } from "@/lib/mock-data";

type RecentlyAddedShelfProps = {
  books: MockBook[];
};

export function RecentlyAddedShelf({ books }: RecentlyAddedShelfProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Recently Added</h3>
        <Link href="/library" className="text-xs text-gold">
          View library &rarr;
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {books.map((book, i) => (
          <Link key={book.id} href={`/library/${book.id}`} className="w-24 shrink-0">
            <div
              className={`h-32 w-24 rounded-lg bg-gradient-to-br shadow-md ${coverGradient(i)}`}
            />
            <p className="mt-2 truncate text-xs font-medium text-foreground">
              {book.title}
            </p>
            <p className="truncate text-[0.7rem] text-muted-foreground">
              {book.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
