import { prisma } from "@/lib/prisma";
import type { BookFormat, BookStatus, MockBook } from "@/lib/mock-data";
import type { MockNote } from "@/lib/mock-notes";

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
    publisher: book.publisher?.name,
  };
}

export async function getAllBooksFromDb(): Promise<MockBook[]> {
  const books = await prisma.book.findMany({ include: bookInclude });
  return books.map(toMockBook);
}

export type LibrarianBook = MockBook & {
  shelf: string;
  shelfPosition?: number;
  aiSummary?: string;
};

export async function getLibrarianBooksFromDb(): Promise<LibrarianBook[]> {
  const books = await prisma.book.findMany({ include: bookInclude });
  return books.map((book) => ({
    ...toMockBook(book),
    shelf: book.shelf?.label ?? "Unshelved",
    shelfPosition: book.shelfPosition ?? undefined,
    aiSummary: book.aiSummary ?? undefined,
  }));
}

export async function getQuotesFromDb(): Promise<
  { book: MockBook; favoriteQuote: string }[]
> {
  const quotes = await prisma.quote.findMany({
    include: { book: { include: bookInclude } },
    orderBy: { createdAt: "desc" },
  });
  return quotes.map((q) => ({ book: toMockBook(q.book), favoriteQuote: q.text }));
}

export async function searchQuotesFromDb(
  query: string
): Promise<{ book: MockBook; favoriteQuote: string }[]> {
  const quotes = await prisma.quote.findMany({
    where: { text: { contains: query, mode: "insensitive" } },
    include: { book: { include: bookInclude } },
  });
  return quotes.map((q) => ({ book: toMockBook(q.book), favoriteQuote: q.text }));
}

export async function getCollectionValueFromDb() {
  const agg = await prisma.book.aggregate({
    _sum: { purchasePrice: true },
    _avg: { purchasePrice: true },
  });
  return {
    total: agg._sum.purchasePrice ? Number(agg._sum.purchasePrice) : 0,
    average: agg._avg.purchasePrice ? Number(agg._avg.purchasePrice) : 0,
  };
}

export async function getDashboardStatsFromDb() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalBooks, currentlyReading, addedThisMonth, valueAgg] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({ where: { readingStatus: "READING" } }),
    prisma.book.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.book.aggregate({ _sum: { purchasePrice: true } }),
  ]);

  return {
    totalBooks,
    currentlyReading,
    addedThisMonth,
    collectionValueUsd: valueAgg._sum.purchasePrice ? Number(valueAgg._sum.purchasePrice) : 0,
  };
}

export async function getRecentlyAddedFromDb(limit = 6): Promise<MockBook[]> {
  const books = await prisma.book.findMany({
    include: bookInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return books.map(toMockBook);
}

export async function getTopGenresFromDb(limit = 5) {
  const genres = await prisma.genre.findMany({
    include: { _count: { select: { books: true } } },
  });
  return genres
    .map((g) => ({ label: g.name, value: g._count.books }))
    .filter((g) => g.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export async function getTopAuthorsFromDb(limit = 4) {
  const authors = await prisma.author.findMany({
    include: { _count: { select: { books: true } } },
  });
  return authors
    .map((a) => ({ name: a.name, books: a._count.books }))
    .filter((a) => a.books > 0)
    .sort((a, b) => b.books - a.books)
    .slice(0, limit);
}

export async function getCollectingSinceFromDb(): Promise<Date | null> {
  const earliest = await prisma.book.findFirst({
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });
  return earliest?.createdAt ?? null;
}

export async function getNotesFromDb(): Promise<MockNote[]> {
  const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });
  return notes.map((n) => ({
    id: n.id,
    bookId: n.bookId ?? "",
    date: n.createdAt.toISOString().slice(0, 10),
    content: n.content,
  }));
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
