import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getExchangeRates, getSupportedCurrencies } from '@/services/api';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nProvider';
import { getCurrencyName } from '@/utils/currencies';

export default function RatesPage() {
  const { lang, t } = useI18n();
  const isFr = lang === 'fr';
  const [rates, setRates] = useState<Record<string, number>>({});
  const [base, setBase] = useState('USD');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => { fetchData(); }, [base]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ratesData, codes] = await Promise.all([getExchangeRates(base), getSupportedCurrencies()]);
      setRates(ratesData.rates);
      setCurrencies(codes);
      setLastUpdate(new Date(ratesData.timestamp).toLocaleString(isFr ? 'fr-FR' : 'en-US'));
    } finally {
      setLoading(false);
    }
  };

  const filteredRates = Object.entries(rates)
    .filter(([currency]) => currency.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>{t('rates.pageTitle')}</title>
        <meta name="description" content={t('rates.pageDescription')} />
      </Head>

      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-3">{t('rates.title')}</h1>
            <p className="text-slate-600 max-w-2xl">{t('rates.intro')}</p>
            {lastUpdate && <p className="text-xs text-slate-400 mt-2">{t('rates.lastUpdate')} {lastUpdate}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-64">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">{t('rates.search')}</label>
              <input className="input-field" placeholder={t('rates.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">{t('rates.baseCurrency')}</label>
              <select className="input-field" value={base} onChange={e => setBase(e.target.value)}>
                {currencies.slice(0, 30).map(c => <option key={c} value={c}>{getCurrencyName(c, isFr)}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-slate-700"><strong>{t('rates.howToReadTitle')}</strong> {t('rates.howToReadBody')} <strong>1 {base}</strong>.</p>
        <Link href="/" className="btn-primary text-sm py-2 px-4 whitespace-nowrap">{t('rates.convert')} →</Link>
      </div>

      {loading ? (
        <div className="py-20 text-center"><p className="text-slate-500">{t('rates.loading')}</p></div>
      ) : filteredRates.length === 0 ? (
        <div className="py-20 text-center"><p className="text-slate-500">{t('rates.noResult')} "{search}"</p></div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-4">
            {filteredRates.length} {filteredRates.length > 1 ? t('rates.found.many') : t('rates.found.one')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRates.map(([currency, rate]) => (
              <motion.div key={currency} whileHover={{ scale: 1.02 }} className="card p-5 bg-white flex justify-between items-center group cursor-default">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">1 {base} =</span>
                  <span className="text-sm font-bold text-slate-900">{getCurrencyName(currency, isFr)}</span>
                </div>
                <div className="text-xl font-display font-bold text-blue-600">{rate.toLocaleString(isFr ? 'fr-FR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
