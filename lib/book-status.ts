import type { BookStatus } from "@/lib/mock-data";

export const STATUS_CONFIG: Record<BookStatus, { label: string; className: string }> = {
  reading: {
    label: "Reading",
    className: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  },
  completed: {
    label: "Completed",
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  unread: {
    label: "Unread",
    className: "text-muted-foreground bg-secondary/60 border-border/60",
  },
  wishlist: {
    label: "Wishlist",
    className: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  },
  dnf: {
    label: "DNF",
    className: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  },
};

export const STATUS_FILTERS: { label: string; value: BookStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Reading", value: "reading" },
  { label: "Completed", value: "completed" },
  { label: "Unread", value: "unread" },
  { label: "Wishlist", value: "wishlist" },
  { label: "DNF", value: "dnf" },
];
