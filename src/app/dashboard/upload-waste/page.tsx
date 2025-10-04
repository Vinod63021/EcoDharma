
"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { classifyWaste, type ClassifyWasteInput, type ClassifyWasteOutput } from '@/ai/flows/waste-classification';
import { Loader2, UploadCloud, AlertCircle, CheckCircle, Recycle, Gift, Info, Youtube } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function UploadWastePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ClassifyWasteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please upload an image smaller than 5MB.", variant: "destructive"});
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setClassificationResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !previewUrl) {
      toast({ title: "No file selected", description: "Please select an image to classify.", variant: "destructive"});
      return;
    }

    setIsLoading(true);
    setError(null);
    setClassificationResult(null);

    try {
      const input: ClassifyWasteInput = { photoDataUri: previewUrl };
      const result = await classifyWaste(input);
      setClassificationResult(result);
      toast({ title: "Classification Successful", description: "Waste item analyzed.", variant: "default"});
    } catch (err) {
      console.error("Classification error:", err);
      setError("Failed to classify waste. The AI model might be busy or an error occurred. Please try again.");
      toast({ title: "Classification Failed", description: "An error occurred during classification.", variant: "destructive"});
    } finally {
      setIsLoading(false);
    }
  };

  const getRecyclabilityColor = (recyclability?: string) => {
    if (!recyclability) return 'text-gray-500';
    switch (recyclability.toLowerCase()) {
      case 'recyclable':
        return 'text-green-600';
      case 'non-recyclable':
        return 'text-red-600';
      case 'unsure':
        return 'text-yellow-600';
      default:
        return 'text-gray-500';
    }
  };
  
  const getRecyclabilityIcon = (recyclability?: string) => {
    if (!recyclability) return <Info className="h-5 w-5" />;
    switch (recyclability.toLowerCase()) {
      case 'recyclable':
        return <CheckCircle className="h-5 w-5" />;
      case 'non-recyclable':
        return <AlertCircle className="h-5 w-5" />;
      case 'unsure':
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">AI Waste Classification</CardTitle>
          <CardDescription>Upload an image of a waste item, and our AI will help you classify it and suggest responsible disposal methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="waste-image" className="text-base">Waste Item Image</Label>
              <div
                className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Preview" width={200} height={200} className="mx-auto h-48 w-auto rounded-md object-contain shadow-md" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                    <p className="pl-1">{file ? file.name : 'Click to upload or drag and drop'}</p>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                </div>
                <Input 
                  id="waste-image" 
                  type="file" 
                  className="sr-only" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange} 
                  ref={fileInputRef}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !file}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Recycle className="mr-2 h-4 w-4" />
              )}
              Classify Waste
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">Analyzing your item...</p>
          <p className="text-sm text-muted-foreground">This might take a moment.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {classificationResult && (
        <Card className="shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center">
              {getRecyclabilityIcon(classificationResult.recyclability)}
              <span className={`ml-2 ${getRecyclabilityColor(classificationResult.recyclability)}`}>
                Classification: {classificationResult.recyclability.charAt(0).toUpperCase() + classificationResult.recyclability.slice(1)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classificationResult.reuseSuggestions?.length > 0 && (
              <div>
                <h3 className="font-semibold text-primary mb-2">Reuse Suggestions &amp; DIY Videos:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {classificationResult.reuseSuggestions.map((item, index) => (
                    <Card key={`reuse-${index}`} className="bg-muted/30 p-4 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-sm font-medium text-foreground mb-2">{item.suggestion}</p>
                      <Button
                        asChild
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-accent hover:underline"
                      >
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.videoSearchQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Youtube className="mr-1 h-4 w-4" /> Watch DIY Video
                        </a>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {classificationResult.recycleChannels?.length > 0 && (
              <div className="pt-4">
                <h3 className="font-semibold text-primary">Recycling Channels:</h3>
                <ul className="list-disc list-inside text-sm text-foreground space-y-1 mt-1">
                  {classificationResult.recycleChannels.map((channel, index) => (
                    <li key={`recycle-${index}`}>{channel}</li>
                  ))}
                </ul>
              </div>
            )}
            {classificationResult.donateSuggestions?.length > 0 && (
              <div className="pt-4">
                <h3 className="font-semibold text-primary">Donation Options:</h3>
                 <ul className="list-disc list-inside text-sm text-foreground space-y-1 mt-1">
                  {classificationResult.donateSuggestions.map((suggestion, index) => (
                    <li key={`donate-${index}`}><Gift className="inline h-4 w-4 mr-1 text-accent" /> {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
             {!classificationResult.reuseSuggestions?.length && !classificationResult.recycleChannels?.length && !classificationResult.donateSuggestions?.length && (
              <p className="text-sm text-muted-foreground">No specific suggestions available for this item's current classification.</p>
             )}
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">AI suggestions are for guidance. Always check local regulations.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
