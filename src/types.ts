export type UserRole = 'learner' | 'admin';

export interface LearnerProfile {
  id: string;
  name: string;
  email: string;
  googleId: string;
  photo?: string;
  registrationDate: string;
  lastLogin: string;
  loginCount: number;
  lastActive: string;
  currentDay: string; // e.g. 'T1'
  completedDays: string[];
  solvedProblems: string[];
  attemptedProblems: string[];
  streak: number;
  accountStatus: 'active' | 'suspended';
  revealedProblems: string[]; // problem IDs where reveal answer was used
  rewardPoints?: number;
  solvedDebuggingChallenges?: string[];
  claimedFunFacts?: string[];
  completedFundamentalsSections?: string[];
  solvedFundamentalsCoding?: string[];
  fundamentalsQuizScores?: Record<string, number>;
}

export interface FundamentalsMCQ {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FundamentalsCodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  starterCode: string;
  solutionCode: string;
  explanation: string;
  testCases: {
    input: string;
    expectedOutput: string;
    inputData?: string;
    parameters?: Record<string, any>;
    testCode?: string;
    isHidden?: boolean;
  }[];
  hints: string[];
}

export interface FundamentalsSection {
  id: string;
  sectionNumber: number;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  summary: string;
  notes: {
    overview: string;
    keyConcepts: { title: string; explanation: string; codeExample?: string }[];
    interviewTips: string[];
    commonPitfalls: { pitfall: string; solution: string }[];
    cheatSheet: string;
  };
  mcqs: FundamentalsMCQ[];
  codingProblems: FundamentalsCodingProblem[];
}

export interface PythonFunFact {
  id: string;
  title: string;
  category: 'History & Origin' | 'Easter Egg' | 'Python Quirk' | 'Real-World' | 'Syntax Magic';
  tagline: string;
  description: string;
  codeSnippet?: string;
  explanation: string;
  interactiveQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  rewardPoints: number;
}

export interface ExampleCase {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CommonError {
  error: string;
  fix: string;
  explanation: string;
}

export interface PracticalExample {
  title: string;
  code: string;
  explanation: string;
}

export interface Problem {
  id: string;
  topicCode: string;
  questionNumber: number;
  title: string;
  type: 'inclass' | 'postclass';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform?: 'LeetCode' | 'GeeksforGeeks' | 'HackerRank';
  platformProblemId?: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: ExampleCase[];
  starterCode: string;
  hints: string[]; // [1st hint, 2nd stronger hint]
  fullSolution: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  learningTakeaway: string;
  testCases: TestCase[];
}

export interface SolvedBasicProgram {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Easy' | 'Medium';
  concept: string;
  problemStatement: string;
  logicSteps: string[];
  code: string;
  sampleInput: string;
  sampleOutput: string;
  timeComplexity: string;
  spaceComplexity: string;
  tipOrTrick: string;
}

export interface DayTipAndTrick {
  title: string;
  category: 'Pythonic Shortcut' | 'Logic Building' | 'Edge Case Guard' | 'Performance Trick' | 'Interview Secret';
  explanation: string;
  codeSnippet?: string;
}

export interface DayCurriculum {
  code: string; // T1 ... T10
  dayNumber: number;
  title: string;
  subtitle: string;
  learningObjectives: string[];
  notes: string;
  interviewTips: string[];
  commonErrors: CommonError[];
  debuggingStrategies: string[];
  practicalExamples: PracticalExample[];
  basicPrograms?: SolvedBasicProgram[];
  tipsAndTricks?: DayTipAndTrick[];
  inClassProblemIds: string[];
  postClassProblemIds: string[];
  completionCriteria: {
    minSolved: number;
    description: string;
  };
  isPublished: boolean;
}

export interface TestResult {
  testIndex: number;
  passed: boolean;
  input: string;
  actualOutput: string;
  expectedOutput: string;
  error?: string;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  problemId: string;
  problemTitle: string;
  topicCode: string;
  code: string;
  status: 'passed' | 'failed' | 'error' | 'timeout';
  attemptNumber: number;
  executionTimeMs: number;
  passCount: number;
  totalTests: number;
  testResults: TestResult[];
  revealAnswerUsed: boolean;
  submittedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  topicCode: string;
  icon: string;
  earningCriteria: string;
  badgeDesignColor: string;
  issuedCount: number;
}

export interface EarnedBadge {
  badgeId: string;
  learnerId: string;
  learnerName: string;
  badgeName: string;
  topicCode: string;
  description: string;
  issuedDate: string;
  uniqueBadgeId: string;
  verificationUrl: string;
  icon: string;
}

export interface FinalAssessmentTopicScore {
  topicCode: string;
  topicName: string;
  score: number;
  total: number;
  percentage: number;
}

export interface FinalAssessmentQuestionResult {
  id: string;
  type: 'mcq' | 'think_type';
  topicCode: string;
  topicName: string;
  questionNumber: number;
  question: string;
  userAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface FinalAssessmentResult {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  submittedAt: string;
  timeSpentSeconds: number;
  totalScore: number;
  totalQuestions: number; // 250
  mcqScore: number;
  mcqTotal: number; // 200
  thinkTypeScore: number;
  thinkTypeTotal: number; // 50
  percentage: number;
  passed: boolean;
  grade: string;
  certificateId?: string;
  certificate?: Certificate;
  topicBreakdown: FinalAssessmentTopicScore[];
  questionResults?: FinalAssessmentQuestionResult[];
}

export interface Certificate {
  certificateId: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  courseTitle: string; // "Python Programming With DSA"
  subtitle: string; // "Powered By Kapil"
  issuedDate: string;
  status: 'issued' | 'revoked';
  verificationUrl: string;
  qrCodeDataUrl?: string;
  grade: string;
  completionSummary: {
    totalSolved: number;
    totalAttempted: number;
    daysCompleted: number;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'curriculum' | 'submission' | 'badge' | 'certificate' | 'announcement' | 'system';
  targetUserId?: string; // or 'all'
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  action: string;
  target?: string;
  details: string;
}

export interface AdminOverviewStats {
  totalLearners: number;
  newRegistrations: number;
  activeLearnersToday: number;
  totalLogins: number;
  totalSubmissions: number;
  problemsSolved: number;
  badgesIssued: number;
  certificatesIssued: number;
  pendingActivities: number;
}

export interface MCQOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface MCQQuestion {
  id: string;
  topicCode: string;
  topicName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  codeSnippet?: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
}

export interface MCQQuizResult {
  id: string;
  date: string;
  topicCode: string;
  topicName: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  passed: boolean; // >= 80%
  earnedBadge?: EarnedBadge | null;
  earnedCertificate?: Certificate | null;
  userAnswers: Record<string, string>;
}
