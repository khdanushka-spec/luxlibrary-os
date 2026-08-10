"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type QuoteFormInput = {
  bookId: string;
  text: string;
  pageNumber?: number | null;
};

export type QuoteActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function addQuote(input: QuoteFormInput): Promise<QuoteActionResult> {
  const text = input.text.trim();
  if (!input.bookId) {
    return { ok: false, error: "Choose a book for this quote." };
  }
  if (!text) {
    return { ok: false, error: "Quote text is required." };
  }

  const quote = await prisma.quote.create({
    data: {
      bookId: input.bookId,
      text,
      pageNumber: input.pageNumber ?? undefined,
    },
  });

  revalidatePath("/quotes");
  revalidatePath("/", "layout");
  return { ok: true, id: quote.id };
}

export async function deleteQuote(id: string): Promise<{ ok: true }> {
  await prisma.quote.delete({ where: { id } });
  revalidatePath("/quotes");
  revalidatePath("/", "layout");
  return { ok: true };
}
