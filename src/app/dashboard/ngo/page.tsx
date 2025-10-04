
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, Award, Edit, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; // Added useToast import

export default function NgoPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast(); // Using central toast

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'NGO')) {
      toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive"});
      router.replace('/dashboard');
    }
  }, [user, loading, router, toast]);

  if (loading || !user || user.role !== 'NGO') {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading NGO Portal or Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Users className="mr-3 h-7 w-7" />NGO Portal</CardTitle>
          <CardDescription>Manage your organization's activities, campaigns, and SHG collaborations within Eco Dharma.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Campaign Management</CardTitle>
            <Award className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Create and manage awareness campaigns, cleanup drives, and events.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Manage Campaigns</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">SHG Collaboration</CardTitle>
            <Heart className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Oversee connected Self-Help Groups, track their product listings on EcoMarket, and manage support.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">View SHGs</Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Organization Profile</CardTitle>
            <Edit className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Update your NGO's information, contact details, and mission statement visible on EcoMap.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Edit Profile</Button>
          </CardContent>
        </Card>
      </div>
      <CardDescription className="text-center text-muted-foreground mt-8">More NGO tools and features coming soon!</CardDescription>
    </div>
  );
}
