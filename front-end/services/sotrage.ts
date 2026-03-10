// Utility to handle local storage operations
export const storage = {
    get: (key: string) => {
        if (typeof window === 'undefined') return null;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    },
    set: (key: string, value: any) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { }
    },
    remove: (key: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(key);
    },
};
