import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/i18n/I18nProvider';

interface RateChartProps {
  data: { date: string; rate: number }[];
  fromCurrency: string;
  toCurrency: string;
}

export default function RateChart({ data, fromCurrency, toCurrency }: RateChartProps) {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium">{isFr ? 'Données historiques non disponibles' : 'Historical data unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} minTickGap={30} />
          <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => val.toFixed(2)} />
          <Tooltip />
          <Area type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" name={`${fromCurrency}/${toCurrency}`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
