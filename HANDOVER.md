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

## What's not built
Everything else in her spec: Home Dashboard (real data), Library, Collections, Authors/Publishers/Series/Genres, Wishlist, Reading tracker, Quotes/Notes, real AI Librarian, real Analytics, Search, Timeline, Settings, auth, database (Prisma/Postgres), import pipeline, etc. This was intentionally scoped down to "web home page" for this session — the full spec describes an entire OS-scale build across 11 phases.
