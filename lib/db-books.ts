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
  readingSessions: { orderBy: { startedAt: "desc" as const }, take: 1 },
  tags: { include: { tag: true } },
} as const;

type DbBook = Awaited<ReturnType<typeof prisma.book.findFirstOrThrow<{ include: typeof bookInclude }>>>;

function toMockBook(book: DbBook): MockBook {
  const latestSession = book.readingSessions[0];
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
    readingProgressPercent: book.readingProgressPercent > 0 ? book.readingProgressPercent : undefined,
    readingStartedAt:
      latestSession && !latestSession.endedAt ? latestSession.startedAt.toISOString() : undefined,
    completedAt: latestSession?.endedAt ? latestSession.endedAt.toISOString() : undefined,
    isFavorite: book.isFavorite || undefined,
    isRare: book.isRare || undefined,
    isSigned: book.isSigned || undefined,
    isFirstEdition: book.isFirstEdition || undefined,
    isLimitedEdition: book.isLimitedEdition || undefined,
  };
}

export async function getAllBooksFromDb(userId: string): Promise<MockBook[]> {
  const books = await prisma.book.findMany({ where: { userId }, include: bookInclude });
  return books.map(toMockBook);
}

export type LibrarianBook = MockBook & {
  shelf: string;
  shelfPosition?: number;
  aiSummary?: string;
};

export async function getLibrarianBooksFromDb(userId: string): Promise<LibrarianBook[]> {
  const books = await prisma.book.findMany({ where: { userId }, include: bookInclude });
  return books.map((book) => ({
    ...toMockBook(book),
    shelf: book.shelf?.label ?? "Unshelved",
    shelfPosition: book.shelfPosition ?? undefined,
    aiSummary: book.aiSummary ?? undefined,
  }));
}

export async function getQuotesFromDb(
  userId: string
): Promise<{ id: string; book: MockBook; favoriteQuote: string; pageNumber?: number }[]> {
  const quotes = await prisma.quote.findMany({
    where: { book: { userId } },
    include: { book: { include: bookInclude } },
    orderBy: { createdAt: "desc" },
  });
  return quotes.map((q) => ({
    id: q.id,
    book: toMockBook(q.book),
    favoriteQuote: q.text,
    pageNumber: q.pageNumber ?? undefined,
  }));
}

export async function searchQuotesFromDb(
  userId: string,
  query: string
): Promise<{ id: string; book: MockBook; favoriteQuote: string }[]> {
  const quotes = await prisma.quote.findMany({
    where: { text: { contains: query, mode: "insensitive" }, book: { userId } },
    include: { book: { include: bookInclude } },
  });
  return quotes.map((q) => ({ id: q.id, book: toMockBook(q.book), favoriteQuote: q.text }));
}

export async function getCollectionValueFromDb(userId: string) {
  const agg = await prisma.book.aggregate({
    where: { userId },
    _sum: { purchasePrice: true },
    _avg: { purchasePrice: true },
  });
  return {
    total: agg._sum.purchasePrice ? Number(agg._sum.purchasePrice) : 0,
    average: agg._avg.purchasePrice ? Number(agg._avg.purchasePrice) : 0,
  };
}

export async function getDashboardStatsFromDb(userId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalBooks, currentlyReading, addedThisMonth, valueAgg] = await Promise.all([
    prisma.book.count({ where: { userId } }),
    prisma.book.count({ where: { userId, readingStatus: "READING" } }),
    prisma.book.count({ where: { userId, createdAt: { gte: startOfMonth } } }),
    prisma.book.aggregate({ where: { userId }, _sum: { purchasePrice: true } }),
  ]);

  return {
    totalBooks,
    currentlyReading,
    addedThisMonth,
    collectionValueUsd: valueAgg._sum.purchasePrice ? Number(valueAgg._sum.purchasePrice) : 0,
  };
}

