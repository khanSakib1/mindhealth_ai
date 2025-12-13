
import { MoodTracker } from "@/components/mood/mood-tracker";
import { getMoodLogs } from "./actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function MoodSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <div className="flex justify-between gap-2">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-20 rounded-lg" />)}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function MoodTrackerContent() {
  // Hardcoded guest user
  const moodLogs = await getMoodLogs('guest-user');

  return <MoodTracker moodLogs={moodLogs} />;
}

export default function MoodPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Mood Tracker</h1>
        <p className="text-muted-foreground">Monitor and understand your emotional well-being.</p>
      </div>
      <Suspense fallback={<MoodSkeleton />}>
        <MoodTrackerContent />
      </Suspense>
    </div>
  );
}
