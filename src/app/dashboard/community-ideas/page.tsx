
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUpcycleIdeas } from '@/context/UpcycleIdeasContext';
import { Lightbulb, User, Recycle, Image as ImageIcon, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; 

export default function CommunityIdeasPage() {
  const { ideas } = useUpcycleIdeas();

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Lightbulb className="mr-3 h-7 w-7" /> Community Upcycle Ideas
          </CardTitle>
          <CardDescription>Discover creative upcycling and recycling ideas shared by fellow Eco Dharma members!</CardDescription>
        </CardHeader>
      </Card>

      {ideas.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-10 text-center">
            <Info className="mx-auto h-16 w-16 text-accent mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">It's Quiet In Here... Too Quiet!</h3>
            <p className="text-muted-foreground mb-4">No upcycle ideas have been shared yet. Why not be the first to spark some creativity?</p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/dashboard/upcycle-studio">
                <Lightbulb className="mr-2 h-4 w-4" /> Share Your Brilliant Idea
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Card key={idea.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
              {idea.imageUrl ? (
                <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
                  <Image 
                    src={idea.imageUrl} 
                    alt={`Upcycled ${idea.itemName}`} 
                    layout="fill" // Changed from cover for fill behavior
                    objectFit="cover" // Ensures image covers the area
                    className="transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="upcycled item"
                  />
                </div>
              ) : (
                <div className="relative w-full h-56 rounded-t-lg overflow-hidden bg-muted flex items-center justify-center">
                  <ImageIcon className="h-24 w-24 text-muted-foreground" aria-label="No image provided" />
                </div>
              )}
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg text-accent flex items-center">
                  <Recycle className="mr-2 h-5 w-5" /> {idea.itemName}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <p className="text-sm text-foreground whitespace-pre-wrap">{idea.ideaDescription}</p>
              </CardContent>
              <CardFooter className="border-t pt-3 mt-auto">
                <div className="text-xs text-muted-foreground flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  Shared by: {idea.submittedBy || 'Anonymous'}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
