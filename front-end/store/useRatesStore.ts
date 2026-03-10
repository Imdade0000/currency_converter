import { create } from 'zustand';

interface RatesState {
    currentRates: Record<string, number>;
    baseCurrency: string;
    lastUpdated: string | null;
    setRates: (rates: Record<string, number>) => void;
    setBase: (base: string) => void;
}

export const useRatesStore = create<RatesState>((set) => ({
    currentRates: {},
    baseCurrency: 'USD',
    lastUpdated: null,
    setRates: (rates) => set({ currentRates: rates, lastUpdated: new Date().toISOString() }),
    setBase: (base) => set({ baseCurrency: base }),
}));
