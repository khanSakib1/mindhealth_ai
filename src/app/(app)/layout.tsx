"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex">
      <aside className="hidden md:flex flex-col w-72 border-r bg-background p-4">
        <div className="flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <AppLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MindfulJourney</span>
          </Link>
          <SidebarNav />
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between md:justify-end border-b px-4 lg:px-6 bg-background">
          <MobileSidebar />
          <div />
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10 bg-secondary/20">
            {children}
        </main>
      </div>
    </div>
  );
}
