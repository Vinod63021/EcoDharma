'use server';

/**
 * @fileOverview A flow for generating images from a text prompt.
 *
 * - generateImage - A function that takes a text prompt and returns an image data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateImageInputSchema = z.string().describe('A text prompt for image generation.');
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.string().describe('The generated image as a data URI.');
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(prompt: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(prompt);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (prompt) => {
    // A more descriptive prompt for better results
    const fullPrompt = `A high-quality, professional, and visually appealing image representing: ${prompt}. Photorealistic, clean, studio lighting.`;
    
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: fullPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed to return an image.');
    }

    return media.url;
  }
);
