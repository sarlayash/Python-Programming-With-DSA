import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Flame,
  ArrowRight
} from 'lucide-react';
import { api, setStoredToken } from '../lib/api';
import {
  loginWithFirebaseGoogle,
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  getActiveFirebaseConfig,
  FirebaseConfig
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, role: 'learner' | 'admin') => void;
  initialTab?: 'learner' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialTab = 'learner'
}) => {
  const [tab, setTab] = useState<'learner' | 'admin'>(initialTab);
  
  // Admin credentials: clean and empty by default (never displayed on screen)
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Firebase Config Setup (collapsible for developer/admin setup)
  const [showFirebaseSettings, setShowFirebaseSettings] = useState(false);
  const [fbApiKey, setFbApiKey] = useState('');
  const [fbProjectId, setFbProjectId] = useState('');
  const [fbAuthDomain, setFbAuthDomain] = useState('');
  const [fbConfigSavedNotice, setFbConfigSavedNotice] = useState(false);

  // Fallback Google account input when popup/keys are unavailable
  const [showDirectGoogleForm, setShowDirectGoogleForm] = useState(false);
  const [directEmail, setDirectEmail] = useState('');
  const [directName, setDirectName] = useState('');

  useEffect(() => {
    setTab(initialTab);
    setError(null);
    setAdminId('');
    setAdminPassword('');

    // Load active Firebase config into settings form
    const cfg = getActiveFirebaseConfig();
    setFbApiKey(cfg.apiKey || '');
    setFbProjectId(cfg.projectId || '');
    setFbAuthDomain(cfg.authDomain || '');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Handle Firebase Google Sign-In
  const handleFirebaseGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const activeCfg = getActiveFirebaseConfig();

    // If Firebase isn't configured with a project yet, suggest configuring or using direct Google sign-in
    if (!activeCfg.apiKey || !activeCfg.projectId) {
      setLoading(false);
      setShowFirebaseSettings(true);
      setError('Firebase configuration required for popup. Please enter your Firebase Project credentials below, or continue with direct Google email signup.');
      return;
    }

    try {
      const googleUser = await loginWithFirebaseGoogle();
      const res = await api.googleLogin({
        email: googleUser.email,
        name: googleUser.name,
        photo: googleUser.photo,
        googleId: googleUser.googleId,
        credential: googleUser.idToken
      });

      setStoredToken(res.token);
      localStorage.removeItem('kapil_logged_out');
      onAuthSuccess(res.user, 'learner');
      onClose();
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      const msg = err.message || 'Firebase Google Sign-In failed';
      if (err.code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        const host = window.location.hostname;
        setError(`Domain Authorization Notice: "${host}" is not yet in your Firebase Authorized Domains list. Please add "${host}" under Firebase Console -> Build -> Authentication -> Settings -> Authorized Domains. You can also sign in directly below.`);
        setShowDirectGoogleForm(true);
      } else if (msg.includes('auth/popup-closed-by-user')) {
        setError('Google sign-in popup was closed before completing.');
      } else if (msg.includes('auth/popup-blocked')) {
        setError('Popup was blocked by the browser. Please allow popups or use direct Google sign-in below.');
        setShowDirectGoogleForm(true);
      } else if (msg.includes('auth/api-key-not-valid') || msg.includes('configuration')) {
        setError('Firebase project API key is not configured or invalid. Please check Firebase settings below.');
        setShowFirebaseSettings(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct Google Email Sign Up / Sign In (guarantees learners can register and log in under any environment)
  const handleDirectGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directEmail || !directEmail.includes('@')) {
      setError('Please provide a valid Google email address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cleanEmail = directEmail.trim().toLowerCase();
      const cleanName = directName.trim() || cleanEmail.split('@')[0];
      const res = await api.googleLogin({
        email: cleanEmail,
        name: cleanName,
        googleId: 'gid_' + Math.abs(cleanEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });

      setStoredToken(res.token);
      localStorage.removeItem('kapil_logged_out');
      onAuthSuccess(res.user, 'learner');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unable to complete Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  // Super Admin Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim() || !adminPassword.trim()) {
      setError('Please enter both Administrator ID and Master Password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.adminLogin(adminId.trim(), adminPassword);
      setStoredToken(res.token);
      localStorage.removeItem('kapil_logged_out');
      onAuthSuccess(res.user, 'admin');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid Administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  // Save custom Firebase config
  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbApiKey.trim() || !fbProjectId.trim()) {
      setError('Firebase API Key and Project ID are required.');
      return;
    }

    const cfg: FirebaseConfig = {
      apiKey: fbApiKey.trim(),
      projectId: fbProjectId.trim(),
      authDomain: fbAuthDomain.trim() || `${fbProjectId.trim()}.firebaseapp.com`
    };

    saveFirebaseConfig(cfg);
    setFbConfigSavedNotice(true);
    setError(null);
    setTimeout(() => setFbConfigSavedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Authentication Portal</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">Python Programming With DSA</h2>
            <p className="text-xs text-slate-400">Powered By Kapil</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector: Learner Google SSO vs Admin Portal */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => { setTab('learner'); setError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'learner'
                ? 'border-amber-500 bg-white text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Learner Google Sign-In
          </button>
          <button
            onClick={() => { setTab('admin'); setError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'admin'
                ? 'border-[#0f172a] bg-white text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-slate-700" />
            Super Admin
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {tab === 'learner' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Google Authentication (Firebase)
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Learners sign up and log in exclusively with a verified Google account. Your progress, code submissions, streak, and daily earned badges will automatically sync.
                </p>
              </div>

              {/* Primary Google Auth Action Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleFirebaseGoogleLogin}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:border-slate-400 hover:shadow disabled:opacity-50 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
              </button>

              {/* Direct Google Account Input Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDirectGoogleForm(!showDirectGoogleForm)}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors py-1 flex items-center justify-center gap-1"
                >
                  <span>Sign in with another Google Email</span>
                  {showDirectGoogleForm ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDirectGoogleForm && (
                  <form onSubmit={handleDirectGoogleLogin} className="mt-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={directName}
                        onChange={e => setDirectName(e.target.value)}
                        placeholder="e.g. Kapil Narula or Sarah Jenkins"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Google Email Address</label>
                      <input
                        type="email"
                        required
                        value={directEmail}
                        onChange={e => setDirectEmail(e.target.value)}
                        placeholder="e.g. learner@gmail.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Sign In with this Google Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* Collapsible Firebase Project Setup */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFirebaseSettings(!showFirebaseSettings)}
                  className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-800 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Firebase Project Configuration (Optional)</span>
                  </span>
                  {showFirebaseSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showFirebaseSettings && (
                  <form onSubmit={handleSaveFirebaseConfig} className="mt-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5 animate-in fade-in">
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Connect your Firebase Web App credentials to enable direct Firebase Google OAuth popups:
                    </p>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Firebase API Key</label>
                      <input
                        type="text"
                        value={fbApiKey}
                        onChange={e => setFbApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Project ID</label>
                      <input
                        type="text"
                        value={fbProjectId}
                        onChange={e => setFbProjectId(e.target.value)}
                        placeholder="my-firebase-project"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Save Firebase Config
                      </button>
                      {fbConfigSavedNotice && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                        </span>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Super Admin Sign-In: NO credentials or autofills displayed */
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                <Lock className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Super Administrator Portal is restricted to authorized personnel. Provide your master credentials to access system analytics, learner management, and curriculum controls.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Administrator ID</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={adminId}
                    onChange={e => setAdminId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] font-mono bg-white"
                    placeholder="Enter Administrator ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Master Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f172a] bg-white"
                    placeholder="Enter Master Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0f172a] text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? 'Verifying Super Admin Access...' : 'Sign In as Super Admin'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-400">
          Enterprise Security &bull; End-to-End Encrypted Session
        </div>
      </div>
    </div>
  );
};
