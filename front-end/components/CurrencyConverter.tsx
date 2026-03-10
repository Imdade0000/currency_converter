import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { currencies, formatAmount } from '@/utils/currencies';
import { convertCurrency } from '@/services/api';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';

export default function CurrencyConverter() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('XOF');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const isFirstMount = useRef(true);

  const addToHistory = useAppStore((state) => state.addToHistory);

  const handleConvert = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error(isFr ? 'Veuillez entrer un montant valide' : 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await convertCurrency({ from: fromCurrency, to: toCurrency, amount: parseFloat(amount) });
      setResult(response.result);
      setRate(response.rate);
      setLastUpdate(new Date(response.timestamp).toLocaleString(isFr ? 'fr-FR' : 'en-US'));

      addToHistory({
        id: Date.now().toString(),
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        result: response.result,
        rate: response.rate,
        timestamp: response.timestamp
      });

      toast.success(isFr ? 'Conversion réussie !' : 'Conversion successful!');
    } catch {
      toast.error(isFr ? 'Erreur lors de la conversion. Veuillez reessayer.' : 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result) {
      setAmount(result.toString());
      setResult(parseFloat(amount));
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (amount && parseFloat(amount) > 0) {
      const timer = setTimeout(() => { handleConvert(); }, 500);
      return () => clearTimeout(timer);
    }
  }, [fromCurrency, toCurrency]);

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold gradient-text mb-2">{isFr ? 'Convertisseur de devises' : 'Currency converter'}</h2>
        <p className="text-slate-600">{isFr ? 'Convertissez rapidement entre plus de 30 devises mondiales' : 'Convert quickly between more than 30 world currencies'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">{isFr ? 'Montant a convertir' : 'Amount to convert'}</label>
          <div className="space-y-3">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={isFr ? 'Entrez le montant' : 'Enter amount'} className="input-field text-2xl font-bold" min="0" step="0.01" />
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="input-field">
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center md:col-span-2 -my-3">
          <motion.button whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }} onClick={handleSwapCurrencies} className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">⇅</motion.button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">{isFr ? 'Montant converti' : 'Converted amount'}</label>
          <div className="space-y-3">
            <div className="input-field text-2xl font-bold bg-slate-50">{loading ? (isFr ? 'Calcul...' : 'Calculating...') : result !== null ? formatAmount(result, toCurrency) : <span className="text-slate-400">0.00</span>}</div>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="input-field">
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.code} - {currency.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {rate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{isFr ? 'Taux de change' : 'Exchange rate'}</p>
                <p className="text-lg font-bold text-slate-900">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</p>
              </div>
              {lastUpdate && <div className="text-right"><p className="text-xs text-slate-500">{isFr ? 'Mis à jour' : 'Updated'}</p><p className="text-xs text-slate-600">{lastUpdate}</p></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={handleConvert} disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? (isFr ? 'Conversion en cours...' : 'Converting...') : (isFr ? 'Convertir' : 'Convert')}
      </button>
    </div>
  );
}
