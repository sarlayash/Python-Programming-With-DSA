import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  Lightbulb,
  AlertTriangle,
  Award,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  Copy,
  Check,
  Zap,
  Terminal,
  Brain,
  Filter
} from 'lucide-react';
import { DayCurriculum, Problem, LearnerProfile } from '../types';
import { DAY_PROGRAMS_AND_TIPS } from '../data/curriculumProgramsData';

interface CurriculumViewProps {
  curriculum: DayCurriculum[];
  problems: Problem[];
  learner: LearnerProfile | null;
  selectedTopicCode?: string;
  initialSubTab?: 'problems' | 'solved' | 'tips' | 'notes' | 'interview' | 'errors';
  onSelectProblem: (problemId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  curriculum,
  problems,
  learner,
  selectedTopicCode,
  initialSubTab = 'problems',
  onSelectProblem
}) => {
  const [activeCode, setActiveCode] = useState<string>(selectedTopicCode || curriculum[0]?.code || 'T1');
  const [subTab, setSubTab] = useState<'problems' | 'solved' | 'tips' | 'notes' | 'interview' | 'errors'>(initialSubTab);
  const [selectedProgramIdx, setSelectedProgramIdx] = useState<number>(0);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [tipCategoryFilter, setTipCategoryFilter] = useState<string>('All');

  const activeDay = curriculum.find(c => c.code === activeCode) || curriculum[0];
  const dayProblems = problems.filter(p => p.topicCode === activeCode);
  const inClassProblems = dayProblems.filter(p => p.type === 'inclass');
  const postClassProblems = dayProblems.filter(p => p.type === 'postclass');

  // Fallback to embedded DAY_PROGRAMS_AND_TIPS so all 5 programs and tips are always loaded
  const dayBasicPrograms = (activeDay.basicPrograms && activeDay.basicPrograms.length > 0)
    ? activeDay.basicPrograms
    : (DAY_PROGRAMS_AND_TIPS[activeDay.code]?.basicPrograms || []);

  const dayTipsAndTricks = (activeDay.tipsAndTricks && activeDay.tipsAndTricks.length > 0)
    ? activeDay.tipsAndTricks
    : (DAY_PROGRAMS_AND_TIPS[activeDay.code]?.tipsAndTricks || []);

  const activeProgram = dayBasicPrograms[selectedProgramIdx] || dayBasicPrograms[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSelectDay = (code: string) => {
    setActiveCode(code);
    setSelectedProgramIdx(0);
  };

  const downloadNotes = () => {
    if (!activeDay) return;
    const content = `# ${activeDay.code}: ${activeDay.title} - ${activeDay.subtitle}
Instructor: Kapil | Python Programming With DSA

## Objectives:
${activeDay.learningObjectives.map(o => '- ' + o).join('\n')}

## Lecture Notes:
${activeDay.notes}

## 5 Solved Logic Builder Programs (Day ${activeDay.dayNumber}):
${dayBasicPrograms.map((p, idx) => `
### Program ${idx + 1}: ${p.title} (${p.difficulty} - ${p.concept})
**Problem Statement:** ${p.problemStatement}

**Logic Building Steps:**
${p.logicSteps.map(s => `- ${s}`).join('\n')}

\`\`\`python
${p.code}
\`\`\`

- **Sample Input:** ${p.sampleInput}
- **Sample Output:** ${p.sampleOutput}
- **Complexity:** Time: ${p.timeComplexity} | Space: ${p.spaceComplexity}
- **Kapil's Pro Tip:** ${p.tipOrTrick}
`).join('\n---\n')}

## Day ${activeDay.dayNumber} Tips & Tricks:
${dayTipsAndTricks.map(t => `
### [${t.category}] ${t.title}
${t.explanation}
${t.codeSnippet ? `\n\`\`\`python\n${t.codeSnippet}\n\`\`\`` : ''}
`).join('\n')}

## Interview & Placement Questions:
${activeDay.interviewTips.map(t => '- ' + t).join('\n')}

## Common Errors & Debugging:
${activeDay.commonErrors.map(e => `* Pitfall: ${e.error}\n  Solution: ${e.fix}\n  Explanation: ${e.explanation}`).join('\n\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Day_${activeDay.dayNumber}_${activeDay.code}_Full_Curriculum_Notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tipCategories = ['All', ...Array.from(new Set(dayTipsAndTricks.map(t => t.category)))];
  const filteredTips = tipCategoryFilter === 'All'
    ? dayTipsAndTricks
    : dayTipsAndTricks.filter(t => t.category === tipCategoryFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Configurable Day-Wise Curriculum</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Python Programming With DSA</h1>
          <p className="text-xs text-slate-500">Modules T1 through T10 curated with 5 solved basic programs, logic building guides, and placement tips</p>
        </div>

        <button
          onClick={downloadNotes}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          Download Day {activeDay?.dayNumber} Notes (.md)
        </button>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {curriculum.map((day) => {
          const isSelected = day.code === activeCode;
          const isCompleted = learner?.completedDays.includes(day.code);

          return (
            <button
              key={day.code}
              onClick={() => handleSelectDay(day.code)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border shrink-0 ${
                isSelected
                  ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`font-mono text-[11px] ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                {day.code}
              </span>
              <span>Day {day.dayNumber}: {day.title}</span>
              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Active Day Meta Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                {activeDay.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">Day {activeDay.dayNumber} of 10</span>
              {!activeDay.isPublished && (
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">Unpublished</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{activeDay.title}</h2>
            <p className="text-xs text-slate-500">{activeDay.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <Award className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <div className="font-semibold text-slate-800">Badge Criteria</div>
              <div className="text-[11px] text-slate-500">{activeDay.completionCriteria.description}</div>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Learning Objectives</h4>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {activeDay.learningObjectives.map((obj, i) => (
              <li key={i} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sub Navigation */}
        <div className="mt-6 flex border-b border-slate-200 gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSubTab('solved')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              subTab === 'solved'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>5 Solved Logic Builders</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
              {dayBasicPrograms.length}
            </span>
          </button>
          <button
            onClick={() => setSubTab('tips')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              subTab === 'tips'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Tips & Tricks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
              {dayTipsAndTricks.length}
            </span>
          </button>
          <button
            onClick={() => setSubTab('problems')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              subTab === 'problems'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-600" />
            <span>Problems & Assessments ({dayProblems.length})</span>
          </button>
          <button
            onClick={() => setSubTab('notes')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              subTab === 'notes'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Lecture Notes</span>
          </button>
          <button
            onClick={() => setSubTab('interview')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              subTab === 'interview'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Interview Questions</span>
          </button>
          <button
            onClick={() => setSubTab('errors')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              subTab === 'errors'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Pitfalls & Debugging</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* SUBTAB: 5 SOLVED LOGIC BUILDERS */}
        {/* ======================================================== */}
        {subTab === 'solved' && (
          <div className="pt-6 space-y-6">
            {/* Logic Builder Intro Banner */}
            <div className="bg-gradient-to-r from-amber-50 via-amber-50/50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>5 Solved Logic Builders for Day {activeDay.dayNumber}: {activeDay.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-extrabold uppercase">
                      Logic Mastery
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-3xl">
                    Carefully selected by Kapil to guide you through loop invariants, data modeling, and algorithmic reasoning step-by-step before attempting graded challenges.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-amber-200/60">
                <span className="text-[11px] font-bold text-amber-900">5 Handcrafted Programs</span>
                <span className="text-[10px] text-slate-500">Fully Commented & Explained</span>
              </div>
            </div>

            {/* Program Selection Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {dayBasicPrograms.map((prog, idx) => {
                const isSelected = selectedProgramIdx === idx;
                return (
                  <button
                    key={prog.id}
                    onClick={() => setSelectedProgramIdx(idx)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md ring-2 ring-amber-500/50'
                        : 'bg-white hover:bg-amber-50/20 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{idx + 1}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          prog.difficulty === 'Beginner'
                            ? isSelected ? 'bg-sky-950 text-sky-300' : 'bg-sky-50 text-sky-700'
                            : prog.difficulty === 'Easy'
                            ? isSelected ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                            : isSelected ? 'bg-amber-950 text-amber-300' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {prog.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold line-clamp-1 leading-snug">
                        {prog.title}
                      </h4>
                    </div>
                    <div className="mt-2 text-[10px] font-medium truncate opacity-75">
                      {prog.concept}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Solved Program Deep Dive Card */}
            {activeProgram && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Program Header */}
                <div className="bg-white border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono text-[11px] font-bold">
                        Program #{selectedProgramIdx + 1} of 5
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeProgram.difficulty === 'Beginner'
                          ? 'bg-sky-100 text-sky-800'
                          : activeProgram.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {activeProgram.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-100">
                        Concept: {activeProgram.concept}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {activeProgram.title}
                    </h3>
                  </div>

                  {/* Complexity Chips */}
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono font-medium text-slate-700">
                      <span className="text-slate-400 mr-1">Time:</span>
                      <strong className="text-slate-900">{activeProgram.timeComplexity}</strong>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono font-medium text-slate-700">
                      <span className="text-slate-400 mr-1">Space:</span>
                      <strong className="text-slate-900">{activeProgram.spaceComplexity}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* Problem Statement Box */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Problem Requirement
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {activeProgram.problemStatement}
                    </p>
                  </div>

                  {/* Logic Building Step-by-Step Breakdown */}
                  <div className="bg-white border border-amber-200/80 rounded-xl p-5 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        How to Build the Logic (Step-by-Step Thinking Process)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeProgram.logicSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-100 flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Python Solution Code Block */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-700" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Complete Working Python Solution
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopy(activeProgram.code, activeProgram.id)}
                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all"
                      >
                        {copiedCodeId === activeProgram.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-[#0f172a] rounded-xl p-4 sm:p-5 font-mono text-xs text-slate-200 border border-slate-800 shadow-md overflow-x-auto">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                          <span className="ml-2 font-mono text-slate-400">solution.py</span>
                        </span>
                        <span className="text-[10px] text-slate-500">Python 3.12 • UTF-8</span>
                      </div>

                      <pre className="text-emerald-300 leading-relaxed selection:bg-amber-500 selection:text-slate-900 font-mono">
                        {activeProgram.code}
                      </pre>
                    </div>
                  </div>

                  {/* Sample Input & Sample Output Terminal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Sample Input
                      </div>
                      <pre className="bg-slate-100 p-3 rounded-lg text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre-wrap">
                        {activeProgram.sampleInput}
                      </pre>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Expected Output
                      </div>
                      <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {activeProgram.sampleOutput}
                      </pre>
                    </div>
                  </div>

                  {/* Kapil's Logic Secret & Pro Tip */}
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-bold text-amber-950 block mb-0.5">
                        Kapil's Logic Secret:
                      </strong>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        {activeProgram.tipOrTrick}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB: TIPS & TRICKS */}
        {/* ======================================================== */}
        {subTab === 'tips' && (
          <div className="pt-6 space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Day {activeDay.dayNumber} Logic Building Tips & Pythonic Tricks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pro idioms, edge-case guards, and algorithmic mental shortcuts curated for {activeDay.title}
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {tipCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTipCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      tipCategoryFilter === cat
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-amber-300 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tip.category === 'Pythonic Shortcut'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : tip.category === 'Logic Building'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : tip.category === 'Edge Case Guard'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : tip.category === 'Performance Trick'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-800 border border-amber-100'
                      }`}>
                        {tip.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {tip.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {tip.explanation}
                    </p>
                  </div>

                  {tip.codeSnippet && (
                    <div className="pt-2">
                      <div className="bg-[#0f172a] rounded-lg p-3 font-mono text-[11px] text-emerald-300 relative group overflow-x-auto">
                        <pre>{tip.codeSnippet}</pre>
                        <button
                          onClick={() => handleCopy(tip.codeSnippet!, `tip-${idx}`)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy snippet"
                        >
                          {copiedCodeId === `tip-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* General Logic Building Mental Model Banner */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4" />
                Kapil's Universal Logic Building Framework
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl mb-4">
                Before typing any code into the IDE, always follow this 4-phase discipline practiced by competitive programmers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                  <div className="font-bold text-amber-300 text-[11px] mb-1">1. Small Dry-Run (N=3)</div>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Manually write out intermediate variables for the smallest non-trivial input on paper.
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                  <div className="font-bold text-emerald-300 text-[11px] mb-1">2. Formulate Invariant</div>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Define what MUST stay true before and after each loop cycle (e.g. max_so_far, two pointer sum).
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                  <div className="font-bold text-sky-300 text-[11px] mb-1">3. Guard Extremes</div>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Check N=0, N=1, negative numbers, all-equal elements, and out-of-bound array endpoints.
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700">
                  <div className="font-bold text-purple-300 text-[11px] mb-1">4. Complexity Audit</div>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Audit nested loops for O(N^2) bottlenecks and replace with hash maps, two pointers, or prefix sums.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB: PROBLEMS & ASSESSMENTS */}
        {/* ======================================================== */}
        {subTab === 'problems' && (
          <div className="pt-6 space-y-6">
            {/* In-Class Problems */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h3 className="font-bold text-sm text-slate-900">In-Class Coding Exercises</h3>
                <span className="text-xs text-slate-400">({inClassProblems.length} interactive questions)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inClassProblems.map(p => {
                  const isSolved = learner?.solvedProblems.includes(p.id);
                  const isAttempted = learner?.attemptedProblems.includes(p.id);

                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProblem(p.id)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/10 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Q#{p.questionNumber}
                            </span>
                            {p.platform && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                p.platform === 'LeetCode'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : p.platform === 'GeeksforGeeks'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                              }`}>
                                {p.platform}
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {p.difficulty}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 leading-snug">
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {p.statement}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {p.testCases.length} Test Cases
                        </span>
                        {isSolved ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                            ✓ Solved
                          </span>
                        ) : isAttempted ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                            Attempted
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Open IDE →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Post-Class Problems */}
            {postClassProblems.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <h3 className="font-bold text-sm text-slate-900">Post-Class Assessment & Homework</h3>
                  <span className="text-xs text-slate-400">({postClassProblems.length} graded questions)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {postClassProblems.map(p => {
                    const isSolved = learner?.solvedProblems.includes(p.id);

                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectProblem(p.id)}
                        className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/10 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                Q#{p.questionNumber}
                              </span>
                              {p.platform && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  p.platform === 'LeetCode'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : p.platform === 'GeeksforGeeks'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                                }`}>
                                  {p.platform}
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              p.difficulty === 'Easy'
                                ? 'bg-emerald-50 text-emerald-700'
                                : p.difficulty === 'Medium'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {p.difficulty}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900 leading-snug">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {p.statement}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {p.testCases.length} Tests
                          </span>
                          {isSolved ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                              ✓ Solved
                            </span>
                          ) : (
                            <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                              Assess →
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB: NOTES VIEWER */}
        {/* ======================================================== */}
        {subTab === 'notes' && (
          <div className="pt-6 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed font-sans">
              <div className="whitespace-pre-wrap font-sans text-xs">
                {activeDay.notes}
              </div>

              {activeDay.practicalExamples && activeDay.practicalExamples.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900">Practical Implementation Code:</h4>
                  {activeDay.practicalExamples.map((ex, idx) => (
                    <div key={idx} className="bg-[#0f172a] text-slate-100 p-4 rounded-lg font-mono text-[11px]">
                      <div className="text-amber-400 font-bold mb-1 font-sans">{ex.title}</div>
                      <pre className="overflow-x-auto text-emerald-400">{ex.code}</pre>
                      <p className="text-slate-400 mt-2 text-[10px] font-sans">{ex.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB: INTERVIEW TIPS */}
        {/* ======================================================== */}
        {subTab === 'interview' && (
          <div className="pt-6 space-y-3">
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong className="font-bold">Kapil's Interview Placement Focus:</strong> These questions and time-complexity discussions reflect direct patterns evaluated in Fortune 500 technical screenings.
            </div>

            <div className="space-y-3">
              {activeDay.interviewTips.map((tip, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3 shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs text-slate-800 leading-relaxed">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB: COMMON ERRORS & PITFALLS */}
        {/* ======================================================== */}
        {subTab === 'errors' && (
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDay.commonErrors.map((err, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{err.error}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{err.explanation}</p>
                  <div className="pt-2 border-t border-rose-100 text-[11px]">
                    <strong className="text-emerald-700">Recommended Fix: </strong>
                    <code className="bg-emerald-50 px-1 py-0.5 rounded text-emerald-900 font-mono">{err.fix}</code>
                  </div>
                </div>
              ))}
            </div>

            {activeDay.debuggingStrategies && activeDay.debuggingStrategies.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Targeted Debugging Strategies
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  {activeDay.debuggingStrategies.map((strat, idx) => (
                    <li key={idx}>{strat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
