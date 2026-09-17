import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Flag,
  RotateCcw,
  Trophy,
  ExternalLink,
  Copy,
  Download,
  BookOpen,
  Terminal,
  Check,
  X,
  FileCheck,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Lock,
  Search,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';
import {
  FINAL_ASSESSMENT_MCQS,
  FINAL_ASSESSMENT_THINK_TYPE,
  FinalAssessmentMCQ,
  FinalAssessmentThinkType
} from '../data/finalAssessmentData';
import { LearnerProfile, Certificate, FinalAssessmentResult, FinalAssessmentTopicScore } from '../types';
import { api } from '../lib/api';
import { getVerificationUrl, generateHighContrastQR } from '../lib/verification';

interface FinalAssessmentViewProps {
  learner: LearnerProfile | null;
  onOpenAuth: () => void;
  onNavigateToVerify: (certId: string) => void;
  onCertificateEarned?: (cert: Certificate) => void;
  onBackToDashboard: () => void;
}

export const FinalAssessmentView: React.FC<FinalAssessmentViewProps> = ({
  learner,
  onOpenAuth,
  onNavigateToVerify,
  onCertificateEarned,
  onBackToDashboard
}) => {
  // State: briefing | in_progress | results | review
  const [assessmentState, setAssessmentState] = useState<'briefing' | 'in_progress' | 'results' | 'review'>('briefing');
  
  // Learner identification
  const [candidateName, setCandidateName] = useState(learner?.name || 'Kapil Narula');
  const [candidateEmail, setCandidateEmail] = useState(learner?.email || 'kapilnarula27july@gmail.com');

  // Exam state
  const TOTAL_TIME_SECONDS = 90 * 60; // 90 minutes = 5400 seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME_SECONDS);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Section: 'mcq' (200 questions) or 'think_type' (50 questions)
  const [activeSection, setActiveSection] = useState<'mcq' | 'think_type'>('mcq');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Answers & flags
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [thinkTypeAnswers, setThinkTypeAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // UI helpers
  const [filterTopic, setFilterTopic] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unanswered' | 'flagged' | 'answered'>('all');
  const [showPaletteDrawer, setShowPaletteDrawer] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Results & Certificate
  const [resultData, setResultData] = useState<FinalAssessmentResult | null>(null);
  const [certQrUrl, setCertQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Review mode filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [reviewSection, setReviewSection] = useState<'all' | 'mcq' | 'think_type'>('all');

  // Update learner details when learner prop updates
  useEffect(() => {
    if (learner) {
      if (learner.name) setCandidateName(learner.name);
      if (learner.email) setCandidateEmail(learner.email);
    }
  }, [learner]);

  // Check if learner already has a previous assessment result stored
  useEffect(() => {
    const loadPreviousResult = async () => {
      try {
        const prev = await api.getFinalAssessmentResult();
        if (prev) {
          setResultData(prev);
          if (prev.certificate) {
            const url = getVerificationUrl('cert', prev.certificate.certificateId);
            generateHighContrastQR(url, 220).then(setCertQrUrl).catch(() => {});
          }
        }
      } catch (e) {
        console.warn('Could not load previous final assessment result', e);
      }
    };
    loadPreviousResult();
  }, []);

  // 90-Minute Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && assessmentState === 'in_progress') {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleTimeExpiryAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, assessmentState]);

  // Handle start assessment
  const handleStartExam = () => {
    setTimeRemaining(TOTAL_TIME_SECONDS);
    setTimerActive(true);
    setActiveSection('mcq');
    setActiveQuestionIndex(0);
    setAssessmentState('in_progress');
  };

  // Time expiry auto-submit
  const handleTimeExpiryAutoSubmit = async () => {
    setTimerActive(false);
    await executeSubmission();
  };

  // Execute submission
  const executeSubmission = async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      const timeSpent = TOTAL_TIME_SECONDS - timeRemaining;
      const res = await api.submitFinalAssessment(
        candidateName,
        candidateEmail,
        mcqAnswers,
        thinkTypeAnswers,
        timeSpent
      );

      setResultData(res.result);
      setTimerActive(false);
      setAssessmentState('results');

      if (res.certificate) {
        if (onCertificateEarned) {
          onCertificateEarned(res.certificate);
        }
        const verifyUrl = getVerificationUrl('cert', res.certificate.certificateId);
        const qr = await generateHighContrastQR(verifyUrl, 240);
        setCertQrUrl(qr);
      }
    } catch (err) {
      console.error('Final assessment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Counts
  const totalMCQs = FINAL_ASSESSMENT_MCQS.length; // 200
  const totalThinkType = FINAL_ASSESSMENT_THINK_TYPE.length; // 50
  const answeredMCQsCount = Object.keys(mcqAnswers).length;
  const answeredThinkTypeCount = Object.values(thinkTypeAnswers).filter(t => typeof t === 'string' && t.trim().length > 0).length;
  const totalAnsweredCount = answeredMCQsCount + answeredThinkTypeCount;
  const totalQuestions = totalMCQs + totalThinkType; // 250

  // Active question pointers
  const currentMCQ: FinalAssessmentMCQ | undefined = FINAL_ASSESSMENT_MCQS[activeQuestionIndex];
  const currentTT: FinalAssessmentThinkType | undefined = FINAL_ASSESSMENT_THINK_TYPE[activeQuestionIndex];

  // Current question ID and flag status
  const currentQId = activeSection === 'mcq' ? currentMCQ?.id : currentTT?.id;
  const isCurrentFlagged = currentQId ? !!flaggedQuestions[currentQId] : false;

  const toggleFlagCurrentQuestion = () => {
    if (!currentQId) return;
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQId]: !prev[currentQId]
    }));
  };

  // Copy Verification URL
  const handleCopyVerification = () => {
    if (!resultData?.certificateId) return;
    const url = getVerificationUrl('cert', resultData.certificateId);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // -------------------------------------------------------------
  // VIEW 1: BRIEFING / INTRO SCREEN
  // -------------------------------------------------------------
  if (assessmentState === 'briefing') {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e1b4b] border border-amber-500/30 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              Executive Accreditation &bull; Python & DSA Grand Master
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Certified Final Assessment
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              The capstone accreditation for the <strong className="text-amber-400">Python Programming With DSA</strong> curriculum. Evaluates complete mastery across all 10 modules through 200 diagnostic MCQs and 50 Think & Type technical challenges.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700">
                <Clock className="w-4 h-4 text-amber-400" />
                <span><strong>90 Minutes</strong> Strict Time Limit</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span><strong>250 Questions</strong> (200 MCQ + 50 Think & Type)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700">
                <Award className="w-4 h-4 text-emerald-400" />
                <span><strong>QR-Verified Certificate</strong> on 60%+ Score</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        {/* Existing Result Card if completed */}
        {resultData && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase tracking-wide">
                    {resultData.passed ? 'Certified' : 'Attempted'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(resultData.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  Previous Score: {resultData.totalScore} / {resultData.totalQuestions} ({resultData.percentage}%)
                </h3>
                <p className="text-xs text-slate-300">{resultData.grade}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setAssessmentState('results')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <FileCheck className="w-4 h-4 text-amber-400" />
                View Report & Certificate
              </button>
              <button
                onClick={handleStartExam}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </button>
            </div>
          </div>
        )}

        {/* Assessment Structure & Anti-Guess Integrity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rules & Structure */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
              <GraduationCap className="w-5 h-5" />
              <h3>Assessment Structure & Rigor</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">1</span>
                <div>
                  <strong className="text-white">Section A: 200 Diagnostic MCQs</strong>
                  <p className="text-slate-400 text-xs mt-0.5">20 targeted questions per topic across Day 1 (Logic Patterns) to Day 10 (Dynamic Programming & Optimization).</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">2</span>
                <div>
                  <strong className="text-white">Section B: 50 Think & Type Challenges</strong>
                  <p className="text-slate-400 text-xs mt-0.5">Direct analytical calculation questions requiring exact mathematical, Big-O, or algorithmic values (no multiple choices).</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-mono text-xs font-bold">3</span>
                <div>
                  <strong className="text-white">Continuous 90-Minute Timer</strong>
                  <p className="text-slate-400 text-xs mt-0.5">Proctored countdown with automatic submission upon timer expiry. Learners may freely jump between questions.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Anti-Guessing & Integrity Guarantee */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <h3>Anti-Guessing Integrity System</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              This assessment utilizes an enterprise anti-pattern architecture to guarantee legitimate algorithmic proficiency:
            </p>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Sequential Patterns:</strong> Correct options are strictly balanced (exactly 50 A, 50 B, 50 C, 50 D) with no consecutive repetitions of answers. Guessing sequences like "all A" will fail the assessment.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Zero Duplicate Questions:</strong> Every question is uniquely authored to test syntax, pointer mechanics, recurrence bounds, and edge cases.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Verifiable QR Credential:</strong> Scoring 60% (150/250) or higher immediately issues an official QR-verified certificate hosted on the public registry.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Registration Details */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Candidate Information for Official Credential</h3>
            <p className="text-xs text-slate-400 mt-1">
              Please verify your full legal name and email address. These details will be permanently engraved onto your verified completion certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name (as to appear on certificate)</label>
              <input
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                placeholder="e.g. Kapil Narula"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Registered Email Address</label>
              <input
                type="email"
                value={candidateEmail}
                onChange={e => setCandidateEmail(e.target.value)}
                placeholder="e.g. kapilnarula27july@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBackToDashboard}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              &larr; Return to Learner Dashboard
            </button>

            <button
              onClick={handleStartExam}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-950/40 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <Trophy className="w-5 h-5" />
              Begin 90-Minute Certified Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE EXAM SCREEN (PROCTORED LIVE TESTING)
  // -------------------------------------------------------------
  if (assessmentState === 'in_progress') {
    const isMcqSection = activeSection === 'mcq';
    const activeQuestionsList = isMcqSection ? FINAL_ASSESSMENT_MCQS : FINAL_ASSESSMENT_THINK_TYPE;
    const currentQNumber = activeQuestionIndex + 1;
    const sectionTotal = activeQuestionsList.length;

    // Filter questions for the palette drawer
    const filteredQuestions = activeQuestionsList.filter(q => {
      if (filterTopic !== 'ALL' && q.topicCode !== filterTopic) return false;
      const isAns = isMcqSection ? !!mcqAnswers[q.id] : !!(thinkTypeAnswers[q.id] || '').trim();
      const isFlg = !!flaggedQuestions[q.id];

      if (filterStatus === 'answered') return isAns;
      if (filterStatus === 'unanswered') return !isAns;
      if (filterStatus === 'flagged') return isFlg;
      return true;
    });

    const timerColorClass =
      timeRemaining <= 300
        ? 'text-red-400 animate-pulse bg-red-950/40 border-red-500/40'
        : timeRemaining <= 1200
        ? 'text-amber-400 bg-amber-950/40 border-amber-500/40'
        : 'text-emerald-400 bg-slate-900 border-slate-800';

    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {/* Sticky Exam Control Bar */}
        <div className="sticky top-2 z-30 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Certified Assessment</span>
                <span className="text-[11px] text-slate-400">Day 1 - Day 10</span>
              </div>
              <div className="text-xs text-amber-400 font-medium">
                {totalAnsweredCount} of {totalQuestions} answered ({Math.round((totalAnsweredCount / totalQuestions) * 100)}%)
              </div>
            </div>
          </div>

          {/* Center: Live Countdown Timer */}
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono text-lg font-black shadow-inner ${timerColorClass}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPaletteDrawer(!showPaletteDrawer)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Palette ({filteredQuestions.length})</span>
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Exam</span>
            </button>
          </div>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveSection('mcq');
                setActiveQuestionIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeSection === 'mcq'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Section A: 200 MCQs</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${activeSection === 'mcq' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                {answeredMCQsCount}/200
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSection('think_type');
                setActiveQuestionIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeSection === 'think_type'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Section B: 50 Think & Type</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${activeSection === 'think_type' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                {answeredThinkTypeCount}/50
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Overall Progress:</span>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${(totalAnsweredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
            <span className="font-mono text-white">{totalAnsweredCount}/{totalQuestions}</span>
          </div>
        </div>

        {/* Question Palette Drawer (Collapsible) */}
        {showPaletteDrawer && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Filter Topic:</span>
                <select
                  value={filterTopic}
                  onChange={e => setFilterTopic(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="ALL">All 10 Topics</option>
                  <option value="T1">T1: Pattern Programming</option>
                  <option value="T2">T2: Array Essentials</option>
                  <option value="T3">T3: Two-Pointer & Sliding Window</option>
                  <option value="T4">T4: 2D Matrices</option>
                  <option value="T5">T5: Strings & Hash Tables</option>
                  <option value="T6">T6: Recursion & Backtracking</option>
                  <option value="T7">T7: Stacks & Queues</option>
                  <option value="T8">T8: Linked Lists</option>
                  <option value="T9">T9: Trees & Graphs</option>
                  <option value="T10">T10: DP & Greedy</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Status:</span>
                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
                  {(['all', 'unanswered', 'flagged', 'answered'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                        filterStatus === st ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick jump question numbers grid */}
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {activeQuestionsList.map((q, idx) => {
                const isAns = isMcqSection ? !!mcqAnswers[q.id] : !!(thinkTypeAnswers[q.id] || '').trim();
                const isFlg = !!flaggedQuestions[q.id];
                const isCurr = idx === activeQuestionIndex;

                let btnClass = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600';
                if (isAns) btnClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 font-bold';
                if (isFlg) btnClass = 'bg-amber-950/60 text-amber-300 border-amber-500/50 font-bold';
                if (isCurr) btnClass += ' ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 text-white';

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      setShowPaletteDrawer(false);
                    }}
                    className={`h-8 rounded-lg border text-xs font-mono transition-all flex items-center justify-center relative ${btnClass}`}
                    title={`Q${idx + 1}: ${q.topicCode}`}
                  >
                    {idx + 1}
                    {isFlg && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Question Card */}
        {isMcqSection && currentMCQ && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Question Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                  Question {currentQNumber} of {sectionTotal}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                  {currentMCQ.topicCode}: {currentMCQ.topicName}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  currentMCQ.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' :
                  currentMCQ.difficulty === 'Medium' ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40' :
                  'text-rose-400 bg-rose-950/40 border border-rose-800/40'
                }`}>
                  {currentMCQ.difficulty}
                </span>
              </div>

              <button
                onClick={toggleFlagCurrentQuestion}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCurrentFlagged
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isCurrentFlagged ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentMCQ.question}
              </h2>

              {currentMCQ.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] p-4 text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-500">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Python Code Context</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{currentMCQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* 4 Options Grid */}
            <div className="space-y-3 pt-2">
              {currentMCQ.options.map(opt => {
                const isSelected = mcqAnswers[currentMCQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setMcqAnswers(prev => ({
                        ...prev,
                        [currentMCQ.id]: opt.id
                      }));
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {opt.id}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                        {opt.text}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Question
              </button>

              <div className="text-xs text-slate-400">
                {mcqAnswers[currentMCQ.id] ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Option {mcqAnswers[currentMCQ.id]} Selected
                  </span>
                ) : (
                  <span className="text-slate-500">Unanswered</span>
                )}
              </div>

              {activeQuestionIndex < sectionTotal - 1 ? (
                <button
                  onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection('think_type');
                    setActiveQuestionIndex(0);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  Proceed to Section B
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Think & Type Question Card */}
        {!isMcqSection && currentTT && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                  Think & Type Challenge {currentQNumber} of {sectionTotal}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold">
                  {currentTT.topicCode}: {currentTT.topicName}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  currentTT.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' :
                  currentTT.difficulty === 'Medium' ? 'text-amber-400 bg-amber-950/40 border border-amber-800/40' :
                  'text-rose-400 bg-rose-950/40 border border-rose-800/40'
                }`}>
                  {currentTT.difficulty}
                </span>
              </div>

              <button
                onClick={toggleFlagCurrentQuestion}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCurrentFlagged
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isCurrentFlagged ? 'Flagged' : 'Flag for Review'}</span>
              </button>
            </div>

            {/* Prompt Statement */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentTT.question}
              </h2>

              {currentTT.codeSnippet && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] p-4 text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-500">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Technical Reference</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{currentTT.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Direct Input Field */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>Your Analytical Answer (Exact Value or Expression):</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={thinkTypeAnswers[currentTT.id] || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setThinkTypeAnswers(prev => ({
                      ...prev,
                      [currentTT.id]: val
                    }));
                  }}
                  placeholder={currentTT.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Answers are case-insensitive and whitespace-normalized. Enter exact numbers, keywords, or Big-O complexities (e.g. 15, True, O(N)).
              </p>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Question
              </button>

              <div className="text-xs text-slate-400">
                {(thinkTypeAnswers[currentTT.id] || '').trim() ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Answer Recorded
                  </span>
                ) : (
                  <span className="text-slate-500">Unanswered</span>
                )}
              </div>

              {activeQuestionIndex < sectionTotal - 1 ? (
                <button
                  onClick={() => setActiveQuestionIndex(prev => prev + 1)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all"
                >
                  Finalize & Submit Exam
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Assessment Submission</h3>
                  <p className="text-xs text-slate-400">Your responses will be graded instantly.</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>MCQs Answered:</span>
                  <span className="font-mono text-white font-bold">{answeredMCQsCount} / 200</span>
                </div>
                <div className="flex justify-between">
                  <span>Think & Type Answered:</span>
                  <span className="font-mono text-white font-bold">{answeredThinkTypeCount} / 50</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                  <span className="text-amber-400">Total Answered:</span>
                  <span className="font-mono text-amber-400">{totalAnsweredCount} / 250</span>
                </div>
                {totalQuestions - totalAnsweredCount > 0 && (
                  <div className="text-[11px] text-amber-400/90 pt-1">
                    Warning: You have {totalQuestions - totalAnsweredCount} unanswered questions remaining.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Return to Exam
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={executeSubmission}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm & Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: RESULTS SCREEN & VERIFIED UNIQUE CERTIFICATE
  // -------------------------------------------------------------
  if (assessmentState === 'results' && resultData) {
    const isPassed = resultData.passed;

    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {/* Banner */}
        <div className={`relative overflow-hidden rounded-2xl border p-8 sm:p-10 shadow-2xl text-white ${
          isPassed
            ? 'bg-gradient-to-br from-[#0b1c13] via-[#0f291e] to-[#0f172a] border-emerald-500/40'
            : 'bg-gradient-to-br from-[#1c0f0f] via-[#290f14] to-[#0f172a] border-rose-500/40'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/60 border border-slate-700">
                {isPassed ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Certified Grand Master
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Retake Recommended
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {isPassed ? 'Assessment Passed with Honors!' : 'Assessment Completed'}
              </h1>
              <p className="text-slate-300 text-sm max-w-xl">
                {isPassed
                  ? `Candidate ${resultData.learnerName} has officially verified executive competence across Day 1 to Day 10 topics.`
                  : `You scored ${resultData.totalScore}/250 (${resultData.percentage}%). A score of 60% (150/250) is required for certification.`}
              </p>
              <div className="text-xs text-amber-400 font-semibold pt-1">
                Grade Awarded: {resultData.grade}
              </div>
            </div>

            {/* Score Ring / Badge */}
            <div className="shrink-0 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-1 min-w-[200px]">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Score</span>
              <div className="text-4xl font-black font-mono text-white">
                {resultData.totalScore} <span className="text-lg text-slate-500">/ 250</span>
              </div>
              <div className={`text-sm font-bold font-mono ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {resultData.percentage}%
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                MCQ: {resultData.mcqScore}/200 &bull; Think: {resultData.thinkTypeScore}/50
              </div>
            </div>
          </div>
        </div>

        {/* QR-Verified Unique Certificate Card (if passed) */}
        {isPassed && resultData.certificateId && (
          <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  <ShieldCheck className="w-4 h-4" /> Official Enterprise Credential Issued
                </span>
                <h2 className="text-xl font-extrabold text-white mt-2">
                  Verifiable Grand Master Certificate
                </h2>
                <p className="text-xs text-slate-400">
                  Unique Certificate ID: <span className="font-mono text-amber-300 font-bold">{resultData.certificateId}</span>
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigateToVerify(resultData.certificateId!)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  View in Verifier
                </button>
                <button
                  onClick={handleCopyVerification}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Certificate Display Shell */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 rounded-xl bg-slate-950 p-6 border border-slate-800 space-y-4 text-slate-300 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span>ISSUED TO: <strong className="text-white">{resultData.learnerName}</strong></span>
                  <span>DATE: <strong className="text-white">{new Date(resultData.submittedAt).toLocaleDateString()}</strong></span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-amber-300">
                    Executive Certification in Python Programming With DSA
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Curriculum engineered by Kapil Narula. Completed 250 enterprise problems across Day 1 to Day 10 with distinction honors.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">SCORE</span>
                    <span className="text-white font-bold">{resultData.totalScore}/250</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">GRADE</span>
                    <span className="text-emerald-400 font-bold truncate">Honors</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                    <span className="text-slate-500 block">DAYS</span>
                    <span className="text-amber-400 font-bold">10 / 10</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-white border border-slate-300 shadow-md">
                {certQrUrl ? (
                  <img
                    src={certQrUrl}
                    alt="Certificate QR Verification Code"
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-500">
                    Generating QR...
                  </div>
                )}
                <span className="text-[10px] font-mono font-bold text-slate-900 mt-2 text-center uppercase tracking-wider">
                  Scan to Verify Authenticity
                </span>
                <span className="text-[9px] font-mono text-slate-500 truncate max-w-[160px]">
                  {resultData.certificateId}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Topic Breakdown (T1 to T10) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Topic Mastery Breakdown</h3>
              <p className="text-xs text-slate-400">Detailed scores across each curriculum module (25 total points per day)</p>
            </div>
            <button
              onClick={() => setAssessmentState('review')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Review All 250 Questions & Explanations</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resultData.topicBreakdown.map(tb => {
              const pct = tb.percentage;
              const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
              return (
                <div key={tb.topicCode} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{tb.topicCode}: {tb.topicName}</span>
                    <span className="font-mono text-slate-300 font-bold">{tb.score}/{tb.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={onBackToDashboard}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            &larr; Return to Learner Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartExam}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </button>

            <button
              onClick={() => setAssessmentState('review')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Detailed Solutions & Explanations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 4: REVIEW MODE (FULL 250 EXPLANATIONS)
  // -------------------------------------------------------------
  if (assessmentState === 'review' && resultData) {
    const qResults = resultData.questionResults || [];

    const filteredReview = qResults.filter(q => {
      if (reviewSection === 'mcq' && q.type !== 'mcq') return false;
      if (reviewSection === 'think_type' && q.type !== 'think_type') return false;

      if (reviewFilter === 'correct' && !q.isCorrect) return false;
      if (reviewFilter === 'incorrect' && q.isCorrect) return false;
      return true;
    });

    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <button
              onClick={() => setAssessmentState('results')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold mb-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Score Report
            </button>
            <h2 className="text-2xl font-black text-white">
              Assessment Review & Detailed Explanations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredReview.length} of {qResults.length} questions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Section selector */}
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
              {(['all', 'mcq', 'think_type'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setReviewSection(sec)}
                  className={`px-3 py-1 rounded-md capitalize font-semibold transition-all ${
                    reviewSection === sec ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sec === 'all' ? 'All' : sec === 'mcq' ? 'MCQ (200)' : 'Think & Type (50)'}
                </button>
              ))}
            </div>

            {/* Filter correct/incorrect */}
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
              {(['all', 'incorrect', 'correct'] as const).map(flt => (
                <button
                  key={flt}
                  onClick={() => setReviewFilter(flt)}
                  className={`px-3 py-1 rounded-md capitalize font-semibold transition-all ${
                    reviewFilter === flt ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filteredReview.map(q => (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 space-y-3 transition-all ${
                q.isCorrect
                  ? 'border-emerald-500/30 bg-slate-900/60'
                  : 'border-rose-500/30 bg-rose-950/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                    Q{q.questionNumber} ({q.type.toUpperCase()})
                  </span>
                  <span className="text-slate-400 font-semibold">{q.topicCode}: {q.topicName}</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold">
                  {q.isCorrect ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <X className="w-4 h-4" /> Incorrect (0)
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white">{q.question}</h4>

              {/* User vs Correct */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className={`p-2.5 rounded-xl border font-mono ${
                  q.isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                }`}>
                  <span className="text-[10px] text-slate-400 block font-sans">YOUR ANSWER</span>
                  <strong>{q.userAnswer || '(Unanswered)'}</strong>
                </div>

                <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 font-mono text-emerald-300">
                  <span className="text-[10px] text-slate-400 block font-sans">CORRECT ANSWER</span>
                  <strong>{q.correctAnswer}</strong>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Conceptual Takeaway:
                </span>
                <p className="leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
