'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { QuizAnswers } from '@/ai/flows/get-stress-level-from-quiz';
import { getStressAdviceFromQuiz } from '@/app/(app)/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Zap, Sparkles, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

export const quizQuestions = [
  {
    id: 'sleep',
    question: 'How have you been sleeping lately?',
    answers: ['Very well', 'Okay', 'Poorly'],
  },
  {
    id: 'workload',
    question: 'How would you describe your current workload or daily demands?',
    answers: ['Manageable', 'Busy', 'Overwhelming'],
  },
  {
    id: 'mood',
    question: 'How often have you felt irritable or anxious this week?',
    answers: ['Rarely', 'Sometimes', 'Frequently'],
  },
  {
    id: 'relaxation',
    question: 'Are you making time for relaxation or hobbies?',
    answers: ['Plenty of time', 'A little, but not enough', 'Almost none'],
  },
];


const formSchema = z.object({
  sleep: z.string({ required_error: 'Please select an option.' }),
  workload: z.string({ required_error: 'Please select an option.' }),
  mood: z.string({ required_error: 'Please select an option.' }),
  relaxation: z.string({ required_error: 'Please select an option.' }),
});

export function StressQuiz() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ advice: string; justification: string; stressLevel: number } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const quizResult = await getStressAdviceFromQuiz(data as QuizAnswers);
      setResult(quizResult);
      setCurrentQuestion(quizQuestions.length); // Go to result screen
    });
  };

  const handleNext = async () => {
    const fieldName = quizQuestions[currentQuestion].id as keyof QuizAnswers;
    const isValid = await form.trigger(fieldName);
    if (isValid) {
      setCurrentQuestion(prev => prev + 1);
    }
  }

  const handleReset = () => {
    form.reset();
    setResult(null);
    setCurrentQuestion(0);
    setIsDialogOpen(false);
  }

  const progressPercentage = ((currentQuestion + 1) / (quizQuestions.length + 1)) * 100;
  const currentQ = quizQuestions[currentQuestion];
  
  const getStressLevelColor = (level: number) => {
    if (level <= 2) return 'text-green-400';
    if (level === 3) return 'text-yellow-400';
    return 'text-orange-400';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Zap className="text-yellow-300" />
          Daily Stress Check-in
        </CardTitle>
        <CardDescription>Answer a few questions to get a personalized stress assessment from your AI assistant.</CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
           <Alert className="bg-secondary/50">
            <Sparkles className="h-4 w-4" />
            <AlertTitle className='flex items-center gap-2'>
              Your Assessment Result
            </AlertTitle>
            <AlertDescription className='space-y-4 mt-4'>
                <div className='flex items-baseline gap-2'>
                    <p>Calculated Stress Level:</p>
                    <p className={cn('text-2xl font-bold', getStressLevelColor(result.stressLevel))}>{result.stressLevel}/5</p>
                </div>
                <p className='text-xs italic text-muted-foreground'>{result.justification}</p>
                <p className='font-semibold'>{result.advice}</p>
                <Button variant="ghost" onClick={handleReset} className="w-full mt-4">Start Over</Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                <Activity className="mr-2"/> Take the Stress Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Daily Stress Quiz</DialogTitle>
                <DialogDescription>Let&apos;s see how you&apos;re doing today.</DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {currentQuestion < quizQuestions.length ? (
                    <FormField
                      control={form.control}
                      name={currentQ.id as keyof QuizAnswers}
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-lg font-medium">{currentQ.question}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {currentQ.answers.map(answer => (
                                <FormItem key={answer} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                  <FormControl>
                                    <RadioGroupItem />
                                  </FormControl>
                                  <FormLabel className="font-normal w-full cursor-pointer">{answer}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium">All done!</h3>
                      <p className="text-muted-foreground">Click below to get your results.</p>
                    </div>
                  )}

                  <div className='space-y-4'>
                    <Progress value={progressPercentage} className='h-2'/>
                    {isPending ? (
                      <Button disabled className="w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </Button>
                    ) : currentQuestion < quizQuestions.length -1 ? (
                      <Button type="button" onClick={handleNext} className="w-full">Next</Button>
                    ) : currentQuestion === quizQuestions.length -1 ? (
                       <Button type="button" onClick={handleNext} className="w-full">Finish & See Results</Button>
                    ) : (
                      <Button type="submit" className="w-full">Get My Results</Button>
                    )}
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
