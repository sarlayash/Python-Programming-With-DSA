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
} from '../types';

const TOKEN_KEY = 'kapil_dsa_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  adminLogin: (adminId: string, password: string) =>
    request<{ success: boolean; token: string; user: any }>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ adminId, password })
    }),

  googleLogin: (payload: { credential?: string; email?: string; name?: string; photo?: string; googleId?: string }) =>
    request<{ success: boolean; token: string; user: LearnerProfile }>('/api/auth/learner/google', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getCurrentUser: () =>
    request<{ user: any; authenticated: boolean; role: 'learner' | 'admin' | null }>('/api/auth/me'),

  logout: () =>
    request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),

  updateAdminPassword: (newPassword: string) =>
    request<{ success: boolean; message: string }>('/api/auth/admin/password', {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    }),

  // Curriculum & Problems
  getCurriculum: () =>
    request<DayCurriculum[]>('/api/curriculum'),

  getDayCurriculum: (code: string) =>
    request<DayCurriculum>(`/api/curriculum/${code}`),

  getProblems: () =>
    request<Problem[]>('/api/problems'),

  getProblemById: (id: string) =>
    request<Problem>(`/api/problems/${id}`),

  // Code Execution
  runCode: (code: string, input?: string) =>
    request<{
      stdout: string;
      stderr: string;
      exitCode: number | null;
      executionTimeMs: number;
      timedOut: boolean;
    }>('/api/code/run', {
      method: 'POST',
      body: JSON.stringify({ code, input })
    }),

  submitCode: (problemId: string, code: string) =>
    request<{
      success: boolean;
      submission: Submission;
      isSuccess: boolean;
      attemptNumber: number;
      hintToProvide: string | null;
      strongerGuidance: string | null;
      revealAnswerEnabled: boolean;
      newlyEarnedBadge: EarnedBadge | null;
      newlyEarnedCertificate: Certificate | null;
    }>('/api/code/submit', {
      method: 'POST',
      body: JSON.stringify({ problemId, code })
    }),

  revealAnswer: (problemId: string) =>
    request<{
      success: boolean;
      fullSolution: string;
      explanation: string;
      timeComplexity: string;
      spaceComplexity: string;
      learningTakeaway: string;
    }>('/api/code/reveal-answer', {
      method: 'POST',
      body: JSON.stringify({ problemId })
    }),

  // Badges & Certificates
  getBadges: () =>
    request<Badge[]>('/api/badges'),

  getMyBadges: () =>
    request<EarnedBadge[]>('/api/badges/my'),

  getLearnerBadges: () =>
    request<EarnedBadge[]>('/api/badges/my'),

  getMyCertificate: () =>
    request<Certificate | null>('/api/certificates/my'),

  getLearnerCertificate: () =>
    request<Certificate | null>('/api/certificates/my'),

  verifyCertificate: (certId: string) =>
    request<Certificate>(`/api/verify/cert/${certId}`),

  verifyBadge: (badgeId: string) =>
    request<EarnedBadge>(`/api/verify/badge/${badgeId}`),

  // Admin Portal
  getAdminOverview: () =>
    request<AdminOverviewStats>('/api/admin/overview'),

  getAdminAnalytics: () =>
    request<any>('/api/admin/overview'),

  getLearners: () =>
    request<LearnerProfile[]>('/api/admin/learners'),

  getAdminLearners: () =>
    request<LearnerProfile[]>('/api/admin/learners'),

  getSubmissions: () =>
    request<Submission[]>('/api/admin/submissions'),

  getAuditLogs: () =>
    request<AuditLog[]>('/api/admin/audit-logs'),

  getAdminAuditLogs: () =>
    request<AuditLog[]>('/api/admin/audit-logs'),

  getReportData: (reportType: string) =>
    request<any[]>(`/api/admin/reports/${reportType}`),

  issueCertificate: (payload: { learnerId: string; learnerName: string; learnerEmail: string }) =>
    request<{ success: boolean; cert: Certificate }>('/api/rewards/admin/issue-cert', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  issueCertificateManually: (learnerId: string) =>
    request<{ success: boolean; cert: Certificate }>('/api/rewards/admin/issue-cert', {
      method: 'POST',
      body: JSON.stringify({ learnerId })
    }),

  grantBadgeManually: (payload: any) =>
    request<{ success: boolean; badge: EarnedBadge }>('/api/badges/admin/award', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  revokeCertificate: (certificateId: string) =>
    request<{ success: boolean }>('/api/rewards/admin/revoke-cert', {
      method: 'POST',
      body: JSON.stringify({ certificateId })
    }),

  togglePublishDay: (code: string, isPublished: boolean) =>
    request<{ success: boolean; day: DayCurriculum }>('/api/curriculum/admin/day/toggle-publish', {
      method: 'POST',
      body: JSON.stringify({ code, isPublished })
    }),

  saveDay: (day: DayCurriculum) =>
    request<{ success: boolean; day: DayCurriculum }>('/api/curriculum/admin/day', {
      method: 'POST',
      body: JSON.stringify(day)
    }),

  saveProblem: (problem: Problem) =>
    request<{ success: boolean; problem: Problem }>('/api/curriculum/admin/problem', {
      method: 'POST',
      body: JSON.stringify(problem)
    }),

  createProblem: (problem: any) =>
    request<{ success: boolean; problem: Problem }>('/api/curriculum/admin/problem', {
      method: 'POST',
      body: JSON.stringify(problem)
    }),

  // Notifications
  getNotifications: () =>
    request<AppNotification[]>('/api/notifications'),

  markNotificationRead: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'POST' }),

  broadcastNotification: (title: string, message: string) =>
    request<{ success: boolean }>('/api/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({ title, message })
    })
};
