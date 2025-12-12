'use server';
/**
 * @fileOverview Flow for generating personalized wellness tips based on journal entries.
 *
 * - generatePersonalizedWellnessTips - A function that generates personalized wellness tips.
 * - GeneratePersonalizedWellnessTipsInput - The input type for the generatePersonalizedWellnessTips function.
 * - GeneratePersonalizedWellnessTipsOutput - The return type for the generatePersonalizedWellnessTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedWellnessTipsInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The user journal entry to analyze and extract context from.'),
  moodData: z.string().describe('The users logged mood data.'),
});
export type GeneratePersonalizedWellnessTipsInput = z.infer<
  typeof GeneratePersonalizedWellnessTipsInputSchema
>;

const GeneratePersonalizedWellnessTipsOutputSchema = z.object({
  wellnessTips:
    z.string()
      .describe('Personalized wellness tips based on the journal entry.'),
});
export type GeneratePersonalizedWellnessTipsOutput = z.infer<
  typeof GeneratePersonalizedWellnessTipsOutputSchema
>;

export async function generatePersonalizedWellnessTips(
  input: GeneratePersonalizedWellnessTipsInput
): Promise<GeneratePersonalizedWellnessTipsOutput> {
  return generatePersonalizedWellnessTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedWellnessTipsPrompt',
  input: {schema: GeneratePersonalizedWellnessTipsInputSchema},
  output: {schema: GeneratePersonalizedWellnessTipsOutputSchema},
  prompt: `You are a mental wellness expert. Based on the user\'s journal entry and mood data, provide personalized wellness tips to help improve their mental well-being. Be empathetic and encouraging.\n\nJournal Entry: {{{journalEntry}}}\nMood Data: {{{moodData}}}\n\nWellness Tips:`,
});

const generatePersonalizedWellnessTipsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedWellnessTipsFlow',
    inputSchema: GeneratePersonalizedWellnessTipsInputSchema,
    outputSchema: GeneratePersonalizedWellnessTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
