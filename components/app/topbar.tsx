import { Search } from "lucide-react";
import { AddBookDialog } from "./add-book-dialog";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppTopbar({
  userName,
  userEmail,
  isSuperAdmin,
  communityUnreadCount = 0,
}: {
  userName: string;
  userEmail: string;
  isSuperAdmin: boolean;
  communityUnreadCount?: number;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-3 py-3.5 backdrop-blur-xl sm:gap-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <MobileNav isSuperAdmin={isSuperAdmin} communityUnreadCount={communityUnreadCount} />
        <form action="/search" className="relative w-full min-w-0 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            placeholder="Search your library..."
            className="h-9 w-full rounded-full border border-border/70 bg-secondary/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/40 focus:outline-none"
          />
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <AddBookDialog />
        <ThemeToggle />
        <UserMenu name={userName} email={userEmail} />
      </div>
    </header>
  );
}
