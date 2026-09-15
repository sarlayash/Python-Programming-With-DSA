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
