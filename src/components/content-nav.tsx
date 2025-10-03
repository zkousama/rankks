"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface ContentNavProps {
  basePath: string;
  currentContentType: string;
}

export default function ContentNav({
  basePath,
  currentContentType,
}: ContentNavProps) {
  const navItems = [
    { name: "Standings", slug: "standings" },
    { name: "Scorers", slug: "scorers" },
    { name: "Passers", slug: "passers" },
    { name: "Players", slug: "players" },
  ];

  return (
    <nav className="flex items-center gap-4 border-b border-border bg-card px-4">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={`${basePath}/${item.slug}`}
          className={cn(
            "py-3 border-b-2 text-sm font-semibold transition-colors",
            currentContentType === item.slug
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          )}
        >
          {item.name.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
