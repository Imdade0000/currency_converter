import Head from 'next/head';
import { useI18n } from '@/i18n/I18nProvider';

export default function ContactPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>{isFr ? 'Contactez-nous | XChange' : 'Contact us | XChange'}</title>
      </Head>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">{isFr ? 'Un besoin spécifique ?' : 'Need something specific?'}</h1>
        <p className="text-slate-600 mb-12">
          {isFr
            ? "Notre équipe d'experts fintech est la pour vous accompagner dans l'intégration de nos solutions."
            : 'Our fintech experts can help you integrate our solutions.'}
        </p>

        <div className="card text-left p-10">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Email</label>
              <input type="email" className="input-field" placeholder={isFr ? 'votre@email.com' : 'your@email.com'} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{isFr ? 'Sujet' : 'Subject'}</label>
              <select className="input-field">
                <option>{isFr ? 'Support technique' : 'Technical support'}</option>
                <option>{isFr ? 'Questions commerciales' : 'Business questions'}</option>
                <option>{isFr ? 'Partenariats' : 'Partnerships'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">{isFr ? 'Message' : 'Message'}</label>
              <textarea className="input-field h-32" placeholder={isFr ? 'Dites-nous tout...' : 'Tell us everything...'} />
            </div>
            <button className="btn-primary w-full py-4">{isFr ? 'Envoyer le message' : 'Send message'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
