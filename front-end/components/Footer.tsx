import Link from 'next/link';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

export default function Footer() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#07111F] text-white">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-ink">
                <LogoMark />
              </span>
              <span>
                <span className="block text-xl font-display font-bold">XChange</span>
                <span className="text-sm text-slate-400">{isFr ? 'Convertisseur financier moderne' : 'Modern financial converter'}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              {isFr
                ? 'Une solution claire pour convertir, surveiller et intégrer les taux de change en temps réel.'
                : 'A clear solution to convert, monitor and integrate real-time exchange rates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FooterColumn
              title={isFr ? 'Navigation' : 'Navigation'}
              links={[
                { href: '/', label: isFr ? 'Accueil' : 'Home' },
                { href: '/rates', label: isFr ? 'Taux de change' : 'Exchange rates' },
                { href: '/blog', label: 'Blog' },
                { href: '/premium', label: 'Premium' },
                { href: '/api-docs', label: isFr ? 'Documentation API' : 'API Docs' },
              ]}
            />
            <FooterColumn
              title={isFr ? 'Conversions populaires' : 'Popular conversions'}
              links={[
                { href: '/convertir/dollar-en-franc-cfa', label: 'Dollar → Franc CFA' },
                { href: '/convertir/euro-en-franc-cfa', label: 'Euro → Franc CFA' },
                { href: '/convertir/euro-en-naira', label: 'Euro → Naira' },
                { href: '/convertir/dollar-en-naira', label: 'Dollar → Naira' },
              ]}
            />
            <FooterColumn
              title={isFr ? 'Pays' : 'Countries'}
              links={[
                { href: '/taux/benin', label: isFr ? 'Taux au Bénin' : 'Rates in Benin' },
                { href: '/taux/nigeria', label: isFr ? 'Taux au Nigeria' : 'Rates in Nigeria' },
              ]}
            />
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-300">{isFr ? 'Support' : 'Support'}</h4>
              <ul className="space-y-3">
                <FooterLink href="/faq" label="FAQ" />
                <FooterLink href="/contact" label="Contact" />
                <FooterLink href="/privacy" label={isFr ? 'Confidentialité' : 'Privacy'} />
                <FooterLink href="/terms" label={isFr ? "Conditions d'utilisation" : 'Terms of service'} />
              </ul>

              <div className="mt-6">
                <p className="mb-3 text-sm text-slate-400">{isFr ? 'Recevoir les mises à jour' : 'Get updates'}</p>
                <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                  <input
                    type="email"
                    placeholder={isFr ? 'Votre email' : 'Your email'}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button className="bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700">OK</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-slate-800 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">© {currentYear} XChange. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          <div className="flex gap-3">
            <SocialLink href="https://twitter.com" label="Twitter" icon={<TwitterIcon />} />
            <SocialLink href="https://facebook.com" label="Facebook" icon={<FacebookIcon />} />
            <SocialLink href="https://linkedin.com" label="LinkedIn" icon={<LinkedInIcon />} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-300">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <FooterLink key={link.href} href={link.href} label={link.label} />
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm text-slate-400 transition-colors hover:text-cyan-200">
        {label}
      </Link>
    </li>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors hover:border-cyan-300 hover:text-cyan-200"
      aria-label={label}
    >
      {icon}
    </a>
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

function TwitterIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2H21l-6.592 7.537L22.16 22h-6.068l-4.75-6.203L5.917 22H3.16l7.05-8.054L2 2h6.223l4.293 5.676L18.244 2Zm-1.064 18.17h1.682L7.312 3.735H5.508L17.18 20.17Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 22v-8h2.7l.5-3h-3.2V9.2c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V11H7v3h3.2v8h3.3Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.94 8.5A1.94 1.94 0 1 1 6.94 4.6a1.94 1.94 0 0 1 0 3.88ZM5.3 9.95h3.3V22H5.3V9.95ZM12.1 9.95h3.17v1.64h.05c.44-.84 1.51-1.72 3.1-1.72 3.31 0 3.93 2.18 3.93 5V22h-3.3v-5.74c0-1.37-.03-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V22h-3.3V9.95Z" />
    </svg>
  );
}
