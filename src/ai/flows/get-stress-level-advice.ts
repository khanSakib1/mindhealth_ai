'use server';
/**
 * @fileOverview Flow for generating advice based on a user's stress level.
 *
 * - getStressLevelAdvice - A function that generates advice.
 * - GetStressLevelAdviceInput - The input type for the getStressLevelAdvice function.
 * - GetStressLevelAdviceOutput - The return type for the getStressLevelAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetStressLevelAdviceInputSchema = z.object({
  stressLevel: z
    .number()
    .min(1)
    .max(5)
    .describe('The user\'s reported stress level on a scale of 1 to 5.'),
});
export type GetStressLevelAdviceInput = z.infer<
  typeof GetStressLevelAdviceInputSchema
>;

const GetStressLevelAdviceOutputSchema = z.object({
  advice:
    z.string()
      .describe('Personalized advice based on the stress level.'),
});
export type GetStressLevelAdviceOutput = z.infer<
  typeof GetStressLevelAdviceOutputSchema
>;

export async function getStressLevelAdvice(
  input: GetStressLevelAdviceInput
): Promise<GetStressLevelAdviceOutput> {
  return getStressLevelAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getStressLevelAdvicePrompt',
  input: {schema: GetStressLevelAdviceInputSchema},
  output: {schema: GetStressLevelAdviceOutputSchema},
  prompt: `You are a mental wellness coach. A user has reported their stress level on a scale of 1 (very low) to 5 (very high).
  
  Their stress level is: {{stressLevel}}.
  
  - If the stress level is 1 or 2, congratulate them on managing their stress well and provide a short, encouraging message.
  - If the stress level is 3, acknowledge it and provide a simple, quick tip for prevention, like taking a short break or a few deep breaths.
  - If the stress level is 4 or 5, respond with empathy and suggest a specific, actionable stress-reduction technique. For example, suggest the 'Box Breathing' exercise, a short mindfulness practice, or writing down their thoughts. Keep the suggestion concise and easy to follow.
  
  Generate a response that is helpful and empathetic.
  `,
});

const getStressLevelAdviceFlow = ai.defineFlow(
  {
    name: 'getStressLevelAdviceFlow',
    inputSchema: GetStressLevelAdviceInputSchema,
    outputSchema: GetStressLevelAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
