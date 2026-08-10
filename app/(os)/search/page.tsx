import Link from "next/link";
import { Search as SearchIcon, User as UserIcon } from "lucide-react";
import { BookCard } from "@/components/library/book-card";
import { getAllBooksFromDb, searchQuotesFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return { title: q ? `“${q}” — Search — LuxLibrary OS` : "Search — LuxLibrary OS" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const user = (await getCurrentUser())!;

  if (!query) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <SearchIcon className="size-6 text-gold" />
          Search
        </h1>
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          Search your titles, authors, genres, and favorite quotes from the
          box above.
        </div>
      </div>
    );
  }

  const allBooks = await getAllBooksFromDb(user.id);

  const matchingBooks = allBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query) ||
      b.genre.toLowerCase().includes(query)
  );

  const matchingAuthors = Array.from(
    new Map(
      allBooks
        .filter((b) => b.author.toLowerCase().includes(query))
        .map((b) => [b.author, b.author])
    ).values()
  );

  const matchingQuotes = await searchQuotesFromDb(user.id, query);

  const totalResults =
    matchingBooks.length + matchingAuthors.length + matchingQuotes.length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <SearchIcon className="size-6 text-gold" />
          Search
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {totalResults} results for &ldquo;{q}&rdquo;
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          Nothing matches &ldquo;{q}&rdquo;.
        </div>
      ) : (
        <>
          {matchingBooks.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-medium text-foreground">
                Books ({matchingBooks.length})
              </h2>
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {matchingBooks.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} />
                ))}
              </div>
            </section>
          )}

          {matchingAuthors.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-medium text-foreground">
                Authors ({matchingAuthors.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                {matchingAuthors.map((author) => (
                  <Link
                    key={author}
                    href={`/library?q=${encodeURIComponent(author)}`}
                    className="flex items-center gap-2 rounded-full border border-border/70 bg-card/60 py-1.5 pl-1.5 pr-4 text-sm text-foreground transition-colors hover:border-gold/40"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs">
                      <UserIcon className="size-3" />
                    </span>
                    {author}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {matchingQuotes.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-medium text-foreground">
                Quotes ({matchingQuotes.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {matchingQuotes.map(({ book, favoriteQuote }) => (
                  <Link
                    key={book.id}
                    href={`/library/${book.id}`}
                    className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-6 transition-colors hover:border-gold/40"
                  >
                    <p className="font-display text-lg italic leading-relaxed text-foreground">
                      {favoriteQuote}
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      — {book.title}, {book.author}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
