import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gem } from "lucide-react";
import { BookCard } from "@/components/library/book-card";
import { getAllBooksFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";
import { getSeriesBySlug } from "@/lib/series";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const series = getSeriesBySlug(slug, books);
  return { title: series ? `${series.name} — LuxLibrary OS` : "LuxLibrary OS" };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const series = getSeriesBySlug(slug, books);
  if (!series) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/series"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Series
      </Link>

      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <Gem className="size-6 text-gold" />
          {series.name}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {series.books[0].author} &middot; {series.books.length} owned
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {series.books.map((book, i) => (
          <div key={book.id}>
            <BookCard book={book} index={i} />
            {book.seriesVolume && (
              <p className="mt-1 text-[0.7rem] text-gold">
                Book {book.seriesVolume}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
