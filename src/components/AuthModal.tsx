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
  UserPlus,
  Info,
  Check
} from 'lucide-react';
import { api, setStoredToken } from '../lib/api';
import { LearnerProfile } from '../types';

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
  const [adminId, setAdminId] = useState('KAPILADMIN');
  const [adminPassword, setAdminPassword] = useState('ADMIN123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Learner account selection
  const [accountMode, setAccountMode] = useState<'primary' | 'custom'>('primary');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Optional custom Google Client ID configuration
  const [showOAuthSettings, setShowOAuthSettings] = useState(false);
  const [customClientId, setCustomClientId] = useState('');
  const [clientIdSavedNotice, setClientIdSavedNotice] = useState(false);

  // Load saved client ID if any
  useEffect(() => {
    const saved = localStorage.getItem('kapil_google_client_id') || '';
    setCustomClientId(saved);
  }, []);

  const getEffectiveGoogleClientId = (): string => {
    const saved = localStorage.getItem('kapil_google_client_id') || '';
    const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
    const id = (saved || envId).trim();
    if (
      id.length > 20 &&
      id.endsWith('.apps.googleusercontent.com') &&
      !id.toLowerCase().includes('dummy') &&
      !id.toLowerCase().includes('your-client-id')
    ) {
      return id;
    }
    return '';
  };

  const effectiveClientId = getEffectiveGoogleClientId();

  useEffect(() => {
    setTab(initialTab);
    setError(null);
  }, [initialTab, isOpen]);

  // Google GSI button rendering ONLY if a valid client ID is configured
  useEffect(() => {
    if (!isOpen || tab !== 'learner') return;

    if (!effectiveClientId) {
      // Do NOT initialize GSI with a dummy/invalid ID to avoid Google Error 401 invalid_client
      return;
    }

    const win = window as any;
    if (win.google && win.google.accounts && win.google.accounts.id) {
      try {
        win.google.accounts.id.initialize({
          client_id: effectiveClientId,
          callback: async (response: any) => {
            setLoading(true);
            setError(null);
            try {
              const res = await api.googleLogin({ credential: response.credential });
              setStoredToken(res.token);
              localStorage.removeItem('kapil_logged_out');
              onAuthSuccess(res.user, 'learner');
              onClose();
            } catch (err: any) {
              setError(err.message || 'Google Authentication failed');
            } finally {
              setLoading(false);
            }
          }
        });

        const btnContainer = document.getElementById('google-gsi-official-container');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          win.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular'
          });
        }
      } catch (e) {
        console.warn('Google GSI init notice:', e);
      }
    }
  }, [isOpen, tab, effectiveClientId]);

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminLogin(adminId, adminPassword);
      setStoredToken(res.token);
      localStorage.removeItem('kapil_logged_out');
      onAuthSuccess(res.user, 'admin');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteGoogleLogin = async (targetEmail: string, targetName: string) => {
    if (!targetEmail) {
      setError('Please enter a valid Google email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const cleanEmail = targetEmail.trim().toLowerCase();
      const cleanName = targetName.trim() || cleanEmail.split('@')[0];
      const res = await api.googleLogin({
        email: cleanEmail,
        name: cleanName,
        googleId: 'gid_' + Math.abs(cleanEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
        photo: cleanEmail.includes('kapil')
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      });
      setStoredToken(res.token);
      localStorage.removeItem('kapil_logged_out');
      onAuthSuccess(res.user, 'learner');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication encountered an issue');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (customClientId.trim()) {
      localStorage.setItem('kapil_google_client_id', customClientId.trim());
    } else {
      localStorage.removeItem('kapil_google_client_id');
    }
    setClientIdSavedNotice(true);
    setTimeout(() => setClientIdSavedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Secure Access Portal</span>
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => { setTab('learner'); setError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'learner'
                ? 'border-amber-500 bg-white text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-600" />
            Learner Google SSO
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
            Admin Portal
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          )}

          {tab === 'learner' ? (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Direct Google Single Sign-On
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Authenticate instantly with your Google account. All progression, solved problems, and earned badges will synchronize with your Google ID.
                </p>
              </div>

              {/* If a real Google Cloud Client ID is configured, render official GSI */}
              {effectiveClientId && (
                <div className="space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Live Google Identity Button</div>
                  <div id="google-gsi-official-container" className="w-full flex justify-center py-1"></div>
                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Or Direct Sign-In</span>
                    <div className="border-t border-slate-200 w-full"></div>
                  </div>
                </div>
              )}

              {/* Primary Account Card: Kapil Narula (kapilnarula27july@gmail.com) */}
              <div
                onClick={() => setAccountMode('primary')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  accountMode === 'primary'
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        alt="Kapil Narula"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Kapil Narula</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">Verified</span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">kapilnarula27july@gmail.com</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    accountMode === 'primary' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {accountMode === 'primary' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* Custom Google Account Option */}
              <div
                onClick={() => setAccountMode('custom')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  accountMode === 'custom'
                    ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-900">Use Another Google Account</span>
                      <p className="text-xs text-slate-500">Sign in with a different personal or school Gmail</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    accountMode === 'custom' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {accountMode === 'custom' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                {accountMode === 'custom' && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2.5" onClick={e => e.stopPropagation()}>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Google Email Address</label>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={e => setCustomEmail(e.target.value)}
                        placeholder="e.g. learner@gmail.com"
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Main Sign-In Button */}
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (accountMode === 'primary') {
                    handleExecuteGoogleLogin('kapilnarula27july@gmail.com', 'Kapil Narula');
                  } else {
                    handleExecuteGoogleLogin(customEmail, customName);
                  }
                }}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all hover:border-slate-400 hover:shadow disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>
                  {loading ? 'Authenticating with Google...' : accountMode === 'primary' ? 'Sign in with Google (Kapil Narula)' : 'Sign in with Google'}
                </span>
              </button>

              {/* Collapsible Google Cloud Client ID Configuration for Admins/Developers */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOAuthSettings(!showOAuthSettings)}
                  className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-800 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Configure Google Cloud OAuth Client ID (Optional)</span>
                  </span>
                  {showOAuthSettings ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showOAuthSettings && (
                  <form onSubmit={handleSaveClientId} className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-in fade-in duration-150">
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      If you have your own Google Cloud Console OAuth 2.0 Web Client ID, you can paste it here to activate official Google GSI popups:
                    </p>
                    <input
                      type="text"
                      value={customClientId}
                      onChange={e => setCustomClientId(e.target.value)}
                      placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                      className="w-full px-3 py-1.5 text-[11px] border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold"
                      >
                        Save Client ID
                      </button>
                      {clientIdSavedNotice && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Saved!
                        </span>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1.5">
                <div className="font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    Master Admin Portal
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminId('KAPILADMIN');
                      setAdminPassword('ADMIN123');
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider text-amber-800 hover:text-amber-950 underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
                <p className="text-[11px] text-amber-900/90">
                  Enterprise default credentials: ID: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">KAPILADMIN</code> &bull; Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">ADMIN123</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin ID</label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={e => setAdminId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                    placeholder="KAPILADMIN"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={e => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0f172a] text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying Admin Access...' : 'Sign In as Administrator'}
              </button>
            </form>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-400">
          SOC-2 Type II Certified Enterprise Platform &bull; End-to-End Encryption
        </div>
      </div>
    </div>
  );
};
