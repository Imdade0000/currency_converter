import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { resetPassword } from '@/services/api';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';

export default function ResetPasswordPage() {
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(isFr ? 'Le mot de passe doit contenir au moins 6 caractères' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(isFr ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }

    if (!token || typeof token !== 'string') {
      toast.error(isFr ? 'Token de réinitialisation invalide' : 'Invalid reset token');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      toast.success(isFr ? 'Mot de passe réinitialisé avec succès !' : 'Password reset successfully!');
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || (isFr ? 'Le lien de réinitialisation est invalide ou a expiré.' : 'Reset link is invalid or expired.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 pt-28">
      <Head>
        <title>{isFr ? 'Réinitialiser le mot de passe | XChange' : 'Reset password | XChange'}</title>
        <meta name="description" content={isFr ? 'Réinitialisez votre mot de passe XChange' : 'Reset your XChange password'} />
      </Head>

      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">{isFr ? 'Réinitialiser le mot de passe' : 'Reset password'}</h1>

          {!token ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔗</div>
              <p className="text-slate-600 mb-2">{isFr ? 'Lien invalide' : 'Invalid link'}</p>
              <p className="text-sm text-slate-400 mb-6">{isFr ? 'Ce lien de réinitialisation est invalide. Veuillez en demander un nouveau.' : 'This reset link is invalid. Please request a new one.'}</p>
              <Link href="/" className="btn-primary inline-block">{isFr ? "Retour à l'accueil" : 'Back to home'}</Link>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-slate-900 font-semibold mb-2">{isFr ? 'Mot de passe réinitialisé !' : 'Password reset!'}</p>
              <p className="text-sm text-slate-500 mb-6">{isFr ? 'Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.' : 'Your password has been updated successfully. You can now sign in.'}</p>
              <Link href="/" className="btn-primary inline-block">{isFr ? 'Se connecter' : 'Sign in'}</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-6">{isFr ? 'Entrez votre nouveau mot de passe ci-dessous.' : 'Enter your new password below.'}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{isFr ? 'Nouveau mot de passe' : 'New password'}</label>
                  <input type="password" required className="input-field" placeholder="********" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{isFr ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
                  <input type="password" required className="input-field" placeholder="********" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? (isFr ? 'Réinitialisation...' : 'Resetting...') : (isFr ? 'Réinitialiser le mot de passe' : 'Reset password')}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
