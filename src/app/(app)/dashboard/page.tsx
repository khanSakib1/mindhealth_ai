"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookText, HeartPulse, MessageSquare, Smile, Lightbulb } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";
import { getDashboardData, type DashboardData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const quickLinks = [
  { title: "Log Your Mood", href: "/mood", icon: Smile, description: "Quickly log how you're feeling today." },
  { title: "Write in Journal", href: "/journal", icon: BookText, description: "Reflect on your day and thoughts." },
  { title: "AI Assistant", href: "/chat", icon: MessageSquare, description: "Chat with your supportive AI companion." },
  { title: "Guided Exercises", href: "/exercises", icon: HeartPulse, description: "Find calm with breathing & mindfulness." },
];

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-56" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) {
      getDashboardData(user.uid).then(setData);
    }
  }, [user]);

  if (!user || !data) {
    return <DashboardSkeleton />;
  }

  const { recentEntry, recentMood, wellnessTip } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.displayName || 'friend'}! Here&apos;s your wellness overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item) => (
          <Card key={item.title} className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <item.icon className="w-6 h-6 text-primary-foreground/80" />
                </div>
                <CardTitle className="font-headline">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link href={item.href}>
                  Go to {item.title.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Activity</CardTitle>
                <CardDescription>Your latest check-ins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentMood ? (
                  <div className="p-4 rounded-md bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Latest mood from {format(new Date(recentMood.date), "MMM d")}: <span className="font-semibold capitalize text-foreground">{recentMood.mood}</span></p>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-md bg-secondary/50">
                    <p className="text-sm text-muted-foreground">No recent mood logs.</p>
                  </div>
                )}
                {recentEntry ? (
                  <div className="p-4 rounded-md bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Latest journal entry:</p>
                    <Link href="/journal" className="font-semibold text-foreground hover:underline">{recentEntry.title}</Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{recentEntry.content}</p>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-md bg-secondary/50">
                    <p className="text-sm text-muted-foreground">No recent journal entries.</p>
                  </div>
                )}
            </CardContent>
        </Card>
        <Card className="bg-accent/20 border-accent/50">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Lightbulb /> Wellness Tip</CardTitle>
                <CardDescription>A personalized tip from your AI assistant.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-6 rounded-md bg-background/50">
                    <p className="text-center text-accent-foreground/90">
                        &quot;{wellnessTip}&quot;
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
