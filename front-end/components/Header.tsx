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

  const navLinks = [
    { href: '/', label: t('nav.home'), show: true },
    { href: '/rates', label: t('nav.rates'), show: true },
    { href: '/dashboard', label: t('nav.dashboard'), show: isAuthenticated },
    { href: '/alerts', label: t('nav.alerts'), show: isAuthenticated },
    { href: '/notifications', label: t('nav.notifications'), show: isAuthenticated, badge: unreadNotifications },
    { href: '/admin', label: t('nav.admin'), show: isAuthenticated },
    { href: '/api-docs', label: t('nav.apiDocs'), show: true },
  ].filter((item) => item.show);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.04 }}
              transition={{ duration: 0.2 }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-ink text-white shadow-lg shadow-slate-900/15"
            >
              <LogoMark />
            </motion.div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-slate-950 group-hover:text-blue-700 transition-colors">
                XChange
              </h1>
              <p className="text-xs font-medium text-slate-500">{t('app.tagline')}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-white hover:text-blue-700 hover:shadow-sm"
              >
                {link.label}
                {!!link.badge && link.badge > 0 && <NotificationBadge count={link.badge} />}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                aria-label="language selector"
              >
                <LangSwatch lang={currentLanguage.lang} />
                <span>{currentLanguage.label}</span>
                <ChevronDownIcon />
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-28 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.lang}
                      type="button"
                      onClick={() => {
                        setLang(option.lang);
                        setLanguageMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm ${lang === option.lang ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
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
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    {user?.isPremium && <p className="text-xs font-semibold text-amber-600">{t('nav.premium')}</p>}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-slate-500 transition-colors hover:text-red-600"
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowAuthModal(true)} className="btn-secondary px-4 py-2 text-sm">
                  {t('auth.login')}
                </button>
                <Link href="/premium" className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100">
                  {t('nav.premium')}
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[720px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          <nav className="space-y-1 border-t border-slate-100 pt-4">
            <div className="mb-3 flex items-center gap-2 px-1">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.lang}
                  type="button"
                  onClick={() => setLang(option.lang)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${lang === option.lang ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <LangSwatch lang={option.lang} />
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {navLinks.map((link) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                label={`${link.label}${link.badge && link.badge > 0 ? ` (${link.badge > 99 ? '99+' : link.badge})` : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
            <MobileNavLink href="/premium" label={t('nav.premium')} onClick={() => setMobileMenuOpen(false)} />

            <div className="mt-3 border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-semibold text-red-600"
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
      className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
    >
      {label}
    </Link>
  );
}

function NotificationBadge({ count }: { count: number }) {
  return (
    <span className="flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function LogoMark() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10m0 0-3-3m3 3-3 3M17 17H7m0 0 3 3m-3-3 3-3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
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
      <clipPath id="union-flag-clip">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#union-flag-clip)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
