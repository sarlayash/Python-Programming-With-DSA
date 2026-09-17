import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  X,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Bug,
  Volume2,
  VolumeX,
  Settings,
  ArrowRight
} from 'lucide-react';
import {
  PushNotificationPayload,
  subscribeToPushNotifications,
  loadPushPreferences,
  savePushPreferences
} from '../lib/pushNotifications';

interface PushNotificationToastProps {
  onNavigate: (tab: string, contextId?: string) => void;
  onOpenSettings?: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  onNavigate,
  onOpenSettings
}) => {
  const [activeNotif, setActiveNotif] = useState<PushNotificationPayload | null>(null);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  const durationMs = 8000;
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(durationMs);

  useEffect(() => {
    const prefs = loadPushPreferences();
    setIsSoundMuted(!prefs.soundEnabled);

    // Subscribe to incoming push notifications
    const unsubscribe = subscribeToPushNotifications((notif) => {
      setActiveNotif(notif);
      setProgress(100);
      remainingTimeRef.current = durationMs;
      startTimeRef.current = Date.now();
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!activeNotif) return;

    if (isHovered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();
    const interval = 50;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newRemaining = Math.max(0, remainingTimeRef.current - elapsed);
      const newProgress = (newRemaining / durationMs) * 100;
      setProgress(newProgress);

      if (newRemaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setActiveNotif(null);
      }
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeNotif, isHovered]);

  const handleDismiss = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveNotif(null);
  };

  const handleAction = () => {
    if (!activeNotif) return;
    const targetTab = activeNotif.targetTab || 'dashboard';
    const targetId = activeNotif.targetId;
    handleDismiss();
    onNavigate(targetTab, targetId);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prefs = loadPushPreferences();
    prefs.soundEnabled = !prefs.soundEnabled;
    savePushPreferences(prefs);
    setIsSoundMuted(!prefs.soundEnabled);
  };

  if (!activeNotif) return null;

  // Category visual helpers
  const getCategoryBadge = () => {
    switch (activeNotif.category) {
      case 'pending_tasks':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Task Reminder',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        };
      case 'streak_reminder':
        return {
          icon: <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />,
          label: 'Daily Streak Alert',
          color: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
        };
      case 'spin_wheel':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Daily Spinning Wheel',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
      case 'final_assessment':
        return {
          icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Final Assessment',
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      case 'debugging_lab':
        return {
          icon: <Bug className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Debugging Lab',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        };
      default:
        return {
          icon: <Bell className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Learner Reminder',
          color: 'bg-slate-700 text-slate-300 border-slate-600'
        };
    }
  };

  const badge = getCategoryBadge();

  return (
    <div
      className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] animate-in slide-in-from-bottom-5 fade-in duration-300 select-none shadow-2xl"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="relative rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border-2 border-amber-500/60 p-4 text-white shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top meta bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${badge.color}`}
            >
              {badge.icon}
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-1 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title={isSoundMuted ? 'Unmute reminder chime' : 'Mute reminder chime'}
            >
              {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Settings button */}
            {onOpenSettings && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings();
                }}
                className="p-1 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                title="Reminder Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="p-1 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-1.5 mb-3">
          <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            {activeNotif.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeNotif.body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700/80 relative z-10">
          <span className="text-[10px] text-slate-400 font-mono">
            {isHovered ? 'Timer Paused' : 'Push Notification • Real-Time'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors font-medium"
            >
              Dismiss
            </button>

            <button
              onClick={handleAction}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <span>{activeNotif.actionText || 'View Task'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
