import Head from 'next/head';
import Link from 'next/link';
import CurrencyConverter from '@/components/CurrencyConverter';
import ConversionHistory from '@/components/ConversionHistory';
import { useI18n } from '@/i18n/I18nProvider';

export default function Home() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  return (
    <>
      <Head>
        <title>{isFr ? 'XChange | Convertisseur de devises ultra-rapide' : 'XChange | Ultra-fast currency converter'}</title>
        <meta name="description" content={isFr ? 'Convertissez vos devises instantanement au meilleur taux.' : 'Convert your currencies instantly at the best rate.'} />
      </Head>

      <section className="pt-20 pb-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500 rounded-full filter blur-[120px] animate-pulse" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in-up">
            {isFr ? 'Le monde change,' : 'The world changes,'} <br />
            <span className="text-blue-400">{isFr ? 'votre argent aussi.' : 'your money too.'}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {isFr ? 'Convertissez instantanément plus de 160 devises avec des taux mis à jour en temps réel.' : 'Instantly convert more than 160 currencies with live updated rates.'}
          </p>

          <div className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CurrencyConverter />
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <span className="w-10 h-1 bg-blue-600 mr-4 rounded-full" />
                {isFr ? 'Pourquoi choisir XChange ?' : 'Why choose XChange?'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard icon="⚡" title={isFr ? 'Flash-Update' : 'Flash update'} description={isFr ? 'Des taux rafraîchis toutes les 10 minutes pour une précision maximale.' : 'Rates refreshed every 10 minutes for maximum accuracy.'} />
                <FeatureCard icon="🌍" title={isFr ? 'Couverture mondiale' : 'Global coverage'} description={isFr ? 'Accédez aux devises de 170 pays incluant les paires africaines majeures.' : 'Access currencies from 170 countries including major African pairs.'} />
                <FeatureCard icon="🔔" title={isFr ? 'Alertes intelligentes' : 'Smart alerts'} description={isFr ? "Soyez notifié dès qu'une devise atteint votre taux cible." : 'Get notified as soon as a currency reaches your target rate.'} />
                <FeatureCard icon="📊" title={isFr ? 'Analyses avancées' : 'Advanced analytics'} description={isFr ? 'Historique complet et graphiques interactifs pour anticiper le marché.' : 'Full history and interactive charts to anticipate market moves.'} />
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6">{isFr ? 'Conversions récentes' : 'Recent conversions'}</h3>
              <ConversionHistory />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{isFr ? 'Espace développeurs' : 'Developers area'}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{isFr ? 'Intégrez nos données de taux de change fiables et en temps réel dans vos applications.' : 'Integrate our reliable real-time exchange rates into your applications.'}</p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-800 rounded-2xl p-4 text-left font-mono text-blue-300 relative mb-8">
            <p className="mb-1"><span className="text-slate-500">{isFr ? "// Exemple d'intégration JavaScript" : '// JavaScript integration example'}</span></p>
            <p className="mb-1">const response = await fetch('https://api.xchange.com/api/rates?base=USD', {'{'}</p>
            <p className="mb-1 pl-4">headers: {'{'} 'X-API-Key': 'xc_live_58291...' {'}'}</p>
            <p className="mb-1">{'}'});</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/api-docs" className="btn-primary text-center">{isFr ? 'Lire la documentation API' : 'Read API documentation'}</Link>
            <Link href="/dashboard" className="btn-secondary bg-transparent border-slate-600 text-white hover:border-blue-400 hover:text-blue-400 text-center">{isFr ? 'Générer une clé API' : 'Generate an API key'}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
