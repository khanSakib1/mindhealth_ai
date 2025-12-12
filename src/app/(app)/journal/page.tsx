"use client";

import { JournalList } from "@/components/journal/journal-list";
import type { JournalEntry } from "@/lib/definitions";
import { addEntry, analyzeSentiment, getJournalEntries, getWellnessTips, summarizeEntry } from "./actions";
import { z } from "zod";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

const journalSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(5000),
});

function JournalSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-7 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function JournalPage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [entries, setEntries] = useState<JournalEntry[] | null>(null);

  const fetchEntries = () => {
    if (user) {
      setEntries(null); // Trigger skeleton
      getJournalEntries(user.uid).then(setEntries);
    }
  };

  useEffect(() => {
    if (user) {
        getJournalEntries(user.uid).then(setEntries);
    }
  }, [user]);

  const handleAddEntry = async (values: z.infer<typeof journalSchema>) => {
    if (!user) throw new Error("Not authenticated");
    await addEntry(user.uid, values);
    startTransition(() => {
      fetchEntries();
    });
  };

  const handleSummarize = (entryId: string, content: string) => {
    return summarizeEntry(entryId, content);
  };
  
  const handleAnalyze = async (entryId: string, content: string) => {
    if (!user) throw new Error("Not authenticated");
    const result = await analyzeSentiment(entryId, content);
     startTransition(() => {
      fetchEntries();
    });
    return result;
  };
  
  const handleGetWellnessTips = (content: string) => {
    if (!user) throw new Error("Not authenticated");
    return getWellnessTips(user.uid, content);
  }

  if (!user || !entries) {
    return <JournalSkeleton />;
  }

  return (
    <JournalList 
      entries={entries} 
      addEntry={handleAddEntry} 
      summarizeEntry={handleSummarize} 
      analyzeSentiment={handleAnalyze}
      getWellnessTips={handleGetWellnessTips}
    />
  );
}
