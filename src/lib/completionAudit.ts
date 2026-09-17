// Audit Engine for Learner Completion & Final Certificate Activation
// Enforces: "final certificate will not activate unless all tasks, days, levels are completed..no pending tasks"

import { LearnerProfile, DayCurriculum, Problem, FinalAssessmentResult } from '../types';

export interface LevelAudit {
  name: 'Beginner' | 'Intermediate' | 'Advanced';
  range: string;
  dayCodes: string[];
  totalDays: number;
  completedDays: number;
  totalTasks: number;
  solvedTasks: number;
  isCompleted: boolean;
}

export interface CompletionAudit {
  totalDays: number;
  completedDaysCount: number;
  pendingDays: DayCurriculum[];
  
  totalProblems: number;
  solvedProblemsCount: number;
  pendingProblems: Problem[];
  pendingTasksCount: number;

  levels: LevelAudit[];
  isAllDaysCompleted: boolean;
  isAllTasksCompleted: boolean;
  isAllLevelsCompleted: boolean;
  finalAssessmentPassed: boolean;
  
  // Certificate Activation Gate: All tasks, days, and levels must be complete with ZERO pending tasks
  isCertificateActivated: boolean;
  activationPercentage: number;
  statusMessage: string;
}

export function auditLearnerCompletion(
  learner: LearnerProfile | null,
  curriculum: DayCurriculum[],
  problems: Problem[],
  finalAssessmentResult?: FinalAssessmentResult | null
): CompletionAudit {
  const completedDayCodes = new Set(learner?.completedDays || []);
  const solvedProblemIds = new Set(learner?.solvedProblems || []);

  const totalDays = curriculum.length || 10;
  const pendingDays = curriculum.filter(d => !completedDayCodes.has(d.code));
  const completedDaysCount = totalDays - pendingDays.length;

  const totalProblems = problems.length || 34;
  const pendingProblems = problems.filter(p => !solvedProblemIds.has(p.id));
  const solvedProblemsCount = totalProblems - pendingProblems.length;
  const pendingTasksCount = pendingProblems.length;

  // Track the 3 curriculum levels:
  // Beginner: T1, T2, T3
  // Intermediate: T4, T5, T6, T7
  // Advanced: T8, T9, T10
  const levelDefinitions: { name: 'Beginner' | 'Intermediate' | 'Advanced'; range: string; dayCodes: string[] }[] = [
    { name: 'Beginner', range: 'Day 1–3 (T1–T3)', dayCodes: ['T1', 'T2', 'T3'] },
    { name: 'Intermediate', range: 'Day 4–7 (T4–T7)', dayCodes: ['T4', 'T5', 'T6', 'T7'] },
    { name: 'Advanced', range: 'Day 8–10 (T8–T10)', dayCodes: ['T8', 'T9', 'T10'] }
  ];

  const levels: LevelAudit[] = levelDefinitions.map(def => {
    const levelDays = curriculum.filter(d => def.dayCodes.includes(d.code));
    const completedDaysInLevel = levelDays.filter(d => completedDayCodes.has(d.code)).length;
    
    const levelProblems = problems.filter(p => def.dayCodes.includes(p.topicCode));
    const solvedTasksInLevel = levelProblems.filter(p => solvedProblemIds.has(p.id)).length;

    const isCompleted =
      completedDaysInLevel === levelDays.length &&
      (levelProblems.length === 0 || solvedTasksInLevel === levelProblems.length);

    return {
      name: def.name,
      range: def.range,
      dayCodes: def.dayCodes,
      totalDays: levelDays.length,
      completedDays: completedDaysInLevel,
      totalTasks: levelProblems.length,
      solvedTasks: solvedTasksInLevel,
      isCompleted
    };
  });

  const isAllDaysCompleted = pendingDays.length === 0 && completedDaysCount >= totalDays;
  const isAllTasksCompleted = pendingTasksCount === 0;
  const isAllLevelsCompleted = levels.every(l => l.isCompleted);
  
  // Assessment check: score >= 60% or passed flag
  const finalAssessmentPassed = Boolean(
    finalAssessmentResult && (finalAssessmentResult.passed || finalAssessmentResult.percentage >= 60)
  );

  // ZERO PENDING TASKS MANDATE:
  // Final certificate will not activate unless all tasks, days, levels are completed (no pending tasks)
  const isCertificateActivated = isAllDaysCompleted && isAllTasksCompleted && isAllLevelsCompleted;

  // Activation completion progress ratio
  const daysWeight = (completedDaysCount / totalDays) * 40;
  const tasksWeight = (solvedProblemsCount / totalProblems) * 40;
  const levelsWeight = (levels.filter(l => l.isCompleted).length / levels.length) * 20;
  const activationPercentage = Math.round(daysWeight + tasksWeight + levelsWeight);

  let statusMessage = '';
  if (isCertificateActivated) {
    statusMessage = 'All tasks, days, and levels completed! Certificate is fully activated.';
  } else if (pendingTasksCount > 0) {
    statusMessage = `Locked: ${pendingTasksCount} pending task${pendingTasksCount > 1 ? 's' : ''} remaining across curriculum days.`;
  } else if (!isAllDaysCompleted) {
    statusMessage = `Locked: ${pendingDays.length} curriculum day${pendingDays.length > 1 ? 's' : ''} await completion.`;
  } else {
    statusMessage = 'Locked: Complete all level requirements to activate your verified certificate.';
  }

  return {
    totalDays,
    completedDaysCount,
    pendingDays,
    totalProblems,
    solvedProblemsCount,
    pendingProblems,
    pendingTasksCount,
    levels,
    isAllDaysCompleted,
    isAllTasksCompleted,
    isAllLevelsCompleted,
    finalAssessmentPassed,
    isCertificateActivated,
    activationPercentage,
    statusMessage
  };
}
