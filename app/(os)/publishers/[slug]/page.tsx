import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BookCard } from "@/components/library/book-card";
import { getAllBooksFromDb } from "@/lib/db-books";
import { getPublisherBooks } from "@/lib/publishers";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const publisher = getPublisherBooks(slug, books);
  return { title: publisher ? `${publisher.name} — BringBooks` : "BringBooks" };
}

export default async function PublisherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  const publisher = getPublisherBooks(slug, books);
  if (!publisher) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/publishers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Publishers
      </Link>

      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <BookOpen className="size-6 text-gold" />
          {publisher.name}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {publisher.books.length}{" "}
          {publisher.books.length === 1 ? "book" : "books"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {publisher.books.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} />
        ))}
      </div>
    </div>
  );
}
