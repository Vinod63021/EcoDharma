"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Droplets, Users, CalendarDays, ExternalLink, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const soapTutorials = [
  { id: '1', title: 'Basic Cold Process Soap from Used Cooking Oil', description: 'Learn the fundamentals of making soap safely at home using leftover cooking oil.', difficulty: 'Medium', link: '#' },
  { id: '2', title: 'Hot Process Soap for Beginners', description: 'A quicker method to make soap, suitable for those with some experience.', difficulty: 'Medium', link: '#' },
  { id: '3', title: 'Adding Natural Colorants and Scents', description: 'Explore how to customize your homemade soap with natural ingredients.', difficulty: 'Easy', link: '#' },
];

const nearbySHGs = [
  { id: 'shg1', name: 'CleanHands Collective', contact: 'cleanhands@example.com', area: 'North District' },
  { id: 'shg2', name: 'SoapMakers United', contact: 'soapmakers@example.com', area: 'South District' },
  { id: 'shg3', name: 'EcoSoaps Initiative', contact: 'ecosoaps@example.com', area: 'West District' },
];

export default function OilToSoapPage() {
  const { toast } = useToast();
  const [selectedSHG, setSelectedSHG] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleHelp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSHG || !contactName || !contactEmail) {
      toast({ title: "Scheduling Error", description: "Please fill all fields to schedule SHG help.", variant: "destructive" });
      return;
    }
    setIsScheduling(true);
    // Simulate API call
    setTimeout(() => {
      toast({ title: "Help Scheduled!", description: `Thank you, ${contactName}! ${selectedSHG} will contact you at ${contactEmail} to coordinate.` });
      setSelectedSHG('');
      setContactName('');
      setContactEmail('');
      setIsScheduling(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Droplets className="mr-3 h-7 w-7" />Oil to Soap Conversion</CardTitle>
          <CardDescription>Turn used cooking oil into useful soap! Learn how with DIY tutorials or connect with local Self-Help Groups (SHGs) for assistance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground mb-4">
            Converting used cooking oil into soap is a fantastic way to reduce waste and create a valuable product. 
            It prevents oil from clogging drains or polluting waterways.
          </p>
          <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800">
            <p className="font-semibold">Important Safety Note:</p>
            <p className="text-xs">Soap making, especially with lye (sodium hydroxide), requires careful handling and safety precautions. Always wear protective gear (gloves, goggles) and work in a well-ventilated area. Follow tutorials precisely.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">DIY Soap Making Tutorials</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {soapTutorials.map(tutorial => (
              <AccordionItem value={tutorial.id} key={tutorial.id}>
                <AccordionTrigger className="hover:text-accent font-medium text-base">{tutorial.title} <span className="text-xs text-muted-foreground ml-2">({tutorial.difficulty})</span></AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-sm text-foreground">{tutorial.description}</p>
                  <Button variant="link" asChild className="p-0 h-auto text-accent hover:underline">
                    <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                      View Tutorial <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center"><Users className="mr-2 h-6 w-6" />Get Help from an SHG</CardTitle>
          <CardDescription>Local Self-Help Groups can assist with oil collection and soap making. Schedule a consultation or oil drop-off.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScheduleHelp} className="space-y-4">
            <div>
              <Label htmlFor="shg-select">Select SHG</Label>
              <select
                id="shg-select"
                value={selectedSHG}
                onChange={(e) => setSelectedSHG(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-input bg-background py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              >
                <option value="" disabled>Choose an SHG...</option>
                {nearbySHGs.map(shg => (
                  <option key={shg.id} value={shg.name}>{shg.name} ({shg.area})</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="contact-name">Your Name</Label>
              <Input 
                id="contact-name" 
                type="text" 
                placeholder="Your Name" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Your Email</Label>
              <Input 
                id="contact-email" 
                type="email" 
                placeholder="your.email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isScheduling}>
              {isScheduling ? 'Scheduling...' : <><CalendarDays className="mr-2 h-4 w-4" /> Schedule Assistance</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
