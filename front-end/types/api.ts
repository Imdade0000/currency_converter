export interface User {
    id: string;
    email: string;
    name: string;
    isPremium: boolean;
    favoriteCurrencies: string; // Stored as JSON string
    createdAt: string;
}

export interface ExchangeRate {
    base: string;
    rates: Record<string, number>;
    timestamp: string;
}

export interface Conversion {
    id: string;
    userId?: string;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    result: number;
    rate: number;
    createdAt: string;
}

export interface Alert {
    id: string;
    userId: string;
    fromCurrency: string;
    toCurrency: string;
    targetRate: number;
    condition: 'above' | 'below';
    active: boolean;
    lastTriggered?: string;
    createdAt: string;
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    plan: string;
    active: boolean;
    requestLimit: number;
    requestCount: number;
    createdAt: string;
}
