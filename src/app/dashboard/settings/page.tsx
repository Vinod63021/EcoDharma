
"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Palette, ShieldLock } from 'lucide-react';

export default function SettingsPage() {
  // Mock settings state
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <SettingsIcon className="mr-3 h-7 w-7" /> Application Settings
          </CardTitle>
          <CardDescription>Manage your Eco Dharma preferences and account settings.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center"><Bell className="mr-2 h-5 w-5" />Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new challenges, rewards, and community activity.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-base">Push Notifications (Coming Soon)</Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts on your device.
              </p>
            </div>
            <Switch
              id="push-notifications"
              disabled // Feature not implemented
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center"><Palette className="mr-2 h-5 w-5" />Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode (Experimental)</Label>
              <p className="text-sm text-muted-foreground">
                Switch to a darker theme. (Currently affects sidebar only)
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(checked) => {
                setDarkMode(checked);
                // This is a basic toggle for demonstration.
                // A full dark mode implementation would require more extensive theme adjustments.
                if (checked) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-primary flex items-center"><ShieldLock className="mr-2 h-5 w-5" />Account & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
           <Button variant="outline">Manage Data Sharing (Coming Soon)</Button>
           <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 border-destructive/50">Delete Account (Coming Soon)</Button>
        </CardContent>
      </Card>

      <CardFooter className="mt-8 justify-center">
         <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes (Demo)</Button>
      </CardFooter>
    </div>
  );
}
