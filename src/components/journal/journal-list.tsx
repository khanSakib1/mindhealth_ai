"use client";

import type { JournalEntry } from "@/lib/definitions";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Sparkles, FileText, BrainCircuit, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const journalSchema = z.object({
  title: z.string().min(1, "Title is required.").max(100, "Title is too long."),
  content: z.string().min(10, "Content must be at least 10 characters.").max(5000, "Content is too long."),
});

type JournalListProps = {
  entries: JournalEntry[];
  addEntry: (values: z.infer<typeof journalSchema>) => Promise<void>;
  summarizeEntry: (entryId: string, content: string) => Promise<string>;
  analyzeSentiment: (entryId: string, content: string) => Promise<{ sentiment: string; score: number }>;
  getWellnessTips: (content: string) => Promise<string>;
};

export function JournalList({ entries, addEntry, summarizeEntry, analyzeSentiment, getWellnessTips }: JournalListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof journalSchema>>({
    resolver: zodResolver(journalSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = async (values: z.infer<typeof journalSchema>) => {
    setIsSubmitting(true);
    try {
      await addEntry(values);
      toast({ title: "Journal entry saved!" });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Failed to save entry", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSummarize = async (entry: JournalEntry) => {
    setAiResult(null);
    setIsAiLoading(true);
    try {
      const summary = await summarizeEntry(entry.id, entry.content);
      setAiResult({ title: "Entry Summary", content: summary });
    } catch {
      toast({ title: "Failed to get summary", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAnalyze = async (entry: JournalEntry) => {
    setAiResult(null);
    setIsAiLoading(true);
    try {
      const { sentiment, score } = await analyzeSentiment(entry.id, entry.content);
      const scorePercent = Math.round(((score + 1) / 2) * 100);
      setAiResult({
        title: "Sentiment Analysis",
        content: (
          <div>
            <p><strong>Sentiment:</strong> <span className="capitalize">{sentiment}</span></p>
            <p><strong>Score:</strong> {score.toFixed(2)} ({scorePercent}%)</p>
          </div>
        ),
      });
    } catch {
      toast({ title: "Failed to analyze sentiment", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleGetTips = async (entry: JournalEntry) => {
    setAiResult(null);
    setIsAiLoading(true);
    try {
      const tips = await getWellnessTips(entry.content);
      setAiResult({ title: "Personalized Wellness Tips", content: tips });
    } catch (error) {
       toast({ title: "Failed to get wellness tips", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">My Journal</h1>
          <p className="text-muted-foreground">A space for your thoughts and reflections.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
              <DialogDescription>What's on your mind today?</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A good day" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write freely about your day, thoughts, and feelings..." rows={8} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Entry
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {(aiResult || isAiLoading) && (
        <Alert className="mb-6 bg-primary/10 border-primary/20">
          <Sparkles className="h-4 w-4 text-primary-foreground/80" />
          <AlertTitle className="font-headline">{isAiLoading ? "AI is thinking..." : aiResult?.title}</AlertTitle>
          <AlertDescription>
            {isAiLoading ? <p>Please wait a moment.</p> : aiResult?.content}
          </AlertDescription>
        </Alert>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No entries yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Click &quot;New Entry&quot; to start your journal.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="truncate font-headline">{entry.title}</CardTitle>
                <CardDescription>{format(new Date(entry.date), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-4 text-sm text-muted-foreground">{entry.content}</p>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-2">
                <Button variant="outline" onClick={() => handleSummarize(entry)} disabled={isAiLoading}>
                  <FileText className="mr-2 h-4 w-4" /> Summarize
                </Button>
                <Button variant="outline" onClick={() => handleAnalyze(entry)} disabled={isAiLoading}>
                  <BrainCircuit className="mr-2 h-4 w-4" /> Analyze Sentiment
                </Button>
                <Button variant="outline" onClick={() => handleGetTips(entry)} disabled={isAiLoading}>
                  <Lightbulb className="mr-2 h-4 w-4" /> Get Wellness Tips
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
