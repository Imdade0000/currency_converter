import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Lang, translations } from './translations';

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, fallback?: string) => string;
};

const STORAGE_KEY = 'xchange_lang';

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (nextLang: Lang) => {
    setLangState(nextLang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLang);
    }
  };

  const t = (key: string, fallback?: string) => {
    return translations[lang][key] ?? translations.fr[key] ?? fallback ?? key;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
