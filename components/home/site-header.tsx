"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Library", href: "#library-map" },
  { label: "AI Librarian", href: "#ai-librarian" },
  { label: "Analytics", href: "#analytics" },
  { label: "Reading Life", href: "#reading-life" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-border/60 py-3"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="#top" className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6" />
          <span className="font-display text-[1.05rem] tracking-tight text-foreground">
            LuxLibrary <span className="text-gold">OS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Sign in
          </Link>
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            className="h-9 rounded-full bg-gold px-4 text-[0.85rem] font-medium text-gold-foreground hover:bg-gold/90"
          >
            Enter your library
          </Button>
        </div>
      </div>
    </header>
  );
}
