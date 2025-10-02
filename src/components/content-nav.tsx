'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ContentNav({ basePath }: { basePath: string }) {
  const pathname = usePathname();

  // Define the available content types
  const navItems = [
    { name: 'Standings', href: `${basePath}/standings` },
    { name: 'Scorers', href: `${basePath}/scorers` },
    { name: 'Passers', href: `${basePath}/passers` },
    { name: 'Players', href: `${basePath}/players` },
  ];

  return (
    <nav className="flex items-center gap-4 border-b mb-6">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'py-2 px-1 border-b-2 text-sm font-semibold transition-colors',
            pathname === item.href
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}