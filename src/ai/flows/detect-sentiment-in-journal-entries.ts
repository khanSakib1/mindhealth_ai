'use server';
/**
 * @fileOverview Detects the sentiment of journal entries.
 *
 * - detectSentimentInJournalEntries - A function that handles the sentiment detection process.
 * - DetectSentimentInJournalEntriesInput - The input type for the detectSentimentInJournalEntries function.
 * - DetectSentimentInJournalEntriesOutput - The return type for the detectSentimentInJournalEntries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSentimentInJournalEntriesInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('The journal entry to analyze for sentiment.'),
});
export type DetectSentimentInJournalEntriesInput = z.infer<
  typeof DetectSentimentInJournalEntriesInputSchema
>;

const DetectSentimentInJournalEntriesOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the journal entry, e.g., positive, negative, or neutral.'
    ),
  score: z
    .number()
    .describe(
      'A numerical score representing the sentiment strength, ranging from -1 (very negative) to 1 (very positive).'
    ),
});
export type DetectSentimentInJournalEntriesOutput = z.infer<
  typeof DetectSentimentInJournalEntriesOutputSchema
>;

export async function detectSentimentInJournalEntries(
  input: DetectSentimentInJournalEntriesInput
): Promise<DetectSentimentInJournalEntriesOutput> {
  return detectSentimentInJournalEntriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectSentimentInJournalEntriesPrompt',
  input: {schema: DetectSentimentInJournalEntriesInputSchema},
  output: {schema: DetectSentimentInJournalEntriesOutputSchema},
  prompt: `Analyze the sentiment of the following journal entry. Return the sentiment as either positive, negative, or neutral, and provide a numerical score from -1 to 1, where -1 is very negative and 1 is very positive.\n\nJournal Entry: {{{journalEntry}}}`,
});

const detectSentimentInJournalEntriesFlow = ai.defineFlow(
  {
    name: 'detectSentimentInJournalEntriesFlow',
    inputSchema: DetectSentimentInJournalEntriesInputSchema,
    outputSchema: DetectSentimentInJournalEntriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
