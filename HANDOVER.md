# LuxLibrary OS — Handover

**Status (2026-08-09):** Home / marketing page built, verified, pushed to GitHub, and deployed to Vercel production. Nothing else from the full spec is implemented yet.

## Repo & deployment
- GitHub: https://github.com/khdanushka-spec/luxlibrary-os (public, under the `khdanushka-spec` account — not `dhanu-af`)
- Vercel: project `dkns/luxlibrary-os`, prod at **https://luxlibrary-os.vercel.app**, connected to the GitHub repo for auto-deploy on push to `master`
- Local git identity for this repo only: `Dhanushka` / `khdanushka@gmail.com` (matches `nutriai`'s local config, not global)
- **Gotcha:** this machine's `gh` CLI has two cached accounts (`dhanu-af`, `khdanushka-spec`) and only one is active at a time. Before pushing, run `gh auth status` to confirm the active account matches the repo owner, `gh auth switch --hostname github.com --user <name>` if not.

## Stack
- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind v4
- shadcn/ui — built on **Base UI**, not Radix. Components take a `render` prop instead of `asChild` (e.g. `<Button render={<a href="/x" />}>`), and if the rendered element isn't a real `<button>`, pass `nativeButton={false}` or Base UI logs a console error.
- `motion` (import from `motion/react`, not `framer-motion`)
- `lucide-react` icons
- Dev server: `npm run dev` inside this folder, or via the shared launcher entry `luxlibrary-os` (port 3013) in `C:\Users\dnand\.claude\launch.json`.

## What's built
`app/page.tsx` composes sections from `components/home/`:
hero, principles marquee, stats, feature grid, library map showcase, AI librarian chat mockup, reading/analytics showcase, quote, final CTA, footer. Theme: warm dark "gilded library" palette (gold accent), Fraunces serif for headlines + Geist Sans for UI, tokens in `app/globals.css`.

## Known gap — Figma reference
Dhanu supplied a Figma Make file (`figma.com/make/RRR4dvaXsgw2PAMdrolMG5`) as the visual reference. `get_design_context` fails: her Figma seat is **View-only**, which blocks the MCP from reading the file even though she owns it. The home page was built from her written design brief (Apple/Notion/Arc/Linear/Stripe-inspired) instead of the literal file. If she upgrades her seat to Editor (or duplicates the file into an editable plan), re-pull the design and reconcile spacing/colors/copy against it.

## Update (2026-08-09, session 2): app shell + Home Dashboard
Added the actual "operating system" behind "Enter your library" (was just an anchor link before):
- `app/(os)/layout.tsx` — sidebar (`components/app/sidebar.tsx`) + topbar (`components/app/topbar.tsx`) shell, nav data in `lib/nav.ts` (matches the spec's full Information Architecture: Home, Library, Collections, Library Map, Wishlist, Authors, Publishers, Series, Genres, Reading, Quotes, Notes, Timeline, AI Librarian, Analytics, Settings, Profile)
- `app/(os)/dashboard/page.tsx` — the real Home Dashboard: stat tiles, today's pick, continue reading, AI insights, reading challenge ring, recently added shelf, favorite genres/authors. Runs entirely on `lib/mock-data.ts` — **no real data yet**.
- Every other nav item routes through `app/(os)/[section]/page.tsx`, a shared "this module hasn't been built yet" placeholder (returns a real 404 via `notFound()` for unknown paths, so it's not a catch-all).
- `prisma/schema.prisma` — full data model (Book, Author/BookContributor, Publisher, Series, Genre, Tag, Shelf, Quote, Note, ReadingSession) covering the spec's BOOK DETAILS fields. **Prisma 7** (breaking changes from what most training data / older Prisma docs assume — see below).
- `lib/prisma.ts` — PrismaClient singleton using `@prisma/adapter-neon` (matches the Neon convention from her other projects). Not imported anywhere yet — the dashboard still reads mock data.

### Prisma 7 gotchas hit this session (worth knowing before touching the schema again)
- `datasource { url = env(...) }` in `schema.prisma` **no longer works** — v7 moved this to `prisma.config.ts`'s `datasource.url`, and `adapter` was removed from config entirely (migrations "just work" with driver adapters now).
- `PrismaClient` now **requires** an `adapter` in its constructor (unless using Accelerate) — there's no more implicit "read `DATABASE_URL` from schema" behavior. Hence `@prisma/adapter-neon` + `@neondatabase/serverless` + `ws` in `lib/prisma.ts`.
- `prisma.config.ts`'s `env()` helper **throws** if the var is unset — this broke the first Vercel deploy (`postinstall: prisma generate` failed the whole build because `DATABASE_URL` isn't set yet, no DB provisioned). Fixed by reading `process.env.DATABASE_URL ?? ""` directly instead of the `env()` helper. If you add real env handling later, keep in mind `prisma generate` must survive a completely unset `DATABASE_URL` since that's the state until a database exists.
- These aren't documented in the public Prisma docs yet as of this session (WebFetch of the official pages returned v6 content) — what's here was reverse-engineered from the installed `prisma@7.9.1` package's own `.d.ts` files (`node_modules/@prisma/config/dist/index.d.ts`, generated client's `index.d.ts`). Re-check the actual installed version's types before trusting any Prisma 7 guidance from training data.

## Update (2026-08-09, session 3): Library page
Added `/library` (`app/(os)/library/page.tsx` → `components/library/library-view.tsx`): a browsable grid/list of 28 mock books (`MOCK_BOOKS` in `lib/mock-data.ts`) with live search (title/author), status filter chips, genre dropdown, sort (title/author/newest/longest), and a grid/list toggle — all client-side state, no backend. Status badge styling lives in `lib/book-status.ts`. Verified: search, status filtering, and list view all confirmed working correctly against the DOM (not just eyeballed).

## Update (2026-08-09, session 4): Book Detail page
Added `/library/[id]` (`app/(os)/library/[id]/page.tsx`): cover, status/rating, genre/format/year/pages chips, shelf location, Summary, AI Summary, Favorite Quote (only shown when `rating >= 4`), and a Details card (publisher, ISBN-13, language, condition, purchase price) + Tags. `lib/book-detail.ts` deterministically derives all of this from each `MockBook` (hashed by id+title, so it's stable across renders) rather than hand-authoring 28 detail records. `BookCard` and `BookListRow` now link to it.

## Update (2026-08-09, session 5): 5 more modules in one batch
- **Add Book** (`components/app/add-book-dialog.tsx`): real modal form in the topbar (title/author required, genre/format/status selects), client-validated, shows a success state on submit. Explicitly labeled "Preview only — no database is connected yet" — it does **not** persist anywhere (no localStorage, nothing). Don't be surprised a submitted book doesn't show up in Library; that's intentional, not a bug, until a real backend exists.
- **Wishlist** (`/wishlist`) — grid of `status === "wishlist"` books, reuses `BookCard`.
- **Authors** (`/authors`) — aggregated from `MOCK_BOOKS` (name, count, genres), sorted by count. Cards link to `/library?q=<author name>`.
- **Genres** (`/genres`) — same idea, links to `/library?genre=<genre>`.
- **Quotes** (`/quotes`) — wall of every book's `favoriteQuote` (rating ≥ 4 only), linking to that book's detail page.
- To make the Authors/Genres deep links work, `LibraryView` now reads its initial `query`/`genre` state from `useSearchParams()`, and `app/(os)/library/page.tsx` wraps it in `<Suspense>` (Next requires this for `useSearchParams` in a statically-rendered route — without it the build fails). The route stayed statically prerendered (`○`) even with this change.
- Fixed a content bug caught during this session's own verification: every book's favorite quote was the identical hardcoded string — added `QUOTE_TEMPLATES` (6 variants) in `lib/book-detail.ts`, picked deterministically by the same hash used for other derived fields. Worth remembering: skim generated/derived mock content for this kind of "technically works, looks obviously fake" issue before shipping, not just check it renders.

## Update (2026-08-09, session 6): AI Librarian
Added `/ai` — a real chat UI (`components/ai/ai-chat.tsx`) backed by a rule-based query engine (`lib/ai-librarian.ts`) over `MOCK_BOOKS`. Handles: author lookups, genre filters, "shorter than N pages", "where is `<title>`", "summarize `<title>`" (reuses `getBookDetail().aiSummary`), "recommend books like `<title>`" (same-genre pool), and "never read"/unread queries. Anything it can't parse gets an honest fallback message explaining it's pattern matching, not a live model, with example query shapes. No AI API (OpenAI/Claude) is wired up — this is deliberately NOT a real LLM call, just enough logic to make the chat feel alive and demonstrate the intended UX. Verified all 5 suggestion chips return sensible answers, including one deliberately-unhandleable query ("which books mention quantum physics") to confirm the fallback reads as helpful rather than broken.

## Update (2026-08-09, session 7): Search
The topbar search box (present on every OS page) was purely decorative until now. It's a plain `<form action="/search"><input name="q" /></form>` — no client JS, native GET navigation. `/search` (`app/(os)/search/page.tsx`) reads `searchParams` server-side and matches books (title/author/genre), authors, and favorite quotes against the query, in grouped sections. Has an empty-query hint state and a no-results state. Verified: real topbar submission, multi-category results, author-only results, quote-only results, both empty states — all correct, console clean on the live deployment.

### Still not built
No real database (Neon isn't provisioned — Storage tab in Vercel dashboard, or ask to set one up next), no auth, Collections/Publishers/Series/Reading/Notes/Timeline pages (still placeholders), real Analytics (dashboard has some charts but no dedicated `/analytics`), import pipeline, no book edit or delete, no actual LLM behind the AI Librarian, search doesn't cover notes (none exist yet). This is still an early slice of an 11-phase spec — expect this to take many more sessions, similar to how her NEXORA Finance OS project took ~24 sessions.
