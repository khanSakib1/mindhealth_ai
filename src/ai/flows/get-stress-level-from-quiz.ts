'use server';
/**
 * @fileOverview Flow for determining a stress level from a quiz.
 *
 * - getStressLevelFromQuiz - A function that generates a stress level from quiz answers.
 * - GetStressLevelFromQuizInput - The input type for the getStressLevelFromQuiz function.
 * - GetStressLevelFromQuizOutput - The return type for the getStressLevelFromQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const answersSchema = z.object({
  sleep: z.enum(['Very well', 'Okay', 'Poorly']),
  workload: z.enum(['Manageable', 'Busy', 'Overwhelming']),
  mood: z.enum(['Rarely', 'Sometimes', 'Frequently']),
  relaxation: z.enum(['Plenty of time', 'A little, but not enough', 'Almost none']),
});

export type QuizAnswers = z.infer<typeof answersSchema>;

const GetStressLevelFromQuizInputSchema = answersSchema;
export type GetStressLevelFromQuizInput = z.infer<typeof GetStressLevelFromQuizInputSchema>;

const GetStressLevelFromQuizOutputSchema = z.object({
  stressLevel: z.number().min(1).max(5).describe('The calculated stress level from 1 to 5.'),
  justification: z.string().describe('A brief explanation for why this stress level was chosen.'),
});
export type GetStressLevelFromQuizOutput = z.infer<typeof GetStressLevelFromQuizOutputSchema>;

export async function getStressLevelFromQuiz(
  input: GetStressLevelFromQuizInput
): Promise<GetStressLevelFromQuizOutput> {
  return getStressLevelFromQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getStressLevelFromQuizPrompt',
  input: {schema: GetStressLevelFromQuizInputSchema},
  output: {schema: GetStressLevelFromQuizOutputSchema},
  prompt: `You are an expert at analyzing self-reported wellness data.
  
  Based on the following answers to a short quiz, determine the user's stress level on a scale of 1 (very low) to 5 (very high).
  
  Questions & Answers:
  - How have you been sleeping lately? {{sleep}}
  - How would you describe your current workload or daily demands? {{workload}}
  - How often have you felt irritable or anxious this week? {{mood}}
  - Are you making time for relaxation or hobbies? {{relaxation}}
  
  Analyze these answers and return a stress level and a very brief, one-sentence justification. For example, if sleep is poor and workload is overwhelming, the stress level should be high (4 or 5). If sleep is good and mood is rarely anxious, it should be low (1 or 2).
  `,
});

const getStressLevelFromQuizFlow = ai.defineFlow(
  {
    name: 'getStressLevelFromQuizFlow',
    inputSchema: GetStressLevelFromQuizInputSchema,
    outputSchema: GetStressLevelFromQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
