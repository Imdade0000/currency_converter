import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { currencies, formatAmount, getCurrencyByCode } from '@/utils/currencies';
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
  const fromCurrencyData = getCurrencyByCode(fromCurrency);
  const toCurrencyData = getCurrencyByCode(toCurrency);

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
      toast.error(isFr ? 'Erreur lors de la conversion. Veuillez réessayer.' : 'Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    const previousAmount = amount;
    const previousResult = result;

    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (previousResult !== null) {
      setAmount(previousResult.toString());
      setResult(previousAmount ? parseFloat(previousAmount) : null);
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
    <div className="surface-panel max-w-4xl mx-auto overflow-hidden">
      <div className="border-b border-slate-100 bg-white/80 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {isFr ? 'Taux en direct' : 'Live rates'}
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-950 sm:text-3xl">
              {isFr ? 'Convertisseur de devises' : 'Currency converter'}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {isFr
                ? 'Comparez vos devises clés en quelques secondes, avec un résultat lisible et prêt à utiliser.'
                : 'Compare key currencies in seconds, with a clear result ready to use.'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{isFr ? 'Paire active' : 'Active pair'}</p>
            <p className="mt-1 font-mono text-blue-700">{fromCurrency}/{toCurrency}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <CurrencyPanel
            label={isFr ? 'Vous envoyez' : 'You send'}
            amountLabel={isFr ? 'Montant à convertir' : 'Amount to convert'}
            amount={amount}
            onAmountChange={setAmount}
            currency={fromCurrency}
            onCurrencyChange={setFromCurrency}
            placeholder={isFr ? 'Entrez le montant' : 'Enter amount'}
            symbol={fromCurrencyData?.symbol || fromCurrency}
            currencyLabel={isFr ? 'Devise source' : 'Source currency'}
            editable
          />

          <div className="flex justify-center lg:pb-8">
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleSwapCurrencies}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-md transition-colors hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              aria-label={isFr ? 'Inverser les devises' : 'Swap currencies'}
            >
              <SwapIcon />
            </motion.button>
          </div>

          <CurrencyPanel
            label={isFr ? 'Vous recevez' : 'You receive'}
            amountLabel={isFr ? 'Montant converti' : 'Converted amount'}
            amount={loading ? (isFr ? 'Calcul...' : 'Calculating...') : result !== null ? formatAmount(result, toCurrency) : '0.00'}
            currency={toCurrency}
            onCurrencyChange={setToCurrency}
            symbol={toCurrencyData?.symbol || toCurrency}
            currencyLabel={isFr ? 'Devise cible' : 'Target currency'}
            editable={false}
            highlighted
          />
        </div>

        <AnimatePresence>
          {rate && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
                    {isFr ? 'Taux de change' : 'Exchange rate'}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-950">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </p>
                </div>
                {lastUpdate && (
                  <div className="rounded-xl bg-white px-3 py-2 text-left shadow-sm sm:text-right">
                    <p className="text-xs text-slate-500">{isFr ? 'Mis à jour' : 'Updated'}</p>
                    <p className="text-xs font-semibold text-slate-700">{lastUpdate}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={handleConvert} disabled={loading} className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? (isFr ? 'Conversion en cours...' : 'Converting...') : (isFr ? 'Convertir maintenant' : 'Convert now')}
        </button>
      </div>
    </div>
  );
}

interface CurrencyPanelProps {
  label: string;
  amountLabel: string;
  amount: string;
  currency: string;
  onCurrencyChange: (value: string) => void;
  symbol: string;
  currencyLabel: string;
  editable: boolean;
  highlighted?: boolean;
  placeholder?: string;
  onAmountChange?: (value: string) => void;
}

function CurrencyPanel({
  label,
  amountLabel,
  amount,
  currency,
  onCurrencyChange,
  symbol,
  currencyLabel,
  editable,
  highlighted = false,
  placeholder,
  onAmountChange,
}: CurrencyPanelProps) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${highlighted ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-200 bg-slate-50/80'}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${highlighted ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
          {currency}
        </span>
      </div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">{amountLabel}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
          {symbol}
        </span>
        {editable ? (
          <input
            type="number"
            value={amount}
            onChange={(event) => onAmountChange?.(event.target.value)}
            placeholder={placeholder}
            className="input-field h-14 pl-14 text-xl font-bold sm:text-2xl"
            min="0"
            step="0.01"
          />
        ) : (
          <div className="flex h-14 items-center rounded-xl border border-emerald-200 bg-white px-4 pl-14 text-xl font-bold text-slate-950 shadow-sm sm:text-2xl">
            <span className="truncate">{amount}</span>
          </div>
        )}
      </div>

      <label className="mb-2 mt-4 block text-sm font-semibold text-slate-700">{currencyLabel}</label>
      <select value={currency} onChange={(event) => onCurrencyChange(event.target.value)} className="input-field">
        {currencies.map((item) => (
          <option key={item.code} value={item.code}>{item.code} - {item.name}</option>
        ))}
      </select>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h11m0 0-3-3m3 3-3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17H6m0 0 3 3m-3-3 3-3" />
    </svg>
  );
}
