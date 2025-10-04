"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ContentNavProps {
  basePath: string;
  currentContentType: string;
  countryName?: string;
  countryCode?: string;
}

export default function ContentNav({
  basePath,
  currentContentType,
  countryName,
  countryCode,
}: ContentNavProps) {
  const navItems = [
    { name: "Standings", slug: "standings" },
    { name: "Scorers", slug: "scorers" },
    { name: "Passers", slug: "passers" },
    { name: "Players", slug: "players" },
  ];

  return (
    <nav className="flex items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
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
      </div>
      
      {countryName && countryCode && (
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0">
          <span>{countryName}</span>
          <Image 
            src={`https://flagcdn.com/w40/${countryCode}.png`} 
            width={40} 
            height={25} 
            alt={countryName} 
            className="rounded" 
          />
        </div>
      )}
    </nav>
  );
}