"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookText,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Smile,
} from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mood", label: "Mood Tracker", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookText },
  { href: "/chat", label: "AI Assistant", icon: MessageSquare },
  { href: "/exercises", label: "Exercises", icon: HeartPulse },
  { href: "/settings", label: "Settings", icon: Settings },
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
            className="justify-start"
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
