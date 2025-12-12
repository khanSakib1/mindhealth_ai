"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return null; // Or a loading spinner, handled by AuthProvider for now
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

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
        <div className="mt-auto">
           <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between md:justify-end border-b px-4 lg:px-6 bg-background">
          <MobileSidebar />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10 bg-secondary/20">
            {children}
        </main>
      </div>
    </div>
  );
}
