import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/services/api';

interface ConversionHistory {
  id: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

interface AppState {
  // Authentification
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  
  // Conversion
  conversionHistory: ConversionHistory[];
  
  // UI
  showAuthModal: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
  addToHistory: (conversion: ConversionHistory) => void;
  clearHistory: () => void;
  setShowAuthModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      conversionHistory: [],
      showAuthModal: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ token });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),

      addToHistory: (conversion) =>
        set((state) => ({
          conversionHistory: [conversion, ...state.conversionHistory].slice(0, 10),
        })),

      clearHistory: () => set({ conversionHistory: [] }),

      setShowAuthModal: (show) => set({ showAuthModal: show }),
    }),
    {
      name: 'currency-converter-storage',
      partialize: (state) => ({
        conversionHistory: state.conversionHistory,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
