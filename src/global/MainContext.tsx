import { createContext } from 'react';

type MainContextType = { 
  onRefresh: () => void; 
  isLoading: boolean;
  currentTime: string;
};
export const MainContext = createContext<MainContextType | null>(null);