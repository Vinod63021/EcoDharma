
'use server';

/**
 * @fileOverview Waste classification AI agent.
 *
 * - classifyWaste - A function that handles the waste classification process.
 * - ClassifyWasteInput - The input type for the classifyWaste function.
 * - ClassifyWasteOutput - The return type for the classifyWaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyWasteInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyWasteInput = z.infer<typeof ClassifyWasteInputSchema>;

const WasteReuseSuggestionWithVideoQuerySchema = z.object({
  suggestion: z.string().describe('A creative reuse suggestion for the waste item.'),
  videoSearchQuery: z.string().describe('A concise search query (max 5 words) for finding DIY video tutorials related to the suggestion on platforms like YouTube.'),
});

const ClassifyWasteOutputSchema = z.object({
  recyclability: z.enum(['recyclable', 'non-recyclable', 'unsure']).describe('The recyclability of the waste item.'),
  reuseSuggestions: z.array(WasteReuseSuggestionWithVideoQuerySchema).describe('Suggestions for reusing the waste item, each with a corresponding video search query.'),
  recycleChannels: z.array(z.string()).describe('Suggested channels for recycling the waste item.'),
  donateSuggestions: z.array(z.string()).describe('Suggestions for donating the waste item, if applicable.'),
});
export type ClassifyWasteOutput = z.infer<typeof ClassifyWasteOutputSchema>;

export async function classifyWaste(input: ClassifyWasteInput): Promise<ClassifyWasteOutput> {
  return classifyWasteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyWastePrompt',
  input: {schema: ClassifyWasteInputSchema},
  output: {schema: ClassifyWasteOutputSchema},
  prompt: `You are an expert in waste management and recycling.

You will classify the provided waste item as recyclable, non-recyclable, or unsure.
You will also provide suggestions for recycling it through appropriate channels, and donating it if applicable.

For the reuseSuggestions field, provide creative ideas for reusing the item. For each reuse suggestion, you MUST provide:
1.  The 'suggestion' itself (a string describing the reuse idea).
2.  A 'videoSearchQuery' (a concise string, max 5 words, for finding a relevant DIY video tutorial on YouTube for that specific suggestion).
This should be an array of objects, where each object contains 'suggestion' and 'videoSearchQuery'.

Analyze the following image to determine its recyclability and suggest appropriate actions:

Waste Item Image: {{media url=photoDataUri}}

Ensure your response is structured according to the ClassifyWasteOutputSchema.
`,
});

const classifyWasteFlow = ai.defineFlow(
  {
    name: 'classifyWasteFlow',
    inputSchema: ClassifyWasteInputSchema,
    outputSchema: ClassifyWasteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

