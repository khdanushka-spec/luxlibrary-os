import { LibraryView } from "@/components/library/library-view";
import { getAllBooksFromDb } from "@/lib/db-books";
import { getCurrentUser } from "@/lib/auth";

export const metadata = {
  title: "Library — BringBooks",
};

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const user = (await getCurrentUser())!;
  const books = await getAllBooksFromDb(user.id);
  return <LibraryView books={books} />;
}
