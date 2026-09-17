import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
  Send,
  Sliders,
  AlertCircle
} from 'lucide-react';
import {
  PushNotificationPreferences,
  loadPushPreferences,
  savePushPreferences,
  getBrowserNotificationPermission,
  requestBrowserPushPermission
} from '../lib/pushNotifications';
import { AppNotification } from '../types';

interface PushNotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerTestReminder: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const PushNotificationSettingsModal: React.FC<PushNotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  onTriggerTestReminder,
  notifications,
  onMarkNotificationRead
}) => {
  const [prefs, setPrefs] = useState<PushNotificationPreferences>(loadPushPreferences());
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>('settings');

  useEffect(() => {
    if (isOpen) {
      setPrefs(loadPushPreferences());
      setBrowserPermission(getBrowserNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdatePrefs = (partial: Partial<PushNotificationPreferences>) => {
    const updated = { ...prefs, ...partial };
    setPrefs(updated);
    savePushPreferences(updated);
  };

  const handleRequestBrowserPush = async () => {
    const res = await requestBrowserPushPermission();
    setBrowserPermission(res);
    if (res === 'granted') {
      handleUpdatePrefs({ browserPushEnabled: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                Real-Time Push Reminders
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                  Live Engine
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Contextual study alerts, streak guards & certificate activation reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Notification Settings
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Notification History ({notifications.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'settings' ? (
            <>
              {/* Test Trigger Button Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Immediate Verification
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    Test the real-time push alert with audible audio chime and in-app toast right now.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onTriggerTestReminder();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Push Reminder Now
                </button>
              </div>

              {/* Master Push Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Enable Push Notifications</h4>
                  <p className="text-xs text-slate-500">Allow reminders to alert you about pending tasks and streak goals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.enabled}
                    onChange={(e) => handleUpdatePrefs({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* System Browser Notifications */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-slate-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">System Web Notifications</h4>
                      <p className="text-xs text-slate-500">Alerts in background tabs & desktop push tray</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      browserPermission === 'granted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : browserPermission === 'denied'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {browserPermission === 'granted'
                      ? 'Granted'
                      : browserPermission === 'denied'
                      ? 'Blocked'
                      : 'Permission Needed'}
                  </span>
                </div>

                {browserPermission !== 'granted' && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-600">
                      Grant browser permission to receive desktop & mobile push banners.
                    </p>
                    <button
                      onClick={handleRequestBrowserPush}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Allow System Push
                    </button>
                  </div>
                )}
              </div>

              {/* In-App Sound & Toast Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audio Chime Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {prefs.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-amber-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Synthesizer Chime</h4>
                      <p className="text-[11px] text-slate-500">Pleasant audio chime</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.soundEnabled}
                    onChange={(e) => handleUpdatePrefs({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                </div>

                {/* In-App Toast Toggle */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">In-App Push Toast</h4>
                      <p className="text-[11px] text-slate-500">Floating responsive card</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.inAppToastEnabled}
                    onChange={(e) => handleUpdatePrefs({ inAppToastEnabled: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Reminder Frequency Selector */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                    Reminder Frequency
                  </h4>
                  <span className="text-[11px] text-amber-600 font-semibold">
                    {prefs.intervalSeconds <= 60
                      ? `${prefs.intervalSeconds}s (Demo Mode)`
                      : `${prefs.intervalSeconds / 60} minutes`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { label: '30s (Demo)', sec: 30, tag: 'Real-Time' },
                    { label: '5 Mins', sec: 300, tag: 'Quick' },
                    { label: '15 Mins', sec: 900, tag: 'Standard' },
                    { label: '1 Hour', sec: 3600, tag: 'Focus' }
                  ].map((opt) => (
                    <button
                      key={opt.sec}
                      onClick={() => handleUpdatePrefs({ intervalSeconds: opt.sec })}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        prefs.intervalSeconds === opt.sec
                          ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                      }`}
                    >
                      <div>{opt.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{opt.tag}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Notification History */
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No notifications logged yet. Trigger a push reminder to see it here!
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`p-3.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                      !n.read
                        ? 'border-amber-300 bg-amber-50/40 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Preferences saved automatically</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
