"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import Link from "next/link";
import { AppLogo } from "../icons";
import { useState } from "react";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <AppLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MindfulJourney</span>
          </Link>
        </SheetHeader>
        <div className="p-4" onClick={() => setOpen(false)}>
            <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}
