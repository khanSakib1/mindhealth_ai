'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a quote of the day.
 *
 * - generateQuoteOfTheDay - A function that generates a quote of the day.
 * - GenerateQuoteOfTheDayInput - The input type for the generateQuoteOfTheDay function.
 * - GenerateQuoteOfTheDayOutput - The return type for the generateQuoteOfTheDay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuoteOfTheDayInputSchema = z.object({
  category: z.string().describe('The category for the quote, e.g., "inspiration", "motivation", "wisdom".'),
});
export type GenerateQuoteOfTheDayInput = z.infer<typeof GenerateQuoteOfTheDayInputSchema>;

const GenerateQuoteOfTheDayOutputSchema = z.object({
  quote: z.string().describe('The generated quote of the day.'),
  author: z.string().describe('The author of the quote.'),
});
export type GenerateQuoteOfTheDayOutput = z.infer<typeof GenerateQuoteOfTheDayOutputSchema>;

export async function generateQuoteOfTheDay(input: GenerateQuoteOfTheDayInput): Promise<GenerateQuoteOfTheDayOutput> {
  return generateQuoteOfTheDayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuoteOfTheDayPrompt',
  input: {schema: GenerateQuoteOfTheDayInputSchema},
  output: {schema: GenerateQuoteOfTheDayOutputSchema},
  prompt: `You are an expert curator of quotes.
  
  Generate a short, powerful, and inspiring quote about {{category}}.
  
  Provide the quote and its author. If the author is unknown, state "Anonymous".
  The quote should be uplifting and suitable for starting the day with a positive mindset.
  `,
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
