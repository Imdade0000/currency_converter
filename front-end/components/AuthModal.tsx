import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAppStore } from '@/store/useAppStore';
import { login, register, forgotPassword, verify2Fa } from '@/services/api';
import toast from 'react-hot-toast';
import { useI18n } from '@/i18n/I18nProvider';

type AuthView = 'login' | 'register' | 'forgot-password' | 'verify-2fa';

export default function AuthModal() {
  const router = useRouter();
  const { lang } = useI18n();
  const isFr = lang === 'fr';
  const { showAuthModal, setShowAuthModal, setUser, setToken } = useAppStore();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [userIdFor2Fa, setUserIdFor2Fa] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.auth === 'login') {
      setView('login');
      setShowAuthModal(true);
    }
  }, [router.isReady, router.query.auth, setShowAuthModal]);

  if (!showAuthModal) return null;

  const resetForm = () => setFormData({ email: '', password: '', name: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (view === 'login') {
        const data = await login(formData.email, formData.password);

        if (data.requires2FA) {
          setUserIdFor2Fa(data.userId || null);
          setView('verify-2fa');
          toast.success(isFr ? 'Code de vérification envoyé !' : 'Verification code sent!');
          return;
        }

        setUser(data.user ?? null);
        setToken(data.token ?? null);
        toast.success(isFr ? 'Bon retour parmi nous !' : 'Welcome back!');
        setShowAuthModal(false);
        const next = typeof router.query.next === 'string' ? router.query.next : '/dashboard';
        router.push(next);
      } else if (view === 'verify-2fa') {
        if (!userIdFor2Fa) return;
        const data = await verify2Fa(userIdFor2Fa, twoFactorCode);
        setUser(data.user);
        setToken(data.token);
        toast.success(isFr ? 'Authentification réussie !' : 'Authentication successful!');
        setShowAuthModal(false);
        const next = typeof router.query.next === 'string' ? router.query.next : '/dashboard';
        router.push(next);
      } else if (view === 'register') {
        const data = await register(formData.email, formData.password, formData.name);
        setUser(data.user);
        setToken(data.token);
        toast.success(isFr ? 'Compte crée avec succès !' : 'Account created successfully!');
        setShowAuthModal(false);
        const next = typeof router.query.next === 'string' ? router.query.next : '/dashboard';
        router.push(next);
      } else {
        await forgotPassword(formData.email);
        toast.success(
          isFr
            ? 'Si un compte existe avec cet email, un lien de réinitialisation a été envoye.'
            : 'If an account exists for this email, a reset link has been sent.',
        );
        resetForm();
        setView('login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || (isFr ? 'Une erreur est survenue' : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const title = view === 'login'
    ? (isFr ? 'Connexion' : 'Sign in')
    : view === 'register'
      ? (isFr ? 'Inscription' : 'Sign up')
      : view === 'verify-2fa'
        ? (isFr ? 'Vérification 2FA' : '2FA Verification')
        : (isFr ? 'Mot de passe oublié' : 'Forgot password');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-display font-bold gradient-text">{title}</h2>
            <button onClick={() => { setShowAuthModal(false); resetForm(); setView('login'); }} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>

          {view === 'forgot-password' && (
            <p className="text-sm text-slate-500 mb-4">
              {isFr
                ? 'Entrez votre adresse email. Si un compte existe, vous recevrez un lien de réinitialisation.'
                : 'Enter your email address. If an account exists, you will receive a reset link.'}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{isFr ? 'Nom complet' : 'Full name'}</label>
                <input type="text" required className="input-field" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input type="email" required className="input-field" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            {view !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{isFr ? 'Mot de passe' : 'Password'}</label>
                <input type="password" required className="input-field" placeholder="********" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            )}

            {view === 'verify-2fa' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {isFr ? 'Code de vérification' : 'Verification Code'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="123456"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {isFr
                    ? 'Entrez le code à 6 chiffres envoyé à votre adresse email.'
                    : 'Enter the 6-digit code sent to your email address.'}
                </p>
              </div>
            )}

            {view === 'login' && (
              <div className="text-right -mt-1">
                <button type="button" onClick={() => { resetForm(); setView('forgot-password'); }} className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  {isFr ? 'Mot de passe oublie ?' : 'Forgot password?'}
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading
                ? (isFr ? 'Chargement...' : 'Loading...')
                : view === 'login'
                  ? (isFr ? 'Se connecter' : 'Sign in')
                  : view === 'register'
                    ? (isFr ? "S'inscrire" : 'Sign up')
                    : view === 'verify-2fa'
                      ? (isFr ? 'Vérifier' : 'Verify')
                      : (isFr ? 'Envoyer le lien' : 'Send reset link')}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {view === 'login' && <button onClick={() => { resetForm(); setView('register'); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">{isFr ? "Pas encore de compte ? S'inscrire" : "No account yet? Sign up"}</button>}
            {view === 'register' && <button onClick={() => { resetForm(); setView('login'); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">{isFr ? 'Deja un compte ? Se connecter' : 'Already have an account? Sign in'}</button>}
            {view === 'forgot-password' && <button onClick={() => { resetForm(); setView('login'); }} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">{isFr ? 'Retour a la connexion' : 'Back to sign in'}</button>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
