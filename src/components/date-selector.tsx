'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateSelector({
  basePath,
  currentYear
}: {
  basePath: string;
  currentYear: number;
}) {
  const router = useRouter();

  const handleYearChange = (offset: number) => {
    const newYear = currentYear + offset;
    router.push(`${basePath}/${newYear}`);
  };

  return (
    <div className="flex items-center gap-4 font-mono text-lg font-bold">
      <button onClick={() => handleYearChange(-1)} className="p-1 rounded-full hover:bg-accent">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span>{currentYear}</span>
      <button onClick={() => handleYearChange(1)} className="p-1 rounded-full hover:bg-accent">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}