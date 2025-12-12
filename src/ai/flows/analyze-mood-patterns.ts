'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing mood patterns over time.
 *
 * The flow takes in a user ID and a list of mood logs, and returns an analysis of the user's mood patterns.
 *
 * @exports analyzeMoodPatterns - The main function to analyze mood patterns.
 * @exports AnalyzeMoodPatternsInput - The input type for the analyzeMoodPatterns function.
 * @exports AnalyzeMoodPatternsOutput - The return type for the analyzeMoodPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMoodPatternsInputSchema = z.object({
  userId: z.string().describe('The ID of the user to analyze mood patterns for.'),
  moodLogs: z
    .array(
      z.object({
        date: z.string().describe('The date of the mood log.'),
        mood: z.string().describe('The mood recorded in the log.'),
        notes: z.string().optional().describe('Optional notes associated with the mood log.'),
      })
    )
    .describe('A list of mood logs for the user.'),
});
export type AnalyzeMoodPatternsInput = z.infer<typeof AnalyzeMoodPatternsInputSchema>;

const AnalyzeMoodPatternsOutputSchema = z.object({
  analysis: z.string().describe('An analysis of the user\'s mood patterns over time.'),
});
export type AnalyzeMoodPatternsOutput = z.infer<typeof AnalyzeMoodPatternsOutputSchema>;

export async function analyzeMoodPatterns(input: AnalyzeMoodPatternsInput): Promise<AnalyzeMoodPatternsOutput> {
  return analyzeMoodPatternsFlow(input);
}

const analyzeMoodPatternsPrompt = ai.definePrompt({
  name: 'analyzeMoodPatternsPrompt',
  input: {schema: AnalyzeMoodPatternsInputSchema},
  output: {schema: AnalyzeMoodPatternsOutputSchema},
  prompt: `You are an AI assistant specializing in mental health and well-being.
  Your task is to analyze a user\'s mood patterns over time based on their mood logs and return an insightful analysis.

  Here are the user\'s mood logs:
  {{#each moodLogs}}
  - Date: {{date}}, Mood: {{mood}}, Notes: {{notes}}
  {{/each}}

  Analyze the mood patterns and provide a summary of the user\'s mood trends, potential triggers,
  and any notable observations about their emotional well-being. Focus on patterns and trends, not individual entries.
  Speak in a friendly, empathetic tone.
  `,
});

const analyzeMoodPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeMoodPatternsFlow',
    inputSchema: AnalyzeMoodPatternsInputSchema,
    outputSchema: AnalyzeMoodPatternsOutputSchema,
  },
  async input => {
    const {output} = await analyzeMoodPatternsPrompt(input);
    return output!;
  }
);
