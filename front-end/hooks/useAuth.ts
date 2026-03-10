import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppStore } from '@/store/useAppStore';
import { getCurrentUser } from '@/services/api';

export function useAuth(requireAuth: boolean = true) {
    const { user, token, hasHydrated, setUser, logout } = useAppStore();
    const router = useRouter();
    const [isRestoringSession, setIsRestoringSession] = useState(false);
    const loading = !hasHydrated || isRestoringSession;

    useEffect(() => {
        const restoreSession = async () => {
            if (!hasHydrated || user || !token) {
                return;
            }

            try {
                setIsRestoringSession(true);
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                logout();
            } finally {
                setIsRestoringSession(false);
            }
        };

        restoreSession();
    }, [hasHydrated, user, token, setUser, logout]);

    useEffect(() => {
        if (!loading && requireAuth && !user) {
            const nextPath = typeof router.asPath === 'string' ? router.asPath : '/dashboard';
            router.push({
                pathname: '/',
                query: {
                    auth: 'login',
                    next: nextPath,
                },
            });
        }
    }, [user, loading, requireAuth, router]);

    return { user, loading, isAuthenticated: !!user, setUser };
}
