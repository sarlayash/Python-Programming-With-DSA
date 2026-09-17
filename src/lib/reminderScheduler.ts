// Context-Aware Automated Push Reminder Scheduler for Learners
import { LearnerProfile, DayCurriculum, Problem } from '../types';
import {
  PushNotificationPayload,
  dispatchPushNotification,
  loadPushPreferences,
  savePushPreferences
} from './pushNotifications';

let reminderIntervalHandle: any = null;
let lastReminderIndex = 0;

export interface ReminderContext {
  learner: LearnerProfile | null;
  curriculum: DayCurriculum[];
  problems: Problem[];
  type?: string;
  onAddNotificationToFeed?: (notif: { title: string; message: string; type?: any }) => void;
}

/**
 * Generate a smart, context-sensitive reminder based on the learner's actual progress
 */
export function generateSmartReminder(context: ReminderContext): PushNotificationPayload {
  const { learner, curriculum, problems } = context;

  const completedDayCodes = learner?.completedDays || [];
  const solvedProblemIds = new Set(learner?.solvedProblems || []);
  const streak = learner?.streak || 1;

  // Find incomplete days
  const pendingDays = curriculum.filter(d => !completedDayCodes.includes(d.code));
  
  // Find pending problems across curriculum
  const pendingProblems = problems.filter(p => !solvedProblemIds.has(p.id));
  const pendingCount = pendingProblems.length;

  const reminderPool: PushNotificationPayload[] = [];

  // 1. Pending Tasks & Certificate Activation reminder
  if (pendingCount > 0) {
    const nextPendingProb = pendingProblems[0];
    const day = curriculum.find(d => d.code === nextPendingProb.topicCode);
    reminderPool.push({
      id: `rem-pending-${Date.now()}`,
      title: '📋 Certificate Locked: Pending Tasks Remaining',
      body: `You have ${pendingCount} pending tasks! Complete "${nextPendingProb.title}" in ${day ? `Day ${day.dayNumber}: ${day.title}` : 'Curriculum'} to activate your Final Certificate.`,
      category: 'pending_tasks',
      targetTab: 'ide',
      targetId: nextPendingProb.id,
      timestamp: new Date().toISOString(),
      actionText: 'Solve Problem Now'
    });
  } else {
    // Zero pending tasks!
    reminderPool.push({
      id: `rem-zero-pending-${Date.now()}`,
      title: '🎉 All Tasks Complete! Final Certificate Ready',
      body: 'Zero pending tasks remaining! Take the Certified Final Assessment or claim your executive verified credential now.',
      category: 'final_assessment',
      targetTab: 'final-assessment',
      timestamp: new Date().toISOString(),
      actionText: 'Take Final Assessment'
    });
  }

  // 2. Next Incomplete Day Reminder
  if (pendingDays.length > 0) {
    const nextDay = pendingDays[0];
    reminderPool.push({
      id: `rem-day-${Date.now()}`,
      title: `⏳ Day ${nextDay.dayNumber} Reminder: ${nextDay.title}`,
      body: `Your curriculum is awaiting progress on ${nextDay.title}. Dive into ${nextDay.subtitle} and master today's patterns!`,
      category: 'curriculum_day',
      targetTab: 'curriculum',
      targetId: nextDay.code,
      timestamp: new Date().toISOString(),
      actionText: `Open Day ${nextDay.dayNumber}`
    });
  }

  // 3. Streak Protection
  reminderPool.push({
    id: `rem-streak-${Date.now()}`,
    title: `🔥 Maintain Your ${streak}-Day Streak!`,
    body: `Keep the momentum going! Completing a coding problem or spinning the wheel today keeps your ${streak}-day active streak alive.`,
    category: 'streak_reminder',
    targetTab: 'dashboard',
    timestamp: new Date().toISOString(),
    actionText: 'Continue Practice'
  });

  // 4. Daily Spinning Wheel & 10 MCQs
  reminderPool.push({
    id: `rem-spin-${Date.now()}`,
    title: '🎡 Daily Spinning Wheel Challenge Ready',
    body: 'Test your Python & DSA intuition with 10 randomized diagnostic MCQs. Spin the wheel to unlock your daily topic badge!',
    category: 'spin_wheel',
    targetTab: 'spinning-wheel',
    timestamp: new Date().toISOString(),
    actionText: 'Spin the Wheel'
  });

  // 5. Final Assessment Capstone Exam
  reminderPool.push({
    id: `rem-exam-${Date.now()}`,
    title: '🏆 Certified Final Assessment (Days 1–10)',
    body: 'Challenge yourself in the 90-minute proctored examination: 200 Diagnostic MCQs + 50 Think & Type algorithmic questions.',
    category: 'final_assessment',
    targetTab: 'final-assessment',
    timestamp: new Date().toISOString(),
    actionText: 'View Exam Overview'
  });

  // 6. Debugging Lab
  reminderPool.push({
    id: `rem-debug-${Date.now()}`,
    title: '🐛 Interactive Python Debugging Lab',
    body: 'Find and fix syntax traps, off-by-one errors, and recursion edge cases in real Python code snippets.',
    category: 'debugging_lab',
    targetTab: 'debugging',
    timestamp: new Date().toISOString(),
    actionText: 'Open Debug Lab'
  });

  // Rotate through reminders cleanly
  const selected = reminderPool[lastReminderIndex % reminderPool.length];
  lastReminderIndex++;
  return selected;
}

/**
 * Trigger an immediate push reminder (e.g. from UI button or manual test)
 */
export function triggerImmediateReminder(context: ReminderContext): PushNotificationPayload {
  const reminder = generateSmartReminder(context);
  dispatchPushNotification(reminder);

  // Update lastTriggered timestamp
  const prefs = loadPushPreferences();
  prefs.lastTriggered = Date.now();
  savePushPreferences(prefs);

  // Add to in-app notification feed if callback provided
  if (context.onAddNotificationToFeed) {
    context.onAddNotificationToFeed({
      title: reminder.title,
      message: reminder.body,
      type: 'announcement'
    });
  }

  return reminder;
}

/**
 * Start or restart the automated reminder background ticker
 */
export function startReminderScheduler(context: ReminderContext): () => void {
  if (reminderIntervalHandle) {
    clearInterval(reminderIntervalHandle);
    reminderIntervalHandle = null;
  }

  const checkAndTick = () => {
    const prefs = loadPushPreferences();
    if (!prefs.enabled) return;

    const intervalMs = (prefs.intervalSeconds || 30) * 1000;
    const now = Date.now();

    // Check if enough time has passed since last reminder
    if (now - prefs.lastTriggered >= intervalMs) {
      triggerImmediateReminder(context);
    }
  };

  // Run initial check with a short delay (e.g. 5 seconds after page load)
  const initialTimeout = setTimeout(() => {
    const prefs = loadPushPreferences();
    // In demo mode (interval <= 60s) or first visit, fire initial reminder to demonstrate capability
    if (prefs.enabled && (prefs.intervalSeconds <= 60 || !prefs.lastTriggered)) {
      triggerImmediateReminder(context);
    }
  }, 4000);

  // Check every 5 seconds whether the configured interval threshold is reached
  reminderIntervalHandle = setInterval(checkAndTick, 5000);

  return () => {
    clearTimeout(initialTimeout);
    if (reminderIntervalHandle) {
      clearInterval(reminderIntervalHandle);
      reminderIntervalHandle = null;
    }
  };
}
