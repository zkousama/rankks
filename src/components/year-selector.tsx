// src/components/year-selector.tsx
'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SeasonAPI } from '@/lib/thesportsdb';
import { useEffect } from 'react';

interface YearSelectorProps {
  seasons: SeasonAPI[];
  basePath: string;
  currentSeason: string;
}

export default function YearSelector({ seasons, basePath, currentSeason }: YearSelectorProps) {
  // fallback display if no seasons sent
  if (!seasons || seasons.length === 0) {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className="px-3 py-1 text-sm font-medium bg-accent text-accent-foreground">
          {currentSeason || 'Current Season'}
        </div>
      </div>
    );
  }
  // scroll active season into view once mounted
  useEffect(() => {
    if (!currentSeason) return;
    const el = document.getElementById(`season-${currentSeason}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentSeason, seasons]);

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
      {seasons.map((season) => {
        const year = season.strSeason.includes('-')
          ? season.strSeason.split('-')[0]
          : season.strSeason;
        const isActive = season.strSeason === currentSeason;
        return (
          <Link
            key={season.strSeason}
            href={`${basePath}/${season.strSeason}/standings`}
            id={`season-${season.strSeason}`}
            className={cn(
              "px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/20 hover:text-foreground"
            )}
          >
            {year}
          </Link>
        );
      })}
    </div>
  );
}