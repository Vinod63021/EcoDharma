
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/lib/types';
import { USER_ROLES } from '@/lib/types';
import { Users, Leaf, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(undefined);
  const { user, setRole, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (!loading && user?.role) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      setRole(selectedRole);
    } else {
      toast({
        title: "Role Selection Error",
        description: "Please select a role to continue.",
        variant: "destructive",
      });
    }
  };
  
  if (loading || (!loading && !user && !router)) { // Added !router to prevent premature render
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf size={32} />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">Choose Your Role</CardTitle>
          <CardDescription className="text-muted-foreground">Select how you'll participate in Eco Dharma.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              value={selectedRole}
              className="space-y-3"
            >
              {USER_ROLES.map((role) => (
                <Label
                  key={role}
                  htmlFor={role}
                  className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-colors hover:bg-accent/10 ${selectedRole === role ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'}`}
                >
                  <RadioGroupItem value={role} id={role} />
                  <span className="font-medium text-foreground">{role}</span>
                </Label>
              ))}
            </RadioGroup>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!selectedRole}>
              <Users className="mr-2 h-5 w-5" /> Continue as {selectedRole || '...'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
