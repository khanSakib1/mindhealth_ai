'use server';
/**
 * @fileOverview Flow for generating a quote of the day.
 *
 * - generateQuoteOfTheDay - A function that generates a quote.
 * - GenerateQuoteOfTheDayInput - The input type for the generateQuoteOfTheDay function.
 * - GenerateQuoteOfTheDayOutput - The return type for the generateQuoteOfTheDay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteOfTheDayInputSchema = z.object({
  theme: z.string().describe('The theme for the quote, e.g., mindfulness, perseverance, happiness.'),
});
export type GenerateQuoteOfTheDayInput = z.infer<
  typeof GenerateQuoteOfTheDayInputSchema
>;

const GenerateQuoteOfTheDayOutputSchema = z.object({
  quote: z.string().describe('The generated quote.'),
  author: z.string().describe('The author of the quote (can be "Unknown").'),
});
export type GenerateQuoteOfTheDayOutput = z.infer<
  typeof GenerateQuoteOfTheDayOutputSchema
>;

export async function generateQuoteOfTheDay(
  input: GenerateQuoteOfTheDayInput
): Promise<GenerateQuoteOfTheDayOutput> {
  return generateQuoteOfTheDayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuoteOfTheDayPrompt',
  input: {schema: GenerateQuoteOfTheDayInputSchema},
  output: {schema: GenerateQuoteOfTheDayOutputSchema},
  prompt: `You are an expert curator of inspirational quotes. Generate a short, impactful, and non-cliche quote about the theme of '{{theme}}'. The quote should be insightful and encouraging. Return the quote and the author. If the author is not well-known, you can attribute it to "Unknown".`,
});

const generateQuoteOfTheDayFlow = ai.defineFlow(
  {
    name: 'generateQuoteOfTheDayFlow',
    inputSchema: GenerateQuoteOfTheDayInputSchema,
    outputSchema: GenerateQuoteOfTheDayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
