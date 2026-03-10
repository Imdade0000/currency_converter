import { motion } from 'framer-motion';
import { createCheckoutSession } from '@/services/api';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPremium?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({ title, price, features, isPremium, onSelect }: PricingCardProps) {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  const handleCheckout = async () => {
    if (!isPremium) return;
    try {
      const { url } = await createCheckoutSession();
      if (url) window.location.href = url;
    } catch {
      toast.error(isFr ? "Erreur lors de l'initialisation du paiement" : 'Unable to initialize payment');
    }
  };

  return (
    <motion.div whileHover={{ y: -10 }} className={`card flex flex-col h-full ${isPremium ? 'border-2 border-blue-500 relative' : ''}`}>
      {isPremium && <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl font-bold text-xs uppercase tracking-wider">{isFr ? 'Le plus populaire' : 'Most popular'}</div>}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <div className="flex items-baseline space-x-1"><span className="text-4xl font-extrabold text-slate-900">{price}</span><span className="text-slate-500">{isFr ? '/ mois' : '/ month'}</span></div>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm"><span className="text-green-500">✓</span><span>{feature}</span></li>
        ))}
      </ul>

      <button onClick={onSelect || handleCheckout} className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${isPremium ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
        {isPremium ? (isFr ? 'Commencer maintenant' : 'Get started') : (isFr ? 'Version actuelle' : 'Current plan')}
      </button>
    </motion.div>
  );
}
