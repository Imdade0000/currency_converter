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

      <section
        className="pt-24 pb-32 text-white overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/exchange_picture2.jpg')" }}
      >
        {/* Overlay allégé pour mieux voir l'image en arrière-plan */}
        <div className="absolute inset-0 bg-slate-900/40 z-0"></div>
        {/* Suppression des halos lumineux colorés pour un rendu plus propre */}

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

      <section className="py-24 relative bg-slate-50 overflow-hidden">
        {/* Halos de couleur unie (bleu) pour éviter l'effet multicolore */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
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

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-500">
              <div className="absolute inset-0 bg-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <h3 className="text-xl font-bold mb-6 relative z-10">{isFr ? 'Conversions récentes' : 'Recent conversions'}</h3>
              <div className="relative z-10">
                <ConversionHistory />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative bg-[#0B1120] text-white overflow-hidden">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{isFr ? 'Espace développeurs' : 'Developers area'}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">{isFr ? 'Intégrez nos données de taux de change fiables et en temps réel dans vos applications.' : 'Integrate our reliable real-time exchange rates into your applications.'}</p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 text-left font-mono text-blue-300 border border-slate-800 shadow-2xl relative mb-12 hover:border-blue-500 transition-colors duration-300">
            <div className="absolute top-0 left-4 w-12 h-1 bg-blue-500 rounded-b-full"></div>
            <p className="mb-1"><span className="text-slate-500">{isFr ? "// Exemple d'intégration JavaScript" : '// JavaScript integration example'}</span></p>
            <p className="mb-1">const response = await fetch('https://api.xchange.com/api/rates?base=USD', {'{'}</p>
            <p className="mb-1 pl-4">headers: {'{'} 'X-API-Key': 'xc_live_58291...' {'}'}</p>
            <p className="mb-1">{'}'});</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/api-docs" className="px-8 py-4 bg-blue-600 rounded-full font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-center">
              {isFr ? 'Lire la documentation API' : 'Read API documentation'}
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-slate-800/50 backdrop-blur-md rounded-full font-bold text-white border border-slate-700 hover:border-blue-400 hover:text-blue-400 transition-all duration-300 text-center">
              {isFr ? 'Générer une clé API' : 'Generate an API key'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}
