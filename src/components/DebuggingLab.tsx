import React, { useState } from 'react';
import {
  Bug,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Trophy,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Code2,
  ChevronRight,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  Check
} from 'lucide-react';
import { DEBUGGING_CHALLENGES, DebuggingChallenge, DebuggingTestCase } from '../data/debuggingChallenges';
import { LearnerProfile } from '../types';
import { api } from '../lib/api';

interface DebuggingLabProps {
  currentUser: LearnerProfile | null;
  onUpdateLearner: (updated: LearnerProfile) => void;
  onOpenAuth: () => void;
}

interface TestRunResult {
  testIndex: number;
  description: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

export const DebuggingLab: React.FC<DebuggingLabProps> = ({
  currentUser,
  onUpdateLearner,
  onOpenAuth
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(DEBUGGING_CHALLENGES[0].id);
  const selectedChallenge = DEBUGGING_CHALLENGES.find(c => c.id === selectedChallengeId) || DEBUGGING_CHALLENGES[0];

  // Codes state keyed by challenge id
  const [codes, setCodes] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const c of DEBUGGING_CHALLENGES) {
      map[c.id] = c.buggyCode;
    }
    return map;
  });

  const currentCode = codes[selectedChallenge.id] ?? selectedChallenge.buggyCode;

  const [activeTab, setActiveTab] = useState<'editor' | 'hints' | 'explanation'>('editor');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestRunResult[] | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [celebrationPoints, setCelebrationPoints] = useState<number | null>(null);

  // Solved challenges set
  const solvedSet = new Set(currentUser?.solvedDebuggingChallenges || []);
  const totalPointsFromDebugging = DEBUGGING_CHALLENGES
    .filter(c => solvedSet.has(c.id))
    .reduce((acc, c) => acc + c.rewardPoints, 0);

  const handleCodeChange = (newCode: string) => {
    setCodes(prev => ({ ...prev, [selectedChallenge.id]: newCode }));
  };

  const handleResetCode = () => {
    setCodes(prev => ({ ...prev, [selectedChallenge.id]: selectedChallenge.buggyCode }));
    setTestResults(null);
    setRunError(null);
  };

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setTestResults(null);
    setRunError(null);

    const results: TestRunResult[] = [];
    let allPassed = true;

    try {
      for (let i = 0; i < selectedChallenge.testCases.length; i++) {
        const tc = selectedChallenge.testCases[i];
        const res = await api.runCode(currentCode, tc.input);

        const cleanActual = (res.stdout || '').trim();
        const cleanExpected = tc.expectedOutput.trim();
        const passed = cleanActual === cleanExpected;

        if (!passed) {
          allPassed = false;
        }

        results.push({
          testIndex: i + 1,
          description: tc.description,
          input: tc.input,
          expectedOutput: cleanExpected,
          actualOutput: cleanActual || (res.stderr ? `Error: ${res.stderr}` : '(No output)'),
          passed,
          error: res.stderr || undefined
        });
      }

      setTestResults(results);

      // If all passed and user is logged in
      if (allPassed) {
        if (currentUser) {
          if (!solvedSet.has(selectedChallenge.id)) {
            const updated = await api.submitDebuggingReward(
              currentUser.id,
              selectedChallenge.id,
              selectedChallenge.rewardPoints
            );

            if (updated) {
              onUpdateLearner(updated);
            } else {
              const updatedSolved = [...(currentUser.solvedDebuggingChallenges || []), selectedChallenge.id];
              const updatedPoints = (currentUser.rewardPoints || 0) + selectedChallenge.rewardPoints;
              const updatedProfile: LearnerProfile = {
                ...currentUser,
                rewardPoints: updatedPoints,
                solvedDebuggingChallenges: updatedSolved
              };
              onUpdateLearner(updatedProfile);
            }
            setCelebrationPoints(selectedChallenge.rewardPoints);
          }
        }
      }
    } catch (err: any) {
      setRunError(err?.message || 'Execution error during test run.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-slate-800 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Bug className="w-3.5 h-3.5" />
              <span>Python Production Debugging Arena</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              5 Python Debugging Challenges
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Find, diagnose, and fix 5 real-world Python bugs frequently asked in Fortune 500 technical rounds. Inspect broken code, understand the root causes, pass automated test harnesses, and <strong className="text-amber-400 font-semibold">earn reward points</strong>!
            </p>
          </div>

          {/* Reward Points Overview Card */}
          <div className="shrink-0 bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Your Reward Points</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {currentUser?.rewardPoints || totalPointsFromDebugging} <span className="text-xs font-normal text-slate-400">PTS</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {solvedSet.size} of {DEBUGGING_CHALLENGES.length} Bugs Resolved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Challenge Selector & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Challenge List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Challenge Roster</h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                +350 Total Points
              </span>
            </div>

            <div className="space-y-2">
              {DEBUGGING_CHALLENGES.map((challenge, idx) => {
                const isSolved = solvedSet.has(challenge.id);
                const isSelected = challenge.id === selectedChallenge.id;

                return (
                  <button
                    key={challenge.id}
                    onClick={() => {
                      setSelectedChallengeId(challenge.id);
                      setTestResults(null);
                      setRunError(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-400/50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded">
                          Bug #{idx + 1}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          challenge.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                          challenge.difficulty === 'Medium' ? 'bg-sky-100 text-sky-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {challenge.title.replace(/^Challenge \d+: /, '')}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {challenge.category}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100/60 px-2 py-0.5 rounded-full border border-amber-200">
                        <Trophy className="w-3 h-3 text-amber-600" />
                        +{challenge.rewardPoints}
                      </span>
                      {isSolved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Solved
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Unsolved</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>How to Gain Reward Points</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              1. Inspect the buggy Python code and study the error symptoms.<br />
              2. Fix the flaw in the interactive editor.<br />
              3. Click <strong>Run & Validate Fix</strong> to execute the full automated test suite.<br />
              4. When all test cases pass, the reward points are credited instantly to your account!
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor & Test Harness (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Challenge Description Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  {selectedChallenge.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedChallenge.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-mono font-bold text-xs rounded-lg border border-amber-200 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  +{selectedChallenge.rewardPoints} Reward Points
                </span>
                {solvedSet.has(selectedChallenge.id) && (
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                )}
              </div>
            </div>

            {/* Bug Diagnosis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg space-y-1">
                <span className="font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Bug Symptom & Flaw
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {selectedChallenge.bugSummary}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-slate-600" />
                  Error Classification
                </span>
                <p className="text-slate-600 text-[11px] font-mono">
                  {selectedChallenge.errorType}
                </p>
                <p className="text-[11px] text-slate-500">
                  {selectedChallenge.symptoms}
                </p>
              </div>
            </div>

            {/* Sub-tabs: Editor vs Hints vs Explanation */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Interactive Python Editor
              </button>
              <button
                onClick={() => setActiveTab('hints')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'hints'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Debugging Hints ({selectedChallenge.hints.length})
              </button>
              <button
                onClick={() => setActiveTab('explanation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'explanation'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                Deep Explanation
              </button>
            </div>
          </div>

          {/* Tab Content: Hints */}
          {activeTab === 'hints' && (
            <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-5 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                Stepped Hints for {selectedChallenge.title}
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedChallenge.hints.map((hint, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-amber-200/60 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab Content: Explanation */}
          {activeTab === 'explanation' && (
            <div className="bg-sky-50/60 rounded-xl border border-sky-200 p-5 space-y-3">
              <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                Why This Bug Happens & Production Best Practices
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-lg border border-sky-200/60">
                {selectedChallenge.explanation}
              </p>
            </div>
          )}

          {/* Tab Content: Editor & Controls */}
          {activeTab === 'editor' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-slate-900 text-slate-200 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <Code2 className="w-4 h-4" />
                  <span>solution.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCode}
                    className="px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5"
                    title="Reset to original buggy code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Buggy Code
                  </button>
                </div>
              </div>

              {/* Code Textarea with line numbers */}
              <div className="p-3 bg-[#0f172a]">
                <textarea
                  value={currentCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full h-80 bg-[#0f172a] text-slate-100 font-mono text-xs p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Validates against {selectedChallenge.testCases.length} isolated test harnesses.
                </div>

                <div className="flex items-center gap-3">
                  {!currentUser && (
                    <button
                      onClick={onOpenAuth}
                      className="text-xs text-amber-700 hover:underline font-semibold"
                    >
                      Sign In with Google to Save Points
                    </button>
                  )}

                  <button
                    onClick={handleRunAllTests}
                    disabled={isRunning}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                      isRunning
                        ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-amber-950/20'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        Executing Python Test Suite...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Run & Validate Fix (+{selectedChallenge.rewardPoints} PTS)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Harness Results View */}
          {testResults && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Automated Test Suite Results</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    testResults.every(r => r.passed)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {testResults.filter(r => r.passed).length} / {testResults.length} Passed
                  </span>
                </h3>

                {testResults.every(r => r.passed) && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bug Fixed Successfully!</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {testResults.map((tr) => (
                  <div
                    key={tr.testIndex}
                    className={`p-3 rounded-lg border text-xs space-y-2 ${
                      tr.passed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        {tr.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>Test Case {tr.testIndex}: {tr.description}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        tr.passed ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                      }`}>
                        {tr.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    {!tr.passed && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-sans font-semibold text-[10px] block">Expected Output:</span>
                          <pre className="text-emerald-700 whitespace-pre-wrap">{tr.expectedOutput}</pre>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                          <span className="text-slate-500 font-sans font-semibold text-[10px] block">Actual Output:</span>
                          <pre className="text-rose-700 whitespace-pre-wrap">{tr.actualOutput}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {runError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong>Execution Error:</strong>
                <p className="mt-1 font-mono text-[11px] whitespace-pre-wrap">{runError}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reward Points Celebration Dialog */}
      {celebrationPoints !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-amber-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8 text-slate-950 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                Reward Granted!
              </span>
              <h3 className="text-xl font-black text-slate-900">
                +{celebrationPoints} Reward Points Earned
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Outstanding work! You successfully identified and debugged the issue in{' '}
                <strong>{selectedChallenge.title}</strong>. Your points have been synchronized to your learner profile.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-center justify-around text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Reward Points</span>
                <span className="text-lg font-black text-amber-700 font-mono">
                  {currentUser?.rewardPoints || totalPointsFromDebugging} PTS
                </span>
              </div>
              <div className="h-6 w-px bg-amber-200" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bugs Resolved</span>
                <span className="text-lg font-black text-emerald-700 font-mono">
                  {solvedSet.size} / {DEBUGGING_CHALLENGES.length}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCelebrationPoints(null)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Continue Debugging
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
