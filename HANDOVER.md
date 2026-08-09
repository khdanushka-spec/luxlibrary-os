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

### Still not built
No real database (Neon isn't provisioned — Storage tab in Vercel dashboard, or ask to set one up next), no auth, real Library/Collections/Authors/etc. list-and-detail pages, real AI Librarian, real Analytics, Search, import pipeline. This is still an early slice of an 11-phase spec — expect this to take many more sessions, similar to how her NEXORA Finance OS project took ~24 sessions.
