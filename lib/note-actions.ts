"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type NoteFormInput = {
  title?: string;
  content: string;
  bookId?: string;
};

export type NoteActionResult = { ok: true; id: string } | { ok: false; error: string };

export async function addNote(input: NoteFormInput): Promise<NoteActionResult> {
  const content = input.content.trim();
  if (!content) {
    return { ok: false, error: "Note content is required." };
  }

  const note = await prisma.note.create({
    data: {
      title: input.title?.trim() || undefined,
      content,
      bookId: input.bookId || undefined,
    },
  });

  revalidatePath("/notes");
  revalidatePath("/", "layout");
  return { ok: true, id: note.id };
}

export async function deleteNote(id: string): Promise<{ ok: true }> {
  await prisma.note.delete({ where: { id } });
  revalidatePath("/notes");
  revalidatePath("/", "layout");
  return { ok: true };
}
