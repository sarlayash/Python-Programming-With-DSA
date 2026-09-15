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
  Target
} from 'lucide-react';
import { LearnerProfile, DayCurriculum, Problem, EarnedBadge } from '../types';

interface LearnerDashboardProps {
  learner: LearnerProfile | null;
  curriculum: DayCurriculum[];
  problems: Problem[];
  earnedBadges: EarnedBadge[];
  onNavigate: (tab: string, context?: any) => void;
  onOpenAuth: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  learner,
  curriculum,
  problems,
  earnedBadges,
  onNavigate,
  onOpenAuth
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
                          <button className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold">
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
