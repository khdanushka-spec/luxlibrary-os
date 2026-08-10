import Link from "next/link";
import { Quote as QuoteIcon } from "lucide-react";
import { AddQuoteDialog } from "@/components/quotes/add-quote-dialog";
import { DeleteQuoteButton } from "@/components/quotes/delete-quote-button";
import { getAllBooksFromDb, getQuotesFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Quotes — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const user = (await getCurrentUser())!;
  const [quotes, books] = await Promise.all([getQuotesFromDb(user.id), getAllBooksFromDb(user.id)]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
            <QuoteIcon className="size-6 text-gold" />
            Quotes
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {quotes.length} favorite passages from your library
          </p>
        </div>
        <AddQuoteDialog books={books.map((b) => ({ id: b.id, title: b.title, author: b.author }))} />
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          No favorite quotes yet — add one from a book you love.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quotes.map(({ id, book, favoriteQuote, pageNumber }) => (
            <Link
              key={id}
              href={`/library/${book.id}`}
              className="group relative rounded-2xl border border-gold/20 bg-gold/[0.05] p-6 transition-colors hover:border-gold/40"
            >
              <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <DeleteQuoteButton id={id} />
              </div>
              <p className="font-display pr-6 text-lg italic leading-relaxed text-foreground">
                {favoriteQuote}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — {book.title}, {book.author}
                {pageNumber ? `, p. ${pageNumber}` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
