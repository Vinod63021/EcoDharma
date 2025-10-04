
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, Edit3, Shield, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    // This should ideally be handled by AppLayout's loading state or redirection
    return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <UserCircle className="mr-3 h-7 w-7" /> Your Eco Dharma Profile
          </CardTitle>
          <CardDescription>View and manage your account details and activity.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name || user.email} />
              <AvatarFallback className="text-3xl">{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-foreground">{user.name || 'Eco Warrior'}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className="mt-2 bg-accent text-accent-foreground">{user.role}</Badge>
            <Button variant="outline" size="sm" className="mt-4">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center"><Activity className="mr-2 h-5 w-5"/>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your recent contributions and achievements on Eco Dharma will appear here.</p>
            {/* Placeholder for activity feed */}
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-muted/50 rounded-md text-sm">Logged 5kg of Plastic waste on {new Date().toLocaleDateString()}.</div>
              <div className="p-3 bg-muted/50 rounded-md text-sm">Earned 50 Eco Dharma Points for completing a challenge.</div>
              <div className="p-3 bg-muted/50 rounded-md text-sm">Shared a new upcycle idea for "Old Newspapers".</div>
            </div>
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center"><Shield className="mr-2 h-5 w-5"/>Account Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline">Change Password (Coming Soon)</Button>
            <Button variant="outline">Manage Linked Accounts (Coming Soon)</Button>
          </CardContent>
        </Card>
    </div>
  );
}

// Minimal Badge component for role display (can be moved to ui/badge if not already there)
const Badge = ({className, children}: {className?:string, children: React.ReactNode}) => (
  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${className || ''}`}>
    {children}
  </span>
)
