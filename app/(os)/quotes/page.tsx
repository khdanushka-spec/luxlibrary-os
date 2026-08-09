import Link from "next/link";
import { Quote as QuoteIcon } from "lucide-react";
import { getBookDetail } from "@/lib/book-detail";
import { MOCK_BOOKS } from "@/lib/mock-data";

export const metadata = {
  title: "Quotes — LuxLibrary OS",
};

export default function QuotesPage() {
  const quotes = MOCK_BOOKS.map((book) => ({
    book,
    detail: getBookDetail(book),
  })).filter((entry) => entry.detail.favoriteQuote);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <QuoteIcon className="size-6 text-gold" />
          Quotes
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {quotes.length} favorite passages from your highest-rated books
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          No favorite quotes yet — rate a book 4 or 5 stars to see it here.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quotes.map(({ book, detail }) => (
            <Link
              key={book.id}
              href={`/library/${book.id}`}
              className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-6 transition-colors hover:border-gold/40"
            >
              <p className="font-display text-lg italic leading-relaxed text-foreground">
                {detail.favoriteQuote}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — {book.title}, {book.author}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
