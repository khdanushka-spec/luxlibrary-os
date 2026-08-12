import Link from "next/link";
import { LogoMark } from "@/components/home/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export function LegalHeader() {
  return (
    <header className="border-b border-border/60 py-5">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6" />
          <span className="font-display text-[1.05rem] tracking-tight text-foreground">
            Bring<span className="text-gold">Books</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Back home
          </Link>
        </div>
      </div>
    </header>
  );
}
