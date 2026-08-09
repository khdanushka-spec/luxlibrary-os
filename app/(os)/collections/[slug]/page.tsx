import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { BookCard } from "@/components/library/book-card";
import { getCollection, getCollectionBooks } from "@/lib/collections";
import { getAllBooksFromDb } from "@/lib/db-books";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  return { title: collection ? `${collection.title} — LuxLibrary OS` : "LuxLibrary OS" };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const allBooks = await getAllBooksFromDb();
  const books = getCollectionBooks(collection, allBooks);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Collections
      </Link>

      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <LayoutGrid className="size-6 text-gold" />
          {collection.title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {collection.description} &middot; {books.length}{" "}
          {books.length === 1 ? "book" : "books"}
        </p>
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-border/70 bg-card/60 py-20 text-center text-sm text-muted-foreground">
          Nothing in this collection yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
