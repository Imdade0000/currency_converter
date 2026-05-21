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
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <HistoryIcon />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{isFr ? 'Aucun historique' : 'No history yet'}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isFr ? 'Vos conversions récentes apparaîtront ici.' : 'Your recent conversions will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{isFr ? 'Activité' : 'Activity'}</p>
          <h3 className="mt-1 text-xl font-display font-bold text-slate-950">{isFr ? 'Conversions récentes' : 'Recent conversions'}</h3>
        </div>
        <button onClick={clearHistory} className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700">
          {isFr ? 'Effacer' : 'Clear'}
        </button>
      </div>

      <div className="space-y-3">
        {conversionHistory.map((conversion, index) => (
          <motion.div
            key={conversion.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-blue-50/60"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-bold text-slate-950">{formatAmount(conversion.amount, conversion.from)}</span>
                  <ArrowRightIcon />
                  <span className="font-bold text-blue-700">{formatAmount(conversion.result, conversion.to)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {isFr ? 'Taux' : 'Rate'}: 1 {conversion.from} = {conversion.rate.toFixed(4)} {conversion.to}
                </p>
              </div>
              <p className="shrink-0 text-right text-xs text-slate-500">
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

function HistoryIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 0 3-6.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-5-5m5 5-5 5" />
    </svg>
  );
}
