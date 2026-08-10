"use server";

import { revalidatePath } from "next/cache";
import { getShelfOptionsFromDb, type ShelfOption } from "@/lib/db-books";
import { prisma } from "@/lib/prisma";
import { requireApprovedUser } from "@/lib/auth";

export async function getShelfOptions(): Promise<ShelfOption[]> {
  const user = await requireApprovedUser();
  if (!user) return [];
  return getShelfOptionsFromDb();
}

export type ShelfFormInput = {
  label: string;
  room?: string;
  capacity?: number | null;
};

export type ShelfActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function addShelf(input: ShelfFormInput): Promise<ShelfActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const label = input.label.trim();
  if (!label) {
    return { ok: false, error: "Shelf label is required." };
  }

  const shelf = await prisma.shelf.create({
    data: {
      label,
      room: input.room?.trim() || undefined,
      capacity: input.capacity ?? undefined,
    },
  });

  revalidatePath("/library-map");
  revalidatePath("/", "layout");
  return { ok: true, id: shelf.id };
}

export async function deleteShelf(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const bookCount = await prisma.book.count({ where: { shelfId: id } });
  if (bookCount > 0) {
    return {
      ok: false,
      error: `Move ${bookCount} book${bookCount === 1 ? "" : "s"} off this shelf first.`,
    };
  }

  await prisma.shelf.delete({ where: { id } });
  revalidatePath("/library-map");
  revalidatePath("/", "layout");
  return { ok: true };
}
