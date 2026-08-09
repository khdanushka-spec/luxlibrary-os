import { prisma } from "@/lib/prisma";
import type { BookFormat, BookStatus, MockBook } from "@/lib/mock-data";

function toTitleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function humanizeEnum(value: string) {
  return value
    .split("_")
    .map((word) => toTitleCase(word))
    .join(" ");
}

const bookInclude = {
  contributors: { include: { author: true } },
  genres: { include: { genre: true } },
  publisher: true,
  series: true,
  shelf: true,
} as const;

type DbBook = Awaited<ReturnType<typeof prisma.book.findFirstOrThrow<{ include: typeof bookInclude }>>>;

function toMockBook(book: DbBook): MockBook {
  return {
    id: book.id,
    title: book.title,
    author: book.contributors[0]?.author.name ?? "Unknown",
    genre: book.genres[0]?.genre.name ?? "Uncategorized",
    format: toTitleCase(book.format) as BookFormat,
    status: book.readingStatus.toLowerCase() as BookStatus,
    rating: book.rating,
    pages: book.pages ?? 0,
    year: book.publicationYear ?? 0,
    series: book.series?.name,
    seriesVolume: book.volume ?? undefined,
  };
}

export async function getAllBooksFromDb(): Promise<MockBook[]> {
  const books = await prisma.book.findMany({ include: bookInclude });
  return books.map(toMockBook);
}

export async function getBookDetailFromDb(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      ...bookInclude,
      quotes: true,
    },
  });
  if (!book) return null;

  return {
    book: toMockBook(book),
    publisher: book.publisher?.name ?? "Unknown",
    shelf: book.shelf?.label ?? "Unshelved",
    shelfPosition: book.shelfPosition ?? undefined,
    isbn13: book.isbn13 ?? undefined,
    language: book.language ?? "English",
    purchasePrice: book.purchasePrice ? Number(book.purchasePrice) : undefined,
    condition: book.condition ? humanizeEnum(book.condition) : undefined,
    summary: book.summary ?? undefined,
    aiSummary: book.aiSummary ?? undefined,
    favoriteQuote: book.quotes[0]?.text ?? null,
    tags: [
      book.genres[0]?.genre.name,
      toTitleCase(book.format),
      book.publicationYear ? `${Math.floor(book.publicationYear / 10) * 10}s` : undefined,
    ].filter((t): t is string => Boolean(t)),
  };
}
