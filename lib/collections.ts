import type { MockBook } from "@/lib/mock-data";

export type Collection = {
  slug: string;
  title: string;
  description: string;
  filter: (book: MockBook) => boolean;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "five-star-favorites",
    title: "5-Star Favorites",
    description: "Books you rated the full five stars.",
    filter: (b) => b.rating === 5,
  },
  {
    slug: "currently-reading",
    title: "Currently Reading",
    description: "What's open on your nightstand right now.",
    filter: (b) => b.status === "reading",
  },
  {
    slug: "wishlist",
    title: "Wishlist",
    description: "Books you don't own yet.",
    filter: (b) => b.status === "wishlist",
  },
  {
    slug: "quick-reads",
    title: "Quick Reads",
    description: "Under 250 pages — perfect for a weekend.",
    filter: (b) => b.pages < 250,
  },
  {
    slug: "rare-editions",
    title: "Rare & Leather-Bound",
    description: "The special editions on your shelves.",
    filter: (b) => b.format === "Leather",
  },
  {
    slug: "this-decade",
    title: "This Decade",
    description: "Published 2020 or later.",
    filter: (b) => b.year >= 2020,
  },
  {
    slug: "timeless-classics",
    title: "Timeless Classics",
    description: "Published before 1970.",
    filter: (b) => b.year < 1970,
  },
];

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionBooks(collection: Collection, books: MockBook[]) {
  return books.filter(collection.filter);
}
