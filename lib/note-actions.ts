"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireApprovedUser } from "@/lib/auth";

export type NoteFormInput = {
  title?: string;
  content: string;
  bookId?: string;
};

export type NoteActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function addNote(input: NoteFormInput): Promise<NoteActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const content = input.content.trim();
  if (!content) {
    return { ok: false, error: "Note content is required." };
  }

  if (input.bookId) {
    const book = await prisma.book.findUnique({ where: { id: input.bookId }, select: { userId: true } });
    if (!book || book.userId !== user.id) {
      return { ok: false, error: "You can only add notes to your own books." };
    }
  }

  const note = await prisma.note.create({
    data: {
      userId: user.id,
      title: input.title?.trim() || undefined,
      content,
      bookId: input.bookId || undefined,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/", "layout");
  return { ok: true, id: note.id };
}

export async function updateNote(id: string, input: NoteFormInput): Promise<NoteActionResult> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const content = input.content.trim();
  if (!content) {
    return { ok: false, error: "Note content is required." };
  }

  const existing = await prisma.note.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) {
    return { ok: false, error: "Note not found." };
  }
  if (existing.userId !== user.id && user.role !== "SUPER_ADMIN") {
    return { ok: false, error: "You don't have permission to edit this note." };
  }

  if (input.bookId) {
    const book = await prisma.book.findUnique({ where: { id: input.bookId }, select: { userId: true } });
    if (!book || book.userId !== user.id) {
      return { ok: false, error: "You can only attach notes to your own books." };
    }
  }

  await prisma.note.update({
    where: { id },
    data: {
      title: input.title?.trim() || null,
      content,
      bookId: input.bookId || null,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/", "layout");
  return { ok: true, id };
}

export async function deleteNote(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireApprovedUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const existing = await prisma.note.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) {
    return { ok: false, error: "Note not found." };
  }
  if (existing.userId !== user.id && user.role !== "SUPER_ADMIN") {
    return { ok: false, error: "You don't have permission to delete this note." };
  }

  await prisma.note.delete({ where: { id } });
  revalidatePath("/notes");
  revalidatePath("/", "layout");
  return { ok: true };
}
