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
};

export type BookActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function addBook(input: BookFormInput): Promise<BookActionResult> {
  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    return { ok: false, error: "Title and author are required." };
  }

  const authorRecord = await prisma.author.upsert({
    where: { name: author },
    update: {},
    create: { name: author },
  });

  const genreRecord = await prisma.genre.upsert({
    where: { name: input.genre },
    update: {},
    create: { name: input.genre },
  });

  const book = await prisma.book.create({
    data: {
      title,
      format: input.format.toUpperCase() as BookFormat,
      readingStatus: input.status.toUpperCase() as ReadingStatus,
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
}

export type UpdateBookInput = BookFormInput & { rating: number | null };

export async function updateBook(id: string, input: UpdateBookInput): Promise<BookActionResult> {
  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    return { ok: false, error: "Title and author are required." };
  }

  const [authorRecord, genreRecord] = await Promise.all([
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
  ]);

  await prisma.bookContributor.deleteMany({ where: { bookId: id } });
  await prisma.bookGenre.deleteMany({ where: { bookId: id } });

  await prisma.book.update({
    where: { id },
    data: {
      title,
      format: input.format.toUpperCase() as BookFormat,
      readingStatus: input.status.toUpperCase() as ReadingStatus,
      rating: input.rating,
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
}

export async function deleteBook(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  await prisma.book.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}
