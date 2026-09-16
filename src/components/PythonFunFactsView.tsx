import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Trophy,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCw,
  Zap,
  BookmarkCheck,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Flame,
  Check,
  AlertCircle
} from 'lucide-react';
import { PythonFunFact, LearnerProfile } from '../types';
import { PYTHON_FUN_FACTS } from '../data/pythonFunFacts';
import { api } from '../lib/api';

interface PythonFunFactsViewProps {
  currentUser: LearnerProfile | null;
  onOpenAuth: () => void;
  onUpdateLearner: (updated: LearnerProfile) => void;
  onNavigateToLab?: () => void;
}

export const PythonFunFactsView: React.FC<PythonFunFactsViewProps> = ({
  currentUser,
  onOpenAuth,
  onUpdateLearner,
  onNavigateToLab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterClaimed, setFilterClaimed] = useState<'all' | 'unclaimed' | 'claimed'>('all');
  
  // Track interactive quiz selections: { [factId]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizStatus, setQuizStatus] = useState<Record<string, 'correct' | 'incorrect'>>({});
  
  // Track code runner states: { [factId]: { running: boolean; output?: string; error?: string } }
  const [codeRuns, setCodeRuns] = useState<Record<string, { running: boolean; output?: string; error?: string }>>({});
  
  // Points celebration toast/state
  const [justClaimedPoints, setJustClaimedPoints] = useState<{ factTitle: string; points: number } | null>(null);

  const claimedSet = new Set(currentUser?.claimedFunFacts || []);

  const totalPointsAvailable = PYTHON_FUN_FACTS.reduce((acc, f) => acc + f.rewardPoints, 0);
  const earnedPoints = PYTHON_FUN_FACTS
    .filter(f => claimedSet.has(f.id))
    .reduce((acc, f) => acc + f.rewardPoints, 0);
  const claimedCount = PYTHON_FUN_FACTS.filter(f => claimedSet.has(f.id)).length;
  const progressPercent = Math.round((claimedCount / PYTHON_FUN_FACTS.length) * 100);

  const categories = ['All', 'History & Origin', 'Easter Egg', 'Syntax Magic', 'Python Quirk', 'Real-World'];

  const filteredFacts = PYTHON_FUN_FACTS.filter(fact => {
    if (selectedCategory !== 'All' && fact.category !== selectedCategory) return false;
    const isClaimed = claimedSet.has(fact.id);
    if (filterClaimed === 'unclaimed' && isClaimed) return false;
    if (filterClaimed === 'claimed' && !isClaimed) return false;
    return true;
  });

  const handleRunSnippet = async (fact: PythonFunFact) => {
    if (!fact.codeSnippet) return;
    setCodeRuns(prev => ({
      ...prev,
      [fact.id]: { running: true }
    }));

    try {
      const res = await api.runCode(fact.codeSnippet);
      setCodeRuns(prev => ({
        ...prev,
        [fact.id]: {
          running: false,
          output: res.stdout || (res.stderr ? '' : '(Code executed cleanly with no output)'),
          error: res.stderr || undefined
        }
      }));
    } catch (err: any) {
      setCodeRuns(prev => ({
        ...prev,
        [fact.id]: {
          running: false,
          error: err?.message || 'Execution failed'
        }
      }));
    }
  };

  const handleSelectOption = async (fact: PythonFunFact, optionIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [fact.id]: optionIndex }));
    const isCorrect = optionIndex === fact.interactiveQuestion.correctIndex;

    if (isCorrect) {
      setQuizStatus(prev => ({ ...prev, [fact.id]: 'correct' }));

      // Automatically award reward points if not already claimed!
      if (currentUser && !claimedSet.has(fact.id)) {
        try {
          const updated = await api.claimFunFact(currentUser.id, fact.id, fact.rewardPoints);
          if (updated) {
            onUpdateLearner(updated);
          } else {
            const updatedProfile: LearnerProfile = {
              ...currentUser,
              rewardPoints: (currentUser.rewardPoints || 0) + fact.rewardPoints,
              claimedFunFacts: [...(currentUser.claimedFunFacts || []), fact.id]
            };
            onUpdateLearner(updatedProfile);
          }
          setJustClaimedPoints({ factTitle: fact.title, points: fact.rewardPoints });
          setTimeout(() => setJustClaimedPoints(null), 3500);
        } catch (e) {
          console.error('Error claiming fun fact reward:', e);
        }
      }
    } else {
      setQuizStatus(prev => ({ ...prev, [fact.id]: 'incorrect' }));
    }
  };

  const handleDirectClaim = async (fact: PythonFunFact) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (claimedSet.has(fact.id)) return;

    try {
      const updated = await api.claimFunFact(currentUser.id, fact.id, fact.rewardPoints);
      if (updated) {
        onUpdateLearner(updated);
      } else {
        const updatedProfile: LearnerProfile = {
          ...currentUser,
          rewardPoints: (currentUser.rewardPoints || 0) + fact.rewardPoints,
          claimedFunFacts: [...(currentUser.claimedFunFacts || []), fact.id]
        };
        onUpdateLearner(updatedProfile);
      }
      setJustClaimedPoints({ factTitle: fact.title, points: fact.rewardPoints });
      setTimeout(() => setJustClaimedPoints(null), 3500);
    } catch (e) {
      console.error('Error claiming fun fact points:', e);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification for Claimed Points */}
      {justClaimedPoints && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400">Reward Points Unlocked!</div>
            <div className="text-sm font-semibold text-slate-100">
              +{justClaimedPoints.points} PTS &bull; {justClaimedPoints.factTitle}
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-slate-800 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Python Lore, Easter Eggs & Architecture Quirk Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Python Fun Facts & Reward Challenges
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Explore quirky Python design histories, runtime quirks, and hidden interpreter easter eggs. Discover each fact, test your curiosity with mini challenges, and earn <strong className="text-amber-400 font-semibold">Reward Points</strong> directly toward your official certification rank.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Earn up to +{totalPointsAvailable} Reward Points</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{claimedCount} of {PYTHON_FUN_FACTS.length} Facts Discovered</span>
              </div>
            </div>
          </div>

          {/* Points Progress Card */}
          <div className="shrink-0 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 w-full md:w-64 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Points Collected</span>
              <span className="font-mono font-bold text-amber-400">
                {earnedPoints} / {totalPointsAvailable} PTS
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{progressPercent}% Mastered</span>
              {currentUser ? (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {currentUser.rewardPoints || 0} Total PTS
                </span>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="text-[11px] font-bold text-amber-400 hover:underline"
                >
                  Sign in to save
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Muted background geometric pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Filter Tabs & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {categories.map(cat => {
            const count =
              cat === 'All'
                ? PYTHON_FUN_FACTS.length
                : PYTHON_FUN_FACTS.filter(f => f.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  active
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Claimed vs Unclaimed toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterClaimed('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterClaimed === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Facts
          </button>
          <button
            onClick={() => setFilterClaimed('unclaimed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterClaimed === 'unclaimed'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available Points
          </button>
          <button
            onClick={() => setFilterClaimed('claimed')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterClaimed === 'claimed'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Claimed ({claimedCount})
          </button>
        </div>
      </div>

      {/* Fun Facts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFacts.map((fact, index) => {
          const isClaimed = claimedSet.has(fact.id);
          const currentAnswer = userAnswers[fact.id];
          const status = quizStatus[fact.id];
          const runState = codeRuns[fact.id];

          return (
            <div
              key={fact.id}
              className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                isClaimed
                  ? 'bg-white border-emerald-200 ring-1 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {fact.category}
                  </span>

                  {isClaimed ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      +{fact.rewardPoints} PTS Claimed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      +{fact.rewardPoints} Reward Points
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {fact.title}
                  </h3>
                  <p className="text-xs font-medium text-amber-700 mt-1">
                    {fact.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {fact.description}
                </p>

                {/* Code Snippet Box with Real Python Runner */}
                {fact.codeSnippet && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a] text-slate-200">
                    <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        <span>python_snippet.py</span>
                      </div>
                      <button
                        onClick={() => handleRunSnippet(fact)}
                        disabled={runState?.running}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        {runState?.running ? (
                          <>
                            <RotateCw className="w-3 h-3 animate-spin" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-slate-950" />
                            <span>Run Snippet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto text-emerald-300">
                      <code>{fact.codeSnippet}</code>
                    </pre>

                    {/* Output Terminal if user clicked run */}
                    {runState && (
                      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Execution Output:</div>
                        {runState.output && (
                          <div className="text-slate-100 whitespace-pre-wrap">{runState.output}</div>
                        )}
                        {runState.error && (
                          <div className="text-rose-400 whitespace-pre-wrap">{runState.error}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Deep-Dive Lore Explanation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">Behind the Scenes: </strong>
                  {fact.explanation}
                </div>

                {/* Interactive Curiosity Challenge to Claim Points */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      Curiosity Quiz: Answer to Claim Points
                    </span>
                    {!isClaimed && (
                      <button
                        onClick={() => handleDirectClaim(fact)}
                        className="text-[11px] text-slate-400 hover:text-amber-700 underline font-medium"
                      >
                        Fast Claim (+{fact.rewardPoints} PTS)
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    {fact.interactiveQuestion.question}
                  </p>

                  <div className="space-y-1.5">
                    {fact.interactiveQuestion.options.map((opt, optIdx) => {
                      const isSelected = currentAnswer === optIdx;
                      const isCorrectOpt = optIdx === fact.interactiveQuestion.correctIndex;
                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (isSelected) {
                        if (isCorrectOpt) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                        } else {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-semibold';
                        }
                      } else if (isClaimed && isCorrectOpt) {
                        btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(fact, optIdx)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold border border-current mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback on answer */}
                  {status === 'correct' && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{fact.interactiveQuestion.explanation}</span>
                    </div>
                  )}

                  {status === 'incorrect' && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Not quite! Re-read the explanation above and try another choice to claim your points.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {isClaimed ? '✓ Saved to your learning profile' : 'Unclaimed reward'}
                </span>

                {isClaimed ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    Points Earned (+{fact.rewardPoints})
                  </div>
                ) : (
                  <button
                    onClick={() => handleDirectClaim(fact)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 text-xs"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Claim +{fact.rewardPoints} PTS</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
