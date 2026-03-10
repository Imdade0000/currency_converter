import Head from 'next/head';
import { useI18n } from '@/i18n/I18nProvider';

export default function TermsPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>{isFr ? 'Conditions generales | XChange' : 'Terms of service | XChange'}</title>
      </Head>
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1>{isFr ? "Conditions generales d'utilisation" : 'Terms of service'}</h1>
        <p>{isFr ? "En utilisant XChange, vous acceptez nos conditions d'utilisation." : 'By using XChange, you agree to our terms of service.'}</p>
        <h2>{isFr ? "Utilisation de l'API" : 'API usage'}</h2>
        <p>
          {isFr
            ? "L'usage intensif de notre API sans clé valide ou au-delà des quotas autorises pourra entrainer une suspension temporaire ou definitive de votre accès."
            : 'Heavy API usage without a valid key or beyond allowed quotas may result in temporary or permanent suspension of accèss.'}
        </p>
        <h2>{isFr ? 'Precision des données' : 'Data accuracy'}</h2>
        <p>
          {isFr
            ? 'Bien que nous nous efforcions de fournir les taux les plus précis possibles, ces données sont fournies a titre indicatif et ne doivent pas être utilisees pour des transactions financieres critiques sans verification externe.'
            : 'Although we strive to provide accurate rates, this data is indicative and should not be used for critical financial transactions without external verification.'}
        </p>
      </div>
    </div>
  );
}
