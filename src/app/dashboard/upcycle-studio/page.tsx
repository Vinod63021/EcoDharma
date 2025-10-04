
"use client";
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { getReuseSuggestions, type ReuseSuggestionsInput, type ReuseSuggestionsOutput } from '@/ai/flows/reuse-suggestions';
import { useUpcycleIdeas } from '@/context/UpcycleIdeasContext';
import { Loader2, Paintbrush, AlertCircle, Youtube, Send, PlusCircle, Eye, Lightbulb, Image as ImageIcon, Upload, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image'; // For Next.js optimized image

export default function UpcycleStudioPage() {
  const [wasteItemDescription, setWasteItemDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ReuseSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isSubmitIdeaDialogOpen, setIsSubmitIdeaDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newIdeaDescription, setNewIdeaDescription] = useState('');
  const [newSubmittedBy, setNewSubmittedBy] = useState('');
  const [newIdeaImageFile, setNewIdeaImageFile] = useState<File | null>(null);
  const [newIdeaImagePreview, setNewIdeaImagePreview] = useState<string | null>(null);
  const { addIdea } = useUpcycleIdeas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAISubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!wasteItemDescription.trim()) {
      toast({ title: "Input Required", description: "Please describe your waste item for AI suggestions.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const input: ReuseSuggestionsInput = { wasteItem: wasteItemDescription };
      const response = await getReuseSuggestions(input);
      setResults(response);
      toast({ title: "AI Ideas Generated!", description: "Check out the upcycling suggestions below." });
    } catch (err) {
      console.error("Upcycle suggestion error:", err);
      setError("Failed to generate suggestions. The AI model might be busy or an error occurred. Please try again.");
      toast({ title: "Suggestion Failed", description: "An error occurred while fetching ideas from AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for user idea images
        toast({ title: "Image too large", description: "Please upload an image smaller than 2MB.", variant: "destructive" });
        setNewIdeaImageFile(null);
        setNewIdeaImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
        return;
      }
      setNewIdeaImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewIdeaImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewIdeaImageFile(null);
      setNewIdeaImagePreview(null);
    }
  };

  const handleUserIdeaSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newItemName.trim() || !newIdeaDescription.trim()) {
      toast({ title: "Missing Information", description: "Please provide item name and your idea.", variant: "destructive" });
      return;
    }
    addIdea({
      itemName: newItemName,
      ideaDescription: newIdeaDescription,
      submittedBy: newSubmittedBy || 'Anonymous',
      imageUrl: newIdeaImagePreview || undefined, // Pass the Data URL
    });
    toast({ title: "Idea Submitted!", description: "Thank you for sharing your upcycle idea with the community." });
    setNewItemName('');
    setNewIdeaDescription('');
    setNewSubmittedBy('');
    setNewIdeaImageFile(null);
    setNewIdeaImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setIsSubmitIdeaDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Paintbrush className="mr-3 h-7 w-7" /> Upcycle Studio
          </CardTitle>
          <CardDescription>Transform your waste into treasure! Get AI-powered reuse ideas or share your own creative solutions with the community.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => setIsSubmitIdeaDialogOpen(true)} variant="outline" className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Share Your Upcycle Idea
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/dashboard/community">
              <Users className="mr-2 h-4 w-4" /> View Community Zone
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isSubmitIdeaDialogOpen} onOpenChange={(isOpen) => {
          setIsSubmitIdeaDialogOpen(isOpen);
          if (!isOpen) { // Reset form if dialog is closed
            setNewItemName('');
            setNewIdeaDescription('');
            setNewSubmittedBy('');
            setNewIdeaImageFile(null);
            setNewIdeaImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
          }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary"/>Share Your Upcycle Idea</DialogTitle>
            <DialogDescription>
              Got a creative way to reuse an item? Share it with the Eco Dharma community!
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserIdeaSubmit} className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input 
                id="item-name" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                placeholder="e.g., Old Jeans"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="idea-description">Your Idea *</Label>
              <Textarea 
                id="idea-description" 
                value={newIdeaDescription} 
                onChange={(e) => setNewIdeaDescription(e.target.value)} 
                placeholder="Describe your upcycling method..."
                rows={3}
                required
              />
            </div>
             <div className="space-y-1">
              <Label htmlFor="idea-image">Upload Image (Optional)</Label>
              <Input 
                id="idea-image" 
                type="file" 
                accept="image/png, image/jpeg, image/gif"
                onChange={handleIdeaImageChange}
                ref={fileInputRef}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
               {newIdeaImagePreview && (
                <div className="mt-2 relative w-full h-40 rounded-md overflow-hidden border">
                  <Image src={newIdeaImagePreview} alt="Idea preview" layout="fill" objectFit="contain" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="submitted-by">Your Name (Optional)</Label>
              <Input 
                id="submitted-by" 
                value={newSubmittedBy} 
                onChange={(e) => setNewSubmittedBy(e.target.value)} 
                placeholder="Anonymous" 
              />
            </div>
            <DialogFooter className="sm:justify-start gap-2 pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4"/> Submit Idea
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Get AI-Powered Upcycle Ideas</CardTitle>
           <CardDescription>Describe a waste item below and let our AI suggest creative ways to reuse it, complete with DIY video guides.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAISubmit} className="space-y-4">
            <div>
              <Label htmlFor="waste-item-description" className="sr-only">Describe your waste item for AI</Label>
              <Textarea
                id="waste-item-description"
                placeholder="e.g., old newspapers, plastic bottles, a broken wooden chair..."
                value={wasteItemDescription}
                onChange={(e) => setWasteItemDescription(e.target.value)}
                rows={4}
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Get AI Upcycle Ideas
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-foreground">Brewing up some creative ideas...</p>
          <p className="text-sm text-muted-foreground">This might take a moment.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating AI Ideas</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && results.suggestions && results.suggestions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-headline text-primary">AI-Generated Upcycling Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.suggestions.map((item, index) => (
              <Card key={index} className="shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg text-accent">{item.suggestion}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {/* Description could be added here if AI provides it separately */}
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  >
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.videoSearchQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="mr-2 h-5 w-5" />
                      Watch DIY Video Guides
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      {results && results.suggestions && results.suggestions.length === 0 && !isLoading && (
         <Card className="shadow-md">
            <CardContent className="p-6 text-center">
                <Paintbrush className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">No specific AI suggestions found for that item yet.</p>
                <p className="text-sm text-muted-foreground">Try describing it differently or check back later!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
