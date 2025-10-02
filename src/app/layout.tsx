import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/main-nav";
import ShortcutNav from "@/components/shortcut-nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RANKKS",
  description: "All your sports data in one place.",
};

export default function RootLayout({
  children,
  params: paramsPromise,
}: Readonly<{
  children: React.ReactNode;
  params?: { sportName?: string };
}>) {
  const params = paramsPromise || {};
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <ShortcutNav />
          <MainNav currentSportName={params.sportName} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}