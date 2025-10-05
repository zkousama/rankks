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
  const [allSeasons, setAllSeasons] = useState<string[]>([]);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed
    
    // Determine the latest possible season based on current date
    // For soccer seasons (YYYY-YYYY format), if we're past August, current season is active
    // Otherwise, previous season is the latest
    let latestYear = currentYear;
    if (currentMonth < 7) { // Before August
      latestYear = currentYear - 1;
    }
    
    const generatedSeasons: string[] = [];
    
    // Generate seasons from latestYear down to 1992
    for (let year = latestYear; year >= 1992; year--) {
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
    
    // Check if the new season exists in our generated list
    if (allSeasons.includes(newSeason)) {
      router.push(`${basePath}/${newSeason}/standings`);
    }
  };

  const canNavigatePrevious = () => {
    const currentYearNum = parseInt(currentSeason.split('-')[0]);
    const nextYear = currentYearNum + 1;
    const nextSeason = `${nextYear}-${nextYear + 1}`;
    return allSeasons.includes(nextSeason);
  };

  const canNavigateNext = () => {
    const currentYearNum = parseInt(currentSeason.split('-')[0]);
    const prevYear = currentYearNum - 1;
    const prevSeason = `${prevYear}-${prevYear + 1}`;
    return allSeasons.includes(prevSeason);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (currentSeason) {
      const activeEl = document.getElementById(`season-${currentSeason}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }

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
      {/* Left Navigation Arrow - goes to NEWER season (previous in timeline) */}
      <button
        onClick={() => navigateYear(1)}
        disabled={!canNavigatePrevious()}
        className={cn(
          "h-full px-3 border-r border-border transition-colors",
          canNavigatePrevious() 
            ? "hover:bg-muted cursor-pointer" 
            : "opacity-30 cursor-not-allowed"
        )}
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

      {/* Years Container */}
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

      {/* Right Navigation Arrow - goes to OLDER season (next in timeline) */}
      <button
        onClick={() => navigateYear(-1)}
        disabled={!canNavigateNext()}
        className={cn(
          "h-full px-3 border-l border-border transition-colors",
          canNavigateNext() 
            ? "hover:bg-muted cursor-pointer" 
            : "opacity-30 cursor-not-allowed"
        )}
        aria-label="Next season"
        title="Next season"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
}