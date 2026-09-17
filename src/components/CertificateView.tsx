import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Printer,
  ExternalLink,
  Award,
  Copy,
  Sparkles,
  Lock,
  Clock,
  AlertTriangle,
  Code2,
  ArrowRight,
  RefreshCw,
  Zap,
  Check,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Certificate, LearnerProfile, DayCurriculum, Problem, FinalAssessmentResult } from '../types';
import { getVerificationUrl, generateHighContrastQR } from '../lib/verification';
import { auditLearnerCompletion, CompletionAudit } from '../lib/completionAudit';
import { api } from '../lib/api';
import { dispatchPushNotification } from '../lib/pushNotifications';

interface CertificateViewProps {
  certificate: Certificate | null;
  learner: LearnerProfile | null;
  curriculum: DayCurriculum[];
  problems: Problem[];
  onOpenAuth: () => void;
  onCertificateUpdated?: (cert: Certificate | null) => void;
  onNavigateToVerify?: (certId: string) => void;
  onNavigateToTab?: (tab: string, contextId?: string) => void;
  onUpdateLearner?: (updated: LearnerProfile) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  certificate,
  learner,
  curriculum,
  problems,
  onOpenAuth,
  onCertificateUpdated,
  onNavigateToVerify,
  onNavigateToTab,
  onUpdateLearner
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTaskFilter, setActiveTaskFilter] = useState<'all' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9' | 'T10'>('all');
  const certRef = useRef<HTMLDivElement>(null);

  // Compute live completion audit
  const audit: CompletionAudit = auditLearnerCompletion(learner, curriculum, problems);
  const isActivated = audit.isCertificateActivated;

  // Active Certificate Object
  const activeCert: Certificate = certificate || {
    certificateId: `CERT-KAPIL-ENTERPRISE-${learner?.id ? learner.id.slice(-4).toUpperCase() : '8910'}`,
    learnerId: learner?.id || 'usr_kapil_01',
    learnerName: learner?.name || 'Kapil Narula',
    learnerEmail: learner?.email || 'kapilnarula27july@gmail.com',
    courseTitle: 'Python Programming With DSA',
    subtitle: 'Powered By Kapil',
    issuedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    status: isActivated ? 'issued' : 'locked',
    verificationUrl: getVerificationUrl('cert', `CERT-KAPIL-ENTERPRISE-${learner?.id ? learner.id.slice(-4).toUpperCase() : '8910'}`),
    grade: 'Executive Honors (Enterprise Distinction)',
    completionSummary: {
      totalSolved: audit.solvedProblemsCount,
      totalAttempted: audit.solvedProblemsCount,
      daysCompleted: audit.completedDaysCount
    }
  };

  const verifyUrl = getVerificationUrl('cert', activeCert.certificateId);

  useEffect(() => {
    if (isActivated) {
      generateHighContrastQR(verifyUrl, 260)
        .then(setQrCodeUrl)
        .catch(console.error);
    }
  }, [verifyUrl, isActivated]);

  const handleCopyVerificationLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Simulate Completing All 10 Days & All Tasks (0 Pending Tasks)
  const handleSimulateCompleteAll = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateCompleteAllTasks();
      if (res.learner && onUpdateLearner) {
        onUpdateLearner(res.learner);
      }
      if (res.certificate && onCertificateUpdated) {
        onCertificateUpdated(res.certificate);
      }
      // Trigger push notification reminder
      dispatchPushNotification({
        id: `push-cert-activated-${Date.now()}`,
        title: '🏆 Certificate Activated & Verified!',
        body: 'All 10 days and 34 tasks completed with zero pending tasks. Your official executive certificate is now active!',
        category: 'final_assessment',
        targetTab: 'certificate',
        timestamp: new Date().toISOString(),
        actionText: 'View Certificate'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  // Simulate Resetting to Incomplete State (Demonstrates Lock Screen with Pending Tasks)
  const handleSimulateResetTasks = async () => {
    setIsSimulating(true);
    try {
      const res = await api.simulateResetPendingTasks();
      if (res.learner && onUpdateLearner) {
        onUpdateLearner(res.learner);
      }
      if (onCertificateUpdated) {
        onCertificateUpdated(null);
      }
      dispatchPushNotification({
        id: `push-cert-locked-${Date.now()}`,
        title: '🔒 Certificate Locked (Tasks Pending)',
        body: 'Pending tasks detected across curriculum days. Complete all tasks to re-activate the Certificate.',
        category: 'pending_tasks',
        targetTab: 'certificate',
        timestamp: new Date().toISOString(),
        actionText: 'Review Audit'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFillColor(253, 250, 243);
    doc.rect(0, 0, 297, 210, 'F');

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(3);
    doc.rect(12, 12, 273, 186);

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1.2);
    doc.rect(15, 15, 267, 180);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.text('FORTUNE 500 EXECUTIVE ASSESSMENT BOARD', 148.5, 34, { align: 'center' });

    doc.setTextColor(180, 83, 9);
    doc.setFontSize(9);
    doc.text('OFFICIAL CERTIFICATE OF COMPLETION & EXECUTIVE MASTERY', 148.5, 40, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(26);
    doc.text('Python Programming With DSA', 148.5, 56, { align: 'center' });

    doc.setTextColor(180, 83, 9);
    doc.setFontSize(14);
    doc.text('POWERED BY KAPIL', 148.5, 64, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(11);
    doc.text('This credential certifies that', 148.5, 82, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(28);
    doc.text(activeCert.learnerName, 148.5, 96, { align: 'center' });

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(11);
    doc.text(
      'has completed all 10 intensive curriculum days, 3 mastery levels, and 34 coding tasks with zero pending requirements,',
      148.5,
      109,
      { align: 'center' }
    );
    doc.text(
      'demonstrating distinguished command of Algorithms, Data Structures, and Python Engineering.',
      148.5,
      116,
      { align: 'center' }
    );

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Certificate ID: ${activeCert.certificateId}`, 30, 155);
    doc.text(`Issue Date: ${activeCert.issuedDate}`, 30, 162);
    doc.text(`Distinction: ${activeCert.grade}`, 30, 169);
    doc.text('Status: 100% Zero-Pending Tasks Verified', 30, 176);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Authorized by:', 220, 155);
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Kapil Narula', 220, 164);
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9);
    doc.text('Lead Instructor & Enterprise Architect', 220, 171);

    doc.save(`Python_DSA_Certificate_${activeCert.certificateId}.pdf`);
  };

  const linkedInCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Python%20Programming%20With%20DSA&organizationName=Fortune%20500%20Executive%20Assessment%20Board&issueYear=2026&issueMonth=9&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(activeCert.certificateId)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;

  // Filter pending tasks
  const filteredPendingTasks = activeTaskFilter === 'all'
    ? audit.pendingProblems
    : audit.pendingProblems.filter(p => p.topicCode === activeTaskFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Simulation & Test Toolbar (Allows testing both Inactive Lockscreen and Active Certificate) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Certificate Activation Controller
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isActivated ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isActivated ? 'Status: Activated' : 'Status: Locked (Pending Tasks)'}
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Rule Enforcement: Certificate will NOT activate unless all tasks, days, and levels are completed with 0 pending tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isActivated ? (
            <button
              onClick={handleSimulateCompleteAll}
              disabled={isSimulating}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Simulate 100% Completion (Zero Pending)</span>
            </button>
          ) : (
            <button
              onClick={handleSimulateResetTasks}
              disabled={isSimulating}
              className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Incomplete (Simulate Pending Tasks)</span>
            </button>
          )}
        </div>
      </div>

      {/* CONDITIONAL DISPLAY: LOCKED AUDIT SCREEN vs ACTIVATED CERTIFICATE */}
      {!isActivated ? (
        /* LOCKSCREEN & AUDIT CHECKLIST */
        <div className="space-y-6">
          {/* Lock Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border-2 border-rose-500/40 p-6 sm:p-10 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                    Certificate Inactive / Locked
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Zero Pending Tasks Required
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Certificate Activation Locked
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Strict Verification Standard: The Final Capstone Certificate will strictly <strong>not activate</strong> until all 10 days, all 3 mastery levels (Beginner, Intermediate, Advanced), and all tasks are completed. You currently have <span className="text-rose-400 font-bold underline">{audit.pendingTasksCount} pending tasks</span> and <span className="text-rose-400 font-bold underline">{audit.pendingDays.length} pending days</span>.
                </p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 text-center shrink-0 min-w-[200px]">
                <div className="text-3xl font-black text-rose-400 font-mono">
                  {audit.activationPercentage}%
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Activation Progress
                </div>
                <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${audit.activationPercentage}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-medium">
                  {audit.pendingTasksCount} tasks pending
                </div>
              </div>
            </div>
          </div>

          {/* 4-Pillar Completion Audit Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Pillar 1: Days */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>10 Curriculum Days</span>
                  <span className={audit.isAllDaysCompleted ? 'text-emerald-600' : 'text-amber-600'}>
                    {audit.completedDaysCount}/10
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  {audit.isAllDaysCompleted ? 'All Days Mastered' : `${audit.pendingDays.length} Days Remaining`}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {audit.isAllDaysCompleted
                    ? 'Days 1 to 10 completed.'
                    : `Pending: ${audit.pendingDays.map(d => `Day ${d.dayNumber}`).slice(0, 3).join(', ')}${audit.pendingDays.length > 3 ? '...' : ''}`}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${audit.isAllDaysCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {audit.isAllDaysCompleted ? 'Requirement Met' : 'Incomplete'}
                </span>
                {audit.isAllDaysCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>
            </div>

            {/* Pillar 2: Tasks */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Zero Pending Tasks</span>
                  <span className={audit.isAllTasksCompleted ? 'text-emerald-600' : 'text-rose-600'}>
                    {audit.solvedProblemsCount}/{audit.totalProblems}
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  {audit.isAllTasksCompleted ? 'Zero Pending Tasks' : `${audit.pendingTasksCount} Tasks Pending`}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {audit.isAllTasksCompleted
                    ? 'All coding challenges solved.'
                    : 'Every problem in the syllabus must be solved.'}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${audit.isAllTasksCompleted ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {audit.isAllTasksCompleted ? 'Requirement Met' : 'Pending Tasks'}
                </span>
                {audit.isAllTasksCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                )}
              </div>
            </div>

            {/* Pillar 3: Levels */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>3 Mastery Levels</span>
                  <span className={audit.isAllLevelsCompleted ? 'text-emerald-600' : 'text-amber-600'}>
                    {audit.levels.filter(l => l.isCompleted).length}/3
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  {audit.isAllLevelsCompleted ? 'All Levels Cleared' : 'Levels Incomplete'}
                </h4>
                <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                  {audit.levels.map(lvl => (
                    <div key={lvl.name} className="flex items-center justify-between">
                      <span>{lvl.name}:</span>
                      <span className={lvl.isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {lvl.isCompleted ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${audit.isAllLevelsCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {audit.isAllLevelsCompleted ? 'Requirement Met' : 'Incomplete'}
                </span>
                {audit.isAllLevelsCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>
            </div>

            {/* Pillar 4: Final Assessment */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Final Capstone Exam</span>
                  <span className="text-indigo-600 font-bold">250 Questions</span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  90-Min Final Exam
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  200 Diagnostic MCQs + 50 Think & Type questions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToTab && onNavigateToTab('final-assessment')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Open Exam</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <GraduationCap className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Pending Tasks Directory with Instant IDE Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-500" />
                  Pending Tasks Directory ({audit.pendingTasksCount})
                </h3>
                <p className="text-xs text-slate-500">
                  Solve each problem to clear pending requirements and activate your certificate.
                </p>
              </div>

              {/* Day filter buttons */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1">
                <button
                  onClick={() => setActiveTaskFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeTaskFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({audit.pendingTasksCount})
                </button>
                {curriculum.map(d => {
                  const count = audit.pendingProblems.filter(p => p.topicCode === d.code).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={d.code}
                      onClick={() => setActiveTaskFilter(d.code as any)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                        activeTaskFilter === d.code
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Day {d.dayNumber} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Pending Tasks */}
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredPendingTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No pending tasks in this category!
                </div>
              ) : (
                filteredPendingTasks.map(prob => {
                  const day = curriculum.find(d => d.code === prob.topicCode);
                  return (
                    <div
                      key={prob.id}
                      className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {day ? `Day ${day.dayNumber}: ${day.title}` : prob.topicCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {prob.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {prob.statement}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (onNavigateToTab) {
                            onNavigateToTab('ide', prob.id);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                      >
                        <span>Solve in IDE</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ACTIVATED CERTIFICATE VIEW */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Certificate Activation Status Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                    Officially Activated
                  </span>
                  <span className="text-xs text-emerald-100 font-mono">
                    Zero Pending Tasks Verified
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">
                  Certificate Activated & Cryptographically Verified
                </h2>
                <p className="text-xs text-emerald-100">
                  All 10 curriculum days, 3 mastery levels, and 34 coding challenges completed with distinction.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 bg-white text-emerald-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95 hover:bg-emerald-50 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Master Certificate Display Card */}
          <div
            ref={certRef}
            className="relative bg-[#fdfaf3] text-slate-900 rounded-2xl p-6 sm:p-12 shadow-2xl border-8 border-slate-900 max-w-5xl mx-auto overflow-hidden"
          >
            {/* Inner Gold Foil Border */}
            <div className="absolute inset-3 border-2 border-amber-500/60 rounded-xl pointer-events-none" />
            <div className="absolute inset-4 border border-amber-600/30 rounded-lg pointer-events-none" />

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

            {/* Certificate Content */}
            <div className="relative z-10 text-center space-y-6 sm:space-y-8">
              {/* Header Crest */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-md">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-700">
                  Fortune 500 Executive Assessment Board
                </div>
                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                  Official Certificate of Completion & Executive Mastery
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 tracking-tight">
                  Python Programming With DSA
                </h1>
                <div className="mt-2 text-sm sm:text-base font-bold text-amber-700 uppercase tracking-widest">
                  Powered By Kapil
                </div>
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-500 italic">
                  This credential solemnly certifies that
                </p>
                <div className="text-2xl sm:text-4xl font-serif font-black text-slate-900 border-b-2 border-slate-300 pb-2 max-w-md mx-auto">
                  {activeCert.learnerName}
                </div>
              </div>

              {/* Distinction Statement */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                has met the rigorous completion standards across all 10 intensive curriculum days, 3 mastery levels, and 34 algorithmic tasks with <strong>zero pending tasks</strong>, demonstrating professional mastery of Python, Algorithm Design, and Complex Data Structures.
              </p>

              {/* Certificate Metadata & QR Code */}
              <div className="pt-6 sm:pt-10 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-center gap-6 text-left">
                {/* Left: Cert details */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">Certificate ID:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">{activeCert.certificateId}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Issued On:</span>{' '}
                    <span>{activeCert.issuedDate}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Distinction:</span>{' '}
                    <span className="text-amber-700 font-bold">{activeCert.grade}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audit Status: 100% Zero-Pending Verified</span>
                  </div>
                </div>

                {/* Center: High-Contrast QR Code */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-2 bg-white rounded-xl shadow-md border-2 border-slate-900">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="High Contrast Verification QR"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                        Generating QR...
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Scan to Verify Online
                  </span>
                </div>

                {/* Right: Signature & Authority */}
                <div className="text-right sm:text-right space-y-1">
                  <div className="text-xs text-slate-500">Authorized Signatory</div>
                  <div className="font-serif text-lg font-bold text-slate-900">
                    Kapil Narula
                  </div>
                  <div className="text-[11px] text-amber-700 font-semibold">
                    Lead Instructor & Enterprise Architect
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Fortune 500 Assessment Board
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Actions & Social Sharing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Verification & Professional Credentials
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={linkedInCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#0077b5] hover:bg-[#00669c] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Add to LinkedIn Profile
              </a>

              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                Share on LinkedIn Feed
              </a>

              <button
                onClick={handleCopyVerificationLink}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Link Copied!' : 'Copy Verification URL'}
              </button>

              <button
                onClick={() => {
                  if (onNavigateToVerify) {
                    onNavigateToVerify(activeCert.certificateId);
                  }
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Verification Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
