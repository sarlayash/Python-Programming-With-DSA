import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCw,
  Trophy,
  Award,
  FileCheck,
  CheckCircle2,
  XCircle,
  Flame,
  Sparkles,
  Clock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Volume2,
  VolumeX,
  Code2,
  ShieldCheck,
  Zap,
  Calendar,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import {
  WHEEL_SEGMENTS,
  WheelSegmentConfig,
  getDailyChallengeForDate,
  getRandom10MCQs
} from '../data/mcqQuestionBank';
import { MCQQuestion, EarnedBadge, Certificate } from '../types';
import { api } from '../lib/api';
import { getVerificationUrl } from '../lib/verification';

interface SpinningWheelViewProps {
  learner: any;
  onOpenAuth: () => void;
  onNavigateToTab: (tab: string, context?: any) => void;
  onNavigateToVerify: (type: 'cert' | 'badge', id: string) => void;
}

export const SpinningWheelView: React.FC<SpinningWheelViewProps> = ({
  learner,
  onOpenAuth,
  onNavigateToTab,
  onNavigateToVerify
}) => {
  // Wheel State
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegmentConfig | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Daily Challenge State
  const todayChallenge = getDailyChallengeForDate();
  const [timeUntilTomorrow, setTimeUntilTomorrow] = useState<string>('');
  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    const saved = localStorage.getItem('kapil_dsa_daily_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Quiz Mode State: 'idle' | 'spinning' | 'quiz' | 'results'
  const [quizState, setQuizState] = useState<'idle' | 'spinning' | 'quiz' | 'results'>('idle');
  const [activeQuestions, setActiveQuestions] = useState<MCQQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizDurationSec, setQuizDurationSec] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Result State
  const [quizResult, setQuizResult] = useState<{
    correctCount: number;
    total: number;
    percentage: number;
    passed: boolean;
    earnedBadge?: EarnedBadge | null;
    earnedCertificate?: Certificate | null;
  } | null>(null);

  // Audio Context Ref for synthetic ticks
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilTomorrow(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer for active quiz
  useEffect(() => {
    let timer: any;
    if (quizState === 'quiz') {
      timer = setInterval(() => {
        setQuizDurationSec(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState]);

  // Play synthetic Web Audio tick
  const playTickSound = (freq = 600, duration = 0.03) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
      }
    } catch {}
  };

  // Play celebratory chime
  const playVictoryFanfare = () => {
    if (!soundEnabled) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((pitch, idx) => {
        setTimeout(() => {
          playTickSound(pitch, 0.25);
        }, idx * 120);
      });
    } catch {}
  };

  // Spin the wheel
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setQuizState('spinning');

    // Pick random target slice
    const totalSegments = WHEEL_SEGMENTS.length;
    const targetIndex = Math.floor(Math.random() * totalSegments);
    const targetSegment = WHEEL_SEGMENTS[targetIndex];

    // Calculate angles
    const segmentAngle = 360 / totalSegments;
    // Pointer is at the top (270 degrees or 90 degrees depending on coordinate system).
    // Let's set pointer at top (0 degrees or 270 degrees).
    // Slices are drawn centered around (index * segmentAngle + segmentAngle / 2).
    // To land targetIndex at top (270 deg):
    const currentRot = rotation;
    const fullSpins = 5 + Math.floor(Math.random() * 4); // 5-8 full spins
    const targetAngle = 360 - (targetIndex * segmentAngle + segmentAngle / 2);
    const finalRot = currentRot + (fullSpins * 360) + ((targetAngle - (currentRot % 360) + 360) % 360);

    setRotation(finalRot);

    // Simulated ticking sound during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playTickSound(450 + (tickCount % 3) * 80, 0.02);
      if (tickCount > 24) clearInterval(tickInterval);
    }, 130);

    // Complete spin after animation duration (4 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSegment(targetSegment);
      playTickSound(880, 0.15);

      // Prepare 10 questions
      const questions = getRandom10MCQs(targetSegment.topicCode);
      setActiveQuestions(questions);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setQuizDurationSec(0);
      setQuizStartTime(Date.now());
      setQuizState('quiz');
    }, 4000);
  };

  // Start Today's Challenge directly
  const handleStartTodayChallenge = () => {
    const todaySeg: WheelSegmentConfig = {
      id: 'daily-' + todayChallenge.topicCode,
      label: todayChallenge.title,
      topicCode: todayChallenge.topicCode,
      subLabel: todayChallenge.topicName,
      color: '#ea580c',
      textColor: '#ffffff'
    };
    setSelectedSegment(todaySeg);
    const questions = getRandom10MCQs(todayChallenge.topicCode);
    setActiveQuestions(questions);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizDurationSec(0);
    setQuizStartTime(Date.now());
    setQuizState('quiz');
  };

  // Select Option
  const handleSelectOption = (questionId: string, optionId: string) => {
    playTickSound(520, 0.04);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    let correct = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= 80;

    try {
      const topicCode = selectedSegment?.topicCode || 'MIXED';
      const topicName = selectedSegment?.subLabel || selectedSegment?.label || 'Daily Python Challenge';

      const res = await api.submitMCQQuiz({
        learnerId: learner?.id,
        learnerName: learner?.name || 'Kapil Narula',
        learnerEmail: learner?.email || 'kapilnarula27july@gmail.com',
        topicCode,
        topicName,
        totalQuestions: total,
        correctCount: correct,
        percentage,
        answers: selectedAnswers
      });

      setQuizResult({
        correctCount: correct,
        total,
        percentage,
        passed,
        earnedBadge: res.newlyEarnedBadge,
        earnedCertificate: res.newlyEarnedCertificate
      });

      if (passed) {
        playVictoryFanfare();
        // Increment streak if passed
        const newStreak = dailyStreak + 1;
        setDailyStreak(newStreak);
        localStorage.setItem('kapil_dsa_daily_streak', newStreak.toString());
      }
    } catch (err) {
      console.error('Failed to submit MCQ quiz:', err);
      // Fallback display
      setQuizResult({
        correctCount: correct,
        total,
        percentage,
        passed
      });
    } finally {
      setIsSubmitting(false);
      setQuizState('results');
    }
  };

  // Wheel Geometry Helper
  const totalSegments = WHEEL_SEGMENTS.length;
  const radius = 175;
  const center = 200;
  const segmentAngle = 360 / totalSegments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Daily Challenge & Streak Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-md flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                Daily Challenge Active
              </span>
              <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold rounded-md flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {todayChallenge.date} &bull; Day #{todayChallenge.dayIndex}
              </span>
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {dailyStreak} Day Streak!
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spinning Wheel & Daily 10 MCQs
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Spin the lucky wheel or attempt today&apos;s featured challenge: <strong className="text-amber-300">{todayChallenge.topicName}</strong>.
              Score <strong className="text-emerald-400">80% or higher (8/10)</strong> to unlock an exclusive verifiable Badge and official Certificate of Achievement! A fresh challenge arrives every single day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto shrink-0">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-center sm:text-right">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-center md:justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Tomorrow&apos;s Challenge In
              </div>
              <div className="text-base font-mono font-bold text-amber-400">
                {timeUntilTomorrow || '23h 59m 59s'}
              </div>
            </div>

            {quizState === 'idle' && (
              <button
                onClick={handleStartTodayChallenge}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                Start Today&apos;s Challenge
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW STATE 1: IDLE / SPINNING WHEEL */}
      {(quizState === 'idle' || quizState === 'spinning') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Wheel Canvas / SVG Stage */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] flex items-center justify-center select-none">
              {/* Outer Golden Trim Ring */}
              <div className="absolute inset-0 rounded-full border-[10px] border-slate-900 shadow-2xl bg-slate-950" />
              <div className="absolute inset-2 rounded-full border-[3px] border-amber-500/40 shadow-inner" />

              {/* Decorative Peg Dots */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const rad = (angle * Math.PI) / 180;
                const dotX = 200 + 190 * Math.cos(rad);
                const dotY = 200 + 190 * Math.sin(rad);
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-950"
                    style={{
                      left: `calc(${(dotX / 400) * 100}% - 4px)`,
                      top: `calc(${(dotY / 400) * 100}% - 4px)`
                    }}
                  />
                );
              })}

              {/* Top Pointer Indicator */}
              <div className="absolute -top-3 z-30 flex flex-col items-center">
                <div
                  className={`w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform duration-100 ${
                    isSpinning ? 'animate-bounce' : ''
                  }`}
                />
                <div className="w-3 h-3 rounded-full bg-slate-950 border-2 border-white -mt-7" />
              </div>

              {/* Rotating SVG Wheel */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full transform transition-transform duration-[4000ms] cubic-bezier"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.25, 1)'
                }}
              >
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3" />
                  </filter>
                </defs>

                {WHEEL_SEGMENTS.map((seg, idx) => {
                  const startAngle = idx * segmentAngle;
                  const endAngle = (idx + 1) * segmentAngle;
                  const midAngle = startAngle + segmentAngle / 2;

                  // Polar to cartesian coordinates
                  const startRad = ((startAngle - 90) * Math.PI) / 180;
                  const endRad = ((endAngle - 90) * Math.PI) / 180;
                  const midRad = ((midAngle - 90) * Math.PI) / 180;

                  const x1 = center + radius * Math.cos(startRad);
                  const y1 = center + radius * Math.sin(startRad);
                  const x2 = center + radius * Math.cos(endRad);
                  const y2 = center + radius * Math.sin(endRad);

                  const textDist = radius * 0.68;
                  const tx = center + textDist * Math.cos(midRad);
                  const ty = center + textDist * Math.sin(midRad);

                  const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                  return (
                    <g key={seg.id}>
                      <path
                        d={pathData}
                        fill={seg.color}
                        stroke="#0f172a"
                        strokeWidth="2"
                        className="transition-colors hover:brightness-110"
                      />
                      <g transform={`translate(${tx}, ${ty}) rotate(${midAngle})`}>
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={seg.textColor}
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {seg.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Center Hub */}
                <circle cx={center} cy={center} r="42" fill="#0f172a" stroke="#f59e0b" strokeWidth="4" />
                <circle cx={center} cy={center} r="34" fill="#1e293b" />
              </svg>

              {/* Center Hub Overlay with Spin Button */}
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className={`absolute z-20 w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-xl transition-transform ${
                  isSpinning
                    ? 'bg-amber-600 text-slate-950 scale-95 cursor-not-allowed opacity-90'
                    : 'bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-amber-500/30'
                }`}
              >
                <RotateCw className={`w-5 h-5 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'LUCKY...' : 'SPIN!'}</span>
              </button>
            </div>

            {/* Wheel Control & Sound Bar */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/20 flex items-center gap-2 transition-all"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Spinning Topic...' : 'Spin the Fortune Wheel'}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-300 transition-colors"
                title={soundEnabled ? 'Mute Sounds' : 'Enable Wheel Sounds'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Right Rules & Reward Overview Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wide">
                <Trophy className="w-4 h-4" />
                Qualification Rules & Credentials
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Score 80% or Higher to Win
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Each spin or daily challenge generates <strong className="text-slate-800">10 randomized Python & DSA MCQs</strong> testing logic building, code trace, Big-O analysis, and tricky edge cases.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold text-sm">
                    8/10
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Passing Benchmark: 80%</h4>
                    <p className="text-xs text-slate-600">Answer at least 8 out of 10 questions correctly to qualify for certified credentials.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Official Verifiable Badge</h4>
                    <p className="text-xs text-slate-600">Earn an exclusive cryptographic badge permanently registered under your learner profile.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Official Certificate of Achievement</h4>
                    <p className="text-xs text-slate-600">Unlocked with QR code verification, Kapil&apos;s executive seal, and distinction grade.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>🔄 1 New Daily Challenge Every Day</span>
                <span className="font-semibold text-amber-600">Unlimited Spin Practice</span>
              </div>
            </div>

            {/* Quick Curriculum Slices Legend */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                Wheel Topics on the Board
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WHEEL_SEGMENTS.slice(0, 10).map(seg => (
                  <div key={seg.id} className="flex items-center gap-2 text-[11px] text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="truncate font-medium">{seg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW STATE 2: ACTIVE 10-MCQ QUIZ */}
      {quizState === 'quiz' && activeQuestions.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Quiz Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-bold rounded-md">
                  {selectedSegment?.label || 'Topic Quiz'}
                </span>
                <span className="text-xs text-slate-500">
                  {selectedSegment?.subLabel}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  activeQuestions[currentQuestionIndex]?.difficulty === 'Hard'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : activeQuestions[currentQuestionIndex]?.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {activeQuestions[currentQuestionIndex]?.difficulty}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {Math.floor(quizDurationSec / 60)}m {quizDurationSec % 60}s
              </div>
              <button
                onClick={() => {
                  if (confirm('Cancel this challenge round and return to the spinning wheel?')) {
                    setQuizState('idle');
                  }
                }}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1"
              >
                Quit Quiz
              </button>
            </div>
          </div>

          {/* Progress Bar & Question Pills */}
          <div className="space-y-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${((Object.keys(selectedAnswers).length) / activeQuestions.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {activeQuestions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!selectedAnswers[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                      isCurrent
                        ? 'bg-slate-900 text-amber-400 ring-2 ring-amber-500'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Content */}
          {activeQuestions[currentQuestionIndex] && (
            <div className="space-y-5 pt-2">
              <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {activeQuestions[currentQuestionIndex].question}
              </div>

              {/* Code Snippet if applicable */}
              {activeQuestions[currentQuestionIndex].codeSnippet && (
                <div className="bg-[#0f172a] rounded-xl p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 shadow-inner">
                  <div className="text-[11px] text-slate-400 mb-2 font-sans flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-amber-400" />
                    Python Code Execution
                  </div>
                  <pre className="whitespace-pre">{activeQuestions[currentQuestionIndex].codeSnippet}</pre>
                </div>
              )}

              {/* 4 Options */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {activeQuestions[currentQuestionIndex].options.map(opt => {
                  const isSelected = selectedAnswers[activeQuestions[currentQuestionIndex].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(activeQuestions[currentQuestionIndex].id, opt.id)}
                      className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-500/20 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {opt.id}
                      </div>
                      <div className="text-sm font-medium leading-normal flex-1">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Navigation Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <div className="text-xs text-slate-500 font-medium">
              {Object.keys(selectedAnswers).length} of {activeQuestions.length} Answered
            </div>

            {currentQuestionIndex < activeQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Next Question
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/20 flex items-center gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Grading & Issuing Credential...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit 10 MCQs
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW STATE 3: RESULTS & CREDENTIAL UNLOCK (>=80%) */}
      {quizState === 'results' && quizResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Celebration Card */}
          <div className={`rounded-2xl p-8 border text-center shadow-xl relative overflow-hidden ${
            quizResult.passed
              ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white border-emerald-500/40'
              : 'bg-white text-slate-900 border-slate-200'
          }`}>
            {quizResult.passed && (
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
            )}

            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105">
                {quizResult.passed ? (
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center ring-8 ring-amber-500/20">
                    <Trophy className="w-10 h-10 fill-slate-950" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center ring-8 ring-slate-100">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                  </div>
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  {quizResult.passed ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-0.5 rounded-full">
                      🎉 Challenge Conquered &bull; Score: {quizResult.percentage}%
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-0.5 rounded-full">
                      Benchmarked at {quizResult.percentage}% (Need 80%)
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {quizResult.passed
                    ? 'Congratulations! Official Credential Unlocked!'
                    : 'Good Effort! Spin Again to Master the Topic'}
                </h2>
                <p className={`text-sm mt-2 leading-relaxed ${quizResult.passed ? 'text-slate-300' : 'text-slate-600'}`}>
                  {quizResult.passed
                    ? `You answered ${quizResult.correctCount} out of ${quizResult.total} questions correctly (${quizResult.percentage}%), qualifying above the 80% benchmark. Your verifiable Badge and Certificate are issued below!`
                    : `You answered ${quizResult.correctCount} out of ${quizResult.total} questions correctly (${quizResult.percentage}%). You need 80% (8/10) to qualify for the official credential. Review the full explanations below and spin again!`
                  }
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setQuizState('idle');
                    handleSpinWheel();
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-950/20 flex items-center gap-2 transition-all active:scale-95"
                >
                  <RotateCw className="w-4 h-4" />
                  Spin Another Topic
                </button>

                {quizResult.passed && quizResult.earnedBadge && (
                  <button
                    onClick={() => onNavigateToVerify('badge', quizResult.earnedBadge!.uniqueBadgeId)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    Verify Badge
                  </button>
                )}

                {quizResult.passed && quizResult.earnedCertificate && (
                  <button
                    onClick={() => onNavigateToVerify('cert', quizResult.earnedCertificate!.certificateId)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <FileCheck className="w-4 h-4" />
                    View Certificate
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Earned Credentials Display (if >=80%) */}
          {quizResult.passed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badge Preview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Issued Badge</div>
                      <h4 className="text-base font-bold text-slate-900">
                        {quizResult.earnedBadge?.badgeName || 'DSA Wheel Champion'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        ID: <span className="font-mono font-semibold">{quizResult.earnedBadge?.uniqueBadgeId || 'BDG-SPIN-KN'}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                    VERIFIED
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {quizResult.earnedBadge?.description || `Earned for achieving ${quizResult.percentage}% on the Spinning Wheel Challenge.`}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigateToTab('badges')}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                  >
                    View All Badges <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {quizResult.earnedBadge?.uniqueBadgeId && (
                    <button
                      onClick={() => onNavigateToVerify('badge', quizResult.earnedBadge!.uniqueBadgeId)}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3 h-3 text-amber-500" />
                      Verify QR
                    </button>
                  )}
                </div>
              </div>

              {/* Certificate Preview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-md">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Certified Credential</div>
                      <h4 className="text-base font-bold text-slate-900">
                        Daily Challenge & MCQ Distinction
                      </h4>
                      <p className="text-xs text-slate-500">
                        ID: <span className="font-mono font-semibold">{quizResult.earnedCertificate?.certificateId || 'CERT-SPIN-KN'}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                    GRADE: {quizResult.percentage}%
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Officially qualifies candidate for mastery of Python Programming & DSA algorithmic thinking under Kapil&apos;s enterprise curriculum.
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigateToTab('certificate')}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                  >
                    Open Certificate Portal <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  {quizResult.earnedCertificate?.certificateId && (
                    <button
                      onClick={() => onNavigateToVerify('cert', quizResult.earnedCertificate!.certificateId)}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3 h-3 text-amber-500" />
                      Instant QR Verification
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Full Question Review & Explanations Accordion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Detailed Answer Key & Logic Breakdown</h3>
                <p className="text-xs text-slate-500">Review all 10 questions with complete algorithmic explanations and common interview traps.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-600">
                {quizResult.correctCount} / {quizResult.total} Correct
              </span>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {activeQuestions.map((q, idx) => {
                const userChoice = selectedAnswers[q.id];
                const isCorrect = userChoice === q.correctOptionId;
                const correctOpt = q.options.find(o => o.id === q.correctOptionId);
                const userOpt = q.options.find(o => o.id === userChoice);

                return (
                  <div key={q.id} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                          <span className="text-xs font-semibold text-amber-600">{q.topicName}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{q.question}</div>
                      </div>
                    </div>

                    {q.codeSnippet && (
                      <div className="bg-slate-900 rounded-lg p-3 text-emerald-400 font-mono text-xs overflow-x-auto ml-9">
                        <pre>{q.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="ml-9 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-2.5 rounded-lg border ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}>
                        <div className="font-bold text-[10px] uppercase tracking-wider mb-0.5">Your Answer:</div>
                        <div>Option {userChoice || 'Unanswered'}: {userOpt?.text || 'None selected'}</div>
                      </div>

                      {!isCorrect && (
                        <div className="p-2.5 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-900">
                          <div className="font-bold text-[10px] uppercase tracking-wider mb-0.5 text-emerald-700">Correct Answer:</div>
                          <div>Option {q.correctOptionId}: {correctOpt?.text}</div>
                        </div>
                      )}
                    </div>

                    <div className="ml-9 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-600">
                        <Sparkles className="w-3 h-3" />
                        Kapil&apos;s Logic Insight & Trap Alert
                      </div>
                      <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
