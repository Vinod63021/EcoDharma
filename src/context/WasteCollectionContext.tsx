
"use client";

import type { WasteClassification, WasteReport } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface WasteCollectionContextType {
  reports: WasteReport[];
  addReport: (reportData: Omit<WasteReport, 'id' | 'timestamp'>) => void;
}

const WasteCollectionContext = createContext<WasteCollectionContextType | undefined>(undefined);

// Some mock initial data for the admin to see
const initialReports: WasteReport[] = [
    { 
        id: 'mock1',
        classification: {
            recyclability: 'recyclable',
            reuseSuggestions: [{suggestion: 'Melt into a block', videoSearchQuery: 'melt plastic bottles'}],
            recycleChannels: ['Municipal recycling bin'],
            donateSuggestions: []
        },
        latitude: 12.9716, // Bangalore
        longitude: 77.5946,
        timestamp: '2024-07-29T10:00:00.000Z',
        itemName: 'Plastic Bottles',
        quantity: 15,
        unit: 'items',
        notes: 'In a blue bag by the gate.'
    },
    { 
        id: 'mock2',
        classification: {
            recyclability: 'recyclable',
            reuseSuggestions: [],
            recycleChannels: ['E-waste collection center'],
            donateSuggestions: []
        },
        latitude: 12.9780, // Indiranagar
        longitude: 77.6400,
        timestamp: '2024-07-29T11:30:00.000Z',
        itemName: 'Old Keyboard',
        quantity: 1,
        unit: 'items',
        notes: 'Handle with care.'
    }
];


export const WasteCollectionProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<WasteReport[]>(initialReports);

  const addReport = useCallback((reportData: Omit<WasteReport, 'id' | 'timestamp'>) => {
    const newReport: WasteReport = {
      ...reportData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setReports(prevReports => [newReport, ...prevReports]);
  }, []);

  return (
    <WasteCollectionContext.Provider value={{ reports, addReport }}>
      {children}
    </WasteCollectionContext.Provider>
  );
};

export const useWasteCollection = (): WasteCollectionContextType => {
  const context = useContext(WasteCollectionContext);
  if (context === undefined) {
    throw new Error('useWasteCollection must be used within a WasteCollectionProvider');
  }
  return context;
};
