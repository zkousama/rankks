'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SeasonAPI } from '@/lib/thesportsdb';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface YearSelectorProps {
  seasons: SeasonAPI[];
  basePath: string;
  currentSeason: string;
}

export default function YearSelector({ basePath, currentSeason }: YearSelectorProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);
  
  // Generate a more complete list of seasons
  const [allSeasons, setAllSeasons] = useState<string[]>([]);

  useEffect(() => {
    // Since API only returns 5 seasons, generate seasons from 1992 to current year
    const currentYear = new Date().getFullYear();
    const generatedSeasons: string[] = [];
    
    // Generate seasons in reverse order (newest first)
    for (let year = currentYear; year >= 1992; year--) {
      generatedSeasons.push(`${year}-${year + 1}`);
    }
    
    setAllSeasons(generatedSeasons);
  }, []);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setShowLeftChevron(container.scrollLeft > 0);
    setShowRightChevron(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const navigateYear = (offset: number) => {
    const currentYearNum = parseInt(currentSeason.split('-')[0]);
    const newYear = currentYearNum + offset;
    const newSeason = `${newYear}-${newYear + 1}`;
    router.push(`${basePath}/${newSeason}/standings`);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Scroll active season into view on mount
    if (currentSeason) {
      const activeEl = document.getElementById(`season-${currentSeason}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

    // Check scroll position initially and on scroll
    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [currentSeason, allSeasons]);

  if (allSeasons.length === 0) {
    return (
      <div className="flex items-center justify-center h-12 bg-card border-b border-border">
        <div className="px-3 py-1 text-sm font-medium bg-accent text-accent-foreground">
          {currentSeason || 'Current Season'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-12 bg-card border-b border-border flex items-center">
      {/* Left Navigation Arrow */}
      <button
        onClick={() => navigateYear(1)}
        className="h-full px-3 border-r border-border hover:bg-muted transition-colors"
        aria-label="Previous season"
        title="Previous season"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>

      {/* Left Scroll Chevron */}
      {showLeftChevron && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-12 z-10 h-full px-3 bg-gradient-to-r from-card via-card/90 to-transparent hover:opacity-80"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      {/* Years Container - displays ALL generated seasons */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto px-4 py-1 no-scrollbar flex-1"
      >
        {allSeasons.map((season) => {
          const year = season.split('-')[0];
          const isActive = season === currentSeason;
          
          return (
            <Link
              key={season}
              href={`${basePath}/${season}/standings`}
              id={`season-${season}`}
              className={cn(
                "px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors shrink-0",
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

      {/* Right Scroll Chevron */}
      {showRightChevron && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-12 z-10 h-full px-3 bg-gradient-to-l from-card via-card/90 to-transparent hover:opacity-80"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      <button
        onClick={() => navigateYear(-1)}
        className="h-full px-3 border-l border-border hover:bg-muted transition-colors"
        aria-label="Next season"
        title="Next season"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
}