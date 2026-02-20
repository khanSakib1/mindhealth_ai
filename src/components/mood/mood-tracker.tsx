
"use client";
import type { Mood, MoodLog } from "@/lib/definitions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { addMoodLog, analyzePatterns } from "@/app/(app)/mood/actions";
import { useRouter } from "next/navigation";


const moodOptions: { mood: Mood, emoji: string, label: string, color: string, textColor: string }[] = [
  { mood: "great", emoji: "😄", label: "Great", color: "bg-green-500/20", textColor: "text-green-300" },
  { mood: "good", emoji: "🙂", label: "Good", color: "bg-lime-500/20", textColor: "text-lime-300" },
  { mood: "neutral", emoji: "😐", label: "Neutral", color: "bg-yellow-500/20", textColor: "text-yellow-300" },
  { mood: "bad", emoji: "😟", label: "Bad", color: "bg-orange-500/20", textColor: "text-orange-300" },
  { mood: "awful", emoji: "😭", label: "Awful", color: "bg-red-500/20", textColor: "text-red-300" },
];


const formSchema = z.object({
  mood: z.custom<Mood>((val) => moodOptions.map(m => m.mood).includes(val as Mood), {
    message: "Please select a mood.",
  }),
  notes: z.string().max(500, "Notes can't exceed 500 characters.").optional(),
});

type MoodTrackerProps = {
    moodLogs: MoodLog[];
}

export function MoodTracker({ moodLogs }: MoodTrackerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Hardcoded guest user
      await addMoodLog('guest-user', values);
      toast({
        title: "Mood Logged",
        description: "Your mood has been saved successfully.",
      });
      form.reset();
      setSelectedMood(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log your mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalysis(null);
    setIsAiLoading(true);
    try {
        // Hardcoded guest user
        const result = await analyzePatterns('guest-user', moodLogs);
        setAnalysis(result);
    } catch(error) {
        toast({ title: "Analysis Failed", description: (error as Error).message, variant: "destructive"})
    } finally {
        setIsAiLoading(false);
    }
  }

  const MoodCalendar = () => {
    const moodByDate = new Map(
      moodLogs.map((log) => [
        log.date,
        {
          mood: log.mood,
          notes: log.notes,
          info: moodOptions.find((option) => option.mood === log.mood),
        },
      ])
    );

    const selectedDays = moodLogs.map((log) => new Date(log.date.replace(/-/g, "/")));

    return (
      <Calendar
        mode="multiple"
        selected={selectedDays}
        className="rounded-md border p-0"
        classNames={{
          day: "h-12 w-12 text-lg",
        }}
        modifiers={{
          great: (date) => moodByDate.get(date.toISOString().slice(0, 10))?.mood === "great",
          good: (date) => moodByDate.get(date.toISOString().slice(0, 10))?.mood === "good",
          neutral: (date) => moodByDate.get(date.toISOString().slice(0, 10))?.mood === "neutral",
          bad: (date) => moodByDate.get(date.toISOString().slice(0, 10))?.mood === "bad",
          awful: (date) => moodByDate.get(date.toISOString().slice(0, 10))?.mood === "awful",
        }}
        modifiersClassNames={{
          great: "bg-green-500/20",
          good: "bg-lime-500/20",
          neutral: "bg-yellow-500/20",
          bad: "bg-orange-500/20",
          awful: "bg-red-500/20",
        }}
        formatters={{
          formatDay: (date) => moodByDate.get(date.toISOString().slice(0, 10))?.info?.emoji ?? String(date.getDate()),
        }}
      />
    );
  };

  return (
    <div className="space-y-8">
      {(analysis || isAiLoading) && (
        <Alert className="bg-primary/10 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="font-headline">{isAiLoading ? "AI is analyzing your patterns..." : "Your Mood Analysis"}</AlertTitle>
          <AlertDescription>
            {isAiLoading ? <p>Please wait a moment.</p> : analysis}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-8">
          <Card>
              <CardHeader>
              <CardTitle className="font-headline">How are you feeling today?</CardTitle>
              <CardDescription>Select a mood and add some notes if you like.</CardDescription>
              </CardHeader>
              <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Select your mood</FormLabel>
                          <FormControl>
                          <div className="grid grid-cols-5 gap-2 md:gap-4">
                              {moodOptions.map(({ mood, emoji, label }) => (
                              <TooltipProvider key={mood} delayDuration={100}>
                                  <Tooltip>
                                  <TooltipTrigger asChild>
                                      <button
                                      type="button"
                                      onClick={() => {
                                          field.onChange(mood);
                                          setSelectedMood(mood);
                                      }}
                                      className={cn(
                                          "flex-1 p-3 rounded-lg border-2 transition-transform transform hover:scale-110 hover:-translate-y-1",
                                          selectedMood === mood ? "border-primary scale-105 bg-primary/20" : "border-transparent bg-secondary"
                                      )}
                                      >
                                      <span className="text-4xl">{emoji}</span>
                                      </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p>{label}</p>
                                  </TooltipContent>
                                  </Tooltip>
                              </TooltipProvider>
                              ))}
                          </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Notes (optional)</FormLabel>
                          <FormControl>
                          <Textarea placeholder="Any thoughts to share? What influenced your mood?" {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Log Mood
                  </Button>
                  </form>
              </Form>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle className="font-headline">Your Mood History</CardTitle>
                  <CardDescription>See your mood progression over the month.</CardDescription>
              </CardHeader>
              <CardContent>
                  <MoodCalendar />
              </CardContent>
              <CardFooter>
                  <Button variant="outline" onClick={handleAnalyze} disabled={isAiLoading || !moodLogs || moodLogs.length < 3}>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      {isAiLoading ? "Analyzing..." : "Analyze Patterns with AI"}
                  </Button>
              </CardFooter>
          </Card>
      </div>
    </div>
  );
}
