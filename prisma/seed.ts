import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import {
  PrismaClient,
  type BookCondition,
  type BookFormat,
  type ReadingStatus,
} from "../generated/prisma";
import { getBookDetail } from "../lib/book-detail";
import { MOCK_BOOKS } from "../lib/mock-data";
import { MOCK_NOTES } from "../lib/mock-notes";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.note.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.readingSession.deleteMany();
  await prisma.bookTag.deleteMany();
  await prisma.bookGenre.deleteMany();
  await prisma.bookContributor.deleteMany();
  await prisma.book.deleteMany();
  await prisma.author.deleteMany();
  await prisma.publisher.deleteMany();
  await prisma.series.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.shelf.deleteMany();

  const shelfIds = new Map<string, string>();
  const authorIds = new Map<string, string>();
  const publisherIds = new Map<string, string>();
  const seriesIds = new Map<string, string>();
  const genreIds = new Map<string, string>();
  const bookIds = new Map<string, string>();

  for (const book of MOCK_BOOKS) {
    const detail = getBookDetail(book);

    if (!shelfIds.has(detail.shelf)) {
      const shelf = await prisma.shelf.create({ data: { label: detail.shelf } });
      shelfIds.set(detail.shelf, shelf.id);
    }
    if (!authorIds.has(book.author)) {
      const author = await prisma.author.create({ data: { name: book.author } });
      authorIds.set(book.author, author.id);
    }
    if (!publisherIds.has(detail.publisher)) {
      const publisher = await prisma.publisher.create({
        data: { name: detail.publisher },
      });
      publisherIds.set(detail.publisher, publisher.id);
    }
    if (book.series && !seriesIds.has(book.series)) {
      const series = await prisma.series.create({ data: { name: book.series } });
      seriesIds.set(book.series, series.id);
    }
    if (!genreIds.has(book.genre)) {
      const genre = await prisma.genre.create({ data: { name: book.genre } });
      genreIds.set(book.genre, genre.id);
    }

    const condition: BookCondition =
      detail.condition === "Very Good" ? "VERY_GOOD" : "GOOD";

    const created = await prisma.book.create({
      data: {
        title: book.title,
        seriesId: book.series ? seriesIds.get(book.series) : undefined,
        volume: book.seriesVolume,
        publisherId: publisherIds.get(detail.publisher),
        publicationYear: book.year,
        isbn13: detail.isbn13,
        language: detail.language,
        pages: book.pages,
        format: book.format.toUpperCase() as BookFormat,
        condition,
        purchasePrice: detail.purchasePrice,
        shelfId: shelfIds.get(detail.shelf),
        shelfPosition: detail.shelfPosition,
        summary: detail.summary,
        aiSummary: detail.aiSummary,
        readingStatus: book.status.toUpperCase() as ReadingStatus,
        rating: book.rating,
        contributors: {
          create: { authorId: authorIds.get(book.author)!, role: "AUTHOR" },
        },
        genres: { create: { genreId: genreIds.get(book.genre)! } },
      },
    });
    bookIds.set(book.id, created.id);

    if (detail.favoriteQuote) {
      await prisma.quote.create({
        data: { bookId: created.id, text: detail.favoriteQuote },
      });
    }
  }

  for (const note of MOCK_NOTES) {
    const bookId = bookIds.get(note.bookId);
    if (!bookId) continue;
    await prisma.note.create({
      data: { bookId, content: note.content, createdAt: new Date(note.date) },
    });
  }

  console.log(
    `Seeded ${bookIds.size} books, ${authorIds.size} authors, ${publisherIds.size} publishers, ${genreIds.size} genres, ${seriesIds.size} series, ${shelfIds.size} shelves, ${MOCK_NOTES.length} notes.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
