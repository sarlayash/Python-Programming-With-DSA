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
  ShieldAlert,
  Award
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
}

export const CodingLab: React.FC<CodingLabProps> = ({
  problemId,
  problems,
  learner,
  onProblemSolved,
  onOpenAuth
}) => {
  const currentProblem = problems.find(p => p.id === problemId) || problems[0];

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

  const isSolved = learner?.solvedProblems.includes(currentProblem.id);

  // Sync state on problem change
  useEffect(() => {
    if (currentProblem) {
      setCode(currentProblem.starterCode);
      setRunOutput(null);
      setSubmissionResult(null);
      setRevealedSolution(null);
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

  const handleRevealAnswer = async () => {
    try {
      const res = await api.revealAnswer(currentProblem.id);
      setRevealedSolution(res);
      setActiveTab('solution');
      setShowRevealModal(false);
    } catch (err: any) {
      alert(err.message || 'Could not reveal answer');
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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] min-h-[680px] bg-slate-100 rounded-2xl border border-slate-300 overflow-hidden shadow-sm">
      {/* Top IDE Toolbar */}
      <div className="bg-[#0f172a] text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {currentProblem.topicCode} &bull; Q#{currentProblem.questionNumber}
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[240px] sm:max-w-md">
              {currentProblem.title}
            </h2>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
            currentProblem.difficulty === 'Easy'
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : currentProblem.difficulty === 'Medium'
              ? 'bg-amber-950 text-amber-400 border border-amber-800'
              : 'bg-rose-950 text-rose-400 border border-rose-800'
          }`}>
            {currentProblem.difficulty}
          </span>

          {isSolved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              <CheckCircle className="w-3 h-3" /> Solved
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCode(currentProblem.starterCode)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Reset to starter code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setRunOutput(null);
              setSubmissionResult(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Clear output"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Reveal Answer Action Button */}
          {revealUnlocked ? (
            <button
              onClick={() => {
                if (!revealedSolution) {
                  setShowRevealModal(true);
                } else {
                  setActiveTab('solution');
                }
              }}
              className="px-2.5 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reveal Answer</span>
            </button>
          ) : (
            <div
              title="Reveal Answer unlocks automatically after 2 incorrect submission attempts."
              className="px-2.5 py-1.5 bg-slate-800/80 text-slate-500 text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-not-allowed border border-slate-700/50"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Reveal (Locked: {attempts}/2)</span>
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

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
        {/* Left Side: Problem Statement & Guidance Tabs */}
        <div className="w-full lg:w-5/12 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 gap-4">
            <button
              onClick={() => setActiveTab('problem')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'problem' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              Problem
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'hints' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Hints {submissionResult?.hintToProvide && '(!)'}
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'results' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
              Test Results
            </button>
            {revealedSolution && (
              <button
                onClick={() => setActiveTab('solution')}
                className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'solution' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                Solution
              </button>
            )}
          </div>

          {/* Left Panel Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700 space-y-4">
            {activeTab === 'problem' && (
              <>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{currentProblem.title}</h3>
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
                  <span>Time Complexity Target: <strong className="font-mono text-slate-700">{currentProblem.timeComplexity}</strong></span>
                  <span>Space: <strong className="font-mono text-slate-700">{currentProblem.spaceComplexity}</strong></span>
                </div>
              </>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Progressive Hint Guidance Engine
                  </div>
                  <p>Wrong attempts automatically unlock focused algorithmic hints and edge-case diagnostics.</p>
                </div>

                {submissionResult?.hintToProvide ? (
                  <div className="p-4 bg-white border border-amber-300 rounded-xl shadow-sm space-y-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                      Attempt {attempts} Hint
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {submissionResult.hintToProvide}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
                    Submit a solution attempt to trigger hints. (Hint 1 on 1st incorrect attempt, Hint 2 on 2nd).
                  </div>
                )}

                {submissionResult?.strongerGuidance && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">
                      Deep Mistake Guidance (Attempt {attempts})
                    </span>
                    <p className="text-rose-900 leading-relaxed font-medium">
                      {submissionResult.strongerGuidance}
                    </p>
                  </div>
                )}

                {revealUnlocked && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                    <div className="font-bold text-indigo-900">Reveal Answer is Unlocked!</div>
                    <p className="text-indigo-800 text-[11px]">
                      You can now view the full model solution, mathematical proof, and complexity breakdown.
                    </p>
                    <button
                      onClick={() => setShowRevealModal(true)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700"
                    >
                      Inspect Solution Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-4">
                {submissionResult ? (
                  <>
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                      submissionResult.submission.status === 'passed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
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
                              Test Case #{t.testIndex} {t.isHidden && '(Hidden Verification)'}
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
                              Inputs and outputs are hidden for enterprise grading integrity.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    Click <strong>Submit Solution</strong> to evaluate your code against the full test suite.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'solution' && revealedSolution && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold">
                  Full Verified Reference Solution & Proof
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Python 3 Solution:</h4>
                  <pre className="p-4 bg-[#0f172a] text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
                    {revealedSolution.fullSolution}
                  </pre>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Algorithmic Explanation:</h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{revealedSolution.explanation}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <h4 className="font-bold text-slate-900">Complexity Analysis:</h4>
                  <div className="text-[11px] text-slate-700">
                    <div><strong>Time:</strong> <code className="font-mono text-amber-700">{revealedSolution.timeComplexity}</code></div>
                    <div><strong>Space:</strong> <code className="font-mono text-amber-700">{revealedSolution.spaceComplexity}</code></div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                  <strong>Key Takeaway:</strong> {revealedSolution.learningTakeaway}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Monaco-Style Python Editor & Live Output */}
        <div className="w-full lg:w-7/12 flex flex-col bg-[#0b132b] text-slate-100 overflow-hidden">
          {/* Editor Header */}
          <div className="bg-[#0f172a] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              solution.py
            </span>
            <span className="text-[10px] text-slate-500">Python 3.10 &bull; Isolated Sandbox &bull; UTF-8</span>
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

          {/* Custom Stdin & Output Console Tray */}
          <div className="h-44 bg-[#080d1a] border-t border-slate-800 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e1628] border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Terminal Console
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
                  placeholder="Input line..."
                  className="bg-[#080d1a] px-2 py-0.5 rounded border border-slate-700 text-xs font-mono text-slate-200 w-32 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Output view */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed">
              {isRunning ? (
                <div className="text-amber-400 animate-pulse">Running script in isolated container sandbox...</div>
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
                  Press <strong>Run Code</strong> to execute with input, or <strong>Submit Solution</strong> to evaluate all test cases.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reveal Answer Confirmation Modal */}
      {showRevealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <Eye className="w-5 h-5" />
              <h3 className="text-base">Unlock Official Solution?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have completed 2 or more attempts. Revealing the answer displays the complete model code, mathematical breakdown, and complexity analysis. This action will be logged in your learner analytics.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevealModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Continue Trying
              </button>
              <button
                onClick={handleRevealAnswer}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                Reveal Solution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
