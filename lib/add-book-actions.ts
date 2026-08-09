"use server";

import { revalidatePath } from "next/cache";
import type { BookFormat, ReadingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export type AddBookInput = {
  title: string;
  author: string;
  genre: string;
  format: string;
  status: string;
};

export type AddBookResult = { ok: true; id: string } | { ok: false; error: string };

export async function addBook(input: AddBookInput): Promise<AddBookResult> {
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
