"use server";

import { revalidatePath } from "next/cache";
import type { BookCondition, BookFormat, ReadingStatus } from "@/generated/prisma";
import { resolvePublisherId, resolveSeriesId, resolveTagIds } from "@/lib/book-actions";
import { parseBookCsv } from "@/lib/csv";
import { duplicateKeyMessage, isUniqueConstraintError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";
import { requireApprovedUser } from "@/lib/auth";

const FORMAT_VALUES: BookFormat[] = ["HARDCOVER", "PAPERBACK", "LEATHER", "EBOOK", "AUDIOBOOK"];
const STATUS_VALUES: ReadingStatus[] = ["WISHLIST", "UNREAD", "READING", "COMPLETED", "DNF"];
const CONDITION_VALUES: BookCondition[] = [
  "NEW",
  "LIKE_NEW",
  "VERY_GOOD",
  "GOOD",
  "FAIR",
  "POOR",
];

function normalizeFormat(value: string | undefined): BookFormat {
  const upper = value?.trim().toUpperCase().replace(/\s+/g, "_");
  return (FORMAT_VALUES as string[]).includes(upper ?? "") ? (upper as BookFormat) : "HARDCOVER";
}

function normalizeStatus(value: string | undefined): ReadingStatus {
  const upper = value?.trim().toUpperCase().replace(/\s+/g, "_");
  return (STATUS_VALUES as string[]).includes(upper ?? "") ? (upper as ReadingStatus) : "UNREAD";
}

function normalizeCondition(value: string | undefined): BookCondition | undefined {
  const upper = value?.trim().toUpperCase().replace(/\s+/g, "_");
  return (CONDITION_VALUES as string[]).includes(upper ?? "") ? (upper as BookCondition) : undefined;
}

export type BulkImportResult = {
  created: number;
  updated: number;
  skipped: { row: number; reason: string }[];
};

export async function bulkImportBooks(csvText: string): Promise<BulkImportResult> {
  const user = await requireApprovedUser();
  if (!user) {
    return { created: 0, updated: 0, skipped: [{ row: 0, reason: "You must be signed in to do that." }] };
  }

  const { rows, skipped: parseSkipped } = parseBookCsv(csvText);
  const skipped = [...parseSkipped];
  let created = 0;
  let updated = 0;

  const shelves = await prisma.shelf.findMany({ select: { id: true, label: true } });
  const shelfIdByLabel = new Map(shelves.map((s) => [s.label.toLowerCase(), s.id]));

  for (const row of rows) {
    try {
      const [authorRecord, genreRecord, publisherId, seriesId, tagIds, existing] =
        await Promise.all([
          prisma.author.upsert({
            where: { name: row.author },
            update: {},
            create: { name: row.author },
          }),
          prisma.genre.upsert({
            where: { name: row.genre || "Uncategorized" },
            update: {},
            create: { name: row.genre || "Uncategorized" },
          }),
          resolvePublisherId(row.publisher),
          resolveSeriesId(row.series),
          resolveTagIds(row.tags),
          row.isbn13 ? prisma.book.findUnique({ where: { isbn13: row.isbn13 } }) : null,
        ]);

      const shelfId = row.shelf ? shelfIdByLabel.get(row.shelf.trim().toLowerCase()) : undefined;

      const bookData = {
        title: row.title,
        subtitle: row.subtitle ?? undefined,
        format: normalizeFormat(row.format),
        readingStatus: normalizeStatus(row.status),
        publisherId: publisherId ?? undefined,
        seriesId: seriesId ?? undefined,
        volume: seriesId ? row.seriesVolume ?? undefined : undefined,
        publicationYear: row.year ?? undefined,
        originalPublicationYear: row.originalPublicationYear ?? undefined,
        pages: row.pages ?? undefined,
        isbn13: row.isbn13 ?? undefined,
        isbn10: row.isbn10 ?? undefined,
        country: row.country ?? undefined,
        language: row.language ?? undefined,
        condition: normalizeCondition(row.condition) ?? undefined,
        purchasePrice: row.purchasePrice ?? undefined,
        isFavorite: row.isFavorite ?? undefined,
        isRare: row.isRare ?? undefined,
        isSigned: row.isSigned ?? undefined,
        isFirstEdition: row.isFirstEdition ?? undefined,
        isLimitedEdition: row.isLimitedEdition ?? undefined,
        weightGrams: row.weightGrams ?? undefined,
        widthMm: row.widthMm ?? undefined,
        heightMm: row.heightMm ?? undefined,
        depthMm: row.depthMm ?? undefined,
        qrCode: row.qrCode ?? undefined,
        shelfId: shelfId ?? undefined,
        shelfPosition: shelfId ? row.shelfPosition ?? undefined : undefined,
      };

      const readingStatus = bookData.readingStatus;

      if (existing) {
        const previousStatus = existing.readingStatus;
        await prisma.bookContributor.deleteMany({ where: { bookId: existing.id } });
        await prisma.bookGenre.deleteMany({ where: { bookId: existing.id } });
        await prisma.bookTag.deleteMany({ where: { bookId: existing.id } });
        await prisma.book.update({
          where: { id: existing.id },
          data: {
            ...bookData,
            readingProgressPercent: readingStatus === "COMPLETED" ? 100 : undefined,
            contributors: { create: { authorId: authorRecord.id, role: "AUTHOR" } },
            genres: { create: { genreId: genreRecord.id } },
            tags: { create: tagIds.map((tagId) => ({ tagId })) },
          },
        });

        if (previousStatus !== "READING" && readingStatus === "READING") {
          await prisma.readingSession.create({ data: { bookId: existing.id } });
        } else if (previousStatus === "READING" && readingStatus !== "READING") {
          await prisma.readingSession.updateMany({
            where: { bookId: existing.id, endedAt: null },
            data: { endedAt: new Date() },
          });
        }
        updated++;
      } else {
        const book = await prisma.book.create({
          data: {
            ...bookData,
            readingProgressPercent: readingStatus === "COMPLETED" ? 100 : undefined,
            contributors: { create: { authorId: authorRecord.id, role: "AUTHOR" } },
            genres: { create: { genreId: genreRecord.id } },
            tags: { create: tagIds.map((tagId) => ({ tagId })) },
          },
        });

        if (readingStatus === "READING") {
          await prisma.readingSession.create({ data: { bookId: book.id } });
        }
        created++;
      }
    } catch (error) {
      const reason = isUniqueConstraintError(error)
        ? duplicateKeyMessage(error)
        : "Failed to import this row.";
      skipped.push({ row: row.rowNumber, reason });
    }
  }

  if (created > 0 || updated > 0) {
    revalidatePath("/", "layout");
  }

  return { created, updated, skipped };
}
