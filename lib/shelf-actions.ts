"use server";

import { getShelfOptionsFromDb, type ShelfOption } from "@/lib/db-books";

export async function getShelfOptions(): Promise<ShelfOption[]> {
  return getShelfOptionsFromDb();
}
