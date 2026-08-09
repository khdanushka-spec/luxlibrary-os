"use server";

import { revalidatePath } from "next/cache";
import type { BookFormat, ReadingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type BookFormInput = {
  title: string;
  author: string;
  genre: string;
  format: string;
  status: string;
  publisher?: string;
  isbn13?: string;
  pages?: number | null;
  year?: number | null;
  purchasePrice?: number | null;
};

export type BookActionResult = { ok: true; id: string } | { ok: false; error: string };

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

async function resolvePublisherId(publisher: string | undefined) {
  const name = publisher?.trim();
  if (!name) return null;
  const record = await prisma.publisher.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  return record.id;
}

export async function addBook(input: BookFormInput): Promise<BookActionResult> {
  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    return { ok: false, error: "Title and author are required." };
  }

  const [authorRecord, genreRecord, publisherId] = await Promise.all([
    prisma.author.upsert({
      where: { name: author },
      update: {},
      create: { name: author },
    }),
    prisma.genre.upsert({
      where: { name: input.genre },
      update: {},
      create: { name: input.genre },
    }),
    resolvePublisherId(input.publisher),
  ]);

  try {
    const book = await prisma.book.create({
      data: {
        title,
        format: input.format.toUpperCase() as BookFormat,
        readingStatus: input.status.toUpperCase() as ReadingStatus,
        publisherId: publisherId ?? undefined,
        isbn13: input.isbn13?.trim() || undefined,
        pages: input.pages ?? undefined,
        publicationYear: input.year ?? undefined,
        purchasePrice: input.purchasePrice ?? undefined,
        contributors: {
          create: { authorId: authorRecord.id, role: "AUTHOR" },
        },
        genres: {
          create: { genreId: genreRecord.id },
        },
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, id: book.id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "That ISBN is already in your library." };
    }
    throw error;
  }
}

export type UpdateBookInput = BookFormInput & { rating: number | null };

export async function updateBook(id: string, input: UpdateBookInput): Promise<BookActionResult> {
  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    return { ok: false, error: "Title and author are required." };
  }

  const [authorRecord, genreRecord, publisherId] = await Promise.all([
    prisma.author.upsert({
      where: { name: author },
      update: {},
      create: { name: author },
    }),
    prisma.genre.upsert({
      where: { name: input.genre },
      update: {},
      create: { name: input.genre },
    }),
    resolvePublisherId(input.publisher),
  ]);

  await prisma.bookContributor.deleteMany({ where: { bookId: id } });
  await prisma.bookGenre.deleteMany({ where: { bookId: id } });

  try {
    await prisma.book.update({
      where: { id },
      data: {
        title,
        format: input.format.toUpperCase() as BookFormat,
        readingStatus: input.status.toUpperCase() as ReadingStatus,
        rating: input.rating,
        publisherId,
        isbn13: input.isbn13?.trim() || null,
        pages: input.pages ?? null,
        publicationYear: input.year ?? null,
        purchasePrice: input.purchasePrice ?? null,
        contributors: {
          create: { authorId: authorRecord.id, role: "AUTHOR" },
        },
        genres: {
          create: { genreId: genreRecord.id },
        },
      },
    });

    revalidatePath("/", "layout");
    return { ok: true, id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "That ISBN is already in your library." };
    }
    throw error;
  }
}

export async function deleteBook(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await prisma.book.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}
