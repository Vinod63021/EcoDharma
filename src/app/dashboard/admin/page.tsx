
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, BarChart2, Settings, Loader2, Map as MapIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast(); 

  React.useEffect(() => {
    if (!loading && (!user || user.role !== 'Admin')) {
      toast({ title: "Access Denied", description: "You do not have permission to view this page.", variant: "destructive"});
      router.replace('/dashboard');
    }
  }, [user, loading, router, toast]);
  
  if (loading || !user || user.role !== 'Admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading Admin Panel or Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Shield className="mr-3 h-7 w-7" />Admin Panel</CardTitle>
          <CardDescription>Manage Eco Dharma users, content, and system settings.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Waste Collection Map</CardTitle>
            <MapIcon className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">View real-time locations of logged recyclable waste for collection.</p>
            <Button asChild className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/dashboard/admin/waste-collection">View Collection Map</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">User Management</CardTitle>
            <Users className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">View, edit, and manage user accounts and roles.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Manage Users</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Content Moderation</CardTitle>
            <BarChart2 className="h-6 w-6 text-accent" /> 
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Review community posts, manage SHG listings, and oversee EcoMarket products.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Moderate Content</Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">System Analytics</CardTitle>
            <BarChart2 className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">View platform usage statistics, waste tracking trends, and AI performance.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">View Analytics</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-primary">Platform Settings</CardTitle>
            <Settings className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Configure AI parameters, reward point system, and other global settings.</p>
            <Button className="mt-4 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">Configure Settings</Button>
          </CardContent>
        </Card>
      </div>
      <CardDescription className="text-center text-muted-foreground mt-8">More admin features coming soon!</CardDescription>
    </div>
  );
}
