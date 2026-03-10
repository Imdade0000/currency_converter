import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ConversionRequest {
  from: string;
  to: string;
  amount: number;
}

export interface ConversionResponse {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

export interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface Alert {
  id: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  targetRate: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: string;
}

export interface CreateAlertRequest {
  fromCurrency: string;
  toCurrency: string;
  targetRate: number;
  condition: 'above' | 'below';
}

export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  isTwoFactorEnabled: boolean;
  favoriteCurrencies?: string[];
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  plan: string;
  requestLimit: number;
  requestCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  metadata: string | null;
  createdAt: string;
}

export interface WaitingListEntry {
  id: string;
  email: string;
  createdAt: string;
}

export interface AdminStats {
  generatedAt: string;
  period: {
    activeUserWindowDays: number;
  };
  users: {
    total: number;
    activeLast30Days: number;
    newLast30Days: number;
    premium: number;
  };
  api: {
    totalKeys: number;
    activeKeys: number;
    requestsLast30Days: number;
  };
  dailySeries: Array<{
    date: string;
    signups: number;
    activeUsers: number;
    apiRequests: number;
  }>;
  topApiUsers: Array<{
    userId: string;
    name: string;
    email: string;
    requests: number;
  }>;
}

// API Publique (Phase 1)
export const convertCurrency = async (data: ConversionRequest): Promise<ConversionResponse> => {
  const response = await apiClient.post('/conversion/convert', data);
  return response.data;
};

export const getExchangeRates = async (base: string = 'USD'): Promise<ExchangeRate> => {
  const response = await apiClient.get(`/rates?base=${base}`);
  return response.data;
};

export const getHistoricalRates = async (
  from: string,
  to: string,
  days: number = 30
): Promise<HistoricalRate[]> => {
  const response = await apiClient.get(`/rates/historical?from=${from}&to=${to}&days=${days}`);
  return response.data;
};

export const getSupportedCurrencies = async (): Promise<string[]> => {
  const response = await apiClient.get('/rates/currencies');
  return response.data;
};

export const joinWaitingList = async (email: string): Promise<WaitingListEntry> => {
  const response = await apiClient.post('/waiting-list', { email });
  return response.data;
};

// Authentification (Phase 2)
export const register = async (email: string, password: string, name: string): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post('/auth/register', { email, password, name });
  return response.data;
};

export const login = async (
  email: string,
  password: string
): Promise<{ token?: string; user?: User; requires2FA?: boolean; userId?: string; message?: string }> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const verify2Fa = async (userId: string, code: string): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post('/auth/verify-2fa', { userId, code });
  return response.data;
};

export const toggle2Fa = async (enable: boolean): Promise<User> => {
  const response = await apiClient.post('/auth/toggle-2fa', { enable });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

// Alertes (Phase 2)
export const createAlert = async (alert: CreateAlertRequest): Promise<Alert> => {
  const response = await apiClient.post('/alerts', alert);
  return response.data;
};

export const getUserAlerts = async (): Promise<Alert[]> => {
  const response = await apiClient.get('/alerts');
  return response.data;
};

export const deleteAlert = async (alertId: string): Promise<void> => {
  await apiClient.delete(`/alerts/${alertId}`);
};

export const toggleAlert = async (alertId: string, active: boolean): Promise<Alert> => {
  const response = await apiClient.patch(`/alerts/${alertId}`, { active });
  return response.data;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const getUnreadNotificationsCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get('/notifications/unread-count');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await apiClient.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{ updated: number }> => {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data;
};

// Favoris (Phase 2)
export const updateFavoriteCurrencies = async (currencies: string[]): Promise<User> => {
  const response = await apiClient.patch('/users/favorites', { currencies });
  return response.data;
};

// Abonnement Premium (Phase 2)
export const createCheckoutSession = async (): Promise<{ sessionId: string; url: string }> => {
  const response = await apiClient.post('/subscription/create-checkout');
  return response.data;
};

export const cancelSubscription = async (): Promise<void> => {
  await apiClient.post('/subscription/cancel');
};

// API Keys (Phase 3)
export const generateApiKey = async (name: string, plan: string): Promise<{ apiKey: string }> => {
  const response = await apiClient.post('/api-keys/generate', { name, plan });
  return response.data;
};

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const response = await apiClient.get('/api-keys');
  return response.data;
};

export const revokeApiKey = async (keyId: string): Promise<void> => {
  await apiClient.delete(`/api-keys/${keyId}`);
};

export const getApiUsageStats = async (keyId: string): Promise<any> => {
  const response = await apiClient.get(`/api-keys/${keyId}/usage`);
  return response.data;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

export default apiClient;
