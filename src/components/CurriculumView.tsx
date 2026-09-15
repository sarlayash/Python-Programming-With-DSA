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
  Layers
} from 'lucide-react';
import { DayCurriculum, Problem, LearnerProfile } from '../types';

interface CurriculumViewProps {
  curriculum: DayCurriculum[];
  problems: Problem[];
  learner: LearnerProfile | null;
  selectedTopicCode?: string;
  initialSubTab?: 'problems' | 'notes' | 'interview' | 'errors';
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
  const [subTab, setSubTab] = useState<'problems' | 'notes' | 'interview' | 'errors'>(initialSubTab);

  const activeDay = curriculum.find(c => c.code === activeCode) || curriculum[0];
  const dayProblems = problems.filter(p => p.topicCode === activeCode);
  const inClassProblems = dayProblems.filter(p => p.type === 'inclass');
  const postClassProblems = dayProblems.filter(p => p.type === 'postclass');

  const downloadNotes = () => {
    if (!activeDay) return;
    const content = `# ${activeDay.code}: ${activeDay.title} - ${activeDay.subtitle}
Instructor: Kapil | Python Programming With DSA

## Objectives:
${activeDay.learningObjectives.map(o => '- ' + o).join('\n')}

## Lecture Notes:
${activeDay.notes}

## Interview & Placement Questions:
${activeDay.interviewTips.map(t => '- ' + t).join('\n')}

## Common Errors & Debugging:
${activeDay.commonErrors.map(e => `* Pitfall: ${e.error}\n  Solution: ${e.fix}\n  Explanation: ${e.explanation}`).join('\n\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Day_${activeDay.dayNumber}_${activeDay.code}_Notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Configurable Day-Wise Curriculum</span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Python Programming With DSA</h1>
          <p className="text-xs text-slate-500">Modules T1 through T10 curated with in-class code challenges & post-class assessments</p>
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
              onClick={() => setActiveCode(day.code)}
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
        <div className="mt-6 flex border-b border-slate-200 gap-6 text-xs font-semibold">
          <button
            onClick={() => setSubTab('problems')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              subTab === 'problems'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-600" />
            Problems & Assessments ({dayProblems.length})
          </button>
          <button
            onClick={() => setSubTab('notes')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              subTab === 'notes'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            Lecture Notes Viewer
          </button>
          <button
            onClick={() => setSubTab('interview')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              subTab === 'interview'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Interview & Placement Tips
          </button>
          <button
            onClick={() => setSubTab('errors')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
              subTab === 'errors'
                ? 'border-amber-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Common Pitfalls & Debugging
          </button>
        </div>

        {/* Tab 1: Problems */}
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
                          <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Q#{p.questionNumber}
                          </span>
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
                            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              Q#{p.questionNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              p.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
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

        {/* Tab 2: Notes Viewer */}
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

        {/* Tab 3: Interview Tips */}
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

        {/* Tab 4: Common Errors */}
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
