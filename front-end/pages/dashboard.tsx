import { useState, useEffect, MouseEvent } from 'react';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import { getApiKeys, generateApiKey, ApiKey, toggle2Fa } from '@/services/api';
import ConversionHistory from '@/components/ConversionHistory';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';

export default function DashboardPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const { user, loading, setUser } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [stats] = useState({ totalConversions: 12, totalAlerts: 2, totalApiKeys: 0 });
  const [toggling2Fa, setToggling2Fa] = useState(false);

  useEffect(() => {
    if (user) fetchApiKeys();
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      setApiKeys(keys);
    } catch { }
  };

  const handleGenerateKey = async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    try {
      await generateApiKey(isFr ? 'Cle par defaut' : 'Default key', 'free');
      toast.success(isFr ? 'Nouvelle clé générée !' : 'New API key generated!');
      fetchApiKeys();
    } catch {
      toast.error(isFr ? 'Erreur lors de la generation' : 'Unable to generate key');
    }
  };

  const handleToggle2Fa = async () => {
    if (!user) return;
    setToggling2Fa(true);
    try {
      const updatedUser = await toggle2Fa(!user.isTwoFactorEnabled);
      setUser(updatedUser);
      toast.success(
        isFr
          ? `2FA ${updatedUser.isTwoFactorEnabled ? 'activé' : 'désactivé'} !`
          : `2FA ${updatedUser.isTwoFactorEnabled ? 'enabled' : 'disabled'}!`
      );
    } catch {
      toast.error(isFr ? 'Erreur lors du changement' : 'Unable to toggle 2FA');
    } finally {
      setToggling2Fa(false);
    }
  };

  if (loading) return <div className="p-20 text-center">{isFr ? 'Chargement...' : 'Loading...'}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 pt-28 pb-20">
      <Head><title>{isFr ? 'Tableau de bord | XChange' : 'Dashboard | XChange'}</title></Head>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 card bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">{isFr ? 'Bonjour' : 'Hello'}, {user?.name}</h1>
            <p className="text-slate-400">{isFr ? 'Gerez vos conversions, vos alertes et vos accès API.' : 'Manage your conversions, alerts and API accèss.'}</p>
          </div>
          <div className="flex space-x-8 mt-8 md:mt-0">
            <StatBox label={isFr ? 'Conversions' : 'Conversions'} value={stats.totalConversions} />
            <StatBox label={isFr ? 'Alertes' : 'Alerts'} value={stats.totalAlerts} />
            <StatBox label="API Keys" value={apiKeys.length} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <section>
            <h2 className="text-2xl font-bold mb-6">{isFr ? 'Mon activite récente' : 'My recent activity'}</h2>
            <div className="card"><ConversionHistory /></div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{isFr ? 'Sécurité' : 'Security'}</h2>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{isFr ? 'Authentification à double facteur' : 'Two-Factor Authentication'}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {isFr
                      ? 'Recevez un code par email pour plus de sécurité.'
                      : 'Receive a code via email for extra security.'}
                  </p>
                </div>
                <button
                  onClick={handleToggle2Fa}
                  disabled={toggling2Fa}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${user.isTwoFactorEnabled
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                >
                  {toggling2Fa
                    ? '...'
                    : user.isTwoFactorEnabled
                      ? (isFr ? 'Désactiver' : 'Disable')
                      : (isFr ? 'Activer' : 'Enable')}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">{isFr ? 'Accès API' : 'API accèss'}</h2>
          <div className="card h-full">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-6">{isFr ? 'Commencez a integrer nos données.' : 'Start integrating our data.'}</p>
                <button type="button" onClick={handleGenerateKey} className="btn-primary w-full">{isFr ? 'Générer une clé API' : 'Generate API key'}</button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">{key.name}</p>
                    <code className="text-sm text-blue-600 block truncate">{key.key}</code>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold uppercase">{key.plan}</span>
                      <span className="text-xs text-slate-500">{key.requestCount} / {key.requestLimit} {isFr ? 'req.' : 'requests'}</span>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={handleGenerateKey} className="w-full py-3 text-blue-600 font-bold text-sm hover:bg-blue-50 rounded-xl transition-colors">+ {isFr ? 'Autre clé' : 'Another key'}</button>
              </div>
            )}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <a href="/api-docs" className="text-slate-500 hover:text-blue-600 flex items-center justify-center space-x-2 text-sm">
                <span>{isFr ? 'Lire la documentation API' : 'Read API documentation'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return <div className="text-center"><div className="text-3xl font-bold">{value}</div><div className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">{label}</div></div>;
}
