
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Recycle, Truck, ListChecks, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; // Added useToast import

export default function RecyclerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast(); // Using central toast

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'Recycler')) {
      toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive"});
      router.replace('/dashboard');
    }
  }, [user, loading, router, toast]);
  
  if (loading || !user || user.role !== 'Recycler') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Recycler Hub or Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Recycle className="mr-3 h-7 w-7" />Recycler Hub</CardTitle>
          <CardDescription>Manage your recycling operations, track collections, and connect with households.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Pickup Requests</CardTitle>
            <Truck className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">View and manage incoming waste pickup requests from households.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">View Requests</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Collection Log</CardTitle>
            <ListChecks className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Track collected materials, quantities, and processing status.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Manage Collections</Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Service Area & Materials</CardTitle>
            <MapPin className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Update your service locations and the types of materials you accept.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Update Profile</Button>
          </CardContent>
        </Card>
      </div>
       <CardDescription className="text-center text-muted-foreground mt-8">More recycler tools coming soon!</CardDescription>
    </div>
  );
}
