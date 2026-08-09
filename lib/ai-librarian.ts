import type { LibrarianBook } from "@/lib/db-books";

function listBooks(books: LibrarianBook[], limit = 6) {
  return books
    .slice(0, limit)
    .map((b) => `“${b.title}” by ${b.author}`)
    .join(", ");
}

function findByTitleFragment(query: string, books: LibrarianBook[]) {
  const q = query.toLowerCase();
  return books.find((b) => q.includes(b.title.toLowerCase()));
}

function findByAuthorFragment(query: string, books: LibrarianBook[]) {
  const q = query.toLowerCase();
  return books.filter((b) => q.includes(b.author.toLowerCase()));
}

export function answerQuery(rawQuery: string, books: LibrarianBook[]): string {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return "Ask me anything about your library.";

  const genres = Array.from(new Set(books.map((b) => b.genre)));

  const pagesMatch = query.match(/(shorter than|under|fewer than|less than)\s+(\d+)\s*pages?/);
  if (pagesMatch) {
    const max = parseInt(pagesMatch[2], 10);
    const matches = books.filter((b) => b.pages < max).sort((a, b) => a.pages - b.pages);
    if (matches.length === 0) {
      return `Nothing under ${max} pages in your collection right now.`;
    }
    return `${matches.length} books under ${max} pages: ${listBooks(matches)}.`;
  }

  const authorMatches = findByAuthorFragment(query, books);
  if (authorMatches.length > 0) {
    const author = authorMatches[0].author;
    const shelves = Array.from(new Set(authorMatches.map((b) => b.shelf)));
    return `You have ${authorMatches.length} book${
      authorMatches.length > 1 ? "s" : ""
    } by ${author}: ${listBooks(authorMatches)}. Mostly on Shelf ${shelves.join(", ")}.`;
  }

  if (query.includes("where")) {
    const book = findByTitleFragment(query, books);
    if (book) {
      return `“${book.title}” is on Shelf ${book.shelf}${
        book.shelfPosition ? `, position ${book.shelfPosition}` : ""
      }.`;
    }
  }

  if (query.includes("summar")) {
    const book = findByTitleFragment(query, books);
    if (book) {
      return book.aiSummary ?? `No summary catalogued yet for “${book.title}.”`;
    }
    return "Tell me which book to summarize — try including its title.";
  }

  if (query.includes("recommend")) {
    const referenceTitle = findByTitleFragment(query, books);
    const pool = referenceTitle
      ? books.filter(
          (b) => b.genre === referenceTitle.genre && b.id !== referenceTitle.id
        )
      : books.filter((b) => b.status === "unread" || b.status === "wishlist");
    const picks = pool.slice(0, 3);
    if (picks.length === 0) {
      return "I'd need a bit more of your collection to make a good recommendation.";
    }
    return referenceTitle
      ? `If you liked “${referenceTitle.title}”, try: ${listBooks(picks, 3)}.`
      : `From your unread shelf: ${listBooks(picks, 3)}.`;
  }

  if (query.includes("never read") || query.includes("haven't read") || query.includes("unread")) {
    const matches = books.filter((b) => b.status === "unread");
    return `${matches.length} unread books waiting: ${listBooks(matches)}.`;
  }

  const genreHit = genres.find((g) => query.includes(g.toLowerCase()));
  if (genreHit) {
    const matches = books.filter((b) => b.genre === genreHit);
    return `${matches.length} ${genreHit} books: ${listBooks(matches)}.`;
  }

  const totalBooks = books.length;
  const readingNow = books.filter((b) => b.status === "reading").length;
  return `I'm not sure yet — I'm a demo running on pattern matching over ${totalBooks} books in your library (${readingNow} currently being read), not a live model. Try asking about an author, a genre, "books shorter than N pages", "where is <title>", or "recommend books like <title>".`;
}
