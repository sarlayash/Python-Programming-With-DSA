import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  ChevronRight,
  ArrowRight,
  Copy,
  Check,
  Award,
  AlertTriangle,
  Lightbulb,
  Terminal,
  Clock,
  Layers,
  Zap,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FUNDAMENTALS_SECTIONS } from '../data/fundamentalsCurriculum';
import { FundamentalsSection, FundamentalsCodingProblem, LearnerProfile } from '../types';
import { api } from '../lib/api';

interface PythonFundamentalsViewProps {
  learner: LearnerProfile | null;
  onNavigateToCodingLab?: (problemId?: string) => void;
  onOpenAuth?: () => void;
  onUpdateLearner?: (learner: LearnerProfile) => void;
}

export const PythonFundamentalsView: React.FC<PythonFundamentalsViewProps> = ({
  learner,
  onNavigateToCodingLab,
  onOpenAuth,
  onUpdateLearner
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(FUNDAMENTALS_SECTIONS[0].id);
  const [sectionSubTab, setSectionSubTab] = useState<'notes' | 'mcqs' | 'ide'>('notes');

  // Active section data
  const currentSection =
    FUNDAMENTALS_SECTIONS.find(s => s.id === activeSectionId) || FUNDAMENTALS_SECTIONS[0];

  // Notes Interactive Example Runner State
  const [runningNoteIdx, setRunningNoteIdx] = useState<number | null>(null);
  const [noteOutput, setNoteOutput] = useState<{ idx: number; output: string } | null>(null);
  const [copiedNoteIdx, setCopiedNoteIdx] = useState<number | null>(null);

  // MCQ State: { [questionId]: selectedOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Coding IDE State
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const currentProblem: FundamentalsCodingProblem =
    currentSection.codingProblems[activeProblemIdx] || currentSection.codingProblems[0];

  const [editorCodes, setEditorCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    FUNDAMENTALS_SECTIONS.forEach(sec => {
      sec.codingProblems.forEach(p => {
        initial[p.id] = p.starterCode;
      });
    });
    return initial;
  });

  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [isTestingCases, setIsTestingCases] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<{
    problemId: string;
    stdout: string;
    stderr: string;
    timeMs: number;
  } | null>(null);

  const [testResults, setTestResults] = useState<{
    problemId: string;
    tests: {
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      timeMs: number;
    }[];
    allPassed: boolean;
  } | null>(null);

  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Track completed local progress
  const [completedSections, setCompletedSections] = useState<string[]>(() => {
    return learner?.completedFundamentalsSections || [];
  });
  const [solvedProblems, setSolvedProblems] = useState<string[]>(() => {
    return learner?.solvedFundamentalsCoding || [];
  });

  const currentCode = editorCodes[currentProblem.id] ?? currentProblem.starterCode;

  // Handle running an example directly from the notes
  const handleRunNoteExample = async (idx: number, codeText: string) => {
    setRunningNoteIdx(idx);
    try {
      const res = await api.runCode(codeText);
      setNoteOutput({
        idx,
        output: res.stdout || (res.stderr ? `Error: ${res.stderr}` : 'Execution completed (no console output)')
      });
    } catch (err: any) {
      setNoteOutput({
        idx,
        output: `Execution error: ${err.message || 'Failed to execute code'}`
      });
    } finally {
      setRunningNoteIdx(null);
    }
  };

  // Handle MCQ Selection
  const handleSelectOption = (qId: string, optIdx: number) => {
    if (quizSubmitted) return; // locked after submission until retake
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  // Handle MCQ Submission
  const handleSubmitQuiz = async () => {
    let score = 0;
    currentSection.mcqs.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 4) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Award points if learner logged in
      if (learner) {
        try {
          const stringAnswers: Record<string, string> = {};
          Object.entries(selectedAnswers).forEach(([k, v]) => {
            stringAnswers[k] = String(v);
          });
          const res = await api.submitMCQQuiz({
            learnerId: learner.id,
            learnerName: learner.name,
            learnerEmail: learner.email,
            topicCode: currentSection.id,
            topicName: currentSection.title,
            totalQuestions: 5,
            correctCount: score,
            percentage: Math.round((score / 5) * 100),
            answers: stringAnswers
          });
          if (res?.success && onUpdateLearner) {
            onUpdateLearner({
              ...learner,
              rewardPoints: (learner.rewardPoints || 0) + score * 10,
              completedFundamentalsSections: Array.from(
                new Set([...(learner.completedFundamentalsSections || []), currentSection.id])
              )
            });
          }
        } catch {
          // ignore
        }
      }
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Handle Freeform Run Code in problem IDE
  const handleRunCurrentCode = async () => {
    setIsRunningCode(true);
    setTestResults(null);
    try {
      const input = customInputs[currentProblem.id] || '';
      const res = await api.runCode(currentCode, input);
      setExecutionOutput({
        problemId: currentProblem.id,
        stdout: res.stdout,
        stderr: res.stderr,
        timeMs: res.executionTimeMs
      });
    } catch (err: any) {
      setExecutionOutput({
        problemId: currentProblem.id,
        stdout: '',
        stderr: err.message || 'Execution error',
        timeMs: 0
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  // Handle Testing all cases for the current problem
  const handleTestAllCases = async () => {
    setIsTestingCases(true);
    setExecutionOutput(null);
    try {
      const results: {
        input: string;
        expected: string;
        actual: string;
        passed: boolean;
        timeMs: number;
      }[] = [];

      let allPassed = true;

      for (const tc of currentProblem.testCases) {
        // Construct runnable python probe: define code then print eval(input)
        const harness = `${currentCode}\n\n# Probe Test Case\ntry:\n    _res = ${tc.input}\n    print(_res)\nexcept Exception as _e:\n    print(f"ERROR: {_e}")`;
        const res = await api.runCode(harness);

        const actualNormalized = (res.stdout || '').trim();
        // Remove quotes around string representation or boolean case matching
        const expectedNormalized = tc.expectedOutput.trim();

        // Check equivalence
        const passed =
          actualNormalized === expectedNormalized ||
          actualNormalized.toLowerCase() === expectedNormalized.toLowerCase() ||
          actualNormalized.replace(/['"]/g, '') === expectedNormalized.replace(/['"]/g, '');

        if (!passed) allPassed = false;

        results.push({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: actualNormalized || (res.stderr ? `Error: ${res.stderr}` : 'None'),
          passed,
          timeMs: res.executionTimeMs
        });
      }

      setTestResults({
        problemId: currentProblem.id,
        tests: results,
        allPassed
      });

      if (allPassed) {
        if (!solvedProblems.includes(currentProblem.id)) {
          const nextSolved = [...solvedProblems, currentProblem.id];
          setSolvedProblems(nextSolved);

          // Check if all 3 problems in section are solved
          const allSectionProblemsSolved = currentSection.codingProblems.every(p =>
            p.id === currentProblem.id ? true : nextSolved.includes(p.id)
          );

          if (allSectionProblemsSolved && !completedSections.includes(currentSection.id)) {
            setCompletedSections(prev => [...prev, currentSection.id]);
          }

          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (err: any) {
      alert(`Test runner error: ${err.message || 'Failed to run tests'}`);
    } finally {
      setIsTestingCases(false);
    }
  };

  const handleResetCode = () => {
    setEditorCodes(prev => ({
      ...prev,
      [currentProblem.id]: currentProblem.starterCode
    }));
    setExecutionOutput(null);
    setTestResults(null);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider rounded-md flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Curriculum Track
              </span>
              <span className="text-xs font-semibold text-slate-300">
                5 Progressive Sections &bull; 25 In-Depth MCQs &bull; 15 Coding IDE Challenges
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Fundamentals of Python <span className="text-amber-400">to Advanced Mastery</span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step through structured notes, test your comprehension with 5 curated MCQs per topic, and cement your skills in 3 interactive coding challenges with live in-browser Python execution.
            </p>
          </div>

          {/* Overall Stats Card */}
          <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/60 p-4 rounded-xl shrink-0 backdrop-blur-sm shadow-inner">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sections</span>
              <p className="text-xl font-black text-amber-400">
                {completedSections.length} / {FUNDAMENTALS_SECTIONS.length}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Challenges</span>
              <p className="text-xl font-black text-emerald-400">
                {solvedProblems.length} / 15
              </p>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reward</span>
              <p className="text-xl font-black text-amber-300 flex items-center gap-1 justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
                +250 PTS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Sections Nav Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Select Learning Section (1 to 5)
          </h2>
          <span className="text-xs text-slate-500">
            Progress sequentially: Core Basics &rarr; Advanced OOP & Generators
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {FUNDAMENTALS_SECTIONS.map((sec) => {
            const isActive = sec.id === activeSectionId;
            const isCompleted = completedSections.includes(sec.id);
            const levelColor =
              sec.level === 'Beginner'
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : sec.level === 'Intermediate'
                ? 'text-amber-800 bg-amber-50 border-amber-200'
                : 'text-purple-700 bg-purple-50 border-purple-200';

            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSectionId(sec.id);
                  setActiveProblemIdx(0);
                  setQuizSubmitted(false);
                  setQuizScore(null);
                  setSelectedAnswers({});
                  setExecutionOutput(null);
                  setTestResults(null);
                }}
                className={`p-4 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : levelColor
                      }`}
                    >
                      Section {sec.sectionNumber} &bull; {sec.level}
                    </span>
                    {isCompleted && (
                      <span className="text-emerald-500 text-xs flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-xs sm:text-sm line-clamp-2 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {sec.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100/10 flex items-center justify-between text-[11px] opacity-80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {sec.estimatedTime}
                  </span>
                  <span className="font-semibold">5 MCQs + 3 IDE</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Sub-Tabs: Notes | 5 MCQs | 3 Coding IDE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Sub-tab Navigation Bar */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Section {currentSection.sectionNumber} of 5
              </span>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs text-slate-500">{currentSection.level} Level</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">{currentSection.title}</h2>
            <p className="text-xs text-slate-600 mt-0.5">{currentSection.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-200/80 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setSectionSubTab('notes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                sectionSubTab === 'notes'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Notes & Theory</span>
            </button>

            <button
              onClick={() => setSectionSubTab('mcqs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                sectionSubTab === 'mcqs'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>5 Section MCQs</span>
              {quizScore !== null && (
                <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded text-[10px]">
                  {quizScore}/5
                </span>
              )}
            </button>

            <button
              onClick={() => setSectionSubTab('ide')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                sectionSubTab === 'ide'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>3 Coding Challenges</span>
            </button>
          </div>
        </div>

        {/* SUBTAB 1: NOTES & THEORY */}
        {sectionSubTab === 'notes' && (
          <div className="p-6 sm:p-8 space-y-8">
            {/* Overview Box */}
            <div className="rounded-xl bg-slate-900 text-white p-5 sm:p-6 shadow-md border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Chapter Architectural Overview
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentSection.notes.overview}
              </p>
            </div>

            {/* Key Concepts Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Key Concepts & Mechanics</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {currentSection.notes.keyConcepts.map((concept, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        {concept.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {concept.explanation}
                    </p>

                    {concept.codeExample && (
                      <div className="space-y-2 mt-3">
                        <div className="rounded-lg bg-slate-950 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto relative border border-slate-800">
                          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
                            <span>Python 3 Code Sample</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(concept.codeExample || '');
                                  setCopiedNoteIdx(idx);
                                  setTimeout(() => setCopiedNoteIdx(null), 2000);
                                }}
                                className="flex items-center gap-1 hover:text-white transition-colors"
                              >
                                {copiedNoteIdx === idx ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                {copiedNoteIdx === idx ? 'Copied' : 'Copy'}
                              </button>

                              <button
                                onClick={() => handleRunNoteExample(idx, concept.codeExample || '')}
                                disabled={runningNoteIdx === idx}
                                className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[10px] transition-all disabled:opacity-50"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                {runningNoteIdx === idx ? 'Running...' : 'Run Example'}
                              </button>
                            </div>
                          </div>
                          <pre className="text-xs leading-relaxed text-amber-200">
                            {concept.codeExample}
                          </pre>
                        </div>

                        {noteOutput?.idx === idx && (
                          <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-xs font-mono text-emerald-300">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                              Console Output:
                            </span>
                            <pre className="whitespace-pre-wrap">{noteOutput.output}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column: Interview Tips & Common Pitfalls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interview Tips */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h4>Technical Interview High-Yield Tips</h4>
                </div>
                <ul className="space-y-2 text-xs text-amber-950">
                  {currentSection.notes.interviewTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold mt-0.5">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Pitfalls */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <h4>Common Traps & Solutions</h4>
                </div>
                <div className="space-y-2.5">
                  {currentSection.notes.commonPitfalls.map((p, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <p className="font-semibold text-rose-900 flex items-start gap-1">
                        <span className="text-rose-500 font-bold">&times;</span>
                        {p.pitfall}
                      </p>
                      <p className="text-slate-600 pl-3 border-l-2 border-emerald-400 ml-1">
                        <strong className="text-emerald-700">Fix:</strong> {p.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syntax Cheat Sheet */}
            <div className="rounded-xl bg-slate-950 text-slate-200 p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Quick Syntax Cheat Sheet
                </span>
                <button
                  onClick={() => handleCopyCode(currentSection.notes.cheatSheet)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {currentSection.notes.cheatSheet}
              </pre>
            </div>

            {/* Footer Navigation to Next Tab */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Ready to validate your understanding?
              </span>
              <button
                onClick={() => setSectionSubTab('mcqs')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Proceed to 5 Section MCQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 2: 5 SECTION MCQS */}
        {sectionSubTab === 'mcqs' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section {currentSection.sectionNumber} Mastery Quiz (5 Questions)
                </h3>
                <p className="text-xs text-slate-600">
                  Select your answers for all 5 questions. Score at least 4 out of 5 to earn chapter bonus rewards!
                </p>
              </div>

              {quizSubmitted && quizScore !== null && (
                <div
                  className={`px-4 py-2 rounded-xl border flex items-center gap-3 shrink-0 ${
                    quizScore >= 4
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Your Score</span>
                    <p className="text-lg font-black">{quizScore} / 5</p>
                  </div>
                  <button
                    onClick={handleRetakeQuiz}
                    className="p-2 bg-white rounded-lg shadow-2xs hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retake
                  </button>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {currentSection.mcqs.map((q, qIndex) => {
                const selectedOpt = selectedAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;

                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 p-5 bg-white space-y-3 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{q.question}</p>

                        {q.codeSnippet && (
                          <div className="mt-2.5 rounded-lg bg-slate-950 p-3 font-mono text-xs text-amber-200 overflow-x-auto border border-slate-800">
                            <pre>{q.codeSnippet}</pre>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        const isCorrect = optIdx === q.correctIndex;

                        let optClasses = 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optClasses = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500';
                          } else if (isSelected && !isCorrect) {
                            optClasses = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                          } else {
                            optClasses = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                          }
                        } else if (isSelected) {
                          optClasses = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-600';
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 ${optClasses}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {quizSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {quizSubmitted && isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback Explanation */}
                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-indigo-700">Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                {Object.keys(selectedAnswers).length} of 5 Questions Answered
              </span>

              <div className="flex items-center gap-3">
                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < 5}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Submit Answers & Check Score
                  </button>
                ) : (
                  <button
                    onClick={() => setSectionSubTab('ide')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Proceed to 3 Coding Challenges</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: 3 CODING IDE CHALLENGES */}
        {sectionSubTab === 'ide' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Problem Selector Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                {currentSection.codingProblems.map((prob, pIdx) => {
                  const isSelected = pIdx === activeProblemIdx;
                  const isSolved = solvedProblems.includes(prob.id);
                  const diffColor =
                    prob.difficulty === 'Easy'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : prob.difficulty === 'Medium'
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : 'text-rose-700 bg-rose-50 border-rose-200';

                  return (
                    <button
                      key={prob.id}
                      onClick={() => {
                        setActiveProblemIdx(pIdx);
                        setExecutionOutput(null);
                        setTestResults(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200/50 flex items-center justify-center text-[10px]">
                        {pIdx + 1}
                      </span>
                      <span>{prob.title}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black border ${
                          isSelected ? 'bg-slate-800 text-amber-300 border-slate-700' : diffColor
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                      {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  );
                })}
              </div>

              {onNavigateToCodingLab && (
                <button
                  onClick={() => onNavigateToCodingLab()}
                  className="text-xs text-slate-500 hover:text-amber-600 font-semibold flex items-center gap-1"
                >
                  <span>Open Full Coding Lab</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Problem & Editor Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Problem Details */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Challenge {activeProblemIdx + 1} of 3
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {currentProblem.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {currentProblem.title}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-600 space-y-2 whitespace-pre-line leading-relaxed">
                    {currentProblem.description}
                  </div>

                  {/* Predefined Test Cases Table */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Target Test Cases:
                    </span>
                    <div className="rounded-lg border border-slate-200 overflow-hidden text-xs">
                      <div className="bg-slate-50 px-3 py-1.5 font-bold text-slate-600 grid grid-cols-2 text-[10px] uppercase border-b border-slate-200">
                        <span>Input Call</span>
                        <span>Expected Output</span>
                      </div>
                      {currentProblem.testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 grid grid-cols-2 gap-2 border-b border-slate-100 last:border-b-0 font-mono text-[11px]"
                        >
                          <span className="text-indigo-700 truncate">{tc.input}</span>
                          <span className="text-emerald-700 font-bold truncate">
                            {tc.expectedOutput}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hints Section */}
                  {currentProblem.hints && currentProblem.hints.length > 0 && (
                    <details className="rounded-lg bg-amber-50/60 border border-amber-200 p-3 text-xs text-amber-950">
                      <summary className="font-bold cursor-pointer flex items-center gap-1.5 text-amber-800">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        Need a Hint? (Click to view)
                      </summary>
                      <ul className="mt-2 space-y-1 list-disc list-inside text-amber-900">
                        {currentProblem.hints.map((hint, i) => (
                          <li key={i}>{hint}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {/* Solution Reveal */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setRevealedSolutions(prev => ({
                          ...prev,
                          [currentProblem.id]: !prev[currentProblem.id]
                        }));
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {revealedSolutions[currentProblem.id]
                        ? 'Hide Model Solution'
                        : 'Reveal Model Solution & Explanation'}
                    </button>

                    {revealedSolutions[currentProblem.id] && (
                      <div className="mt-3 rounded-lg bg-slate-950 text-slate-100 p-3 text-xs font-mono border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                          <span>Reference Solution</span>
                          <button
                            onClick={() => {
                              setEditorCodes(prev => ({
                                ...prev,
                                [currentProblem.id]: currentProblem.solutionCode
                              }));
                            }}
                            className="text-amber-400 hover:text-amber-300 font-bold"
                          >
                            Load into Editor
                          </button>
                        </div>
                        <pre className="text-emerald-300 text-[11px] overflow-x-auto leading-relaxed">
                          {currentProblem.solutionCode}
                        </pre>
                        <p className="text-[11px] font-sans text-slate-300 pt-1 border-t border-slate-800">
                          {currentProblem.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Code Editor & Live Console */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
                  {/* Editor Header Bar */}
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono text-slate-200">solution.py</span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        (Python 3.11 Interpreter)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetCode}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors"
                        title="Reset to starter code"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>

                      <button
                        onClick={() => handleCopyCode(currentCode)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedCode ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Code Textarea */}
                  <div className="relative">
                    <textarea
                      value={currentCode}
                      onChange={(e) =>
                        setEditorCodes(prev => ({
                          ...prev,
                          [currentProblem.id]: e.target.value
                        }))
                      }
                      rows={12}
                      spellCheck={false}
                      className="w-full bg-slate-950 text-amber-200 font-mono text-xs p-4 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed resize-y"
                      placeholder="# Write your Python function here..."
                    />
                  </div>

                  {/* Action Controls Bar */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customInputs[currentProblem.id] || ''}
                        onChange={(e) =>
                          setCustomInputs(prev => ({
                            ...prev,
                            [currentProblem.id]: e.target.value
                          }))
                        }
                        placeholder="Custom stdin (optional)"
                        className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-slate-200 placeholder-slate-500 w-44 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunCurrentCode}
                        disabled={isRunningCode || isTestingCases}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Play className="w-3 h-3" />
                        {isRunningCode ? 'Running...' : 'Run Code'}
                      </button>

                      <button
                        onClick={handleTestAllCases}
                        disabled={isRunningCode || isTestingCases}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isTestingCases ? 'Evaluating Tests...' : 'Test All Cases'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Output & Test Case Evaluation Results */}
                {executionOutput && (
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                      <span>Execution Output</span>
                      <span>Time: {executionOutput.timeMs}ms</span>
                    </div>

                    {executionOutput.stdout && (
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">
                          stdout:
                        </span>
                        <pre className="text-emerald-300 whitespace-pre-wrap">
                          {executionOutput.stdout}
                        </pre>
                      </div>
                    )}

                    {executionOutput.stderr && (
                      <div>
                        <span className="text-[10px] text-rose-400 block uppercase font-bold">
                          stderr:
                        </span>
                        <pre className="text-rose-300 whitespace-pre-wrap">
                          {executionOutput.stderr}
                        </pre>
                      </div>
                    )}

                    {!executionOutput.stdout && !executionOutput.stderr && (
                      <span className="text-slate-500 italic">No output produced.</span>
                    )}
                  </div>
                )}

                {testResults && (
                  <div
                    className={`rounded-xl border p-4 space-y-3 font-mono text-xs ${
                      testResults.allPassed
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {testResults.allPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="font-bold text-sm">
                          {testResults.allPassed
                            ? 'All Test Cases Passed! Challenge Complete'
                            : 'Some Test Cases Failed'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-sans">
                        {testResults.tests.filter(t => t.passed).length} /{' '}
                        {testResults.tests.length} Passed
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {testResults.tests.map((t, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                            t.passed
                              ? 'bg-emerald-900/20 border-emerald-700/40 text-emerald-200'
                              : 'bg-rose-900/20 border-rose-700/40 text-rose-200'
                          }`}
                        >
                          <div className="space-y-0.5 truncate max-w-sm">
                            <span className="font-bold">Test {idx + 1}: {t.input}</span>
                            <div className="text-[10px] text-slate-400">
                              Expected: <span className="text-slate-200 font-mono">{t.expected}</span> &bull; Actual: <span className="text-slate-200 font-mono">{t.actual}</span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.passed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                            }`}
                          >
                            {t.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {testResults.allPassed && activeProblemIdx < currentSection.codingProblems.length - 1 && (
                      <div className="pt-2 text-right">
                        <button
                          onClick={() => {
                            setActiveProblemIdx(activeProblemIdx + 1);
                            setExecutionOutput(null);
                            setTestResults(null);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg inline-flex items-center gap-1.5"
                        >
                          <span>Next Challenge ({activeProblemIdx + 2} of 3)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
