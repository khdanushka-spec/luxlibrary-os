import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, DollarSign, ShieldCheck, Users } from "lucide-react";
import { DeleteBookButton } from "@/components/library/delete-book-button";
import { STATUS_CONFIG } from "@/lib/book-status";
import { getMasterLibraryFromDb, getMasterLibraryStatsFromDb } from "@/lib/db-books";
import { coverGradient } from "@/lib/mock-data";
import { requireSuperAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Master Library — LuxLibrary OS",
};

export const dynamic = "force-dynamic";

export default async function MasterLibraryPage() {
  const admin = await requireSuperAdmin();
  if (!admin) redirect("/dashboard");

  const [books, stats] = await Promise.all([
    getMasterLibraryFromDb(),
    getMasterLibraryStatsFromDb(),
  ]);

  const statTiles = [
    { icon: BookOpen, label: "Total books", value: stats.totalBooks.toLocaleString() },
    { icon: Users, label: "Approved members", value: stats.totalMembers.toLocaleString() },
    {
      icon: DollarSign,
      label: "Collection value",
      value: `$${stats.collectionValueUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
  ];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <h1 className="font-display flex items-center gap-2.5 text-3xl text-foreground">
          <ShieldCheck className="size-6 text-gold" />
          Master Library
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every book across every member&apos;s private library, for full visibility and management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statTiles.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/70 bg-card/60 p-5"
          >
            <stat.icon className="mb-3 size-4 text-gold" />
            <div className="font-display text-2xl text-foreground">{stat.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/60 px-5">
        <h2 className="px-1 pt-5 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          All books ({books.length})
        </h2>
        {books.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No books have been added by any member yet.
          </p>
        ) : (
          <div className="mt-2">
            {books.map((book, i) => {
              const status = STATUS_CONFIG[book.status];
              return (
                <div
                  key={book.id}
                  className="flex items-center gap-4 border-b border-border/60 py-3 last:border-b-0"
                >
                  <div
                    className={cn(
                      "h-14 w-10 shrink-0 rounded bg-gradient-to-br",
                      coverGradient(i)
                    )}
                  />
                  <Link
                    href={`/library/${book.id}`}
                    className="min-w-0 flex-1 transition-colors hover:text-gold"
                  >
                    <p className="truncate text-sm font-medium text-foreground">
                      {book.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {book.author} &middot; {book.genre}
                    </p>
                  </Link>
                  <div className="hidden w-40 shrink-0 sm:block">
                    <p className="truncate text-xs font-medium text-foreground">
                      {book.ownerName}
                    </p>
                    <p className="truncate text-[0.7rem] text-muted-foreground">
                      {book.ownerEmail}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "hidden shrink-0 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium sm:block",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                  <div className="shrink-0">
                    <DeleteBookButton id={book.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
