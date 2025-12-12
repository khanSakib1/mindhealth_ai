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
import type { DayProps } from "react-day-picker";

const moodOptions: { mood: Mood, emoji: string, label: string, color: string }[] = [
  { mood: "great", emoji: "😄", label: "Great", color: "bg-green-300/50" },
  { mood: "good", emoji: "🙂", label: "Good", color: "bg-lime-300/50" },
  { mood: "neutral", emoji: "😐", label: "Neutral", color: "bg-yellow-300/50" },
  { mood: "bad", emoji: "😟", label: "Bad", color: "bg-orange-300/50" },
  { mood: "awful", emoji: "😭", label: "Awful", color: "bg-red-300/50" },
];

const formSchema = z.object({
  mood: z.custom<Mood>((val) => moodOptions.map(m => m.mood).includes(val as Mood), {
    message: "Please select a mood.",
  }),
  notes: z.string().max(500, "Notes can't exceed 500 characters.").optional(),
});

type MoodTrackerProps = {
    addMoodLog: (values: z.infer<typeof formSchema>) => Promise<void>;
    moodLogs: MoodLog[];
    analyzePatterns: () => Promise<string>;
}

export function MoodTracker({ addMoodLog, moodLogs, analyzePatterns }: MoodTrackerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await addMoodLog(values);
      toast({
        title: "Mood Logged",
        description: "Your mood has been saved successfully.",
      });
      form.reset();
      setSelectedMood(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log your mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalysis(null);
    setIsAiLoading(true);
    try {
        const result = await analyzePatterns();
        setAnalysis(result);
    } catch(error) {
        toast({ title: "Analysis Failed", description: (error as Error).message, variant: "destructive"})
    } finally {
        setIsAiLoading(false);
    }
  }

  const MoodCalendar = () => {
    const moodDays = moodLogs.map(log => ({
        date: new Date(log.date + 'T00:00:00'), // ensure correct date parsing
        mood: log.mood,
        notes: log.notes
    }));
  
    return (
      <TooltipProvider>
        <Calendar
          mode="multiple"
          selected={moodDays.map(day => day.date)}
          className="rounded-md border p-0"
          classNames={{
            day: "h-12 w-12 text-lg",
          }}
          components={{
            Day: ({ date, displayMonth }: DayProps) => {
              if (!date) {
                return <div className="h-12 w-12"></div>;
              }
              const dayMatch = moodDays.find(
                (d) => d.date.toDateString() === date.toDateString() && d.date.getMonth() === displayMonth.getMonth()
              );
              
              if (dayMatch) {
                const moodInfo = moodOptions.find(m => m.mood === dayMatch.mood);
                return (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(`relative flex h-12 w-12 items-center justify-center rounded-md`, moodInfo?.color)}>
                        <span className="text-2xl">{moodInfo?.emoji}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{moodInfo?.label}</p>
                      {dayMatch.notes && <p className="text-sm text-muted-foreground">{dayMatch.notes}</p>}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              return <div className="h-12 w-12 flex items-center justify-center text-muted-foreground/50">{date.getDate()}</div>;
            },
          }}
        />
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-8">
      {(analysis || isAiLoading) && (
        <Alert className="bg-primary/10 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary-foreground/80" />
          <AlertTitle className="font-headline">{isAiLoading ? "AI is analyzing your patterns..." : "Your Mood Analysis"}</AlertTitle>
          <AlertDescription>
            {isAiLoading ? <p>Please wait a moment.</p> : analysis}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1">
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
                          <div className="flex justify-between gap-2">
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
                                          "flex-1 p-3 rounded-lg border-2 transition-transform transform hover:scale-105",
                                          selectedMood === mood ? "border-primary scale-105 bg-primary/10" : "border-transparent bg-secondary"
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
                  <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Log Mood
                  </Button>
                  </form>
              </Form>
              </CardContent>
          </Card>

          <Card className="lg:col-span-2">
              <CardHeader>
                  <CardTitle className="font-headline">Your Mood History</CardTitle>
                  <CardDescription>See your mood progression over the month.</CardDescription>
              </CardHeader>
              <CardContent>
                  <MoodCalendar />
              </CardContent>
              <CardFooter>
                  <Button variant="outline" onClick={handleAnalyze} disabled={isAiLoading || moodLogs.length < 3}>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      {isAiLoading ? "Analyzing..." : "Analyze Patterns with AI"}
                  </Button>
              </CardFooter>
          </Card>
      </div>
    </div>
  );
}
