"use server";

import { answerQuery } from "@/lib/ai-librarian";
import { getLibrarianBooksFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";

export async function askLibrarian(query: string): Promise<string> {
  const user = (await getCurrentUser())!;
  const books = await getLibrarianBooksFromDb(user.id);
  return answerQuery(query, books);
}
