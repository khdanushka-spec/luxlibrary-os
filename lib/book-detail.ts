import type { MockBook } from "@/lib/mock-data";

const PUBLISHERS = [
  "Penguin Classics",
  "Vintage Books",
  "Alfred A. Knopf",
  "Tor Books",
  "Picador",
  "Harper Perennial",
  "W. W. Norton & Co.",
  "Faber & Faber",
];

const SHELF_BY_GENRE: Record<string, string> = {
  Fantasy: "B2",
  "Literary Fiction": "A4",
  Science: "C1",
  History: "D3",
  Philosophy: "D1",
  Biography: "E2",
  "Science Fiction": "B5",
};

const QUOTE_TEMPLATES = [
  "The kind of book that rearranges something in you.",
  "I read the last page and just sat there for a while.",
  "Every chapter felt like it was written for exactly this moment in my life.",
  "A sentence I copied into my notes and haven't stopped thinking about since.",
  "The ending undid me in the best way.",
  "This is the book I keep pressing into other people's hands.",
];

function hashCode(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getBookDetail(book: MockBook) {
  const seed = hashCode(book.id + book.title);
  const publisher = PUBLISHERS[seed % PUBLISHERS.length];
  const shelf = SHELF_BY_GENRE[book.genre] ?? "A1";
  const shelfPosition = (seed % 40) + 1;
  const isbn13 = `978-${(1000000000 + seed).toString().slice(0, 9)}`;
  const purchasePrice = Math.round((book.pages * 0.045 + 4) * 100) / 100;

  const summary = `A ${book.genre.toLowerCase()} work by ${book.author}, first published in ${book.year}. Spanning ${book.pages} pages, it's catalogued on Shelf ${shelf} as part of the ${book.genre} collection.`;

  const aiSummary = `${book.title} explores themes central to ${book.genre.toLowerCase()} — expect a considered pace across its ${book.pages} pages. Readers who enjoyed other ${book.author} titles in this library tend to rate this similarly.`;

  const favoriteQuote =
    book.rating && book.rating >= 4
      ? `"${QUOTE_TEMPLATES[seed % QUOTE_TEMPLATES.length]}" — a note left on the first read.`
      : null;

  return {
    publisher,
    shelf,
    shelfPosition,
    isbn13,
    language: "English",
    purchasePrice,
    condition: book.rating && book.rating >= 4 ? "Very Good" : "Good",
    summary,
    aiSummary,
    favoriteQuote,
    tags: [book.genre, book.format, `${Math.floor(book.year / 10) * 10}s`],
  };
}
