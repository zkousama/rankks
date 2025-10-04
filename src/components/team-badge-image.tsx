'use client';

import { useState } from 'react';
import Image from 'next/image';

interface TeamBadgeImageProps {
  src: string | null | undefined;
  alt: string;
  initials: string;
}

export default function TeamBadgeImage({ src, alt, initials }: TeamBadgeImageProps) {
  const [hasError, setHasError] = useState(false);

  // If there's an error, no src, or an empty src, show the placeholder
  if (hasError || !src) {
    return (
      <div className="w-6 h-6 bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground rounded-sm shrink-0">
        {initials}
      </div>
    );
  }

  // Otherwise, attempt to render the Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      className="object-contain"
      unoptimized // Using unoptimized as a safe bet with external, unpredictable sports APIs
      onError={() => {
        // If the image fails to load, set the error state to true.
        // This will trigger a re-render and display the placeholder.
        setHasError(true);
      }}
    />
  );
}