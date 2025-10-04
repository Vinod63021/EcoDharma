
"use client";
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'; 
import {
  Home,
  Map,
  ShoppingBag,
  LogOut,
  UserCircle,
  Settings,
  Leaf,
  Users,
  Gift,
  Shield,
  Recycle,
  Paintbrush,
  Award,
  Loader2,
  ScanSearch, 
} from 'lucide-react';


interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: UserRole[]; 
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home, roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
  { href: '/dashboard/take-action', label: 'Earn Points', icon: Award, roles: ['Household'] },
  { href: '/dashboard/upload-waste', label: 'AI Detector', icon: ScanSearch, roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
  { href: '/dashboard/upcycle-studio', label: 'Upcycle Studio', icon: Paintbrush, roles: ['Household', 'SHG'] },
  { href: '/dashboard/ecomap', label: 'EcoMap', icon: Map, roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
  { href: '/dashboard/ecomarket', label: 'EcoMarket', icon: ShoppingBag, roles: ['Household', 'NGO', 'SHG'] },
  { href: '/dashboard/community', label: 'Community Zone', icon: Users, roles: ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'] },
  { href: '/dashboard/rewards', label: 'Rewards Catalog', icon: Gift, roles: ['Household'] },
  // Admin/Specific Role Dashboards
  { href: '/dashboard/admin', label: 'Admin Panel', icon: Shield, roles: ['Admin'] },
  { href: '/dashboard/recycler', label: 'Recycler Hub', icon: Recycle, roles: ['Recycler'] },
  { href: '/dashboard/ngo', label: 'NGO Portal', icon: Users, roles: ['NGO'] },
];

import type { UserRole } from '@/lib/types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !isMounted || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-foreground"><Loader2 className="h-8 w-8 animate-spin mr-2"/>Loading dashboard...</div>;
  }
  
  const availableNavItems = navItems.filter(item => 
    item.roles ? item.roles.includes(user.role as UserRole) : true
  );

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-sidebar-primary" />
            <h1 className="font-headline text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">Eco Dharma</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {availableNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    className="w-full justify-start group"
                    isActive={pathname === item.href} 
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:invisible">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <SidebarMenuButton
              onClick={logout}
              className="w-full justify-start"
              tooltip="Logout"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" /> {/* Hamburger for mobile */}
            <div className="hidden md:block text-lg font-medium text-foreground">
              {availableNavItems.find(item => pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href)))?.label || 'Dashboard'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark mode toggle can be added here later */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name || user.email} />
                    <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground font-semibold">Role: {user.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
