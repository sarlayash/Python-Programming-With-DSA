import React from 'react';
import {
  BookOpen,
  Code2,
  Award,
  FileCheck,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Compass,
  TrendingUp,
  FileText,
  Clock,
  Target,
  RotateCw,
  Zap,
  Trophy,
  Bug,
  GraduationCap,
  ShieldCheck,
  Bell,
  Lock,
  Send,
  Sliders
} from 'lucide-react';
import { LearnerProfile, DayCurriculum, Problem, EarnedBadge } from '../types';
import { auditLearnerCompletion } from '../lib/completionAudit';

interface LearnerDashboardProps {
  learner: LearnerProfile | null;
  curriculum: DayCurriculum[];
  problems: Problem[];
  earnedBadges: EarnedBadge[];
  onNavigate: (tab: string, context?: any) => void;
  onOpenAuth: () => void;
  onOpenPushSettings?: () => void;
  onTriggerTestPush?: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  learner,
  curriculum,
  problems,
  earnedBadges,
  onNavigate,
  onOpenAuth,
  onOpenPushSettings,
  onTriggerTestPush
}) => {
  const currentDayCode = learner?.currentDay || 'T1';
  const currentDay = curriculum.find(c => c.code === currentDayCode) || curriculum[0];

  const solvedCount = learner?.solvedProblems.length || 0;
  const attemptedCount = learner?.attemptedProblems.length || 0;
  const totalProblemsCount = problems.length || 50;
  const completionPercentage = Math.min(100, Math.round((solvedCount / 10) * 100)); // target benchmark
  const topicsCompletedCount = learner?.completedDays.length || 0;

  const currentTopicProblems = problems.filter(p => p.topicCode === currentDayCode);
  const nextRecommendedProblem = currentTopicProblems.find(p => !learner?.solvedProblems.includes(p.id)) || currentTopicProblems[0];

  // Completion Audit for Certificate Gate
  const audit = auditLearnerCompletion(learner, curriculum, problems);

  return (
    <div className="space-y-6 pb-12">
      {/* Enterprise Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-slate-800 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise Cohort &bull; Python Programming With DSA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {learner ? `Welcome back, ${learner.name}` : 'Welcome to Python Programming With DSA'}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Engineered by <strong className="text-amber-400 font-semibold">Kapil</strong> to build Fortune 500 algorithmic rigor. Progress through Day 1 to Day 10 with isolated Python execution, verified test cases, and verifiable executive credentials.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Day {currentDay?.dayNumber || 1}: {currentDay?.title}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" /> Active Mission: Solve 2 Daily Problems
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            {learner ? (
              <button
                onClick={() => onNavigate('ide', { problemId: nextRecommendedProblem?.id })}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/30 flex items-center justify-center gap-2 transition-all"
              >
                <Code2 className="w-4 h-4" />
                Resume Coding Lab
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-950/30 flex items-center justify-center gap-2 transition-all"
              >
                Sign In With Google
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onNavigate('curriculum')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              View Curriculum
            </button>
          </div>
        </div>

        {/* Muted background geometric pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* Real-Time Push Notification & Study Reminders Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Real-Time Push Reminders Active</span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                Live Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Context-aware study alerts, streak guards, and zero-pending certificate activation reminders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {onTriggerTestPush && (
            <button
              onClick={onTriggerTestPush}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
            >
              <Send className="w-3 h-3" />
              <span>Test Push Now</span>
            </button>
          )}

          {onOpenPushSettings && (
            <button
              onClick={onOpenPushSettings}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-3 h-3 text-slate-500" />
              <span>Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* Certificate Activation Status & Zero-Pending Requirement Banner */}
      <div className={`rounded-2xl p-5 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
        audit.isCertificateActivated
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200'
          : 'bg-gradient-to-r from-rose-50/70 via-amber-50/40 to-white border-rose-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            audit.isCertificateActivated
              ? 'bg-emerald-500/20 text-emerald-700'
              : 'bg-rose-500/15 text-rose-700'
          }`}>
            {audit.isCertificateActivated ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            ) : (
              <Lock className="w-6 h-6 text-rose-600" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Final Certificate Activation Gate
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                audit.isCertificateActivated
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {audit.isCertificateActivated ? 'Activated & Verified' : 'Locked (Pending Tasks)'}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {audit.isCertificateActivated
                ? 'All 10 days, 3 mastery levels, and 34 coding challenges completed with zero pending tasks.'
                : `Strict Rule: Certificate will not activate unless all tasks, days, and levels are completed. You have ${audit.pendingTasksCount} pending tasks remaining across ${audit.pendingDays.length} days.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('certificate')}
          className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shrink-0 ${
            audit.isCertificateActivated
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span>{audit.isCertificateActivated ? 'View Active Certificate' : 'Review Pending Tasks'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Current Learning Day */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Current Day</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#0f172a] font-mono">{currentDayCode}</span>
            <span className="text-xs text-slate-400 font-medium">/ 10</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700 font-medium truncate">
            {currentDay?.title}
          </div>
        </div>

        {/* Completion % */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Course Progress</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-mono">{completionPercentage}%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Topics Completed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Topics Mastered</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#0f172a] font-mono">{topicsCompletedCount}</span>
            <span className="text-xs text-slate-400 font-medium">/ 10</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {10 - topicsCompletedCount} remaining
          </div>
        </div>

        {/* Problems Solved */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Problems Solved</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-700 font-mono">{solvedCount}</span>
            <span className="text-xs text-slate-400 font-medium">/ {totalProblemsCount}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {attemptedCount} attempted
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Streak</span>
          <div className="mt-2 flex items-center gap-1.5">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
            <span className="text-2xl font-black text-amber-600 font-mono">{learner?.streak || 1}</span>
            <span className="text-xs text-slate-500 font-medium">days</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Streak Secured
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Credentials</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-700 font-mono">{earnedBadges.length}</span>
            <span className="text-xs text-slate-400 font-medium">Badges</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {topicsCompletedCount >= 3 ? 'Cert Eligible' : '1 Cert Available'}
          </div>
        </div>
      </div>

      {/* HIGHLIGHT FINAL ASSESSMENT ON HOME PAGE */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e1b4b] border-2 border-amber-500/50 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                FINAL ASSESSMENT &bull; DAY 1 TO DAY 10
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> QR-Verified Unique Certificates
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Certified Capstone Final Assessment
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Demonstrate complete Python & DSA mastery across all 10 curriculum days. Proctored 90-minute examination featuring <strong className="text-amber-400">200 Diagnostic MCQs</strong> with strict anti-guess option balancing, plus <strong className="text-indigo-300">50 Think & Type technical challenges</strong>. Score 60%+ to earn an executive cryptographically-verified certificate.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>90 Min</strong> Time Bound</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-Guess Balanced Distribution</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>200 MCQs + 50 Think & Type</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              onClick={() => onNavigate('final-assessment')}
              className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Trophy className="w-5 h-5 text-slate-950" />
              Take Final Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('certificate')}
              className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              View Sample Certificate
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      {/* Daily Spinning Wheel & 10 MCQs Feature Card */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <RotateCw className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded">
                NEW DAILY CHALLENGE
              </span>
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-600" />
                Score 80%+ to unlock Verifiable Badge & Certificate
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Spinning Wheel & Random 10 MCQs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Spin the lucky curriculum wheel, tackle 10 randomized DSA questions, and qualify for cryptographic credentials. A brand-new challenge unlocks every day!
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('wheel')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          Spin & Take Quiz
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Python Fundamentals to Advanced Track Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/80 border border-indigo-500/30 p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded">
                NEW CURRICULUM TRACK
              </span>
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                5 Progressive Sections &bull; 25 MCQs &bull; 15 Coding IDE Challenges
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              Fundamentals of Python to Advanced Mastery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-0.5">
              Move from core fundamentals (variables, types, control flow, loops, data structures) to advanced architecture (functions, OOP, decorators, generators, and context managers). Includes comprehensive notes, 5 MCQs, and 3 live interactive coding IDE challenges for every topic!
            </p>
            {learner && (
              <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-300">
                <span className="font-semibold text-amber-400">
                  {(learner.completedFundamentalsSections || []).length} / 5 Sections Completed
                </span>
                <span>&bull;</span>
                <span className="font-semibold text-emerald-400">
                  {(learner.solvedFundamentalsCoding || []).length} / 15 Coding Challenges Solved
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate('fundamentals')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all active:scale-95"
        >
          <GraduationCap className="w-4 h-4" />
          Explore Track
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Python Debugging Lab: 5 Real-World Python Challenges */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Bug className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded">
                PYTHON DEBUG LAB
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                Earn up to +350 Reward Points
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              5 Python Debugging Code Challenges
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Inspect broken codebases containing mutable default arguments, off-by-one indices, recursion depth errors, shallow copy collisions, and float precision quirks. Run real test harnesses and earn points directly on your profile.
            </p>
            {learner && (
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                <span className="font-semibold text-emerald-800">
                  {(learner.solvedDebuggingChallenges || []).length} / 5 Solved
                </span>
                <span>&bull;</span>
                <span className="font-semibold text-amber-700">
                  {learner.rewardPoints || 0} Reward Points Accumulated
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate('debugging')}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all active:scale-95"
        >
          <Bug className="w-4 h-4" />
          Solve Debugging Challenges
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Python Lore & Fun Facts: Earn Reward Points */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded">
                PYTHON LORE & FUN FACTS
              </span>
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                Earn up to +270 Reward Points
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Curious Python Quirks, Easter Eggs & Real-World Lore
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Why is Python named after British comedians? What happens when you type <code>import antigravity</code> or <code>from __future__ import braces</code>? Uncover 10 secrets, test your curiosity with mini-quizzes, and claim instant points!
            </p>
            {learner && (
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                <span className="font-semibold text-amber-800">
                  {(learner.claimedFunFacts || []).length} / 10 Facts Unlocked
                </span>
                <span>&bull;</span>
                <span className="font-semibold text-emerald-700">
                  {learner.rewardPoints || 0} Total Reward Points
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate('facts')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Discover & Earn Points
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Daily Mission & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Daily Mission & Next Up */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Mission Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Today's Executive Mission</h3>
                  <p className="text-xs text-slate-500">Day {currentDay?.dayNumber}: {currentDay?.title}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                Required for Badge
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete {currentDay?.completionCriteria.description}. Solving in-class and post-class problems validates test cases with CPU/memory boundaries and qualifies you for today's verifiable badge.
              </p>

              {/* Problems in current topic */}
              <div className="space-y-2 mt-3">
                {currentTopicProblems.slice(0, 3).map((prob) => {
                  const isSolved = learner?.solvedProblems.includes(prob.id);
                  const isAttempted = learner?.attemptedProblems.includes(prob.id);

                  return (
                    <div
                      key={prob.id}
                      onClick={() => onNavigate('ide', { problemId: prob.id })}
                      className="p-3 rounded-lg border border-slate-200 hover:border-amber-400/80 bg-slate-50/50 hover:bg-amber-50/20 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          isSolved
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : isAttempted
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isSolved ? '✓' : prob.questionNumber}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{prob.title}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{prob.type}</span>
                            <span>&bull;</span>
                            <span className={prob.difficulty === 'Easy' ? 'text-emerald-600' : prob.difficulty === 'Medium' ? 'text-amber-600' : 'text-rose-600'}>
                              {prob.difficulty}
                            </span>
                            <span>&bull;</span>
                            <span>{prob.testCases.length} Test Cases</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSolved ? (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                            Solved
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('ide', { problemId: prob.id });
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Solve
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Key Curriculum Reference Topics list */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900">Curriculum Progression (T1 - T10)</h3>
              <button
                onClick={() => onNavigate('curriculum')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                Full Syllabus <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {curriculum.map((day) => {
                const isCompleted = learner?.completedDays.includes(day.code);
                const isCurrent = day.code === currentDayCode;

                return (
                  <div
                    key={day.code}
                    onClick={() => onNavigate('curriculum', { selectedTopic: day.code })}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-50/30'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                          {day.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{day.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">{day.subtitle}</p>
                    </div>

                    <div>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold text-amber-700 uppercase">In Progress</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Day {day.dayNumber}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Required Enterprise Shortcuts (Page 2) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Quick Enterprise Shortcuts
            </h3>

            <div className="space-y-1.5">
              {/* Notes Shortcut */}
              <button
                onClick={() => onNavigate('curriculum', { tab: 'notes' })}
                className="w-full p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Day Notes Viewer</span>
                </div>
                <span className="text-[10px] text-slate-400">Downloadable</span>
              </button>

              {/* Coding Lab Shortcut */}
              <button
                onClick={() => onNavigate('ide')}
                className="w-full p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span>Interactive Coding IDE</span>
                </div>
                <span className="text-[10px] text-slate-400">Monaco/Python</span>
              </button>

              {/* Spinning Wheel & Daily MCQs Shortcut */}
              <button
                onClick={() => onNavigate('wheel')}
                className="w-full p-2.5 rounded-lg border border-amber-200/80 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50 text-left transition-colors flex items-center justify-between text-xs font-medium"
              >
                <div className="flex items-center gap-2.5 text-amber-900">
                  <RotateCw className="w-4 h-4 text-amber-600" />
                  <span>Spinning Wheel & 10 MCQs</span>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                  Daily Challenge
                </span>
              </button>

              {/* Interview & Placement Shortcut */}
              <button
                onClick={() => onNavigate('curriculum', { tab: 'interview' })}
                className="w-full p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Interview & Placement Tips</span>
                </div>
                <span className="text-[10px] text-slate-400">Tech Prep</span>
              </button>

              {/* Common Errors Shortcut */}
              <button
                onClick={() => onNavigate('curriculum', { tab: 'errors' })}
                className="w-full p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Common Pitfalls & Fixes</span>
                </div>
                <span className="text-[10px] text-slate-400">Debugging</span>
              </button>

              {/* My Badges Shortcut */}
              <button
                onClick={() => onNavigate('badges')}
                className="w-full p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Earned Daily Badges</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600">{earnedBadges.length} Earned</span>
              </button>

              {/* My Certificate Shortcut */}
              <button
                onClick={() => onNavigate('certificate')}
                className="w-full p-2.5 rounded-lg border border-slate-100 hover:border-amber-300 hover:bg-slate-50 text-left transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 text-slate-800 font-medium">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <span>Final Executive Certificate</span>
                </div>
                <span className="text-[10px] text-slate-400">QR Verifiable</span>
              </button>
            </div>
          </div>

          {/* Course Credentials Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl p-5 border border-slate-800 shadow-md">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Credentialing Authority</span>
            <h4 className="font-bold text-sm mt-1 text-slate-100">Enterprise Certified Python DSA</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Verify completion via public cryptographic hash and tamper-evident QR code matching industry standards.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-300">Instructor: <strong>Kapil</strong></span>
              <button
                onClick={() => onNavigate('certificate')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                View Status →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
