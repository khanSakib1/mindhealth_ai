'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing journal entries.
 *
 * The flow takes journal entries as input and returns a summarized version.
 * - summarizeJournalEntries - The function that summarizes journal entries.
 * - SummarizeJournalEntriesInput - The input type for the summarizeJournalEntries function.
 * - SummarizeJournalEntriesOutput - The return type for the summarizeJournalEntries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJournalEntriesInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('The journal entries to summarize.'),
});
export type SummarizeJournalEntriesInput = z.infer<
  typeof SummarizeJournalEntriesInputSchema
>;

const SummarizeJournalEntriesOutputSchema = z.object({
  summary: z.string().describe('The summarized journal entries.'),
});
export type SummarizeJournalEntriesOutput = z.infer<
  typeof SummarizeJournalEntriesOutputSchema
>;

export async function summarizeJournalEntries(
  input: SummarizeJournalEntriesInput
): Promise<SummarizeJournalEntriesOutput> {
  return summarizeJournalEntriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJournalEntriesPrompt',
  input: {schema: SummarizeJournalEntriesInputSchema},
  output: {schema: SummarizeJournalEntriesOutputSchema},
  prompt: `Summarize the following journal entries:\n\n{{{journalEntries}}}`,
});

const summarizeJournalEntriesFlow = ai.defineFlow(
  {
    name: 'summarizeJournalEntriesFlow',
    inputSchema: SummarizeJournalEntriesInputSchema,
    outputSchema: SummarizeJournalEntriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
