
'use server';

/**
 * @fileOverview This file contains the Genkit flow for providing reuse suggestions for waste items,
 * including search queries for finding relevant DIY videos.
 *
 * - getReuseSuggestions - A function that takes a waste item description and returns creative reuse suggestions.
 * - ReuseSuggestionsInput - The input type for the getReuseSuggestions function.
 * - ReuseSuggestionsOutput - The return type for the getReuseSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReuseSuggestionsInputSchema = z.object({
  wasteItem: z.string().describe('A description of the waste item for which reuse suggestions are needed.'),
});
export type ReuseSuggestionsInput = z.infer<typeof ReuseSuggestionsInputSchema>;

const ReuseSuggestionWithVideoQuerySchema = z.object({
  suggestion: z.string().describe('A creative reuse suggestion for the waste item.'),
  videoSearchQuery: z.string().describe('A concise search query (max 5 words) for finding DIY video tutorials related to the suggestion on platforms like YouTube.'),
});

const ReuseSuggestionsOutputSchema = z.object({
  suggestions: z.array(ReuseSuggestionWithVideoQuerySchema).describe('An array of creative reuse suggestions, each with a corresponding video search query.'),
});
export type ReuseSuggestionsOutput = z.infer<typeof ReuseSuggestionsOutputSchema>;

export async function getReuseSuggestions(input: ReuseSuggestionsInput): Promise<ReuseSuggestionsOutput> {
  return reuseSuggestionsFlow(input);
}

const reuseSuggestionsPrompt = ai.definePrompt({
  name: 'reuseSuggestionsPrompt',
  input: {schema: ReuseSuggestionsInputSchema},
  output: {schema: ReuseSuggestionsOutputSchema},
  prompt: `You are an expert in creative reuse and repurposing of waste items. A user will provide a description of a waste item. For that item, provide:
1. A creative reuse suggestion.
2. A concise and effective search query (maximum 5 words) that the user can use on a video platform like YouTube to find DIY tutorials for that specific suggestion.

Provide at least three distinct suggestions, each with its own reuse idea and video search query.

Waste Item Description: {{{wasteItem}}}`,
});

const reuseSuggestionsFlow = ai.defineFlow(
  {
    name: 'reuseSuggestionsFlow',
    inputSchema: ReuseSuggestionsInputSchema,
    outputSchema: ReuseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await reuseSuggestionsPrompt(input);
    return output!;
  }
);
