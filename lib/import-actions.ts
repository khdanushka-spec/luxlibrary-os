"use server";

import { revalidatePath } from "next/cache";
import type { BookFormat, ReadingStatus } from "@/generated/prisma";
import { resolvePublisherId, resolveSeriesId } from "@/lib/book-actions";
import { parseBookCsv } from "@/lib/csv";
import { isUniqueConstraintError } from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";

const FORMAT_VALUES: BookFormat[] = ["HARDCOVER", "PAPERBACK", "LEATHER", "EBOOK", "AUDIOBOOK"];
const STATUS_VALUES: ReadingStatus[] = ["WISHLIST", "UNREAD", "READING", "COMPLETED", "DNF"];

function normalizeFormat(value: string | undefined): BookFormat {
  const upper = value?.trim().toUpperCase().replace(/\s+/g, "_");
  return (FORMAT_VALUES as string[]).includes(upper ?? "") ? (upper as BookFormat) : "HARDCOVER";
}

function normalizeStatus(value: string | undefined): ReadingStatus {
  const upper = value?.trim().toUpperCase().replace(/\s+/g, "_");
  return (STATUS_VALUES as string[]).includes(upper ?? "") ? (upper as ReadingStatus) : "UNREAD";
}

export type BulkImportResult = {
  created: number;
  updated: number;
  skipped: { row: number; reason: string }[];
};

export async function bulkImportBooks(csvText: string): Promise<BulkImportResult> {
  const { rows, skipped: parseSkipped } = parseBookCsv(csvText);
  const skipped = [...parseSkipped];
  let created = 0;
  let updated = 0;

  for (const row of rows) {
    try {
      const [authorRecord, genreRecord, publisherId, seriesId, existing] = await Promise.all([
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
        row.isbn13 ? prisma.book.findUnique({ where: { isbn13: row.isbn13 } }) : null,
      ]);

      const bookData = {
        title: row.title,
        format: normalizeFormat(row.format),
        readingStatus: normalizeStatus(row.status),
        publisherId: publisherId ?? undefined,
        seriesId: seriesId ?? undefined,
        volume: seriesId ? row.seriesVolume ?? undefined : undefined,
        publicationYear: row.year ?? undefined,
        pages: row.pages ?? undefined,
        isbn13: row.isbn13 ?? undefined,
        purchasePrice: row.purchasePrice ?? undefined,
      };

      const readingStatus = bookData.readingStatus;

      if (existing) {
        const previousStatus = existing.readingStatus;
        await prisma.bookContributor.deleteMany({ where: { bookId: existing.id } });
        await prisma.bookGenre.deleteMany({ where: { bookId: existing.id } });
        await prisma.book.update({
          where: { id: existing.id },
          data: {
            ...bookData,
            readingProgressPercent: readingStatus === "COMPLETED" ? 100 : undefined,
            contributors: { create: { authorId: authorRecord.id, role: "AUTHOR" } },
            genres: { create: { genreId: genreRecord.id } },
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
          },
        });

        if (readingStatus === "READING") {
          await prisma.readingSession.create({ data: { bookId: book.id } });
        }
        created++;
      }
    } catch (error) {
      const reason = isUniqueConstraintError(error)
        ? "That ISBN is already in your library."
        : "Failed to import this row.";
      skipped.push({ row: row.rowNumber, reason });
    }
  }

  if (created > 0 || updated > 0) {
    revalidatePath("/", "layout");
  }

  return { created, updated, skipped };
}
