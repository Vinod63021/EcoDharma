
export type UserRole = 'Household' | 'Recycler' | 'NGO' | 'Admin' | 'SHG';

export const USER_ROLES: UserRole[] = ['Household', 'Recycler', 'NGO', 'Admin', 'SHG'];

export interface DailyQuote {
  id: number;
  text: string;
  author?: string;
}

export interface WasteItem {
  id: string;
  name: string;
  category: string; // e.g., plastic, paper, organic
  quantity: number; // e.g., kg, items
  date: string; // ISO date string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  shgName: string; // Self-Help Group name
  category: string;
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'Drop-off Point' | 'Recycler' | 'NGO' | 'SHG' | 'Campaign';
  latitude: number;
  longitude: number;
  address?: string;
}

export interface UserUpcycleIdea {
  id: string;
  itemName: string;
  ideaDescription: string;
  submittedBy?: string; // Optional: name of the user who submitted
  imageUrl?: string; // Optional: Data URL of the uploaded image
}

// Types for Waste Collection Feature
export interface WasteReuseSuggestion {
    suggestion: string;
    videoSearchQuery: string;
}

export interface WasteClassification {
    recyclability: 'recyclable' | 'non-recyclable' | 'unsure';
    reuseSuggestions: WasteReuseSuggestion[];
    recycleChannels: string[];
    donateSuggestions: string[];
}

export interface WasteReport {
  id: string;
  classification: WasteClassification;
  latitude: number;
  longitude: number;
  timestamp: string;
  itemName: string; // Name of the item as described by the user
  quantity: number;
  unit: 'kg' | 'items';
  notes?: string; // Optional notes for collection
}
