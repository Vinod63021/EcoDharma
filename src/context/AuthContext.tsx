"use client";
import type { UserRole } from '@/lib/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: UserRole | null;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('ecoKarmaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, initialRole?: UserRole) => {
    // In a real app, you'd call an API and get a token & user details
    const mockUser: User = { 
      id: 'user_mock_id', 
      email, 
      role: initialRole || null,
      name: email.split('@')[0] || "Eco Warrior"
    };
    localStorage.setItem('ecoKarmaUser', JSON.stringify(mockUser));
    setUser(mockUser);
    if (initialRole) {
      router.push('/dashboard');
    } else {
      router.push('/select-role');
    }
  };

  const logout = () => {
    localStorage.removeItem('ecoKarmaUser');
    setUser(null);
    router.push('/login');
  };

  const setRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      localStorage.setItem('ecoKarmaUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      router.push('/dashboard');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
