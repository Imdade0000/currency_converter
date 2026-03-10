export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'XOF', 'NGN'];

export const STORAGE_KEYS = {
    USER: 'xc_user',
    TOKEN: 'xc_token',
    HISTORY: 'xc_history_local',
    SETTINGS: 'xc_settings',
};

export const PLANS = [
    {
        id: 'free',
        name: 'Gratuit',
        price: '0$',
        features: ['100 requêtes / jour', 'Max 3 alertes', 'Historique 7 jours'],
    },
    {
        id: 'starter',
        name: 'Starter',
        price: '9$',
        features: ['10 000 requêtes / mois', 'Alertes illimitées', 'Historique 1 mois', 'Zéro publicité'],
        isPremium: true,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '29$',
        features: ['100 000 requêtes / mois', 'Alertes instantanées', 'Aide à l\'intégration', 'Analyse des données'],
        isPremium: true,
    },
];
