
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MessageCircle, Lightbulb, Users, ThumbsUp, Send, Award, Search, Recycle, User as UserIcon, Image as ImageIcon, Info, Droplets, ExternalLink, CalendarDays, ShoppingBag, Smile, Frown, Meh, SmilePlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpcycleIdeas } from '@/context/UpcycleIdeasContext';
import Link from 'next/link';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Post {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  participants: number;
  endsIn: string;
}

const initialPosts: Post[] = [
  { id: '1', author: 'EcoWarriorJane', avatarUrl: 'https://avatar.vercel.sh/jane.png', content: 'Just turned my old jeans into a cool tote bag! So happy with how it turned out. #DIYReuse', timestamp: '2h ago', likes: 15, comments: 3 },
  { id: '2', author: 'GreenThumbMike', avatarUrl: 'https://avatar.vercel.sh/mike.png', content: 'Any tips for composting in a small apartment? Trying to reduce my food waste.', timestamp: '5h ago', likes: 8, comments: 5 },
  { id: '3', author: 'RecycleRita', avatarUrl: 'https://avatar.vercel.sh/rita.png', content: 'Found a new drop-off point for e-waste in the North District! Check EcoMap for details.', timestamp: '1d ago', likes: 22, comments: 2 },
];

const initialChallenges: Challenge[] = [
  { id: 'c1', title: 'Plastic-Free Week', description: 'Try to go an entire week without using single-use plastics. Share your journey!', points: 100, participants: 45, endsIn: '3 days' },
  { id: 'c2', title: 'Upcycle Challenge: Old T-shirts', description: 'Transform an old t-shirt into something new and useful. Post a picture of your creation.', points: 50, participants: 78, endsIn: '5 days' },
  { id: 'c3', title: 'Community Cleanup Drive', description: 'Organize or join a local cleanup event. Make a difference in your neighborhood.', points: 200, participants: 23, endsIn: '10 days' },
];

const guides = [
  {
    id: 'guide1',
    title: 'Oil to Soap Conversion',
    icon: Droplets,
    description: "Turn used cooking oil into useful soap! Learn how with DIY tutorials or connect with local Self-Help Groups (SHGs) for assistance.",
    safetyNote: "Soap making, especially with lye (sodium hydroxide), requires careful handling and safety precautions. Always wear protective gear (gloves, goggles) and work in a well-ventilated area. Follow tutorials precisely.",
    tutorials: [
      { id: 't1', title: 'Basic Cold Process Soap from Used Cooking Oil', description: 'Learn the fundamentals of making soap safely at home using leftover cooking oil.', difficulty: 'Medium', link: '#' },
      { id: 't2', title: 'Hot Process Soap for Beginners', description: 'A quicker method to make soap, suitable for those with some experience.', difficulty: 'Medium', link: '#' },
      { id: 't3', title: 'Adding Natural Colorants and Scents', description: 'Explore how to customize your homemade soap with natural ingredients.', difficulty: 'Easy', link: '#' },
    ],
    shgHelp: {
      title: 'Get Help from an SHG',
      description: 'Local Self-Help Groups can assist with oil collection and soap making. Schedule a consultation or oil drop-off.',
      shgs: [
        { id: 'shg1', name: 'CleanHands Collective', area: 'North District' },
        { id: 'shg2', name: 'SoapMakers United', area: 'South District' },
        { id: 'shg3', name: 'EcoSoaps Initiative', area: 'West District' },
      ],
    },
  },
  {
    id: 'guide2',
    title: 'T-Shirt Tote Bags',
    icon: ShoppingBag,
    description: "Don't throw away old t-shirts! With a few simple cuts and knots, you can turn them into stylish, reusable tote bags. No sewing required!",
    safetyNote: null,
    tutorials: [
       { id: 't4', title: 'No-Sew T-Shirt Bag Tutorial', description: 'A quick and easy way to make a tote bag in under 10 minutes.', difficulty: 'Easy', link: '#' },
       { id: 't5', title: 'Fringed T-Shirt Bag', description: 'Add a little flair to your bag with a decorative fringe bottom.', difficulty: 'Easy', link: '#' },
    ],
    shgHelp: null
  },
  {
    id: 'guide3',
    title: 'Glass Jar Lanterns',
    icon: Lightbulb,
    description: "Transform empty glass jars into beautiful lanterns or candle holders. Perfect for adding a cozy ambiance to any room or outdoor space.",
    safetyNote: "Always use caution when working with candles or open flames. Never leave a lit candle unattended.",
     tutorials: [
       { id: 't6', title: 'Simple Glass Jar Votives', description: 'Decorate jars with paint, twine, or fabric to create lovely candle holders.', difficulty: 'Easy', link: '#' },
       { id: 't7', title: 'Fairy Light Jars', description: 'A safe, flame-free alternative using battery-powered LED fairy lights.', difficulty: 'Easy', link: '#' },
    ],
    shgHelp: null
  }
];


