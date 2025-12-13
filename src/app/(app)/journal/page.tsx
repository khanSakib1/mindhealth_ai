
import { JournalList } from "@/components/journal/journal-list";
import type { JournalEntry } from "@/lib/definitions";
import { getJournalEntries } from "./actions";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";


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

async function JournalContent() {
  // Hardcoded guest user
  const entries = await getJournalEntries('guest-user');
  return <JournalList entries={entries} />;
}

export default function JournalPage() {
  return (
    <Suspense fallback={<JournalSkeleton />}>
      <JournalContent />
    </Suspense>
  );
}
