import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useI18n } from '@/i18n/I18nProvider';
import { Lang } from '@/i18n/translations';
import { motion } from 'framer-motion';
import { getUnreadNotificationsCount } from '@/services/api';

const LANGUAGE_OPTIONS: Array<{ lang: Lang; label: string }> = [
  { lang: 'fr', label: 'FR' },
  { lang: 'en', label: 'EN' },
];

export default function Header() {
  const { user, isAuthenticated, logout, setShowAuthModal } = useAppStore();
  const { lang, setLang, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const currentLanguage = LANGUAGE_OPTIONS.find((option) => option.lang === lang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadNotifications(0);
      return;
    }

    let mounted = true;

    const fetchUnread = async () => {
      try {
        const data = await getUnreadNotificationsCount();
        if (mounted) setUnreadNotifications(data.count);
      } catch {
        if (mounted) setUnreadNotifications(0);
      }
    };

    fetchUnread();
    const interval = window.setInterval(fetchUnread, 60000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [isAuthenticated]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-xl font-display font-bold gradient-text group-hover:scale-105 transition-transform">
                XChange
              </h1>
              <p className="text-xs text-slate-500">{t('app.tagline')}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/rates" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              {t('nav.rates')}
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  {t('nav.dashboard')}
                </Link>
                <Link href="/alerts" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  {t('nav.alerts')}
                </Link>
                <Link href="/notifications" className="text-slate-700 hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-2">
                  {t('nav.notifications')}
                  {unreadNotifications > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </Link>
                <Link href="/admin" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  {t('nav.admin')}
                </Link>
              </>
            )}
            <Link href="/api-docs" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              {t('nav.apiDocs')}
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="language selector"
              >
                <LangSwatch lang={currentLanguage.lang} />
                <span className="text-xs font-semibold">{currentLanguage.label}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 rounded-lg border border-slate-200 bg-white shadow-lg p-1 z-50">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.lang}
                      type="button"
                      onClick={() => {
                        setLang(option.lang);
                        setLanguageMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm ${lang === option.lang ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <LangSwatch lang={option.lang} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    {user?.isPremium && (
                      <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">
                        {t('nav.premium')}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-slate-600 hover:text-red-600 font-medium transition-colors"
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  {t('auth.login')}
                </button>
                <Link
                  href="/premium"
                  className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  {t('nav.premium')}
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                    {t('app.soon')}
                  </span>
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="pt-4 pb-2 space-y-1 border-t border-slate-100">
            <div className="flex items-center gap-2 px-3 mb-2">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.lang}
                  type="button"
                  onClick={() => setLang(option.lang)}
                  className={`px-2 py-1 rounded text-xs border ${lang === option.lang ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200'}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <LangSwatch lang={option.lang} />
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            <MobileNavLink href="/" label={t('nav.home')} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/rates" label={t('nav.rates')} onClick={() => setMobileMenuOpen(false)} />
            {isAuthenticated && (
              <>
                <MobileNavLink href="/dashboard" label={t('nav.dashboard')} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink href="/alerts" label={t('nav.alerts')} onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink
                  href="/notifications"
                  label={`${t('nav.notifications')}${unreadNotifications > 0 ? ` (${unreadNotifications > 99 ? '99+' : unreadNotifications})` : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <MobileNavLink href="/admin" label={t('nav.admin')} onClick={() => setMobileMenuOpen(false)} />
              </>
            )}
            <MobileNavLink href="/api-docs" label={t('nav.apiDocsMobile')} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink href="/premium" label={t('nav.premium')} onClick={() => setMobileMenuOpen(false)} />

            <div className="pt-3 border-t border-slate-100 mt-2">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm text-red-600 font-medium"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full text-sm"
                >
                  {t('auth.loginSignup')}
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors text-sm"
    >
      {label}
    </Link>
  );
}

function LangSwatch({ lang }: { lang: Lang }) {
  if (lang === 'fr') {
    return (
      <svg viewBox="0 0 3 2" className="inline-block h-3.5 w-5 rounded-sm border border-slate-200" aria-hidden="true">
        <rect width="1" height="2" x="0" y="0" fill="#1f4db8" />
        <rect width="1" height="2" x="1" y="0" fill="#ffffff" />
        <rect width="1" height="2" x="2" y="0" fill="#d62839" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 30" className="inline-block h-3.5 w-5 rounded-sm border border-slate-200" aria-hidden="true">
      <clipPath id="t">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

