import Link from "next/link";
import Image from "next/image";

const shortcuts = [
  { id: "premier-league", name: "Premier League", href: "/view/Soccer/4328/2023-2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png" },
  { id: "champions-league", name: "Champions League", href: "/view/Soccer/4480/2023-2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/facv1u1742998896.png" },
  { id: "la-liga", name: "La Liga", href: "/view/Soccer/4335/2023-2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/ja4it51687628717.png" },
  { id: "serie-a", name: "Serie A", href: "/view/Soccer/4332/2023-2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/67q3q21679951383.png" },
  { id: "bundesliga", name: "Bundesliga", href: "/view/Soccer/4331/2023-2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png" },
  { id: "nba", name: "NBA", href: "/view/Basketball/4387/2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/frdjqy1536585083.png" },
  { id: "atp-tour", name: "ATP Tour", href: "/view/Tennis/4385/2024/standings", badge: "https://r2.thesportsdb.com/images/media/league/badge/x16ihc1546113079.png" },
];

export default function ShortcutNav({ currentPath }: { currentPath?: string }) {
  return (
    <div className="bg-background border-b px-4 py-1 overflow-x-auto no-scrollbar h-12">
      <div className="flex items-center gap-3 min-w-max">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.id}
            href={shortcut.href}
            className="flex items-center"
          >
            <Image
              src={shortcut.badge}
              alt={shortcut.name}
              width={36}
              height={36}
              className="object-contain"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}