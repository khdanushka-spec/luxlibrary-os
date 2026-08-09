import { Suspense } from "react";
import { LibraryView } from "@/components/library/library-view";
import { MOCK_BOOKS } from "@/lib/mock-data";

export const metadata = {
  title: "Library — LuxLibrary OS",
};

export default function LibraryPage() {
  return (
    <Suspense fallback={null}>
      <LibraryView books={MOCK_BOOKS} />
    </Suspense>
  );
}
