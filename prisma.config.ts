import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js loads .env.local automatically; the Prisma CLI does not, so load
// it explicitly here (Vercel CLI writes provisioned DB credentials there).
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use process.env directly (not the `env()` helper) so `prisma generate`
    // doesn't throw when DATABASE_URL is unset, e.g. before Neon existed.
    url: process.env.DATABASE_URL ?? "",
  },
});
