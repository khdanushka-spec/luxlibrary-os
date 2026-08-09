"use server";

import { answerQuery } from "@/lib/ai-librarian";
import { getLibrarianBooksFromDb } from "@/lib/db-books";

export async function askLibrarian(query: string): Promise<string> {
  const books = await getLibrarianBooksFromDb();
  return answerQuery(query, books);
}
