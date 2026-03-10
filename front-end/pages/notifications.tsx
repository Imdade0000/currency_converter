import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/hooks/useAuth';
import {
  Notification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/api';

export default function NotificationsPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      toast.error(isFr ? 'Impossible de charger les notifications.' : 'Unable to load notifications.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      setBusyId(id);
      const updated = await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch {
      toast.error(isFr ? 'Echec de la mise à jour.' : 'Failed to update notification.');
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsAsRead();
      const now = new Date().toISOString();
      setNotifications((prev) => prev.map((item) => (item.readAt ? item : { ...item, readAt: now })));
      toast.success(isFr ? 'Toutes les notifications sont marquées comme lues.' : 'All notifications marked as read.');
    } catch {
      toast.error(isFr ? 'Echec de la mise à jour globale.' : 'Failed to mark all notifications as read.');
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading || fetching) return <div className="p-20 text-center">{isFr ? 'Chargement...' : 'Loading...'}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <Head>
        <title>{isFr ? 'Notifications | XChange' : 'Notifications | XChange'}</title>
      </Head>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">{isFr ? 'Notifications' : 'Notifications'}</h1>
          <p className="text-slate-600">
            {isFr
              ? 'Retrouvez ici vos alertes et evenements importants.'
              : 'Find your alerts and important events here.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || markingAll}
          className="btn-secondary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFr ? 'Tout marquer comme lu' : 'Mark all as read'}
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400">
            {isFr ? "Vous n'avez pas encore de notifications." : "You don't have notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card border ${notification.readAt ? 'border-slate-200 bg-white' : 'border-blue-100 bg-blue-50/40'}`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    {new Date(notification.createdAt).toLocaleString(isFr ? 'fr-FR' : 'en-US')}
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">{notification.title}</h2>
                  <p className="text-slate-600 mt-1">{notification.message}</p>
                </div>
                {!notification.readAt && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={busyId === notification.id}
                    className="btn-primary text-sm py-2 px-4 self-start"
                  >
                    {isFr ? 'Marquer comme lu' : 'Mark as read'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
