// src/ai/flows/provide-mental-wellness-conversation.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing a mental wellness conversation with an AI assistant.
 *
 * - mentalWellnessConversation - A function that initiates the mental wellness conversation flow.
 * - MentalWellnessConversationInput - The input type for the mentalWellnessConversation function.
 * - MentalWellnessConversationOutput - The output type for the mentalWellnessConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentalWellnessConversationInputSchema = z.object({
  message: z.string().describe('The user message to the AI assistant.'),
});
export type MentalWellnessConversationInput = z.infer<typeof MentalWellnessConversationInputSchema>;

const MentalWellnessConversationOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user message.'),
});
export type MentalWellnessConversationOutput = z.infer<typeof MentalWellnessConversationOutputSchema>;

export async function mentalWellnessConversation(input: MentalWellnessConversationInput): Promise<MentalWellnessConversationOutput> {
  return mentalWellnessConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalWellnessConversationPrompt',
  input: {schema: MentalWellnessConversationInputSchema},
  output: {schema: MentalWellnessConversationOutputSchema},
  prompt: `You are a friendly and empathetic AI assistant specializing in mental wellness.

  Respond to the user message with helpful advice and support.

  User Message: {{{message}}}
  `,
});

const mentalWellnessConversationFlow = ai.defineFlow(
  {
    name: 'mentalWellnessConversationFlow',
    inputSchema: MentalWellnessConversationInputSchema,
    outputSchema: MentalWellnessConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
