import Head from 'next/head';
import { useI18n } from '@/i18n/I18nProvider';

export default function PrivacyPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>{isFr ? 'Politique de confidentialite | XChange' : 'Privacy policy | XChange'}</title>
      </Head>
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1>{isFr ? 'Politique de confidentialite' : 'Privacy policy'}</h1>
        <p>
          {isFr
            ? 'Chez XChange, la protection de vos données est notre priorite. Nous ne collectons que les informations strictement necessaires au bon fonctionnement de nos services.'
            : 'At XChange, protecting your data is our priority. We only collect information strictly necessary to run our services.'}
        </p>
        <h2>{isFr ? 'Collecte des données' : 'Data collection'}</h2>
        <p>
          {isFr
            ? "Nous collectons votre email pour la gestion de votre compte et l'envoi des alertes que vous avez configurees."
            : 'We collect your email to manage your account and send alerts you configured.'}
        </p>
        <h2>{isFr ? 'Utilisation des cookies' : 'Cookies usage'}</h2>
        <p>
          {isFr
            ? 'Nous utilisons des cookies techniques pour maintenir votre session active et memoriser vos preferences.'
            : 'We use technical cookies to keep your session active and remember your preferences.'}
        </p>
      </div>
    </div>
  );
}
