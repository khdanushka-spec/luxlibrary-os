"use server";

import { revalidatePath } from "next/cache";
import type { BookCondition, BookFormat, ReadingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { duplicateKeyMessage, isUniqueConstraintError } from "@/lib/prisma-errors";
import { requireApprovedUser } from "@/lib/auth";

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
  series?: string;
  seriesVolume?: number | null;
  condition?: string;
  language?: string;
  personalReview?: string;
  personalNotes?: string;
  purchaseDate?: string;
  purchaseSeller?: string;
  currentMarketValue?: number | null;
  insuranceValue?: number | null;
  readingProgressPercent?: number | null;
  tags?: string;
  isFavorite?: boolean;
  isRare?: boolean;
  subtitle?: string;
  isbn10?: string;
  originalPublicationYear?: number | null;
  country?: string;
  isSigned?: boolean;
  isFirstEdition?: boolean;
  isLimitedEdition?: boolean;
  weightGrams?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  depthMm?: number | null;
  qrCode?: string;
  shelfId?: string;
  shelfPosition?: number | null;
};

export type BookActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function resolvePublisherId(publisher: string | undefined) {
  const name = publisher?.trim();
  if (!name) return null;
  const record = await prisma.publisher.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  return record.id;
}

export async function resolveSeriesId(series: string | undefined) {
  const name = series?.trim();
  if (!name) return null;
  const record = await prisma.series.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  return record.id;
}

export async function resolveTagIds(tags: string | undefined): Promise<string[]> {
  const names = (tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (names.length === 0) return [];
  const records = await Promise.all(
    names.map((name) => prisma.tag.upsert({ where: { name }, update: {}, create: { name } }))
  );
  return records.map((r) => r.id);
}

export async function addBook(input: BookFormInput): Promise<BookActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    return { ok: false, error: "Title and author are required." };
  }

  const [authorRecord, genreRecord, publisherId, seriesId, tagIds] = await Promise.all([
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
    resolveSeriesId(input.series),
    resolveTagIds(input.tags),
  ]);

  const readingStatus = input.status.toUpperCase() as ReadingStatus;

  try {
    const book = await prisma.book.create({
      data: {
        title,
        format: input.format.toUpperCase() as BookFormat,
        readingStatus,
        readingProgressPercent:
          readingStatus === "COMPLETED" ? 100 : input.readingProgressPercent ?? undefined,
        publisherId: publisherId ?? undefined,
        isbn13: input.isbn13?.trim() || undefined,
        pages: input.pages ?? undefined,
        publicationYear: input.year ?? undefined,
        purchasePrice: input.purchasePrice ?? undefined,
        seriesId: seriesId ?? undefined,
        volume: seriesId ? input.seriesVolume ?? undefined : undefined,
        condition: (input.condition as BookCondition) || undefined,
        language: input.language?.trim() || undefined,
        personalReview: input.personalReview?.trim() || undefined,
        personalNotes: input.personalNotes?.trim() || undefined,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : undefined,
        purchaseSeller: input.purchaseSeller?.trim() || undefined,
        currentMarketValue: input.currentMarketValue ?? undefined,
        insuranceValue: input.insuranceValue ?? undefined,
        isFavorite: input.isFavorite ?? false,
        isRare: input.isRare ?? false,
        subtitle: input.subtitle?.trim() || undefined,
        isbn10: input.isbn10?.trim() || undefined,
        originalPublicationYear: input.originalPublicationYear ?? undefined,
        country: input.country?.trim() || undefined,
        isSigned: input.isSigned ?? false,
        isFirstEdition: input.isFirstEdition ?? false,
        isLimitedEdition: input.isLimitedEdition ?? false,
        weightGrams: input.weightGrams ?? undefined,
        widthMm: input.widthMm ?? undefined,
        heightMm: input.heightMm ?? undefined,
        depthMm: input.depthMm ?? undefined,
        qrCode: input.qrCode?.trim() || undefined,
        shelfId: input.shelfId || undefined,
        shelfPosition: input.shelfId ? input.shelfPosition ?? undefined : undefined,
        contributors: {
          create: { authorId: authorRecord.id, role: "AUTHOR" },
        },
        genres: {
          create: { genreId: genreRecord.id },
        },
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });

    if (readingStatus === "READING") {
      await prisma.readingSession.create({ data: { bookId: book.id } });
    }

    revalidatePath("/", "layout");
    return { ok: true, id: book.id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: duplicateKeyMessage(error) };
    }
    throw error;
  }
}

