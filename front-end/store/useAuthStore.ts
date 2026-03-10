import { create } from 'zustand';
import { useAppStore } from './useAppStore';

// Specialized store for authenticating state, re-exporting from useAppStore
export const useAuthStore = () => {
    const { user, token, isAuthenticated, setUser, setToken, logout } = useAppStore();
    return { user, token, isAuthenticated, setUser, setToken, logout };
};
