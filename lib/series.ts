import type { MockBook } from "@/lib/mock-data";

export function seriesSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getSeriesList(books: MockBook[]) {
  const map = new Map<string, MockBook[]>();
  for (const book of books) {
    if (!book.series) continue;
    const existing = map.get(book.series) ?? [];
    existing.push(book);
    map.set(book.series, existing);
  }
  return Array.from(map.entries())
    .map(([name, seriesBooks]) => ({
      name,
      books: seriesBooks.sort(
        (a, b) => (a.seriesVolume ?? 0) - (b.seriesVolume ?? 0)
      ),
    }))
    .sort((a, b) => b.books.length - a.books.length);
}

export function getSeriesBySlug(slug: string, books: MockBook[]) {
  return getSeriesList(books).find((s) => seriesSlug(s.name) === slug);
}
