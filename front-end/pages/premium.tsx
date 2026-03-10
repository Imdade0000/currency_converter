import { FormEvent, useMemo, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { joinWaitingList } from '@/services/api';
import { useI18n } from '@/i18n/I18nProvider';

export default function PremiumPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const premiumFeatures = isFr
    ? ['Alertes de taux en temps réel', 'Graphiques historiques avancés', 'Devises favorites illimitées', 'Expérience sans publicité']
    : ['Real-time rate alerts', 'Advanced historical charts', 'Unlimited favorite currencies', 'Ad-free experience'];

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail), [normalizedEmail]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail) {
      toast.error(isFr ? 'Veuillez entrer une adresse email valide' : 'Please enter a valid email address');
      return;
    }

    if (!acceptedPolicy) {
      toast.error(isFr ? 'Veuillez accepter de recevoir les mises à jour pour continuer' : 'Please accept updates to continue');
      return;
    }

    try {
      setSubmitting(true);
      await joinWaitingList(normalizedEmail);
      toast.success(isFr ? "Vous êtes inscrit sur la liste d'attente !" : "You're on the waitlist!");
      setEmail('');
      setAcceptedPolicy(false);
    } catch (error: any) {
      const statusCode = error?.response?.status;
      if (statusCode === 409) {
        toast.error(isFr ? "Cet email est déjà sur la liste d'attente" : 'This email is already on the waitlist');
        return;
      }
      toast.error(isFr ? 'Impossible de vous inscrire pour le moment. Veuillez réessayer.' : 'Unable to register right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 pt-28">
      <Head>
        <title>{isFr ? 'Premium bientôt disponible | XChange' : 'Premium coming soon | XChange'}</title>
        <meta name="description" content={isFr ? "XChange Premium arrive bientôt. Rejoignez la liste d'attente." : 'XChange Premium is coming soon. Join the waitlist.'} />
      </Head>

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          {isFr ? 'Bientôt disponible' : 'Coming soon'}
        </span>

        <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold text-slate-900">
          {isFr ? 'XChange Premium arrive bientôt' : 'XChange Premium is coming soon'}
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          {isFr
            ? "Alertes, analyses approfondies et outils puissants sont en préparation. Rejoignez la liste d'attente et soyez notifié en premier."
            : 'Alerts, advanced analytics and powerful tools are on the way. Join the waitlist and be notified first.'}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {premiumFeatures.map((feature) => (
            <div key={feature} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {feature}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={isFr ? 'vous@email.com' : 'you@email.com'}
              className="input-field flex-1"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary md:min-w-[160px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (isFr ? 'Envoi en cours...' : 'Sending...') : (isFr ? 'Me notifier' : 'Notify me')}
            </button>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={acceptedPolicy}
              onChange={(event) => setAcceptedPolicy(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300"
            />
            <span>
              {isFr
                ? "J'accepte de recevoir les mises à jour par email. Pas de spam, désinscription possible à tout moment."
                : 'I agree to receive email updates. No spam, unsubscribe anytime.'}
            </span>
          </label>
        </form>
      </div>
    </div>
  );
}
