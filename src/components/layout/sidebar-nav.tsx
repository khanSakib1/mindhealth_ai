"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookText,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Smile,
} from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mood", label: "Mood Tracker", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookText },
  { href: "/chat", label: "AI Assistant", icon: MessageSquare },
  { href: "/exercises", label: "Exercises", icon: HeartPulse },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className="justify-start text-base py-6"
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
