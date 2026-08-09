import { Suspense } from "react";
import { LibraryView } from "@/components/library/library-view";
import { getAllBooksFromDb } from "@/lib/db-books";

export const metadata = {
  title: "Library — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const books = await getAllBooksFromDb();
  return (
    <Suspense fallback={null}>
      <LibraryView books={books} />
    </Suspense>
  );
}
