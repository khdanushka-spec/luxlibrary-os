import { getBookDetail } from "@/lib/book-detail";
import { MOCK_BOOKS, type MockBook } from "@/lib/mock-data";

export function getPublishers() {
  const map = new Map<string, MockBook[]>();
  for (const book of MOCK_BOOKS) {
    const publisher = getBookDetail(book).publisher;
    const existing = map.get(publisher) ?? [];
    existing.push(book);
    map.set(publisher, existing);
  }
  return Array.from(map.entries())
    .map(([name, books]) => ({ name, books }))
    .sort((a, b) => b.books.length - a.books.length);
}

export function getPublisherBooks(slug: string) {
  const publishers = getPublishers();
  return publishers.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
}

export function publisherSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
