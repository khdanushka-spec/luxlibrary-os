import { MOCK_BOOKS, type MockBook } from "@/lib/mock-data";

export function seriesSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function getSeriesList() {
  const map = new Map<string, MockBook[]>();
  for (const book of MOCK_BOOKS) {
    if (!book.series) continue;
    const existing = map.get(book.series) ?? [];
    existing.push(book);
    map.set(book.series, existing);
  }
  return Array.from(map.entries())
    .map(([name, books]) => ({
      name,
      books: books.sort((a, b) => (a.seriesVolume ?? 0) - (b.seriesVolume ?? 0)),
    }))
    .sort((a, b) => b.books.length - a.books.length);
}

export function getSeriesBySlug(slug: string) {
  return getSeriesList().find((s) => seriesSlug(s.name) === slug);
}
