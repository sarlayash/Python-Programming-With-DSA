import * as fs from 'fs';
import * as path from 'path';
import {
  LearnerProfile,
  DayCurriculum,
  Problem,
  Submission,
  Badge,
  EarnedBadge,
  Certificate,
  AppNotification,
  AuditLog,
  AdminOverviewStats
} from '../src/types';
import { INITIAL_CURRICULUM, INITIAL_PROBLEMS, INITIAL_BADGES } from './curriculumData';

export interface DatabaseSchema {
  adminConfig: {
    adminId: string;
    passwordHash: string; // Initially ADMIN123 or hashed
  };
  learners: Record<string, LearnerProfile>;
  curriculum: DayCurriculum[];
  problems: Problem[];
  submissions: Submission[];
  badges: Badge[];
  earnedBadges: EarnedBadge[];
  certificates: Certificate[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

export const INITIAL_FIREBASE_USERS: LearnerProfile[] = [
  {
    id: 'usr_kapil_01',
    name: 'Kapil Narula',
    email: 'kapilnarula27july@gmail.com',
    googleId: 'gid_kapil_narula_01',
    photo: '',
    registrationDate: '2026-09-16T03:00:00.000Z',
    lastLogin: new Date().toISOString(),
    loginCount: 14,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: ['T1', 'T2', 'T3', 'T4'],
    solvedProblems: ['p-56', 'p-58', 'p-60', 'p-62'],
    attemptedProblems: ['p-56', 'p-57', 'p-58', 'p-60', 'p-62'],
    streak: 4,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_LvNLjIda',
    name: 'Shreya (2025PCEACS157)',
    email: '2025pceacsshreya157@gmail.com',
    googleId: 'LvNLjIdaQDcfWsRTVgYVfYAwQx2',
    photo: '',
    registrationDate: '2026-09-16T03:20:00.000Z',
    lastLogin: '2026-09-16T03:20:00.000Z',
    loginCount: 2,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: ['T1'],
    solvedProblems: ['p-56'],
    attemptedProblems: ['p-56'],
    streak: 1,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_e7dtuqRq',
    name: 'Yuvraj (2025PCEACS188)',
    email: '2025pceacsyuvraj188@gmail.com',
    googleId: 'e7dtuqRq3yShryzAnN4hIYwgi7R2',
    photo: '',
    registrationDate: '2026-09-16T03:18:00.000Z',
    lastLogin: '2026-09-16T03:18:00.000Z',
    loginCount: 2,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: ['T1'],
    solvedProblems: ['p-56', 'p-58'],
    attemptedProblems: ['p-56', 'p-58'],
    streak: 1,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_qSCHDc97',
    name: 'Samruddhi (2025PCEACS)',
    email: '2025pceacssamruddhi@gmail.com',
    googleId: 'qSCHDc97WcbWpqPl9ZH109mK8u1',
    photo: '',
    registrationDate: '2026-09-16T03:17:00.000Z',
    lastLogin: '2026-09-16T03:17:00.000Z',
    loginCount: 1,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: [],
    solvedProblems: [],
    attemptedProblems: ['p-56'],
    streak: 1,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_xFNitG6S',
    name: 'Suhani Sethiya',
    email: 'suhanisethiya1610@gmail.com',
    googleId: 'xFNitG6SG1gfHdBfHitux6UjV3e2',
    photo: '',
    registrationDate: '2026-09-16T03:15:00.000Z',
    lastLogin: '2026-09-16T03:15:00.000Z',
    loginCount: 3,
    lastActive: new Date().toISOString(),
    currentDay: 'T2',
    completedDays: ['T1'],
    solvedProblems: ['p-56', 'p-57'],
    attemptedProblems: ['p-56', 'p-57'],
    streak: 2,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_x6efSB3n',
    name: 'Vinayak Sh',
    email: 'vinayakshhh2007@gmail.com',
    googleId: 'x6efSB3nSsSmXzBVI5zZlDNI8po1',
    photo: '',
    registrationDate: '2026-09-16T03:12:00.000Z',
    lastLogin: '2026-09-16T03:12:00.000Z',
    loginCount: 2,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: ['T1'],
    solvedProblems: ['p-56'],
    attemptedProblems: ['p-56', 'p-58'],
    streak: 1,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_6DLRMRjV',
    name: 'Sulekha Kumari',
    email: 'sulekhakumari96546@gmail.com',
    googleId: '6DLRMRjVLfUrl6jU4OhW51iV7kL2',
    photo: '',
    registrationDate: '2026-09-16T03:10:00.000Z',
    lastLogin: '2026-09-16T03:10:00.000Z',
    loginCount: 2,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: [],
    solvedProblems: ['p-56'],
    attemptedProblems: ['p-56'],
    streak: 1,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_4g7IMNUJ',
    name: 'Vaishnavi',
    email: 'vaishnavi020230@gmail.com',
    googleId: '4g7IMNUJmqeIQ9LLIBBYV98mRt2',
    photo: '',
    registrationDate: '2026-09-16T03:08:00.000Z',
    lastLogin: '2026-09-16T03:08:00.000Z',
    loginCount: 2,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: ['T1'],
    solvedProblems: ['p-56'],
    attemptedProblems: ['p-56'],
    streak: 1,
    accountStatus: 'active',
    revealedProblems: []
  },
  {
    id: 'usr_1l75wDnO',
    name: 'Y.S. Sarda',
    email: 'yssarda8875@gmail.com',
    googleId: '1l75wDnO5DQtDj4cGdUXTBIzxO9',
    photo: '',
    registrationDate: '2026-09-16T03:05:00.000Z',
    lastLogin: '2026-09-16T03:05:00.000Z',
    loginCount: 2,
    lastActive: new Date().toISOString(),
    currentDay: 'T1',
    completedDays: ['T1'],
    solvedProblems: ['p-56', 'p-58'],
    attemptedProblems: ['p-56', 'p-58'],
    streak: 2,
    accountStatus: 'active',
    revealedProblems: []
  }
];

function getDefaultDB(): DatabaseSchema {
  const learnersMap: Record<string, LearnerProfile> = {};
  for (const user of INITIAL_FIREBASE_USERS) {
    learnersMap[user.id] = { ...user };
  }

  const initialEarnedBadges: EarnedBadge[] = [
    {
      badgeId: 'badge-t1',
      learnerId: 'usr_kapil_01',
      learnerName: 'Kapil Narula',
      badgeName: 'Pattern Architect',
      topicCode: 'T1',
      description: 'Mastered 2D coordinate patterns, pyramids, and geometric ASCII formatting.',
      issuedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
      uniqueBadgeId: 'BDG-T1-8934-KN',
      verificationUrl: '/verify/badge/BDG-T1-8934-KN',
      icon: 'Sparkles'
    },
    {
      badgeId: 'badge-t2',
      learnerId: 'usr_kapil_01',
      learnerName: 'Kapil Narula',
      badgeName: 'Array Vanguard',
      topicCode: 'T2',
      description: 'Demonstrated mastery over 1D sequences, binary search insertions, and frequency counts.',
      issuedDate: new Date(Date.now() - 86400000).toISOString(),
      uniqueBadgeId: 'BDG-T2-4129-KN',
      verificationUrl: '/verify/badge/BDG-T2-4129-KN',
      icon: 'Layers'
    },
    {
      badgeId: 'badge-t3',
      learnerId: 'usr_kapil_01',
      learnerName: 'Kapil Narula',
      badgeName: 'Sequence Strategist',
      topicCode: 'T3',
      description: 'Solved advanced two-pointer problems and calculated resilient medians.',
      issuedDate: new Date().toISOString(),
      uniqueBadgeId: 'BDG-T3-7741-KN',
      verificationUrl: '/verify/badge/BDG-T3-7741-KN',
      icon: 'Zap'
    }
  ];

  const initialCertificate: Certificate = {
    certificateId: 'CERT-KAPIL-ENTERPRISE-8910',
    learnerId: 'usr_kapil_01',
    learnerName: 'Kapil Narula',
    learnerEmail: 'kapilnarula27july@gmail.com',
    courseTitle: 'Python Programming With DSA',
    subtitle: 'Powered By Kapil',
    issuedDate: 'September 15, 2026',
    status: 'issued',
    verificationUrl: '/verify/cert/CERT-KAPIL-ENTERPRISE-8910',
    grade: 'Executive Honors (Enterprise Distinction)',
    completionSummary: {
      totalSolved: 8,
      totalAttempted: 10,
      daysCompleted: 4
    }
  };

  return {
    adminConfig: {
      adminId: process.env.ADMIN_ID || 'KAPILADMIN',
      passwordHash: process.env.ADMIN_PASSWORD || 'ADMIN123'
    },
    learners: learnersMap,
    curriculum: INITIAL_CURRICULUM,
    problems: INITIAL_PROBLEMS,
    submissions: [
      {
        id: 'sub-001',
        learnerId: 'usr_kapil_01',
        learnerName: 'Kapil Narula',
        learnerEmail: 'kapilnarula27july@gmail.com',
        problemId: 'p-56',
        problemTitle: 'Designing a Diamond Pattern of Lights',
        topicCode: 'T1',
        code: `def print_diamond(n):\n    for i in range(1, n+1):\n        print(' '*(n-i) + '*'*(2*i-1))\n    for i in range(n-1, 0, -1):\n        print(' '*(n-i) + '*'*(2*i-1))`,
        status: 'passed',
        attemptNumber: 1,
        executionTimeMs: 42,
        passCount: 4,
        totalTests: 4,
        testResults: [
          { testIndex: 1, passed: true, input: '3', actualOutput: '  *\\n ***\\n*****\\n ***\\n  *', expectedOutput: '  *\\n ***\\n*****\\n ***\\n  *', isHidden: false }
        ],
        revealAnswerUsed: false,
        submittedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    badges: INITIAL_BADGES,
    earnedBadges: initialEarnedBadges,
    certificates: [initialCertificate],
    notifications: [
      {
        id: 'notif-1',
        title: 'Welcome to Python Programming With DSA',
        message: 'Your enterprise portal is configured. Start with Day 1: Pattern Programming.',
        type: 'announcement',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        title: 'Badge Earned: Pattern Architect',
        message: 'Congratulations! You solved your required problems for Day 1 and earned your verified credential.',
        type: 'badge',
        targetUserId: 'usr_kapil_01',
        read: true,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ],
    auditLogs: [
      {
        id: 'audit-1',
        timestamp: new Date().toISOString(),
        adminId: 'SYSTEM',
        action: 'INITIALIZE_CURRICULUM',
        details: 'Loaded 10 modules (T1-T10) with coding assessments and completion standards.'
      }
    ]
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Merge in any missing seeds
        if (!this.data.curriculum || this.data.curriculum.length === 0) {
          this.data.curriculum = INITIAL_CURRICULUM;
        }
        if (!this.data.problems || this.data.problems.length === 0) {
          this.data.problems = INITIAL_PROBLEMS;
        }
        if (!this.data.badges || this.data.badges.length === 0) {
          this.data.badges = INITIAL_BADGES;
        }
        if (!this.data.certificates || this.data.certificates.length === 0) {
          const defaults = getDefaultDB();
          this.data.certificates = defaults.certificates;
        }
        if (!this.data.earnedBadges || this.data.earnedBadges.length === 0) {
          const defaults = getDefaultDB();
          this.data.earnedBadges = defaults.earnedBadges;
        }
        // Always ensure all Firebase authenticated users exist in server database
        if (!this.data.learners) {
          this.data.learners = {};
        }
        for (const fbUser of INITIAL_FIREBASE_USERS) {
          if (!this.data.learners[fbUser.id]) {
            this.data.learners[fbUser.id] = { ...fbUser };
          }
        }
        this.save();
      } catch {
        this.data = getDefaultDB();
        this.save();
      }
    } else {
      this.data = getDefaultDB();
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to persist db.json:', err);
    }
  }

  public getAdminConfig() {
    return this.data.adminConfig;
  }

  public setAdminPassword(newPassword: string) {
    this.data.adminConfig.passwordHash = newPassword;
    this.save();
  }

  public getLearners(): LearnerProfile[] {
    return Object.values(this.data.learners);
  }

  public getLearnerById(id: string): LearnerProfile | undefined {
    return this.data.learners[id];
  }

  public getLearnerByEmail(email: string): LearnerProfile | undefined {
    return Object.values(this.data.learners).find(l => l.email.toLowerCase() === email.toLowerCase());
  }

  public saveLearner(learner: LearnerProfile) {
    this.data.learners[learner.id] = learner;
    this.save();
  }

  public deleteLearner(id: string) {
    if (this.data.learners[id]) {
      delete this.data.learners[id];
      this.save();
    }
  }

  public getCurriculum(): DayCurriculum[] {
    return this.data.curriculum;
  }

  public getDayCurriculum(code: string): DayCurriculum | undefined {
    return this.data.curriculum.find(c => c.code === code);
  }

  public updateDayCurriculum(day: DayCurriculum) {
    const idx = this.data.curriculum.findIndex(c => c.code === day.code);
    if (idx >= 0) {
      this.data.curriculum[idx] = day;
    } else {
      this.data.curriculum.push(day);
    }
    this.save();
  }

  public getProblems(): Problem[] {
    return this.data.problems;
  }

  public getProblemById(id: string): Problem | undefined {
    return this.data.problems.find(p => p.id === id);
  }

  public saveProblem(problem: Problem) {
    const idx = this.data.problems.findIndex(p => p.id === problem.id);
    if (idx >= 0) {
      this.data.problems[idx] = problem;
    } else {
      this.data.problems.push(problem);
    }
    this.save();
  }

  public getSubmissions(): Submission[] {
    return this.data.submissions;
  }

  public addSubmission(sub: Submission) {
    this.data.submissions.unshift(sub);
    this.save();
  }

  public getBadges(): Badge[] {
    return this.data.badges;
  }

  public getEarnedBadges(learnerId?: string): EarnedBadge[] {
    if (learnerId) {
      return this.data.earnedBadges.filter(b => b.learnerId === learnerId);
    }
    return this.data.earnedBadges;
  }

  public awardBadge(earned: EarnedBadge) {
    this.data.earnedBadges.push(earned);
    const badgeDef = this.data.badges.find(b => b.id === earned.badgeId);
    if (badgeDef) {
      badgeDef.issuedCount = (badgeDef.issuedCount || 0) + 1;
    }
    this.save();
  }

  public revokeBadge(uniqueBadgeId: string) {
    this.data.earnedBadges = this.data.earnedBadges.filter(b => b.uniqueBadgeId !== uniqueBadgeId);
    this.save();
  }

  public getCertificates(): Certificate[] {
    return this.data.certificates;
  }

  public getCertificateById(certId: string): Certificate | undefined {
    const clean = (certId || '').trim().toLowerCase();
    return this.data.certificates.find(c => (c.certificateId || '').trim().toLowerCase() === clean);
  }

  public getCertificateForLearner(learnerId: string): Certificate | undefined {
    return this.data.certificates.find(c => c.learnerId === learnerId && c.status === 'issued');
  }

  public issueCertificate(cert: Certificate) {
    const existingIdx = this.data.certificates.findIndex(c => c.certificateId === cert.certificateId);
    if (existingIdx >= 0) {
      this.data.certificates[existingIdx] = cert;
    } else {
      this.data.certificates.push(cert);
    }
    this.save();
  }

  public revokeCertificate(certId: string) {
    const cert = this.data.certificates.find(c => c.certificateId === certId);
    if (cert) {
      cert.status = 'revoked';
      this.save();
    }
  }

  public getNotifications(userId?: string): AppNotification[] {
    return this.data.notifications.filter(n => !n.targetUserId || n.targetUserId === userId || n.targetUserId === 'all');
  }

  public addNotification(notif: AppNotification) {
    this.data.notifications.unshift(notif);
    this.save();
  }

  public markNotificationRead(id: string) {
    const n = this.data.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.save();
    }
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public addAuditLog(log: AuditLog) {
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.save();
  }

  public getOverviewStats(): AdminOverviewStats {
    const learners = Object.values(this.data.learners);
    const totalLogins = learners.reduce((sum, l) => sum + (l.loginCount || 1), 0);
    const solvedSet = new Set<string>();
    learners.forEach(l => l.solvedProblems.forEach(p => solvedSet.add(p)));

    return {
      totalLearners: learners.length,
      newRegistrations: learners.filter(l => Date.now() - new Date(l.registrationDate).getTime() < 7 * 86400000).length,
      activeLearnersToday: learners.filter(l => Date.now() - new Date(l.lastActive).getTime() < 86400000).length || 1,
      totalLogins,
      totalSubmissions: this.data.submissions.length,
      problemsSolved: this.data.submissions.filter(s => s.status === 'passed').length,
      badgesIssued: this.data.earnedBadges.length,
      certificatesIssued: this.data.certificates.filter(c => c.status === 'issued').length,
      pendingActivities: 2
    };
  }
}

export const db = new Database();
