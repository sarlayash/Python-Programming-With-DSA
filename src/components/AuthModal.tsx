import React, { useState, useEffect } from 'react';
import { Shield, Key, AlertCircle, Sparkles, CheckCircle2, Lock, UserCheck } from 'lucide-react';
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

  // Custom demo Google account inputs
  const [demoEmail, setDemoEmail] = useState('kapilnarula27july@gmail.com');
  const [demoName, setDemoName] = useState('Kapil Narula');

  useEffect(() => {
    setTab(initialTab);
    setError(null);
  }, [initialTab, isOpen]);

  // Google GSI button rendering
  useEffect(() => {
    if (!isOpen || tab !== 'learner') return;

    const win = window as any;
    if (win.google && win.google.accounts && win.google.accounts.id) {
      try {
        win.google.accounts.id.initialize({
          client_id: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id.apps.googleusercontent.com',
          callback: async (response: any) => {
            setLoading(true);
            setError(null);
            try {
              const res = await api.googleLogin({ credential: response.credential });
              setStoredToken(res.token);
              onAuthSuccess(res.user, 'learner');
              onClose();
            } catch (err: any) {
              setError(err.message || 'Google Authentication failed');
            } finally {
              setLoading(false);
            }
          }
        });

        const btnContainer = document.getElementById('google-signin-btn-container');
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
  }, [isOpen, tab]);

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminLogin(adminId, adminPassword);
      setStoredToken(res.token);
      onAuthSuccess(res.user, 'admin');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid Admin Credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGoogleLogin = async (overrideEmail?: string, overrideName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const emailToUse = overrideEmail || demoEmail;
      const nameToUse = overrideName || demoName;
      const res = await api.googleLogin({
        email: emailToUse,
        name: nameToUse,
        googleId: 'gid_' + Math.abs(emailToUse.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      setStoredToken(res.token);
      onAuthSuccess(res.user, 'learner');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0f172a] px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Enterprise Access Portal</span>
            <h2 className="text-lg font-bold text-slate-100">Python Programming With DSA</h2>
            <p className="text-xs text-slate-400">Powered By Kapil</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
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
            Learner (Google OAuth)
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
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'learner' ? (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  OAuth Single Sign-On Only
                </div>
                <p>Learners authenticate exclusively through verified Google credentials. No passwords required or stored.</p>
              </div>

              {/* Official Google Button container */}
              <div id="google-signin-btn-container" className="w-full flex justify-center py-1"></div>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Instant Learner Demo Access</span>
                <div className="border-t border-slate-200 w-full"></div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleDemoGoogleLogin('kapilnarula27july@gmail.com', 'Kapil Narula')}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs rounded-lg border border-slate-300 shadow-sm flex items-center justify-center gap-2.5 transition-all hover:border-slate-400"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue as <strong>Kapil Narula</strong> (kapilnarula27july@gmail.com)</span>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Or enter custom Google test account:</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={demoEmail}
                    onChange={e => setDemoEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    disabled={loading || !demoEmail}
                    onClick={() => handleDemoGoogleLogin()}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-950">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  Protected Enterprise Route
                </div>
                <p>Default credentials: ID: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">KAPILADMIN</code>, Password: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">ADMIN123</code></p>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
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
                className="w-full py-2.5 bg-[#0f172a] text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
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
