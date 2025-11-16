'use server';

/**
 * @fileOverview Generates a title for a list based on the list content.
 *
 * - generateListTitle - A function that generates a title for a list.
 * - GenerateListTitleInput - The input type for the generateListTitle function.
 * - GenerateListTitleOutput - The return type for the generateListTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateListTitleInputSchema = z.object({
  listContent: z
    .string()
    .describe('The content of the list to generate a title for.'),
});
export type GenerateListTitleInput = z.infer<typeof GenerateListTitleInputSchema>;

const GenerateListTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the list.'),
});
export type GenerateListTitleOutput = z.infer<typeof GenerateListTitleOutputSchema>;

export async function generateListTitle(input: GenerateListTitleInput): Promise<GenerateListTitleOutput> {
  return generateListTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateListTitlePrompt',
  input: {schema: GenerateListTitleInputSchema},
  output: {schema: GenerateListTitleOutputSchema},
  prompt: `You are a list titling expert. Generate a concise title for the following list content:

List Content: {{{listContent}}}

Title: `,
});

const generateListTitleFlow = ai.defineFlow(
  {
    name: 'generateListTitleFlow',
    inputSchema: GenerateListTitleInputSchema,
    outputSchema: GenerateListTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
