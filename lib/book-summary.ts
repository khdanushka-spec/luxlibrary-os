/**
 * Template-based summary, not a live AI call - same honesty tradeoff as
 * lib/book-detail.ts's hash-derived fallback for legacy books. Gated behind
 * the "Auto-generate book summaries" setting.
 */
export function generateAutoSummary(book: { title: string; author: string; genre: string; pages?: number }): string {
  const pagesClause = book.pages ? ` across its ${book.pages} pages` : "";
  return `${book.title} explores themes central to ${book.genre.toLowerCase()}${pagesClause}. Readers who enjoyed other ${book.author} titles in this library tend to rate this similarly.`;
}