export async function getRecentlyAddedFromDb(userId: string, limit = 6): Promise<MockBook[]> {
  const books = await prisma.book.findMany({
    where: { userId },
    include: bookInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return books.map(toMockBook);
}

export async function getTopGenresFromDb(userId: string, limit = 5) {
  const genres = await prisma.genre.findMany({
    include: { _count: { select: { books: { where: { book: { userId } } } } } },
  });
  return genres
    .map((g) => ({ label: g.name, value: g._count.books }))
    .filter((g) => g.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export async function getTopAuthorsFromDb(userId: string, limit = 4) {
  const authors = await prisma.author.findMany({
    include: { _count: { select: { books: { where: { book: { userId } } } } } },
  });
  return authors
    .map((a) => ({ name: a.name, books: a._count.books }))
    .filter((a) => a.books > 0)
    .sort((a, b) => b.books - a.books)
    .slice(0, limit);
}

export async function getCollectingSinceFromDb(userId: string): Promise<Date | null> {
  const earliest = await prisma.book.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });
  return earliest?.createdAt ?? null;
}

export async function getNotesFromDb(userId: string): Promise<MockNote[]> {
  const notes = await prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return notes.map((n) => ({
    id: n.id,
    bookId: n.bookId ?? "",
    date: n.createdAt.toISOString().slice(0, 10),
    content: n.content,
    title: n.title ?? undefined,
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
    userId: book.userId,
    publisher: book.publisher?.name ?? "Unknown",
    shelf: book.shelf?.label ?? "Unshelved",
    shelfPosition: book.shelfPosition ?? undefined,
    isbn13: book.isbn13 ?? undefined,
    language: book.language ?? "English",
    purchasePrice: book.purchasePrice ? Number(book.purchasePrice) : undefined,
    condition: book.condition ? humanizeEnum(book.condition) : undefined,
    rawCondition: book.condition ?? undefined,
    rawLanguage: book.language ?? undefined,
    personalReview: book.personalReview ?? undefined,
    personalNotes: book.personalNotes ?? undefined,
    purchaseDate: book.purchaseDate ? book.purchaseDate.toISOString().slice(0, 10) : undefined,
    purchaseSeller: book.purchaseSeller ?? undefined,
    currentMarketValue: book.currentMarketValue ? Number(book.currentMarketValue) : undefined,
    insuranceValue: book.insuranceValue ? Number(book.insuranceValue) : undefined,
    summary: book.summary ?? undefined,
    aiSummary: book.aiSummary ?? undefined,
    favoriteQuote: book.quotes[0]?.text ?? null,
    tags: book.tags.map((t) => t.tag.name),
    subtitle: book.subtitle ?? undefined,
    isbn10: book.isbn10 ?? undefined,
    originalPublicationYear: book.originalPublicationYear ?? undefined,
    country: book.country ?? undefined,
    isSigned: book.isSigned,
    isFirstEdition: book.isFirstEdition,
    isLimitedEdition: book.isLimitedEdition,
    weightGrams: book.weightGrams ?? undefined,
    widthMm: book.widthMm ?? undefined,
    heightMm: book.heightMm ?? undefined,
    depthMm: book.depthMm ?? undefined,
    qrCode: book.qrCode ?? undefined,
    shelfId: book.shelfId ?? undefined,
    currentPage: book.currentPage ?? undefined,
  };
}

export type ShelfOption = { id: string; label: string; room: string | null };

export async function getShelfOptionsFromDb(userId: string): Promise<ShelfOption[]> {
  return prisma.shelf.findMany({
    where: { userId },
    select: { id: true, label: true, room: true },
    orderBy: [{ room: "asc" }, { label: "asc" }],
  });
}

export type ShelfMapEntry = {
  id: string;
  label: string;
  room: string;
  capacity?: number;
  books: MockBook[];
};

export async function getShelfMapFromDb(userId: string): Promise<ShelfMapEntry[]> {
  const shelves = await prisma.shelf.findMany({
    where: { userId },
    include: { books: { where: { userId }, include: bookInclude, orderBy: { shelfPosition: "asc" } } },
    orderBy: [{ room: "asc" }, { label: "asc" }],
  });

  const entries: ShelfMapEntry[] = shelves.map((shelf) => ({
    id: shelf.id,
    label: shelf.label,
    room: shelf.room ?? "Unassigned",
    capacity: shelf.capacity ?? undefined,
    books: shelf.books.map(toMockBook),
  }));

  const unshelvedBooks = await prisma.book.findMany({
    where: { userId, shelfId: null },
    include: bookInclude,
  });

  if (unshelvedBooks.length > 0) {
    entries.push({
      id: "unshelved",
      label: "Unshelved",
      room: "Unassigned",
      books: unshelvedBooks.map(toMockBook),
    });
  }

  return entries;
}

// --- Super Admin only: aggregates across every user's library ---

export type MasterLibraryBook = MockBook & {
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
};

export async function getMasterLibraryFromDb(): Promise<MasterLibraryBook[]> {
  const books = await prisma.book.findMany({
    include: { ...bookInclude, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return books.map((book) => ({
    ...toMockBook(book),
    ownerId: book.user.id,
    ownerName: book.user.name,
    ownerEmail: book.user.email,
  }));
}

export async function getMasterLibraryStatsFromDb() {
  const [totalBooks, totalMembers, valueAgg] = await Promise.all([
    prisma.book.count(),
    prisma.user.count({ where: { status: "APPROVED" } }),
    prisma.book.aggregate({ _sum: { purchasePrice: true } }),
  ]);
  return {
    totalBooks,
    totalMembers,
    collectionValueUsd: valueAgg._sum.purchasePrice ? Number(valueAgg._sum.purchasePrice) : 0,
  };
}
