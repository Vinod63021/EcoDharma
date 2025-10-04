
"use client";

import type { UserUpcycleIdea } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface UpcycleIdeasContextType {
  ideas: UserUpcycleIdea[];
  addIdea: (idea: Omit<UserUpcycleIdea, 'id'>) => void;
}

const UpcycleIdeasContext = createContext<UpcycleIdeasContextType | undefined>(undefined);

export const UpcycleIdeasProvider = ({ children }: { children: ReactNode }) => {
  const [ideas, setIdeas] = useState<UserUpcycleIdea[]>([]);

  const addIdea = useCallback((ideaData: Omit<UserUpcycleIdea, 'id'>) => {
    const newIdea: UserUpcycleIdea = {
      ...ideaData,
      id: crypto.randomUUID(),
    };
    setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
  }, []);

  return (
    <UpcycleIdeasContext.Provider value={{ ideas, addIdea }}>
      {children}
    </UpcycleIdeasContext.Provider>
  );
};

export const useUpcycleIdeas = (): UpcycleIdeasContextType => {
  const context = useContext(UpcycleIdeasContext);
  if (context === undefined) {
    throw new Error('useUpcycleIdeas must be used within an UpcycleIdeasProvider');
  }
  return context;
};