export type UpdateBookInput = BookFormInput & { rating: number | null };

export async function updateBook(id: string, input: UpdateBookInput): Promise<BookActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const title = input.title.trim();
  const author = input.author.trim();

  if (!title || !author) {
    return { ok: false, error: "Title and author are required." };
  }

  const [authorRecord, genreRecord, publisherId, seriesId, tagIds] = await Promise.all([
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
    resolveSeriesId(input.series),
    resolveTagIds(input.tags),
  ]);

  const existing = await prisma.book.findUnique({
    where: { id },
    select: { readingStatus: true },
  });
  const previousStatus = existing?.readingStatus;
  const readingStatus = input.status.toUpperCase() as ReadingStatus;

  await prisma.bookContributor.deleteMany({ where: { bookId: id } });
  await prisma.bookGenre.deleteMany({ where: { bookId: id } });
  await prisma.bookTag.deleteMany({ where: { bookId: id } });

  try {
    await prisma.book.update({
      where: { id },
      data: {
        title,
        format: input.format.toUpperCase() as BookFormat,
        readingStatus,
        readingProgressPercent:
          readingStatus === "COMPLETED" ? 100 : input.readingProgressPercent ?? undefined,
        rating: input.rating,
        publisherId,
        isbn13: input.isbn13?.trim() || null,
        pages: input.pages ?? null,
        publicationYear: input.year ?? null,
        purchasePrice: input.purchasePrice ?? null,
        seriesId,
        volume: seriesId ? input.seriesVolume ?? null : null,
        condition: (input.condition as BookCondition) || null,
        language: input.language?.trim() || null,
        personalReview: input.personalReview?.trim() || null,
        personalNotes: input.personalNotes?.trim() || null,
        purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : null,
        purchaseSeller: input.purchaseSeller?.trim() || null,
        currentMarketValue: input.currentMarketValue ?? null,
        insuranceValue: input.insuranceValue ?? null,
        isFavorite: input.isFavorite ?? false,
        isRare: input.isRare ?? false,
        subtitle: input.subtitle?.trim() || null,
        isbn10: input.isbn10?.trim() || null,
        originalPublicationYear: input.originalPublicationYear ?? null,
        country: input.country?.trim() || null,
        isSigned: input.isSigned ?? false,
        isFirstEdition: input.isFirstEdition ?? false,
        isLimitedEdition: input.isLimitedEdition ?? false,
        weightGrams: input.weightGrams ?? null,
        widthMm: input.widthMm ?? null,
        heightMm: input.heightMm ?? null,
        depthMm: input.depthMm ?? null,
        qrCode: input.qrCode?.trim() || null,
        shelfId: input.shelfId || null,
        shelfPosition: input.shelfId ? input.shelfPosition ?? null : null,
        contributors: {
          create: { authorId: authorRecord.id, role: "AUTHOR" },
        },
        genres: {
          create: { genreId: genreRecord.id },
        },
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });

    if (previousStatus !== "READING" && readingStatus === "READING") {
      await prisma.readingSession.create({ data: { bookId: id } });
    } else if (previousStatus === "READING" && readingStatus !== "READING") {
      await prisma.readingSession.updateMany({
        where: { bookId: id, endedAt: null },
        data: { endedAt: new Date() },
      });
    }

    revalidatePath("/", "layout");
    return { ok: true, id };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: duplicateKeyMessage(error) };
    }
    throw error;
  }
}

export async function deleteBook(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  await prisma.book.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}
