import { motion } from 'framer-motion';
import { Alert, deleteAlert, toggleAlert } from '@/services/api';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';
import { getCurrencyName } from '@/utils/currencies';

interface AlertCardProps {
  alert: Alert;
  onRefresh: () => void;
}

export default function AlertCard({ alert, onRefresh }: AlertCardProps) {
  const { lang } = useI18n();
  const isFr = lang === 'fr';

  const handleDelete = async () => {
    if (window.confirm(isFr ? 'Voulez-vous vraiment supprimer cette alerte ?' : 'Do you really want to delete this alert?')) {
      try {
        await deleteAlert(alert.id);
        toast.success(isFr ? 'Alerte supprimée' : 'Alert deleted');
        onRefresh();
      } catch {
        toast.error(isFr ? 'Erreur lors de la suppression' : 'Unable to delete alert');
      }
    }
  };

  const handleToggle = async () => {
    try {
      await toggleAlert(alert.id, !alert.active);
      toast.success(alert.active ? (isFr ? 'Alerte désactivée' : 'Alert disabled') : (isFr ? 'Alerte activée' : 'Alert enabled'));
      onRefresh();
    } catch {
      toast.error(isFr ? 'Erreur lors de la mise à jour' : 'Unable to update alert');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`card border-l-4 ${alert.active ? 'border-l-blue-500' : 'border-l-slate-300'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2 mb-1">
            <span className="text-lg font-bold">{getCurrencyName(alert.fromCurrency, isFr)}</span>
            <span className="text-slate-400 hidden md:inline">→</span>
            <span className="text-lg font-bold">{getCurrencyName(alert.toCurrency, isFr)}</span>
          </div>
          <p className="text-slate-600">
            {isFr ? 'Alerte si le taux passe' : 'Alert when rate goes'}
            <span className="font-semibold mx-1">{alert.condition === 'above' ? (isFr ? 'au-dessus de' : 'above') : (isFr ? 'en-dessous de' : 'below')}</span>
            <span className="text-blue-600 font-bold">{alert.targetRate}</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">{isFr ? 'Créée le' : 'Created on'} {new Date(alert.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={handleToggle} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${alert.active ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
            {alert.active ? (isFr ? 'Désactiver' : 'Disable') : (isFr ? 'Activer' : 'Enable')}
          </button>
          <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">✕</button>
        </div>
      </div>
    </motion.div>
  );
}
