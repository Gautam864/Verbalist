'use server';
/**
 * @fileOverview Converts voice memos into actionable to-do and grocery lists by processing audio and removing conversational filler.
 *
 * - processVoiceMemoToList - A function that takes voice memo audio data and converts it into a list.
 * - ProcessVoiceMemoToListInput - The input type for the processVoiceMemoToList function.
 * - ProcessVoiceMemoToListOutput - The return type for the processVoiceMemoToList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessVoiceMemoToListInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice memo recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ProcessVoiceMemoToListInput = z.infer<typeof ProcessVoiceMemoToListInputSchema>;

const ProcessVoiceMemoToListOutputSchema = z.object({
  listItems: z.array(z.string()).describe('A list of to-do or grocery items.'),
});
export type ProcessVoiceMemoToListOutput = z.infer<typeof ProcessVoiceMemoToListOutputSchema>;

export async function processVoiceMemoToList(
  input: ProcessVoiceMemoToListInput
): Promise<ProcessVoiceMemoToListOutput> {
  return processVoiceMemoToListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processVoiceMemoToListPrompt',
  input: {schema: ProcessVoiceMemoToListInputSchema},
  output: {schema: ProcessVoiceMemoToListOutputSchema},
  prompt: `You are a helpful assistant designed to create clear and concise to-do or grocery lists from voice memos.

  Analyze the provided voice memo and extract actionable items, removing any conversational filler, greetings, or unnecessary details.
  Return a list of distinct items suitable for a to-do list or grocery list.

  When an item includes a quantity, reformat it to place the quantity in parentheses at the end. For example, "6 eggs" should become "Eggs (6)", and "a dozen eggs" should become "Eggs (12)".

  Voice Memo: {{media url=audioDataUri}}
  `,
});

const processVoiceMemoToListFlow = ai.defineFlow(
  {
    name: 'processVoiceMemoToListFlow',
    inputSchema: ProcessVoiceMemoToListInputSchema,
    outputSchema: ProcessVoiceMemoToListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
