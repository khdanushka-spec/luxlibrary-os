import Link from "next/link";
import { Tags } from "lucide-react";
import { getAllBooksFromDb } from "@/lib/db-books";
import type { MockBook } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Genres — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

function getGenres(books: MockBook[]) {
  const map = new Map<string, number>();
  for (const book of books) {
    map.set(book.genre, (map.get(book.genre) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function GenresPage() {
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const genres = getGenres(books);
  const max = Math.max(...genres.map((g) => g.count));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Tags className="size-6 text-gold" />
          Genres
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {genres.length} genres represented
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {genres.map((genre) => (
          <Link
            key={genre.label}
            href={`/library?genre=${encodeURIComponent(genre.label)}`}
            className="rounded-2xl border border-border/70 bg-card/60 p-5 transition-colors hover:border-gold/40 hover:bg-card"
          >
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-foreground">
                {genre.label}
              </p>
              <span className="text-xs text-muted-foreground">
                {genre.count} {genre.count === 1 ? "book" : "books"}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold"
                style={{ width: `${(genre.count / max) * 100}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