// Component for rendering Upcycle Ideas
const UpcycleIdeasContent = () => {
    const { ideas } = useUpcycleIdeas();

    return (
        <>
            {ideas.length === 0 ? (
                <Card className="shadow-md">
                    <CardContent className="p-10 text-center">
                        <Info className="mx-auto h-16 w-16 text-accent mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Upcycle Ideas Shared Yet!</h3>
                        <p className="text-muted-foreground mb-4">Why not be the first to spark some creativity in the community?</p>
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
                        <Card key={idea.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col group">
                            {idea.imageUrl ? (
                                <div className="relative w-full h-56 rounded-t-lg overflow-hidden">
                                    <Image
                                        src={idea.imageUrl}
                                        alt={`Upcycled ${idea.itemName}`}
                                        layout="fill"
                                        objectFit="cover"
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
                                    <UserIcon className="mr-1 h-3 w-3" />
                                    Shared by: {idea.submittedBy || 'Anonymous'}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
};


export default function CommunityPage() {
  const { toast } = useToast();
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [isPosting, setIsPosting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for SHG help form (from old oil-to-soap page)
  const [selectedSHG, setSelectedSHG] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // State for feedback form
  const [feedbackFeeling, setFeedbackFeeling] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackFeeling || !feedbackText.trim()) {
      toast({ title: "Incomplete Feedback", description: "Please select your feeling and write a comment.", variant: "destructive" });
      return;
    }
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      toast({ title: "Feedback Received!", description: "Thank you for helping us improve Eco Dharma." });
      setFeedbackFeeling('');
      setFeedbackText('');
      setIsSubmittingFeedback(false);
    }, 1000);
  };

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


  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast({ title: "Empty Post", description: "Please write something to share.", variant: "destructive" });
      return;
    }
    setIsPosting(true);
    // Simulate API call
    setTimeout(() => {
      const newPost: Post = {
        id: crypto.randomUUID(),
        author: 'CurrentUser', // Replace with actual user
        avatarUrl: 'https://avatar.vercel.sh/current.png',
        content: newPostContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      toast({ title: "Post Shared!", description: "Your thoughts are now live in the community." });
      setIsPosting(false);
    }, 1000);
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Users className="mr-3 h-7 w-7" />Community Zone</CardTitle>
          <CardDescription>Connect with fellow eco-enthusiasts, share ideas, participate in challenges, and inspire each other!</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="feed" className="text-base"><MessageCircle className="mr-2 h-5 w-5" /> Feed</TabsTrigger>
          <TabsTrigger value="challenges" className="text-base"><Award className="mr-2 h-5 w-5" /> Challenges</TabsTrigger>
          <TabsTrigger value="ideas" className="text-base"><Lightbulb className="mr-2 h-5 w-5" /> Upcycle Ideas</TabsTrigger>
          <TabsTrigger value="guides" className="text-base"><Recycle className="mr-2 h-5 w-5" /> Guides</TabsTrigger>
          <TabsTrigger value="feedback" className="text-base"><Smile className="mr-2 h-5 w-5" /> Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <Card className="shadow-md mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostSubmit} className="space-y-3">
                <Textarea 
                  placeholder="What's on your eco-mind? Share tips, successes, or ask questions..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isPosting}>
                  {isPosting ? 'Posting...' : <><Send className="mr-2 h-4 w-4" /> Post to Community</>}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <Input 
              placeholder="Search feed..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <Card key={post.id} className="shadow-sm">
                  <CardHeader className="flex flex-row items-start space-x-3 pb-2">
                    <Avatar>
                      <AvatarImage src={post.avatarUrl} alt={post.author} />
                      <AvatarFallback>{post.author.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-start gap-4 border-t pt-3">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <ThumbsUp className="mr-1 h-4 w-4" /> {post.likes} Likes
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="mr-1 h-4 w-4" /> {post.comments} Comments
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Posts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term or broaden your search." : "No posts in the feed yet. Be the first to share something!"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="challenges">
           <div className="mb-4">
            <Input placeholder="Search challenges..." className="max-w-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map(challenge => (
              <Card key={challenge.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{challenge.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    <Award className="inline h-3 w-3 mr-1 text-yellow-500" /> {challenge.points} Eco Dharma Points | Ends in {challenge.endsIn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-3">{challenge.description}</p>
                  <p className="text-xs text-muted-foreground">{challenge.participants} participants</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Join Challenge</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ideas">
          <UpcycleIdeasContent />
        </TabsContent>

        <TabsContent value="guides">
          <div className="space-y-8">
            {guides.map((guide) => (
              <Card key={guide.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary flex items-center">
                    <guide.icon className="mr-3 h-7 w-7" />{guide.title}
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {guide.safetyNote && (
                    <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-md text-yellow-800 mb-6">
                      <p className="font-semibold">Important Safety Note:</p>
                      <p className="text-xs">{guide.safetyNote}</p>
                    </div>
                  )}

                  <h3 className="font-headline text-xl text-primary mb-2">DIY Tutorials</h3>
                   <Accordion type="single" collapsible className="w-full">
                    {guide.tutorials.map(tutorial => (
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

                  {guide.shgHelp && (
                    <div className="mt-8">
                      <h3 className="font-headline text-xl text-primary flex items-center"><Users className="mr-2 h-6 w-6" />{guide.shgHelp.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{guide.shgHelp.description}</p>
                       <form onSubmit={handleScheduleHelp} className="space-y-4 p-4 border rounded-lg">
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
                            {guide.shgHelp.shgs.map(shg => (
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
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Share Your Feedback</CardTitle>
                    <CardDescription>How has your experience been? Let us know what you love and what we can improve.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                        <div>
                            <Label className="text-base font-medium">How are you feeling about the app?</Label>
                            <RadioGroup
                                value={feedbackFeeling}
                                onValueChange={setFeedbackFeeling}
                                className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                                <Label htmlFor="feeling-great" className={`flex flex-col items-center justify-center rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 ${feedbackFeeling === 'great' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'}`}>
                                    <RadioGroupItem value="great" id="feeling-great" className="sr-only" />
                                    <SmilePlus className="h-8 w-8 text-green-500 mb-2" />
                                    <span className="font-medium text-foreground">Great</span>
                                </Label>
                                <Label htmlFor="feeling-good" className={`flex flex-col items-center justify-center rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 ${feedbackFeeling === 'good' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'}`}>
                                    <RadioGroupItem value="good" id="feeling-good" className="sr-only" />
                                    <Smile className="h-8 w-8 text-blue-500 mb-2" />
                                    <span className="font-medium text-foreground">Good</span>
                                </Label>
                                <Label htmlFor="feeling-okay" className={`flex flex-col items-center justify-center rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 ${feedbackFeeling === 'okay' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'}`}>
                                    <RadioGroupItem value="okay" id="feeling-okay" className="sr-only" />
                                    <Meh className="h-8 w-8 text-yellow-500 mb-2" />
                                    <span className="font-medium text-foreground">Okay</span>
                                </Label>
                                <Label htmlFor="feeling-bad" className={`flex flex-col items-center justify-center rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 ${feedbackFeeling === 'bad' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'}`}>
                                    <RadioGroupItem value="bad" id="feeling-bad" className="sr-only" />
                                    <Frown className="h-8 w-8 text-red-500 mb-2" />
                                    <span className="font-medium text-foreground">Could be better</span>
                                </Label>
                            </RadioGroup>
                        </div>
                        <div>
                            <Label htmlFor="feedback-text" className="text-base font-medium">Your thoughts and suggestions</Label>
                            <Textarea
                                id="feedback-text"
                                placeholder="Tell us more about your experience and any ideas you have for implementation..."
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                rows={5}
                                className="mt-2"
                            />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmittingFeedback}>
                            {isSubmittingFeedback ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Feedback
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
