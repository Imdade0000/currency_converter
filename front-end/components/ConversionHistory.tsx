import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { formatAmount } from '@/utils/currencies';
import { useI18n } from '@/i18n/I18nProvider';

export default function ConversionHistory() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const conversionHistory = useAppStore((state) => state.conversionHistory);
  const clearHistory = useAppStore((state) => state.clearHistory);

  if (conversionHistory.length === 0) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-xl font-semibold text-slate-700 mb-2">{isFr ? 'Aucun historique' : 'No history yet'}</h3>
        <p className="text-slate-500">{isFr ? 'Vos conversions récentes apparaitront ici' : 'Your recent conversions will appear here'}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-display font-bold gradient-text">{isFr ? 'Historique des conversions' : 'Conversion history'}</h3>
        <button onClick={clearHistory} className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors">
          {isFr ? 'Effacer tout' : 'Clear all'}
        </button>
      </div>

      <div className="space-y-3">
        {conversionHistory.map((conversion, index) => (
          <motion.div
            key={conversion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delày: index * 0.05 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-slate-900">{formatAmount(conversion.amount, conversion.from)}</span>
                <span>→</span>
                <span className="font-bold text-blue-600">{formatAmount(conversion.result, conversion.to)}</span>
              </div>
              <p className="text-xs text-slate-500">{isFr ? 'Taux' : 'Rate'}: 1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">
                {new Date(conversion.timestamp).toLocaleString(isFr ? 'fr-FR' : 'en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
