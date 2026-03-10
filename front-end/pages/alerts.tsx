import { useState, useEffect, FormEvent } from 'react';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import AlertCard from '@/components/AlertCard';
import { getUserAlerts, createAlert, Alert, getSupportedCurrencies } from '@/services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nProvider';

type AlertFormState = { fromCurrency: string; toCurrency: string; targetRate: string; condition: 'above' | 'below' };

export default function AlertsPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const { user, loading } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<AlertFormState>({ fromCurrency: 'USD', toCurrency: 'EUR', targetRate: '', condition: 'above' });

  const fetchAlerts = async () => {
    try {
      const data = await getUserAlerts();
      setAlerts(data);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { if (user) fetchAlerts(); }, [user]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try { setCurrencies(await getSupportedCurrencies()); }
      catch { setCurrencies(['USD', 'EUR', 'GBP', 'XOF', 'XAF', 'NGN', 'GHS', 'JPY', 'CNY', 'CAD']); }
    };
    fetchCurrencies();
  }, []);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!user.isPremium && alerts.length >= 3) { toast.error(isFr ? 'Limite atteinte. Passez au Premium pour des alertes illimitées !' : 'Limit reached. Upgrade to Premium for unlimited alerts!'); return; }
    if (formData.fromCurrency === formData.toCurrency) { toast.error(isFr ? 'Les devises source et cible doivent être différentes.' : 'Source and target currencies must be different.'); return; }

    try {
      await createAlert({ ...formData, targetRate: parseFloat(formData.targetRate) });
      toast.success(isFr ? 'Alerte créée !' : 'Alert created!');
      setShowForm(false);
      fetchAlerts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || (isFr ? 'Erreur lors de la création' : 'Unable to create alert'));
    }
  };

  if (loading || fetching) return <div className="p-20 text-center">{isFr ? 'Chargement...' : 'Loading...'}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head><title>{isFr ? 'Mes alertes | XChange' : 'My alerts | XChange'}</title></Head>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">{isFr ? 'Mes alertes de taux' : 'My rate alerts'}</h1>
          <p className="text-slate-600">{isFr ? 'Soyez notifié dès que le marché bouge en votre faveur.' : 'Get notified as soon as the market moves in your favor.'}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary mt-4 md:mt-0 flex items-center"><span className="mr-2 text-xl">+</span> {isFr ? 'Nouvelle alerte' : 'New alert'}</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="card mb-12 bg-blue-50 border-blue-100 overflow-hidden">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2">
            <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">{isFr ? 'De' : 'From'}</label><select className="input-field" value={formData.fromCurrency} onChange={e => setFormData({ ...formData, fromCurrency: e.target.value })}>{currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></div>
            <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">{isFr ? 'Vers' : 'To'}</label><select className="input-field" value={formData.toCurrency} onChange={e => setFormData({ ...formData, toCurrency: e.target.value })}>{currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></div>
            <div><label className="block text-xs font-bold uppercase text-slate-500 mb-1">{isFr ? 'Taux cible' : 'Target rate'}</label><input type="number" step="0.0001" className="input-field" value={formData.targetRate} onChange={e => setFormData({ ...formData, targetRate: e.target.value })} placeholder="ex: 0.95" required /></div>
            <div className="flex items-end"><button type="submit" className="btn-primary w-full">{isFr ? "Créer l'alerte" : 'Create alert'}</button></div>
          </form>
        </motion.div>
      )}

      {alerts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 mb-4">{isFr ? "Vous n'avez pas encore d'alertes." : "You don't have alerts yet."}</p>
          {!showForm && <button onClick={() => setShowForm(true)} className="text-blue-600 font-bold hover:underline">{isFr ? 'Créer ma première alerte' : 'Create my first alert'}</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{alerts.map(alert => <AlertCard key={alert.id} alert={alert} onRefresh={fetchAlerts} />)}</div>
      )}

      {!user.isPremium && (
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">{isFr ? 'Augmentez vos chances' : 'Increase your opportunities'}</h3>
            <p className="opacity-90">{isFr ? 'Les utilisateurs gratuits sont limités à 3 alertes. Passez au Premium pour un suivi illimité.' : 'Free users are limited to 3 alerts. Upgrade to Premium for unlimited tracking.'}</p>
          </div>
          <a href="/premium" className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">{isFr ? 'Découvrir le Premium' : 'Discover Premium'}</a>
        </div>
      )}
    </div>
  );
}
