
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Sparkles, Quote as QuoteIcon, Award, MapPin, ShoppingBag, MessageCircle, Paintbrush, ScanSearch } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import type { DailyQuote } from '@/lib/types';

const dailyQuotes: DailyQuote[] = [
  { id: 1, text: "The Earth does not belong to us: we belong to the Earth.", author: "Marlee Matlin" },
  { id: 2, text: "The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan" },
  { id: 3, text: "Small acts, when multiplied by millions of people, can transform the world.", author: "Howard Zinn" },
  { id: 4, text: "Waste not, want not. Every bit recycled is a step towards a cleaner future.", author: "Eco Dharma" },
  { id: 5, text: "Be the change you wish to see in the world. Start by reducing your waste today.", author: "Mahatma Gandhi (adapted)" },
];

const QuickActionButtons = ({ userRole }: { userRole: string | null }) => {
  const actions = [
    { label: 'Earn Points', icon: Award, href: '/dashboard/take-action', roles: ['Household'] },
    { label: 'AI Detector', icon: ScanSearch, href: '/dashboard/upload-waste', roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
    { label: 'Upcycle Studio', icon: Paintbrush, href: '/dashboard/upcycle-studio', roles: ['Household', 'SHG'] },
    { label: 'EcoMap', icon: MapPin, href: '/dashboard/ecomap', roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
    { label: 'EcoMarket', icon: ShoppingBag, href: '/dashboard/ecomarket', roles: ['Household', 'NGO', 'SHG'] },
    { label: 'Community Zone', icon: MessageCircle, href: '/dashboard/community', roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
  ];

  const availableActions = actions.filter(action => action.roles.includes(userRole || ''));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {availableActions.map(action => (
        <Link href={action.href} key={action.label} passHref>
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center p-2 text-center shadow-sm hover:shadow-md transition-shadow">
            <action.icon className="h-8 w-8 mb-1 text-primary" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};


export default function DashboardHomePage() {
  const [ecoDharmaPoints, setEcoDharmaPoints] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [currentQuote, setCurrentQuote] = useState<DailyQuote | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Mock data fetching
    setEcoDharmaPoints(1250);
    setProgressValue(65);
    setCurrentQuote(dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center text-primary">
            <Sparkles className="mr-2 h-6 w-6" />
            Welcome back, {user?.name || 'Eco Warrior'}!
          </CardTitle>
          <CardDescription>Here's your Eco Dharma summary for today.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Eco Dharma Points</CardTitle>
            <Leaf className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{ecoDharmaPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">+20 points from yesterday</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Weekly Goal Progress</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{progressValue}%</div>
            <Progress value={progressValue} className="mt-2 h-2" indicatorClassName="bg-primary" />
            <p className="text-xs text-muted-foreground mt-1">Keep up the great work!</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1 bg-accent/10">
          <CardHeader className="flex flex-row items-center justify-start space-x-3 pb-2">
            <QuoteIcon className="h-8 w-8 text-accent" />
            <CardTitle className="text-base font-medium text-primary">Daily Eco Quote</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pl-8">
            <blockquote className="text-lg font-medium text-foreground leading-relaxed">
              "{currentQuote?.text}"
            </blockquote>
            {currentQuote?.author && (
              <p className="text-sm text-muted-foreground mt-3 text-right pr-4">- {currentQuote.author}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickActionButtons userRole={user?.role || null} />
        </CardContent>
      </Card>
    </div>
  );
}
