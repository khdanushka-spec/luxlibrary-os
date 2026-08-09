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
  imported: number;
  skipped: { row: number; reason: string }[];
};

export async function bulkImportBooks(csvText: string): Promise<BulkImportResult> {
  const { rows, skipped: parseSkipped } = parseBookCsv(csvText);
  const skipped = [...parseSkipped];
  let imported = 0;

  for (const row of rows) {
    try {
      const [authorRecord, genreRecord, publisherId, seriesId] = await Promise.all([
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
      ]);

      await prisma.book.create({
        data: {
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
          contributors: {
            create: { authorId: authorRecord.id, role: "AUTHOR" },
          },
          genres: {
            create: { genreId: genreRecord.id },
          },
        },
      });
      imported++;
    } catch (error) {
      const reason = isUniqueConstraintError(error)
        ? "That ISBN is already in your library."
        : "Failed to import this row.";
      skipped.push({ row: row.rowNumber, reason });
    }
  }

  if (imported > 0) {
    revalidatePath("/", "layout");
  }

  return { imported, skipped };
}
