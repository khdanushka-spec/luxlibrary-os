import { Search } from "lucide-react";
import { AddBookDialog } from "./add-book-dialog";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppTopbar({ userName, userEmail }: { userName: string; userEmail: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 py-3.5 backdrop-blur-xl">
      <form action="/search" className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          name="q"
          placeholder="Search your library..."
          className="h-9 w-full rounded-full border border-border/70 bg-secondary/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
        />
      </form>

      <div className="flex items-center gap-3">
        <AddBookDialog />
        <ThemeToggle />
        <UserMenu name={userName} email={userEmail} />
      </div>
    </header>
  );
}
