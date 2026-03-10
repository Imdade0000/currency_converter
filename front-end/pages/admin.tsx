import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { getAdminStats, AdminStats } from '@/services/api';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';

export default function AdminPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [fetching, setFetching] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error: any) {
        if (error?.response?.status === 403) { setForbidden(true); return; }
        toast.error(isFr ? 'Impossible de charger les statistiques admin' : 'Unable to load admin statistics');
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchStats();
  }, [user, isFr]);

  const chartData = useMemo(() => {
    if (!stats) return [];
    return stats.dailySeries.map((point) => ({ ...point, label: new Date(point.date).toLocaleDateString(isFr ? 'fr-FR' : 'en-US', { day: '2-digit', month: '2-digit' }) }));
  }, [stats, isFr]);

  if (loading || fetching) return <div className="p-20 text-center">{isFr ? 'Chargement...' : 'Loading...'}</div>;
  if (!user) return null;

  if (forbidden) {
    return (
      <div className="container mx-auto px-4 py-12 pt-28">
        <Head><title>Admin | XChange</title></Head>
        <div className="card text-center py-12">
          <h1 className="text-2xl font-bold mb-3">{isFr ? 'Accès refuse' : 'Accèss denied'}</h1>
          <p className="text-slate-600">{isFr ? 'Votre compte ne dispose pas des droits administrateur.' : 'Your account does not have administrator rights.'}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head><title>Admin | XChange</title></Head>

      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">{isFr ? 'Espace admin' : 'Admin area'}</h1>
        <p className="text-slate-600">{isFr ? 'Vue globale du systeme sur les 30 derniers jours.' : 'System overview for the last 30 days.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label={isFr ? 'Utilisateurs inscrits' : 'Registered users'} value={stats.users.total} />
        <StatCard label={isFr ? 'Utilisateurs actifs (30j)' : 'Active users (30d)'} value={stats.users.activeLast30Days} />
        <StatCard label={isFr ? 'Nouveaux utilisateurs (30j)' : 'New users (30d)'} value={stats.users.newLast30Days} />
        <StatCard label={isFr ? 'Utilisateurs premium' : 'Premium users'} value={stats.users.premium} />
        <StatCard label={isFr ? 'Clés API totales' : 'Total API keys'} value={stats.api.totalKeys} />
        <StatCard label={isFr ? 'Clés API actives' : 'Active API keys'} value={stats.api.activeKeys} />
        <StatCard label={isFr ? 'Requêtes API (30j)' : 'API requests (30d)'} value={stats.api.requestsLast30Days} />
      </div>

      <div className="card mt-8">
        <h2 className="text-xl font-bold mb-4">{isFr ? 'Evolution journaliere (30 jours)' : 'Daily trend (30 days)'}</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="signups" stroke="#2563eb" strokeWidth={2} dot={false} name={isFr ? 'Inscriptions' : 'Signups'} />
              <Line type="monotone" dataKey="activeUsers" stroke="#16a34a" strokeWidth={2} dot={false} name={isFr ? 'Actifs' : 'Active users'} />
              <Line type="monotone" dataKey="apiRequests" stroke="#f59e0b" strokeWidth={2} dot={false} name={isFr ? 'Requêtes API' : 'API requests'} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-8 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">{isFr ? 'Top utilisateurs API (30 jours)' : 'Top API users (30 days)'}</h2>
        {stats.topApiUsers.length === 0 ? (
          <p className="text-slate-500">{isFr ? 'Aucune requété API sur la période.' : 'No API request on this period.'}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 pr-4 text-slate-500 font-semibold">{isFr ? 'Rang' : 'Rank'}</th>
                <th className="text-left py-3 pr-4 text-slate-500 font-semibold">{isFr ? 'Utilisateur' : 'User'}</th>
                <th className="text-left py-3 pr-4 text-slate-500 font-semibold">Email</th>
                <th className="text-left py-3 text-slate-500 font-semibold">{isFr ? 'Requêtes API' : 'API requests'}</th>
              </tr>
            </thead>
            <tbody>
              {stats.topApiUsers.map((entry, index) => (
                <tr key={entry.userId} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-semibold text-slate-700">#{index + 1}</td>
                  <td className="py-3 pr-4 text-slate-900">{entry.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{entry.email}</td>
                  <td className="py-3 text-slate-900 font-semibold">{entry.requests.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-8">{isFr ? 'Dernière mise à jour' : 'Last update'}: {new Date(stats.generatedAt).toLocaleString(isFr ? 'fr-FR' : 'en-US')}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return <div className="card"><p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{label}</p><p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p></div>;
}
