
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
import type {ChatMessage} from '@/lib/definitions';

const MentalWellnessConversationInputSchema = z.object({
  message: z.string().describe('The user message to the AI assistant.'),
  history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
  })).describe('The conversation history.')
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

  Here is the conversation history:
  {{#each history}}
    {{role}}: {{content}}
  {{/each}}
  
  Respond to the last user message with helpful advice and support.

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
