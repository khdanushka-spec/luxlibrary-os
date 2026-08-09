import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bookmark,
  BookOpen,
  Bot,
  Clock,
  Gem,
  Home,
  Layers,
  LayoutGrid,
  Library,
  NotebookText,
  Quote,
  Search,
  Settings,
  Tags,
  User,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Home", href: "/dashboard", icon: Home },
      { label: "Search", href: "/search", icon: Search },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Library", href: "/library", icon: Library },
      { label: "Collections", href: "/collections", icon: LayoutGrid },
      { label: "Library Map", href: "/library-map", icon: Layers },
      { label: "Wishlist", href: "/wishlist", icon: Bookmark },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Authors", href: "/authors", icon: Users },
      { label: "Publishers", href: "/publishers", icon: BookOpen },
      { label: "Series", href: "/series", icon: Gem },
      { label: "Genres", href: "/genres", icon: Tags },
    ],
  },
  {
    label: "Reading Life",
    items: [
      { label: "Reading", href: "/reading", icon: Clock },
      { label: "Quotes", href: "/quotes", icon: Quote },
      { label: "Notes", href: "/notes", icon: NotebookText },
      { label: "Timeline", href: "/timeline", icon: Clock },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AI Librarian", href: "/ai", icon: Bot },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
];

export const NAV_FOOTER_ITEMS: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User },
];
