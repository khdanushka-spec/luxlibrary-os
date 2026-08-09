import { getBookDetail } from "@/lib/book-detail";
import type { MockBook } from "@/lib/mock-data";

function publisherOf(book: MockBook) {
  return book.publisher ?? getBookDetail(book).publisher;
}

export function getPublishers(books: MockBook[]) {
  const map = new Map<string, MockBook[]>();
  for (const book of books) {
    const publisher = publisherOf(book);
    const existing = map.get(publisher) ?? [];
    existing.push(book);
    map.set(publisher, existing);
  }
  return Array.from(map.entries())
    .map(([name, books]) => ({ name, books }))
    .sort((a, b) => b.books.length - a.books.length);
}

export function getPublisherBooks(slug: string, books: MockBook[]) {
  const publishers = getPublishers(books);
  return publishers.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
}

export function publisherSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
