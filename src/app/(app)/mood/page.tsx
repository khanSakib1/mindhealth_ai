"use client";

import { MoodTracker } from "@/components/mood/mood-tracker";
import type { MoodLog } from "@/lib/definitions";
import { addMoodLog, getMoodLogs, analyzePatterns } from "./actions";
import { z } from "zod";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const formSchema = z.object({
  mood: z.enum(["great", "good", "neutral", "bad", "awful"]),
  notes: z.string().max(500).optional(),
});

function MoodSkeleton() {
  return (
    <div className="space-y-8">
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
                {[...Array(5)].map(i => <Skeleton key={i} className="h-20 w-20 rounded-lg" />)}
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

export default function MoodPage() {
  const { user } = useAuth();
  const [moodLogs, setMoodLogs] = useState<MoodLog[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchMoodLogs = () => {
    if (user) {
      setMoodLogs(null);
      getMoodLogs(user.uid).then(setMoodLogs);
    }
  };

  useEffect(() => {
    if(user) {
      getMoodLogs(user.uid).then(setMoodLogs);
    }
  }, [user]);

  const handleAddMoodLog = async (values: z.infer<typeof formSchema>) => {
    if (!user) throw new Error("User not authenticated");
    await addMoodLog(user.uid, values);
    startTransition(() => {
      fetchMoodLogs();
    });
  };

  const handleAnalyzePatterns = async () => {
    if (!user || !moodLogs) throw new Error("Missing user or mood logs");
    return analyzePatterns(user.uid, moodLogs);
  }

  if (!user || moodLogs === null) {
    return <MoodSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Mood Tracker</h1>
        <p className="text-muted-foreground">Monitor and understand your emotional well-being.</p>
      </div>
      <MoodTracker 
        addMoodLog={handleAddMoodLog} 
        moodLogs={moodLogs}
        analyzePatterns={handleAnalyzePatterns} 
      />
    </div>
  );
}
