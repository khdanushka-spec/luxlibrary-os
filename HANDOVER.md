# Handover — 2026-08-09 20:15

## Goal
Dhanu asked to build "LuxLibrary OS" — a premium personal-library operating system for a 2,000+ book collector, from an extensive spec (11-phase build: dashboard, catalog, AI librarian, collections, analytics, reading tracker, etc.). Work proceeded: marketing home page first, then "the Operation site" (the actual app), then iteratively via bare "next" / "next 5" prompts to build out the full IA one module (or batch) at a time, then "confirm and do it" to provision a real database and migrate pages off mock data one at a time.

## State
- Marketing site (`/`) and the full app shell (sidebar covering every IA section, topbar with search + Add Book) are built and deployed.
- **20 screens exist.** Only **Profile** is still unbuilt (falls through to the generic `app/(os)/[section]/page.tsx` "not built yet" page).
- **A real Neon Postgres database is live and seeded**: 28 books, 18 authors, 8 publishers, 7 genres, 2 series, 7 shelves, 6 notes, 13 quotes — the same content the mock data always showed, now persisted for real.
- **Wired to the real database**: Library, Book Detail, Wishlist, Authors, Genres, Publishers (+detail), Series (+detail), Collections (+detail), Quotes, Search, AI Librarian.
- **Still on mock data** (`lib/mock-data.ts`'s `MOCK_BOOKS`, not the database): Dashboard, Analytics, Reading Life, Timeline, Notes. None of these use the risky hash-derived shortcut described in Gotchas *except* Analytics (see Next steps) — the rest should be routine swaps.
- No auth (single-owner app, deliberately not built).
- Add Book is a fully built, validated form that explicitly does **not** persist yet (shows a "preview only" message on submit).
- No book edit/delete, no CSV/import pipeline, no real LLM behind AI Librarian (rule-based pattern matching over real data, clearly labeled as such in the UI, not hidden as if it were a live model).
- Production: **https://luxlibrary-os.vercel.app** — Vercel project `dkns/luxlibrary-os`, auto-deploys on push to `master`. GitHub: `khdanushka-spec/luxlibrary-os` (public).

## Key decisions
- **Mock data first, database later, page by page.** Every module was built against a shared `lib/mock-data.ts` dataset before any database existed, then migrated to Prisma incrementally (Library+Detail together, then 6 aggregation pages, then Quotes+Search, then AI Librarian) rather than provisioning a DB up front or converting everything at once. Every intermediate state stayed shippable, and each migration step was verified against numbers already known from the mock-data era — a real bug (see Gotchas) was caught this way.
- **Migrating a page to the database means adapting Prisma rows into the existing `MockBook` shape** (`lib/db-books.ts`'s `toMockBook()`), not rewriting consuming components — `BookCard`, `BookListRow`, `LibraryView`, etc. never changed; only what a page fetched from did.
- **Library and Book Detail were migrated together, not one at a time**, because they're linked by id — wiring one to real DB ids while the other still looked up the old mock "1".."28" ids would have made every click-through 404.
- **shadcn/ui here is built on Base UI, not Radix.** Components take a `render` prop instead of `asChild` (e.g. `<Button render={<a href="/x" />}>`), and a non-`<button>` render target needs `nativeButton={false}` or Base UI logs a console error.
- **Prisma 7 moved connection config out of `schema.prisma`** into `prisma.config.ts`, and `PrismaClient` now requires an explicit driver `adapter` (`@prisma/adapter-neon` here) — a real API break from what most training data assumes. `prisma.config.ts` reads `process.env.DATABASE_URL` directly, not the throwing `env()` helper, so `prisma generate` survives a build before any database exists.

## Files touched
From-scratch build — essentially all of `app/`, `components/`, `lib/`, `prisma/` are new. The load-bearing files for continuing the database migration:
- `lib/mock-data.ts` — `MOCK_BOOKS` and the `MockBook` type. Source of truth for anything not yet migrated, and the seed data for everything that is.
- `lib/db-books.ts` — every DB read function (`getAllBooksFromDb`, `getBookDetailFromDb`, `getQuotesFromDb`, `searchQuotesFromDb`, `getLibrarianBooksFromDb`) plus the `toMockBook()` adapter. Add new functions here for the remaining pages.
- `lib/book-detail.ts` — `getBookDetail()`, the **hash-derived, mock-only** helper. Exports `hashCode` for reuse elsewhere. Never call this on a book that came from the database — see Gotchas.
- `lib/analytics.ts`, `lib/reading.ts`, `lib/timeline.ts` — still read `MOCK_BOOKS` internally; next migration targets.
- `prisma/schema.prisma` — full data model. `prisma/seed.ts` reuses `lib/mock-data.ts` / `lib/book-detail.ts` / `lib/mock-notes.ts` directly, so re-seeding (`npx prisma db seed`) always matches the mock dataset.
- `app/(os)/ai/actions.ts` — the one Server Action in the app so far, needed because the AI chat is a client component and can't call Prisma directly. Follow this pattern for any future client-interactive feature needing DB access (e.g. making Add Book actually persist).

## Gotchas / constraints learned
- **The single biggest recurring bug class in this build**: `lib/book-detail.ts`'s `getBookDetail(book)` derives publisher/shelf/ISBN/summary/favorite-quote from a hash of `book.id`. Fine for `MOCK_BOOKS` (stable "1".."28" ids), **silently wrong** for a database book (a real cuid the hash was never seeded against). Publishers, Quotes, Search, and AI Librarian all hit this and needed a real fix — query the actually-stored field — not just a data-source swap. **`lib/analytics.ts` still calls `getBookDetail()` for `purchasePrice`** — fix this specifically when migrating Analytics, don't just swap `MOCK_BOOKS` for DB books.
- **This machine's `gh` CLI has two cached GitHub accounts** (`dhanu-af`, `khdanushka-spec`), only one active at a time. Before any push here: `gh auth status` to check, `gh auth switch --hostname github.com --user khdanushka-spec` before pushing, then switch back to `dhanu-af` afterward so Dhanu's other projects on this machine aren't disrupted.
- **Real outbound DB connections work fine from the Bash tool on this machine** — `prisma migrate dev` / `db seed` ran successfully against the live Neon database. (An older cross-project memory claiming otherwise was specific to a different context and has been corrected.)
- **The Browser-pane preview tool can fail to visually show server-streamed Suspense content even when the server response is genuinely correct** — confirmed by `fetch()`ing a page directly and finding the right HTML sitting in a hidden `<div id="S:*">` that never got swapped into view (same root cause as a known "RAF never fires in this tool" limitation). If a page looks stuck/blank here despite clean server logs, `fetch()` it directly before assuming a real bug — and consider whether the `<Suspense>` boundary causing it is even still needed.
- `npx vercel integration add neon --claim --environment production --environment preview --environment development` provisions a real Neon DB via the Vercel Marketplace, connects it to the project, and writes credentials to `.env.local` (gitignored) in one command.
- Windows: stop the local dev server before running `prisma generate`/`migrate` (file lock on the query engine `.dll.node`).
- `dotenv` prints a rotating promotional "tip" line on every `config()` call (once referenced `www.vestauth.com`) — cosmetic, not a security concern.

## Next steps
1. Migrate Dashboard, Analytics, Reading Life, Timeline, and Notes to the real database. `lib/analytics.ts` / `lib/reading.ts` / `lib/timeline.ts` need to accept a `books` (and, for Analytics, real purchase-price) parameter instead of importing `MOCK_BOOKS` directly — same pattern already used for `lib/collections.ts` / `lib/series.ts` / `lib/publishers.ts` — and their pages need to become `async` and fetch via `lib/db-books.ts`. Fix Analytics' `getBookDetail()` call per the Gotcha above.
2. Make Add Book actually persist — it's a complete, validated form that currently does nothing on submit. Needs a Server Action (follow `app/(os)/ai/actions.ts`'s pattern) that creates a `Book` row plus `Author`/`Genre`/`Publisher` upserts, then revalidates the Library page.
3. Book edit/delete — not started.
4. Build the Profile page — the only remaining unbuilt nav item.
5. Once the whole app reads from the database, `lib/mock-data.ts` and `lib/book-detail.ts` become dead code for the app itself (still needed by `prisma/seed.ts`) — worth a cleanup pass, but don't delete what the seed script depends on.

## Open questions
- Real AI (OpenAI/Claude API key) behind AI Librarian, or keep it rule-based indefinitely? Not discussed with Dhanu.
- Auth — the app has none. Worth adding before this is ever exposed beyond Dhanu's own use?
- Whether to keep building out every remaining spec module at the current shallow-but-broad pace, or shift to depth (real book editing, real search relevance, a real import pipeline) on what already exists.
