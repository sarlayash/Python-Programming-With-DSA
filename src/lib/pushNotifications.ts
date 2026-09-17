// Real-Time Push Notification Engine & Reminder Scheduler
// Supports Browser Web Notification API, Web Audio API synthesised chimes,
// and in-app real-time push toast alerts.

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  category: 'pending_tasks' | 'streak_reminder' | 'curriculum_day' | 'spin_wheel' | 'final_assessment' | 'debugging_lab' | 'system';
  targetTab?: string;
  targetId?: string;
  timestamp: string;
  actionText?: string;
}

export interface PushNotificationPreferences {
  enabled: boolean;
  browserPushEnabled: boolean;
  soundEnabled: boolean;
  inAppToastEnabled: boolean;
  intervalSeconds: number; // 30s (demo), 300 (5m), 900 (15m), 3600 (1h), 86400 (daily)
  lastTriggered: number;
}

const PREFS_KEY = 'kapil_dsa_push_notification_prefs_v1';

const DEFAULT_PREFS: PushNotificationPreferences = {
  enabled: true,
  browserPushEnabled: false,
  soundEnabled: true,
  inAppToastEnabled: true,
  intervalSeconds: 30, // 30s demo interval to immediately showcase real-time push reminders
  lastTriggered: 0
};

export function loadPushPreferences(): PushNotificationPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load push preferences', e);
  }
  return { ...DEFAULT_PREFS };
}

export function savePushPreferences(prefs: PushNotificationPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save push preferences', e);
  }
}

// Check browser notification support
export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Request permission for Web Notifications
export async function requestBrowserPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    const prefs = loadPushPreferences();
    prefs.browserPushEnabled = permission === 'granted';
    savePushPreferences(prefs);
    return permission;
  } catch (e) {
    console.warn('Push permission request error', e);
    return Notification.permission;
  }
}

// Play pleasant, elegant two-tone synth chime using Web Audio API
export function playPushChimeSound(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1 (C5 - 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2 (G5 - 783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.12);
    gain2.gain.setValueAtTime(0, now + 0.12);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.65);

    // Tone 3 (C6 - 1046.50 Hz) - crystalline harmonic finish
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1046.5, now + 0.24);
    gain3.gain.setValueAtTime(0, now + 0.24);
    gain3.gain.linearRampToValueAtTime(0.15, now + 0.28);
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.24);
    osc3.stop(now + 0.85);
  } catch (e) {
    // AudioContext autoplay guard
    console.debug('Web Audio chime playback not permitted or unavailable', e);
  }
}

// In-memory subscribers for real-time in-app toast updates
type PushSubscriber = (notif: PushNotificationPayload) => void;
const subscribers = new Set<PushSubscriber>();

export function subscribeToPushNotifications(cb: PushSubscriber): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

// Dispatch push notification across both native OS push & in-app toast
export function dispatchPushNotification(payload: PushNotificationPayload): void {
  const prefs = loadPushPreferences();
  if (!prefs.enabled) return;

  // 1. Play chime if sound enabled
  if (prefs.soundEnabled) {
    playPushChimeSound();
  }

  // 2. Dispatch to in-app toast subscribers
  if (prefs.inAppToastEnabled) {
    subscribers.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error('Push subscriber error', err);
      }
    });
  }

  // 3. Dispatch to native browser Web Notification if allowed
  if (
    prefs.browserPushEnabled &&
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    try {
      const notif = new Notification(payload.title, {
        body: payload.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.category,
        requireInteraction: false
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
        // Custom window event for navigation
        if (payload.targetTab) {
          window.dispatchEvent(
            new CustomEvent('app:navigate', {
              detail: { tab: payload.targetTab, id: payload.targetId }
            })
          );
        }
      };
    } catch (e) {
      console.warn('Native push dispatch blocked or failed', e);
    }
  }
}
