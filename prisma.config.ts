import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // No live database is connected yet — use process.env directly (not the
    // `env()` helper) so `prisma generate` doesn't throw when DATABASE_URL
    // is unset, e.g. during the Vercel build before Neon is provisioned.
    url: process.env.DATABASE_URL ?? "",
  },
});
