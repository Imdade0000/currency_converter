import Head from 'next/head';
import { useI18n } from '@/i18n/I18nProvider';

export default function FAQPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  const faqs = isFr
    ? [
        {
          q: 'À quelle fréquence les taux sont-ils mis à jour ?',
          a: 'Pour les utilisateurs gratuits, les taux sont rafraichis toutes les 24 heures. Pour les membres Premium, les mises à jour sont toutes les 10 minutes.',
        },
        {
          q: 'Quelles sont les devises supportées ?',
          a: 'Plus de 160 devises mondiales, incluant les devises majeures (USD, EUR, GBP) et les devises regionales comme XOF, XAF ou NGN.',
        },
        {
          q: "L'API est-elle payante ?",
          a: 'Nous proposons un plan gratuit limite pour les tests et les petits projets. Des plans payants sont disponibles pour une utilisation commerciale intensive.',
        },
      ]
    : [
        {
          q: 'How often are rates updated?',
          a: 'For free users, rates are refreshed every 24 hours. For Premium users, updates are every 10 minutes.',
        },
        {
          q: 'Which currencies are supported?',
          a: 'More than 160 currencies are supported, including major currencies (USD, EUR, GBP) and regional ones like XOF, XAF and NGN.',
        },
        {
          q: 'Is the API paid?',
          a: 'We offer a limited free plan for tests and small projects. Paid plans are available for heavy commercial usage.',
        },
      ];

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>FAQ | XChange</title>
      </Head>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">{isFr ? 'Questions fréquentes' : 'Frequently asked questions'}</h1>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-8">
              <h3 className="text-xl font-bold mb-4">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
