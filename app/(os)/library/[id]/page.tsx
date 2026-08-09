import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, MapPin, Quote, Sparkles, Star, Tag } from "lucide-react";
import { DeleteBookButton } from "@/components/library/delete-book-button";
import { EditBookDialog } from "@/components/library/edit-book-dialog";
import { hashCode } from "@/lib/book-detail";
import { STATUS_CONFIG } from "@/lib/book-status";
import { getBookDetailFromDb } from "@/lib/db-books";
import { coverGradient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getBookDetailFromDb(id);
  return { title: detail ? `${detail.book.title} — LuxLibrary OS` : "LuxLibrary OS" };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getBookDetailFromDb(id);
  if (!detail) notFound();

  const { book } = detail;
  const status = STATUS_CONFIG[book.status];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Library
        </Link>
        <div className="flex items-center gap-3">
          <EditBookDialog
            id={book.id}
            title={book.title}
            author={book.author}
            genre={book.genre}
            format={book.format}
            status={book.status}
            rating={book.rating}
          />
          <DeleteBookButton id={book.id} />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
        <div
          className={cn(
            "aspect-[2/3] w-full rounded-xl bg-gradient-to-br shadow-lg",
            coverGradient(hashCode(book.id))
          )}
        />

        <div>
          <span
            className={cn(
              "inline-block rounded-full border px-2.5 py-1 text-xs font-medium",
              status.className
            )}
          >
            {status.label}
          </span>
          <h1 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-1.5 text-muted-foreground">{book.author}</p>

          {book.rating && (
            <div className="mt-3 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-4",
                    i < book.rating! ? "fill-gold text-gold" : "text-border"
                  )}
                />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {[book.genre, book.format, `${book.year}`, `${book.pages} pages`].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground"
                >
                  {chip}
                </span>
              )
            )}
          </div>

          <div className="mt-5 flex items-center gap-1.5 text-sm text-gold">
            <MapPin className="size-4" />
            Shelf {detail.shelf}
            {detail.shelfPosition ? `, position ${detail.shelfPosition}` : ""}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {detail.summary && (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <BookOpen className="size-4 text-gold" />
              Summary
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {detail.summary}
            </p>
          </div>
        )}

        {detail.aiSummary && (
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.05] p-6 sm:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gold">
              <Sparkles className="size-4" />
              AI Summary
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {detail.aiSummary}
            </p>
          </div>
        )}

        {detail.favoriteQuote && (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Quote className="size-4 text-gold" />
              Favorite Quote
            </h3>
            <p className="font-display text-lg italic leading-relaxed text-foreground">
              {detail.favoriteQuote}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Details</h3>
          <dl className="space-y-2.5 text-sm">
            {[
              ["Publisher", detail.publisher],
              ["Language", detail.language],
              ["ISBN-13", detail.isbn13],
              ["Condition", detail.condition],
              [
                "Purchase price",
                detail.purchasePrice ? `$${detail.purchasePrice.toFixed(2)}` : undefined,
              ],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right text-foreground">{value}</dd>
                </div>
              ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
            <Tag className="size-4 text-gold" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {detail.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
