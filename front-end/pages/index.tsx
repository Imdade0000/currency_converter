import Head from 'next/head';
import Link from 'next/link';
import type { ReactNode } from 'react';
import CurrencyConverter from '@/components/CurrencyConverter';
import ConversionHistory from '@/components/ConversionHistory';
import { useI18n } from '@/i18n/I18nProvider';

const featureIcons = {
  speed: (
    <path strokeLinecap="round" strokeLinejoin="round" d="m13 3-8 11h7l-1 7 8-11h-7l1-7Z" />
  ),
  globe: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.45 3.2 5.45 3.2 9s-1 6.55-3.2 9c-2.2-2.45-3.2-5.45-3.2-9S9.8 5.45 12 3Z" />
    </>
  ),
  bell: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h4" />
    </>
  ),
  chart: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m7 15 3-3 3 2 5-7" />
    </>
  ),
};

export default function Home() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  return (
    <>
      <Head>
        <title>{isFr ? 'XChange | Convertisseur de devises ultra-rapide' : 'XChange | Ultra-fast currency converter'}</title>
        <meta name="description" content={isFr ? 'Convertissez vos devises instantanément au meilleur taux.' : 'Convert your currencies instantly at the best rate.'} />
      </Head>

      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat pb-16 pt-16 text-white sm:pb-20 sm:pt-20"
        style={{ backgroundImage: "url('/images/exchange_picture2.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#061120]/80" />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(6,17,32,0.95)_0%,rgba(15,37,68,0.78)_48%,rgba(6,182,212,0.18)_100%)]" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {isFr ? 'Marché actualisé en continu' : 'Continuously updated market'}
              </div>

              <h1 className="max-w-3xl text-4xl font-display font-bold leading-tight sm:text-5xl lg:text-6xl">
                {isFr ? 'Convertissez vos devises avec une lecture claire du marché.' : 'Convert currencies with a clearer read on the market.'}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {isFr
                  ? 'XChange combine conversion instantanée, taux en temps réel, alertes et API pour suivre vos opérations sans friction.'
                  : 'XChange combines instant conversion, live rates, alerts and an API to keep your operations moving.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <StatPill label={isFr ? '160+ devises' : '160+ currencies'} />
                <StatPill label={isFr ? 'Alertes de taux' : 'Rate alerts'} />
                <StatPill label={isFr ? 'API développeurs' : 'Developer API'} />
              </div>
            </div>

            <div className="lg:pt-6">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F8FB] py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">XChange</p>
              <h2 className="mt-3 text-3xl font-display font-bold text-slate-950 sm:text-4xl">
                {isFr ? 'Un outil pensé pour décider vite' : 'Built to help you decide faster'}
              </h2>
            </div>
            <p className="max-w-2xl text-slate-600">
              {isFr
                ? 'Chaque écran privilégie la donnée utile: montant, paire, taux, historique et prochaine action.'
                : 'Every screen keeps useful data close: amount, pair, rate, history and next action.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:col-span-2">
              <FeatureCard icon={featureIcons.speed} title={isFr ? 'Conversion immédiate' : 'Immediate conversion'} description={isFr ? 'Un parcours court pour passer du montant au résultat, sans détour.' : 'A short path from amount to result, with no unnecessary steps.'} accent="blue" />
              <FeatureCard icon={featureIcons.globe} title={isFr ? 'Couverture mondiale' : 'Global coverage'} description={isFr ? 'Plus de 160 devises, dont les paires africaines les plus utilisées.' : 'More than 160 currencies, including widely used African pairs.'} accent="cyan" />
              <FeatureCard icon={featureIcons.bell} title={isFr ? 'Alertes intelligentes' : 'Smart alerts'} description={isFr ? "Soyez prévenu dès qu'une devise atteint votre taux cible." : 'Get notified as soon as a currency reaches your target rate.'} accent="amber" />
              <FeatureCard icon={featureIcons.chart} title={isFr ? 'Lecture du marché' : 'Market reading'} description={isFr ? 'Historique et données visuelles pour suivre les mouvements importants.' : 'History and visual data to track meaningful market moves.'} accent="mint" />
            </div>

            <ConversionHistory />
          </div>
        </div>
      </section>

      <section className="bg-brand-ink py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">{isFr ? 'Espace développeurs' : 'Developer area'}</p>
            <h2 className="mt-4 text-3xl font-display font-bold sm:text-4xl">
              {isFr ? 'Des taux fiables dans vos propres produits' : 'Reliable rates inside your own products'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              {isFr
                ? 'Intégrez des données de change à jour dans vos applications, dashboards et services financiers.'
                : 'Integrate current exchange data into your apps, dashboards and financial services.'}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs font-semibold text-slate-400">xchange-api.js</span>
            </div>
            <div className="p-5 font-mono text-sm leading-7 text-cyan-100 sm:p-7">
              <p className="text-slate-500">{isFr ? '// Exemple d’intégration JavaScript' : '// JavaScript integration example'}</p>
              <p>const response = await fetch('https://api.xchange.com/api/rates?base=USD', {'{'}</p>
              <p className="pl-4">headers: {'{'} 'X-API-Key': 'xc_live_58291...' {'}'}</p>
              <p>{'}'});</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/api-docs" className="btn-primary text-center">
              {isFr ? 'Lire la documentation API' : 'Read API documentation'}
            </Link>
            <Link href="/dashboard" className="rounded-xl border border-slate-700 bg-white/5 px-6 py-3 text-center font-semibold text-white transition-all hover:border-cyan-300 hover:bg-cyan-300/10">
              {isFr ? 'Générer une clé API' : 'Generate an API key'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <span className="stat-pill">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
      {label}
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  accent: 'blue' | 'cyan' | 'amber' | 'mint';
}) {
  const accentClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    mint: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border ${accentClasses[accent]}`}>
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {icon}
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
