
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookText, HeartPulse, MessageSquare, Smile, Lightbulb, Quote } from "lucide-react";
import { getDashboardData, type DashboardData } from "./actions";
import { format } from "date-fns";
import { StressQuiz } from "@/components/dashboard/stress-quiz";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const quickLinks = [
  { title: "Log Your Mood", href: "/mood", icon: Smile, description: "Quickly log how you're feeling today." },
  { title: "Write in Journal", href: "/journal", icon: BookText, description: "Reflect on your day and thoughts." },
  { title: "AI Assistant", href: "/chat", icon: MessageSquare, description: "Chat with your supportive AI companion." },
  { title: "Guided Exercises", href: "/exercises", icon: HeartPulse, description: "Find calm with breathing & mindfulness." },
];

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
       <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-56 rounded-lg" />
        <Skeleton className="h-56 rounded-lg" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}

async function DashboardDataContent() {
  // Hardcoded guest user for now
  const data = await getDashboardData('guest-user');

  if (!data) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">Welcome!</h2>
            <p className="text-muted-foreground mt-2">Could not load dashboard data. Please try again later.</p>
        </div>
    );
  }

  const { recentEntry, recentMood, wellnessTip, quoteOfTheDay } = data;

  return (
    <div className="space-y-8">
       <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/30 to-primary/10 border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Quote className="text-yellow-300" /> Quote of the Day</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-6 rounded-md bg-background/50 shadow-inner">
                    <blockquote className="text-center text-lg text-foreground/90 italic">
                        &quot;{quoteOfTheDay.quote}&quot;
                    </blockquote>
                    <p className="text-center text-sm text-muted-foreground mt-4">- {quoteOfTheDay.author}</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/50 to-secondary/20 border-border">
             <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Lightbulb className="text-yellow-300" /> Wellness Tip</CardTitle>
                <CardDescription>A personalized tip from your AI assistant.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-6 rounded-md bg-background/50 shadow-inner">
                    <p className="text-center text-lg text-foreground/90">
                        &quot;{wellnessTip}&quot;
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
      
      <StressQuiz />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item) => (
          <Card key={item.title} className="flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="secondary" className="w-full">
                <Link href={item.href}>
                  Go to {item.title.split(' ')[0]} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
       <Card>
          <CardHeader>
              <CardTitle className="font-headline">Recent Activity</CardTitle>
              <CardDescription>Your latest check-ins.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
              {recentMood ? (
                <div className="p-4 rounded-md bg-secondary">
                  <p className="text-sm text-muted-foreground">Latest mood from {format(new Date(recentMood.date), "MMM d")}: <span className="font-semibold capitalize text-foreground">{recentMood.mood}</span></p>
                </div>
              ) : (
                <div className="p-4 text-center rounded-md bg-secondary/50 border border-dashed">
                  <p className="text-sm text-muted-foreground">No recent mood logs.</p>
                  <Button size="sm" variant="link" asChild><Link href="/mood">Log your mood</Link></Button>
                </div>
              )}
              {recentEntry ? (
                <div className="p-4 rounded-md bg-secondary">
                  <p className="text-sm text-muted-foreground">Latest journal entry:</p>
                  <Link href="/journal" className="font-semibold text-foreground hover:underline">{recentEntry.title}</Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{recentEntry.content}</p>
                </div>
              ) : (
                <div className="p-4 text-center rounded-md bg-secondary/50 border border-dashed">
                  <p className="text-sm text-muted-foreground">No recent journal entries.</p>
                  <Button size="sm" variant="link" asChild><Link href="/journal">Write an entry</Link></Button>
                </div>
              )}
          </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Good morning.</h1>
        <p className="text-muted-foreground">Welcome back to your wellness dashboard.</p>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardDataContent />
      </Suspense>
    </div>
  );
}
