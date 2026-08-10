import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Gem, Heart, MapPin, NotebookText, Quote, Sparkles, Star, Tag } from "lucide-react";
import { DeleteBookButton } from "@/components/library/delete-book-button";
import { EditBookDialog } from "@/components/library/edit-book-dialog";
import { AddNoteDialog } from "@/components/notes/add-note-dialog";
import { DeleteNoteButton } from "@/components/notes/delete-note-button";
import { AddQuoteDialog } from "@/components/quotes/add-quote-dialog";
import { DeleteQuoteButton } from "@/components/quotes/delete-quote-button";
import { hashCode } from "@/lib/book-detail";
import { STATUS_CONFIG } from "@/lib/book-status";
import { getBookDetailFromDb, getNotesForBookFromDb, getShelfOptionsFromDb } from "@/lib/db-books";
import { coverGradient } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getBookDetailFromDb(id);
  return { title: detail ? `${detail.book.title} — BringBooks` : "BringBooks" };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = (await getCurrentUser())!;
  const [detail, shelves, notes] = await Promise.all([
    getBookDetailFromDb(id),
    getShelfOptionsFromDb(user.id),
    getNotesForBookFromDb(id),
  ]);
  if (!detail) notFound();
  if (detail.userId !== user.id && user.role !== "SUPER_ADMIN") notFound();

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
            publisher={book.publisher}
            isbn13={detail.isbn13}
            pages={book.pages || undefined}
            year={book.year || undefined}
            purchasePrice={detail.purchasePrice}
            series={book.series}
            seriesVolume={book.seriesVolume}
            condition={detail.rawCondition}
            language={detail.rawLanguage}
            personalReview={detail.personalReview}
            personalNotes={detail.personalNotes}
            purchaseDate={detail.purchaseDate}
            purchaseSeller={detail.purchaseSeller}
            currentMarketValue={detail.currentMarketValue}
            insuranceValue={detail.insuranceValue}
            readingProgressPercent={book.readingProgressPercent}
            tags={detail.tags.join(", ")}
            isFavorite={book.isFavorite}
            isRare={book.isRare}
            subtitle={detail.subtitle}
            isbn10={detail.isbn10}
            originalPublicationYear={detail.originalPublicationYear}
            country={detail.country}
            isSigned={detail.isSigned}
            isFirstEdition={detail.isFirstEdition}
            isLimitedEdition={detail.isLimitedEdition}
            weightGrams={detail.weightGrams}
            widthMm={detail.widthMm}
            heightMm={detail.heightMm}
            depthMm={detail.depthMm}
            qrCode={detail.qrCode}
            shelfId={detail.shelfId}
            shelfPosition={detail.shelfPosition}
            shelves={shelves}
            currentPage={detail.currentPage}
          />
          <DeleteBookButton id={book.id} />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
        {detail.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-pasted URLs, not worth whitelisting every possible cover host in next.config
          <img
            src={detail.coverImageUrl}
            alt={`${book.title} cover`}
            className="aspect-[2/3] w-full rounded-xl object-cover shadow-lg"
          />
        ) : (
          <div
            className={cn(
              "aspect-[2/3] w-full rounded-xl bg-gradient-to-br shadow-lg",
              coverGradient(hashCode(book.id))
            )}
          />
        )}

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
          {detail.subtitle && (
            <p className="font-display mt-0.5 text-lg text-muted-foreground">
              {detail.subtitle}
            </p>
          )}
          <p className="mt-1.5 text-muted-foreground">{book.author}</p>

          {(book.rating ||
            book.isFavorite ||
            book.isRare ||
            detail.isSigned ||
            detail.isFirstEdition ||
            detail.isLimitedEdition) && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {book.rating && (
                <div className="flex items-center gap-0.5">
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
              {book.isFavorite && (
                <span className="flex items-center gap-1 text-xs text-rose-400">
                  <Heart className="size-3.5 fill-rose-400" />
                  Favorite
                </span>
              )}
              {book.isRare && (
                <span className="flex items-center gap-1 text-xs text-gold">
                  <Gem className="size-3.5" />
                  Rare
                </span>
              )}
              {detail.isSigned && (
                <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground">
                  Signed
                </span>
              )}
              {detail.isFirstEdition && (
                <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground">
                  First edition
                </span>
              )}
              {detail.isLimitedEdition && (
                <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-xs text-muted-foreground">
                  Limited edition
                </span>
              )}
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

          {book.status === "reading" && book.readingProgressPercent !== undefined && (
            <div className="mt-5 max-w-xs">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Reading progress
                  {detail.currentPage && book.pages
                    ? ` — page ${detail.currentPage} of ${book.pages}`
                    : ""}
                </span>
                <span>{book.readingProgressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${book.readingProgressPercent}%` }}
                />
              </div>
            </div>
          )}
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

        {detail.personalReview && (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:col-span-2">
            <h3 className="mb-3 text-sm font-medium text-foreground">Your Review</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {detail.personalReview}
            </p>
          </div>
        )}

        {detail.personalNotes && (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:col-span-2">
            <h3 className="mb-3 text-sm font-medium text-foreground">Personal Notes</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {detail.personalNotes}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Details</h3>
          <dl className="space-y-2.5 text-sm">
            {[
              [
                "Series",
                book.series ? `${book.series}${book.seriesVolume ? ` #${book.seriesVolume}` : ""}` : undefined,
              ],
              ["Publisher", detail.publisher],
              ["Language", detail.language],
              ["Country", detail.country],
              ["ISBN-13", detail.isbn13],
              ["ISBN-10", detail.isbn10],
              [
                "Originally published",
                detail.originalPublicationYear
                  ? `${detail.originalPublicationYear}`
                  : undefined,
              ],
              ["Condition", detail.condition],
              [
                "Purchase price",
                detail.purchasePrice ? `$${detail.purchasePrice.toFixed(2)}` : undefined,
              ],
              [
                "Purchased",
                detail.purchaseDate
                  ? new Date(detail.purchaseDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) + (detail.purchaseSeller ? ` from ${detail.purchaseSeller}` : "")
                  : detail.purchaseSeller
                    ? `From ${detail.purchaseSeller}`
                    : undefined,
              ],
              [
                "Market value",
                detail.currentMarketValue ? `$${detail.currentMarketValue.toFixed(2)}` : undefined,
              ],
              [
                "Insured value",
                detail.insuranceValue ? `$${detail.insuranceValue.toFixed(2)}` : undefined,
              ],
              [
                "Dimensions",
                detail.widthMm || detail.heightMm || detail.depthMm
                  ? `${detail.widthMm ?? "?"} × ${detail.heightMm ?? "?"} × ${detail.depthMm ?? "?"} mm`
                  : undefined,
              ],
              ["Weight", detail.weightGrams ? `${detail.weightGrams} g` : undefined],
              ["QR code", detail.qrCode],
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
          {detail.tags.length > 0 ? (
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
          ) : (
            <p className="text-xs text-muted-foreground">
              No tags yet — add some from Edit.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <NotebookText className="size-4 text-gold" />
              Notes
            </h3>
            <AddNoteDialog lockedBookId={book.id} lockedBookLabel={book.title} />
          </div>
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-border/70 bg-secondary/20 p-4">
                  <div className="mb-1.5 flex items-baseline justify-between gap-4">
                    {note.title ? (
                      <p className="text-sm font-medium text-foreground">{note.title}</p>
                    ) : (
                      <span />
                    )}
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <DeleteNoteButton id={note.id} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No notes yet for this book.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6 sm:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Quote className="size-4 text-gold" />
              Quotes
            </h3>
            <AddQuoteDialog lockedBookId={book.id} lockedBookLabel={book.title} />
          </div>
          {detail.quotes.length > 0 ? (
            <div className="space-y-4">
              {detail.quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="group relative rounded-xl border border-gold/20 bg-gold/[0.05] p-4"
                >
                  <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <DeleteQuoteButton id={quote.id} />
                  </div>
                  <p className="font-display pr-6 text-base italic leading-relaxed text-foreground">
                    {quote.text}
                  </p>
                  {quote.pageNumber && (
                    <p className="mt-2 text-xs text-muted-foreground">p. {quote.pageNumber}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No quotes saved from this book yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
