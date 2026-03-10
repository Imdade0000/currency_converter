import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function Footer() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">XChange</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isFr
                ? 'Votre solution complète pour la conversion de devises en temps réel. Rapide, fiable et précise.'
                : 'Your complete solution for real-time currency conversion. Fast, reliable and accurate.'}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-slate-300">{isFr ? 'Navigation' : 'Navigation'}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? 'Accueil' : 'Home'}</Link></li>
              <li><Link href="/rates" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? 'Taux de change' : 'Exchange rates'}</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="/premium" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? 'Premium' : 'Premium'}</Link></li>
              <li><Link href="/api-docs" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? 'Documentation API' : 'API Docs'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-slate-300">Conversions populaires</h4>
            <ul className="space-y-2">
              <li><Link href="/convertir/dollar-en-franc-cfa" className="text-slate-400 hover:text-white text-sm transition-colors">Dollar → Franc CFA</Link></li>
              <li><Link href="/convertir/euro-en-franc-cfa" className="text-slate-400 hover:text-white text-sm transition-colors">Euro → Franc CFA</Link></li>
              <li><Link href="/convertir/euro-en-naira" className="text-slate-400 hover:text-white text-sm transition-colors">Euro → Naira</Link></li>
              <li><Link href="/convertir/dollar-en-naira" className="text-slate-400 hover:text-white text-sm transition-colors">Dollar → Naira</Link></li>
              <li><Link href="/taux/benin" className="text-slate-400 hover:text-white text-sm transition-colors">Taux au Bénin</Link></li>
              <li><Link href="/taux/nigeria" className="text-slate-400 hover:text-white text-sm transition-colors">Taux au Nigeria</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-slate-300">{isFr ? 'Support' : 'Support'}</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? 'Contact' : 'Contact'}</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">{isFr ? "Conditions d'utilisation" : 'Terms of service'}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-4 text-slate-300">{isFr ? 'Restez informé' : 'Stay updated'}</h4>
            <p className="text-slate-400 text-sm mb-4">{isFr ? 'Recevez les dernières actualités et mises à jour' : 'Get the latest news and updates'}</p>
            <div className="flex">
              <input type="email" placeholder={isFr ? 'Votre email' : 'Your email'} className="flex-1 px-3 py-2 rounded-l-lg bg-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-r-lg hover:from-blue-700 hover:to-indigo-700 transition-all">OK</button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">© {currentYear} XChange. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
          <div className="flex space-x-6">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2H21l-6.592 7.537L22.16 22h-6.068l-4.75-6.203L5.917 22H3.16l7.05-8.054L2 2h6.223l4.293 5.676L18.244 2Zm-1.064 18.17h1.682L7.312 3.735H5.508L17.18 20.17Z" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 22v-8h2.7l.5-3h-3.2V9.2c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V11H7v3h3.2v8h3.3Z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.94 8.5A1.94 1.94 0 1 1 6.94 4.6a1.94 1.94 0 0 1 0 3.88ZM5.3 9.95h3.3V22H5.3V9.95ZM12.1 9.95h3.17v1.64h.05c.44-.84 1.51-1.72 3.1-1.72 3.31 0 3.93 2.18 3.93 5V22h-3.3v-5.74c0-1.37-.03-3.13-1.91-3.13-1.91 0-2.2 1.49-2.2 3.03V22h-3.3V9.95Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
