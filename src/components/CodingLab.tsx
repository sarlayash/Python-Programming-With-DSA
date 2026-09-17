import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  Trash2,
  HelpCircle,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Code2,
  Terminal,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  Award,
  Search,
  Filter,
  Check,
  Copy,
  ArrowDownToLine,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Problem, Submission, TestResult, LearnerProfile, EarnedBadge, Certificate } from '../types';
import { api } from '../lib/api';

interface CodingLabProps {
  problemId?: string;
  problems: Problem[];
  learner: LearnerProfile | null;
  onProblemSolved?: (problemId: string, newlyEarnedBadge?: EarnedBadge | null, newlyEarnedCert?: Certificate | null) => void;
  onOpenAuth: () => void;
  onSelectProblem?: (problemId: string) => void;
}

export const CodingLab: React.FC<CodingLabProps> = ({
  problemId,
  problems,
  learner,
  onProblemSolved,
  onOpenAuth,
  onSelectProblem
}) => {
  // Problem Selection State
  const [selectedPid, setSelectedPid] = useState<string>(problemId || problems[0]?.id || 'p-lc-two-sum');

  useEffect(() => {
    if (problemId && problemId !== selectedPid) {
      setSelectedPid(problemId);
    }
  }, [problemId]);

  const currentProblem = problems.find(p => p.id === selectedPid) || problems[0];
  const currentIndex = problems.findIndex(p => p.id === currentProblem?.id);

  // Problem Switcher Dropdown & Filters
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'LeetCode' | 'GeeksforGeeks' | 'HackerRank' | 'curriculum'>('all');
  const [diffFilter, setDiffFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filtered problems list
  const filteredProblems = problems.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `q#${p.questionNumber}`.includes(searchQuery.toLowerCase());

    const matchesPlatform =
      platformFilter === 'all'
        ? true
        : platformFilter === 'curriculum'
        ? !p.platform
        : p.platform === platformFilter;

    const matchesDiff = diffFilter === 'all' ? true : p.difficulty === diffFilter;

    return matchesSearch && matchesPlatform && matchesDiff;
  });

  const selectProblem = (newPid: string) => {
    setSelectedPid(newPid);
    setIsSelectorOpen(false);
    if (onSelectProblem) {
      onSelectProblem(newPid);
    }
  };

  const handlePrevProblem = () => {
    if (currentIndex > 0) {
      selectProblem(problems[currentIndex - 1].id);
    }
  };

  const handleNextProblem = () => {
    if (currentIndex < problems.length - 1) {
      selectProblem(problems[currentIndex + 1].id);
    }
  };

  // Editor & Output States
  const [code, setCode] = useState<string>(currentProblem?.starterCode || '');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'problem' | 'output' | 'results' | 'hints' | 'solution'>('problem');

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runOutput, setRunOutput] = useState<{ stdout: string; stderr: string; time: number } | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    submission: Submission;
    hintToProvide: string | null;
    strongerGuidance: string | null;
    revealAnswerEnabled: boolean;
  } | null>(null);

  // Attempt & Hint tracking
  const [attempts, setAttempts] = useState<number>(0);
  const [revealUnlocked, setRevealUnlocked] = useState<boolean>(false);
  const [revealedSolution, setRevealedSolution] = useState<any>(null);
  const [showRevealModal, setShowRevealModal] = useState<boolean>(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0); // 0 = none, 1 = hint1, 2 = hint2

  // Feedback states
  const [copySuccess, setCopySuccess] = useState(false);
  const [loadSolutionSuccess, setLoadSolutionSuccess] = useState(false);

  const isSolved = learner?.solvedProblems.includes(currentProblem?.id || '');

  // Sync state on problem change
  useEffect(() => {
    if (currentProblem) {
      setCode(currentProblem.starterCode);
      setRunOutput(null);
      setSubmissionResult(null);
      setRevealedSolution(null);
      setRevealedHintLevel(0);
      setCustomInput(currentProblem.examples[0]?.input || '');

      const alreadyRevealed = learner?.revealedProblems.includes(currentProblem.id);
      setRevealUnlocked(!!alreadyRevealed || !!isSolved);
      setAttempts(0);
      setActiveTab('problem');
    }
  }, [currentProblem?.id, isSolved]);

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('output');
    try {
      const res = await api.runCode(code, customInput);
      setRunOutput({
        stdout: res.stdout,
        stderr: res.stderr,
        time: res.executionTimeMs
      });
    } catch (err: any) {
      setRunOutput({
        stdout: '',
        stderr: err.message || 'Execution error',
        time: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!learner) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    setActiveTab('results');
    try {
      const res = await api.submitCode(currentProblem.id, code);
      setSubmissionResult(res);
      setAttempts(res.attemptNumber);

      if (res.revealAnswerEnabled) {
        setRevealUnlocked(true);
      }

      if (res.isSuccess) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onProblemSolved) {
          onProblemSolved(currentProblem.id, res.newlyEarnedBadge, res.newlyEarnedCertificate);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Solution Reveal Logic
  const handleRevealFullSolution = async () => {
    try {
      const res = await api.revealAnswer(currentProblem.id);
      setRevealedSolution(res);
      setRevealUnlocked(true);
      setActiveTab('solution');
      setShowRevealModal(false);
    } catch (err: any) {
      alert(err.message || 'Could not reveal answer');
    }
  };

  const handleUnlockHint1 = () => {
    setRevealedHintLevel(Math.max(revealedHintLevel, 1));
    setActiveTab('hints');
    setShowRevealModal(false);
  };

  const handleUnlockHint2 = () => {
    setRevealedHintLevel(2);
    setActiveTab('hints');
    setShowRevealModal(false);
  };

  const handleLoadSolutionIntoEditor = () => {
    if (revealedSolution?.fullSolution) {
      setCode(revealedSolution.fullSolution);
      setLoadSolutionSuccess(true);
      setTimeout(() => setLoadSolutionSuccess(false), 3000);
    }
  };

  const handleCopySolution = () => {
    if (revealedSolution?.fullSolution) {
      navigator.clipboard.writeText(revealedSolution.fullSolution);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  if (!currentProblem) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-600">No problems available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] min-h-[680px] bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
      {/* Top IDE Toolbar */}
      <div className="bg-[#0f172a] text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between border-b border-slate-800 shrink-0 gap-2">
        {/* Left Side: Navigation Controls & Problem Switcher */}
        <div className="flex items-center gap-2 relative" ref={selectorRef}>
          {/* Prev / Next Arrows */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={handlePrevProblem}
              disabled={currentIndex <= 0}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
              title="Previous Problem"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-400">
              {currentIndex + 1}/{problems.length}
            </span>
            <button
              onClick={handleNextProblem}
              disabled={currentIndex >= problems.length - 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors"
              title="Next Problem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Problem Dropdown Trigger */}
          <button
            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700 text-left transition-colors max-w-[260px] sm:max-w-xs md:max-w-sm"
          >
            <span className="font-mono text-[10px] font-bold text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
              Q#{currentProblem.questionNumber}
            </span>
            <span className="text-xs font-bold text-white truncate">
              {currentProblem.title}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
          </button>

          {/* Platform Badge */}
          {currentProblem.platform && (
            <span
              className={`hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm ${
                currentProblem.platform === 'LeetCode'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                  : currentProblem.platform === 'GeeksforGeeks'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                  : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40'
              }`}
            >
              {currentProblem.platform}
            </span>
          )}

          {/* Difficulty Badge */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              currentProblem.difficulty === 'Easy'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : currentProblem.difficulty === 'Medium'
                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                : 'bg-rose-950 text-rose-400 border border-rose-800'
            }`}
          >
            {currentProblem.difficulty}
          </span>

          {isSolved && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              <CheckCircle className="w-3 h-3" /> Solved
            </span>
          )}

          {/* Interactive Problem Dropdown Menu */}
          {isSelectorOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* Search & Filters */}
              <div className="p-3 border-b border-slate-800 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search problems by name or #..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Platform Filters */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                  {(['all', 'LeetCode', 'GeeksforGeeks', 'HackerRank', 'curriculum'] as const).map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setPlatformFilter(plat)}
                      className={`px-2 py-0.5 rounded font-medium whitespace-nowrap transition-colors ${
                        platformFilter === plat
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {plat === 'all' ? 'All Platforms' : plat === 'curriculum' ? 'Core DSA' : plat}
                    </button>
                  ))}
                </div>

                {/* Difficulty Filters */}
                <div className="flex items-center gap-1 text-[10px]">
                  {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setDiffFilter(diff)}
                      className={`px-2 py-0.5 rounded font-medium transition-colors ${
                        diffFilter === diff
                          ? 'bg-slate-200 text-slate-950 font-bold'
                          : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {diff === 'all' ? 'All Tiers' : diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 p-1">
                {filteredProblems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching problems found.
                  </div>
                ) : (
                  filteredProblems.map((p) => {
                    const solved = learner?.solvedProblems.includes(p.id);
                    const isCurrent = p.id === currentProblem.id;

                    return (
                      <button
                        key={p.id}
                        onClick={() => selectProblem(p.id)}
                        className={`w-full p-2.5 text-left rounded-lg transition-colors flex items-center justify-between gap-2 text-xs ${
                          isCurrent
                            ? 'bg-amber-500/15 border border-amber-500/30'
                            : 'hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0">
                            #{p.questionNumber}
                          </span>
                          <span className={`font-semibold truncate ${isCurrent ? 'text-amber-300' : 'text-slate-200'}`}>
                            {p.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {p.platform && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {p.platform === 'GeeksforGeeks' ? 'GFG' : p.platform === 'HackerRank' ? 'HR' : 'LC'}
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              p.difficulty === 'Easy'
                                ? 'text-emerald-400'
                                : p.difficulty === 'Medium'
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {p.difficulty}
                          </span>
                          {solved && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: IDE Actions & Solution Reveal Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode(currentProblem.starterCode)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset code to default template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setRunOutput(null);
              setSubmissionResult(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Clear output console"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Solution Reveal Action Button with Options */}
          {revealUnlocked || revealedSolution ? (
            <button
              onClick={() => {
                if (!revealedSolution) {
                  setShowRevealModal(true);
                } else {
                  setActiveTab('solution');
                }
              }}
              className="px-2.5 py-1.5 bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              title="View full solution and reveal options"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Solution Options</span>
            </button>
          ) : (
            <button
              onClick={() => setShowRevealModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Reveal hints or unlock full solution"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Reveal Options ({attempts}/2)</span>
            </button>
          )}

          {/* Run Code */}
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Solution */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: Left Details Panel, Right Monaco-Style Editor & Output */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Problem Statement, Hints & Solution Guidance */}
        <div className="w-full lg:w-5/12 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 gap-4">
            <button
              onClick={() => setActiveTab('problem')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'problem'
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              Problem
            </button>

            <button
              onClick={() => setActiveTab('hints')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'hints'
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Hints {revealedHintLevel > 0 && `(L${revealedHintLevel})`}
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'border-amber-500 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
              Test Results
            </button>

            {revealedSolution && (
              <button
                onClick={() => setActiveTab('solution')}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'solution'
                    ? 'border-indigo-600 text-indigo-900 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Solution
              </button>
            )}
          </div>

          {/* Left Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700 space-y-4">
            {/* Problem Tab */}
            {activeTab === 'problem' && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    {currentProblem.platform && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                        {currentProblem.platform}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Target: {currentProblem.timeComplexity}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{currentProblem.title}</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{currentProblem.statement}</p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Input Format:</h4>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                    {currentProblem.inputFormat}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Output Format:</h4>
                  <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
                    {currentProblem.outputFormat}
                  </p>
                </div>

                {currentProblem.constraints && (
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">Constraints:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 font-mono text-[11px]">
                      {currentProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-900">Examples:</h4>
                  {currentProblem.examples.map((ex, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                      <div className="font-semibold text-slate-800 text-[11px]">Example {i + 1}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Input</span>
                          <pre className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] mt-1 overflow-x-auto">
                            {ex.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">Output</span>
                          <pre className="p-2 bg-white border border-slate-200 rounded font-mono text-[11px] mt-1 overflow-x-auto">
                            {ex.output}
                          </pre>
                        </div>
                      </div>
                      {ex.explanation && (
                        <p className="text-[11px] text-slate-600 italic">
                          <strong className="not-italic text-slate-700">Explanation:</strong> {ex.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Time Target: <strong className="font-mono text-slate-700">{currentProblem.timeComplexity}</strong></span>
                  <span>Space: <strong className="font-mono text-slate-700">{currentProblem.spaceComplexity}</strong></span>
                </div>
              </>
            )}

            {/* Hints Tab */}
            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium">
                  Progressive hints provide incremental intuition without giving away the full code.
                </div>

                {/* Hint 1 */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Hint 1: Conceptual Intuition
                    </span>
                    {revealedHintLevel >= 1 || attempts >= 1 || isSolved ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Unlocked
                      </span>
                    ) : (
                      <button
                        onClick={handleUnlockHint1}
                        className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors"
                      >
                        Reveal Hint 1
                      </button>
                    )}
                  </div>
                  {revealedHintLevel >= 1 || attempts >= 1 || isSolved ? (
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {currentProblem.hints[0] || 'Analyze input boundaries and look for monotonic properties or hash structures.'}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Click "Reveal Hint 1" to view initial mathematical guidance.
                    </p>
                  )}
                </div>

                {/* Hint 2 */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      Hint 2: Algorithmic Strategy & Pointers
                    </span>
                    {revealedHintLevel >= 2 || attempts >= 2 || isSolved ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Unlocked
                      </span>
                    ) : (
                      <button
                        onClick={handleUnlockHint2}
                        className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors"
                      >
                        Reveal Hint 2
                      </button>
                    )}
                  </div>
                  {revealedHintLevel >= 2 || attempts >= 2 || isSolved ? (
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {currentProblem.hints[1] || 'Consider edge cases such as single elements, negative values, and off-by-one indices.'}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">
                      Unlocks deeper algorithmic structure and recurrence relations.
                    </p>
                  )}
                </div>

                {/* Direct Reveal Action */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowRevealModal(true)}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Open Solution Reveal Options
                  </button>
                </div>
              </div>
            )}

            {/* Test Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-4">
                {submissionResult ? (
                  <>
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        submissionResult.submission.status === 'passed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {submissionResult.submission.status === 'passed' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-rose-600" />
                        )}
                        <div>
                          <div className="font-bold text-sm">
                            {submissionResult.submission.status === 'passed'
                              ? 'Accepted! All Test Cases Passed'
                              : 'Wrong Answer / Failed Test Cases'}
                          </div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                            <span>Passed {submissionResult.submission.passCount} of {submissionResult.submission.totalTests} tests</span>
                            <span>&bull;</span>
                            <span>Time: {submissionResult.submission.executionTimeMs}ms</span>
                            <span>&bull;</span>
                            <span>Attempt #{submissionResult.submission.attemptNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test Case Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900">Evaluated Test Runs:</h4>
                      {submissionResult.submission.testResults.map((t, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border text-[11px] font-mono ${
                            t.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/60 border-rose-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold mb-1 font-sans">
                            <span className="flex items-center gap-1.5">
                              {t.passed ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              )}
                              Test Case #{t.testIndex + 1} {t.isHidden && '(Hidden Verification)'}
                            </span>
                            <span className={t.passed ? 'text-emerald-700' : 'text-rose-700'}>
                              {t.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>

                          {!t.isHidden ? (
                            <div className="space-y-1 mt-2">
                              <div><span className="text-slate-500 font-sans">Input:</span> {t.input}</div>
                              <div><span className="text-slate-500 font-sans">Expected:</span> {t.expectedOutput}</div>
                              <div>
                                <span className="text-slate-500 font-sans">Your Output:</span>{' '}
                                <span className={t.passed ? 'text-slate-900' : 'text-rose-600 font-bold'}>
                                  {t.actualOutput || '[Empty output]'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-slate-500 font-sans italic text-[10px]">
                              Inputs and outputs are hidden for test suite validation.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <CheckCircle className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>Click <strong>Submit Solution</strong> to evaluate your code against all test cases.</p>
                  </div>
                )}
              </div>
            )}

            {/* Solution Tab (Full Verified Model Solution) */}
            {activeTab === 'solution' && revealedSolution && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold flex items-center justify-between">
                  <span>Verified Official Reference Solution</span>
                  <span className="font-mono text-[11px] text-emerald-700">100% Tested</span>
                </div>

                {/* Solution Action Options */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleLoadSolutionIntoEditor}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>{loadSolutionSuccess ? 'Loaded in Editor!' : 'Load into Editor'}</span>
                  </button>

                  <button
                    onClick={handleCopySolution}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Model Code */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">Python 3 Reference Code:</h4>
                  <pre className="p-4 bg-[#0f172a] text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                    {revealedSolution.fullSolution}
                  </pre>
                </div>

                {/* Algorithmic Explanation */}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Algorithmic Explanation:</h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {revealedSolution.explanation}
                  </p>
                </div>

                {/* Complexity Analysis */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <h4 className="font-bold text-slate-900">Complexity Analysis:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-500 font-semibold block text-[10px]">Time Complexity</span>
                      <code className="font-mono text-amber-700 font-bold text-xs">{revealedSolution.timeComplexity}</code>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-200">
                      <span className="text-slate-500 font-semibold block text-[10px]">Space Complexity</span>
                      <code className="font-mono text-amber-700 font-bold text-xs">{revealedSolution.spaceComplexity}</code>
                    </div>
                  </div>
                </div>

                {/* Interview Takeaway */}
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                  <strong className="block font-bold">Key Interview Takeaway:</strong>
                  <p className="text-amber-800 leading-relaxed">{revealedSolution.learningTakeaway}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco-Style Python Editor & Output Console */}
        <div className="w-full lg:w-7/12 flex flex-col bg-[#0b132b] text-slate-100 overflow-hidden">
          {/* Editor Header Bar */}
          <div className="bg-[#0f172a] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              solution.py
            </span>
            <span className="text-[10px] text-slate-500">
              Python 3.10 &bull; Standard Execution Harness &bull; UTF-8
            </span>
          </div>

          {/* Interactive Code Editor with line numbers */}
          <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
            {/* Line numbers gutter */}
            <div className="w-12 bg-[#090f20] text-slate-600 select-none py-3 text-right pr-3 font-mono text-xs leading-5 shrink-0 border-r border-slate-800/80">
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code text area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 w-full p-3 bg-transparent text-emerald-300 font-mono text-xs leading-5 resize-none focus:outline-none focus:ring-0 overflow-y-auto selection:bg-amber-500/30 whitespace-pre"
              placeholder="# Write your Python 3 code here..."
            />
          </div>

          {/* Terminal Console Tray */}
          <div className="h-44 bg-[#080d1a] border-t border-slate-800 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e1628] border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Terminal Output
                </span>
                {runOutput && (
                  <span className="text-[10px] text-slate-400">
                    Duration: {runOutput.time}ms
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">Custom Stdin:</span>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. 4 2 7 11 15 9"
                  className="bg-[#080d1a] px-2 py-0.5 rounded border border-slate-700 text-xs font-mono text-slate-200 w-36 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Output view */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed">
              {isRunning ? (
                <div className="text-amber-400 animate-pulse">Running Python script in sandbox environment...</div>
              ) : runOutput ? (
                <div>
                  {runOutput.stdout && (
                    <div className="text-slate-100 whitespace-pre-wrap">{runOutput.stdout}</div>
                  )}
                  {runOutput.stderr && (
                    <div className="text-rose-400 whitespace-pre-wrap mt-1">{runOutput.stderr}</div>
                  )}
                  {!runOutput.stdout && !runOutput.stderr && (
                    <div className="text-slate-500 italic">[Process exited with code 0. No stdout output.]</div>
                  )}
                </div>
              ) : (
                <div className="text-slate-600 italic">
                  Press <strong>Run Code</strong> to test custom stdin, or <strong>Submit Solution</strong> to run full test suite.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Solution Reveal Options Modal */}
      {showRevealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold">
                <Eye className="w-5 h-5" />
                <h3 className="text-base">Solution Reveal Options</h3>
              </div>
              <button
                onClick={() => setShowRevealModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Select which level of solution guidance you want to unlock for{' '}
              <strong className="text-slate-900">{currentProblem.title}</strong>:
            </p>

            <div className="space-y-3">
              {/* Option 1: Hint 1 */}
              <button
                onClick={handleUnlockHint1}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  H1
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                    Option 1: Conceptual Hint (Intuition)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Provides the core mathematical reasoning and data structure hints without spoiling any code.
                  </p>
                </div>
              </button>

              {/* Option 2: Hint 2 */}
              <button
                onClick={handleUnlockHint2}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  H2
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                    Option 2: Algorithmic Strategy (Transitions & Edge Cases)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Provides pointer movements, edge conditions, and recurrence relations.
                  </p>
                </div>
              </button>

              {/* Option 3: Full Reference Solution */}
              <button
                onClick={handleRevealFullSolution}
                className="w-full text-left p-3.5 rounded-xl border border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 shadow-sm">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-indigo-950 group-hover:text-indigo-900">
                    Option 3: Unlock Complete Verified Solution
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Unlocks the tested Python reference solution, copy/load controls, step-by-step explanation, and complexity analysis.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowRevealModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
