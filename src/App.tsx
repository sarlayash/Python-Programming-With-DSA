import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LearnerDashboard } from './components/LearnerDashboard';
import { CurriculumView } from './components/CurriculumView';
import { CodingLab } from './components/CodingLab';
import { BadgesView } from './components/BadgesView';
import { CertificateView } from './components/CertificateView';
import { AdminDashboard } from './components/AdminDashboard';
import { VerificationView } from './components/VerificationView';
import { api, setStoredToken, getStoredToken, clearStoredToken } from './lib/api';
import { logoutFromFirebase, checkFirebaseRedirectResult } from './lib/firebase';
import { parseVerificationTarget, ParsedVerificationTarget } from './lib/verification';
import { DayCurriculum, Problem, Badge, EarnedBadge, Certificate, LearnerProfile, AppNotification } from './types';
import { Award, CheckCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<'learner' | 'admin' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'learner' | 'admin'>('learner');

  // Core app state
  const [curriculum, setCurriculum] = useState<DayCurriculum[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<string | undefined>(undefined);
  const [curriculumSelectedTopic, setCurriculumSelectedTopic] = useState<string | undefined>(undefined);
  const [curriculumSubTab, setCurriculumSubTab] = useState<'problems' | 'notes' | 'interview' | 'errors'>('problems');

  // Congratulatory modal when a badge or cert is earned
  const [congratsData, setCongratsData] = useState<{
    type: 'badge' | 'cert';
    title: string;
    description: string;
  } | null>(null);

  const [isLoadingApp, setIsLoadingApp] = useState(true);

  // Verification route target (hash, path, or query based)
  const [verifyTarget, setVerifyTarget] = useState<ParsedVerificationTarget | null>(null);

  // Listen to URL hash/query/path changes for instant verification routing
  useEffect(() => {
    const handleUrlRoute = () => {
      const fullUrl = window.location.href;
      const parsed = parseVerificationTarget(fullUrl);
      if (parsed) {
        setVerifyTarget(parsed);
      } else {
        setVerifyTarget(null);
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  // Initial load
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoadingApp(true);
      try {
        // Fetch public curriculum, problems, and badges
        const [currData, probData, badgeData] = await Promise.all([
          api.getCurriculum(),
          api.getProblems(),
          api.getBadges()
        ]);
        setCurriculum(currData);
        setProblems(probData);
        setBadges(badgeData);

        // Check if existing token exists
        const existingToken = getStoredToken();

        if (existingToken) {
          try {
            const authRes = await api.getCurrentUser();
            if (authRes.authenticated) {
              setCurrentUser(authRes.user);
              setUserRole(authRes.role);

              if (authRes.role === 'learner') {
                const [bData, cData, nData] = await Promise.all([
                  api.getLearnerBadges(),
                  api.getLearnerCertificate(),
                  api.getNotifications()
                ]);
                setEarnedBadges(bData);
                setCertificate(cData);
                setNotifications(nData);
              }
            } else {
              clearStoredToken();
            }
          } catch (e) {
            console.warn('Session resume note:', e);
            clearStoredToken();
          }
        } else {
          // Check if user just returned from a Firebase Google redirect sign-in
          try {
            const redirectUser = await checkFirebaseRedirectResult();
            if (redirectUser && redirectUser.email) {
              const res = await api.googleLogin({
                email: redirectUser.email,
                name: redirectUser.name,
                photo: redirectUser.photo,
                googleId: redirectUser.googleId,
                credential: redirectUser.idToken
              });
              setStoredToken(res.token);
              setCurrentUser(res.user);
              setUserRole('learner');
              const [bData, cData, nData] = await Promise.all([
                api.getLearnerBadges(),
                api.getLearnerCertificate(),
                api.getNotifications()
              ]);
              setEarnedBadges(bData);
              setCertificate(cData);
              setNotifications(nData);
            }
          } catch (e) {
            console.warn('Redirect auth check notice:', e);
          }
        }
      } catch (err) {
        console.error('App initialization error:', err);
      } finally {
        setIsLoadingApp(false);
      }
    };

    initializeApp();
  }, []);

  // Handler when user logs in via AuthModal
  const handleAuthSuccess = async (user: any, role: 'learner' | 'admin') => {
    localStorage.removeItem('kapil_logged_out');
    setCurrentUser(user);
    setUserRole(role);
    if (role === 'learner') {
      try {
        const [bData, cData, nData] = await Promise.all([
          api.getLearnerBadges(),
          api.getLearnerCertificate(),
          api.getNotifications()
        ]);
        setEarnedBadges(bData);
        setCertificate(cData);
        setNotifications(nData);
      } catch (e) {
        console.error(e);
      }
    } else if (role === 'admin') {
      setCurrentTab('admin');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      await logoutFromFirebase();
    } catch {}
    clearStoredToken();
    localStorage.setItem('kapil_logged_out', 'true');
    setCurrentUser(null);
    setUserRole(null);
    setEarnedBadges([]);
    setCertificate(null);
    setCurrentTab('dashboard');
  };

  const handleOpenAuth = (tab: 'learner' | 'admin' = 'learner') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  const handleNavigate = (tab: string, context?: any) => {
    if (context?.problemId) {
      setSelectedProblemId(context.problemId);
    }
    if (context?.selectedTopic) {
      setCurriculumSelectedTopic(context.selectedTopic);
    }
    if (context?.tab) {
      setCurriculumSubTab(context.tab);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProblemSolved = (
    problemId: string,
    newlyEarnedBadge?: EarnedBadge | null,
    newlyEarnedCert?: Certificate | null
  ) => {
    // Refresh user state
    api.getCurrentUser().then(res => {
      if (res.authenticated) {
        setCurrentUser(res.user);
      }
    });

    if (newlyEarnedBadge) {
      setEarnedBadges(prev => [newlyEarnedBadge, ...prev]);
      setCongratsData({
        type: 'badge',
        title: `Badge Earned: ${newlyEarnedBadge.badgeName}!`,
        description: newlyEarnedBadge.description
      });
    }

    if (newlyEarnedCert) {
      setCertificate(newlyEarnedCert);
      setCongratsData({
        type: 'cert',
        title: 'Executive Certificate Unlocked!',
        description: 'Congratulations! You have qualified for the official Python Programming With DSA Completion Credential.'
      });
    }

    // Refresh notifications
    api.getNotifications().then(setNotifications).catch(() => {});
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-amber-500/20">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        currentUser={currentUser}
        userRole={userRole}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoadingApp ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500 font-mono">Initializing Enterprise Python Sandbox & Curriculum...</p>
          </div>
        ) : verifyTarget ? (
          <VerificationView
            type={verifyTarget.type}
            id={verifyTarget.id}
            onBackToPortal={() => {
              setVerifyTarget(null);
              window.location.hash = '';
              setCurrentTab('dashboard');
            }}
            onNavigateToTab={(tab) => {
              setVerifyTarget(null);
              window.location.hash = '';
              setCurrentTab(tab);
            }}
          />
        ) : currentTab === 'verify' ? (
          <VerificationView
            type="cert"
            id={certificate?.certificateId || 'CERT-KAPIL-ENTERPRISE-8910'}
            onBackToPortal={() => setCurrentTab('dashboard')}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <LearnerDashboard
                learner={userRole === 'learner' ? currentUser : null}
                curriculum={curriculum}
                problems={problems}
                earnedBadges={earnedBadges}
                onNavigate={handleNavigate}
                onOpenAuth={() => handleOpenAuth('learner')}
              />
            )}

            {currentTab === 'curriculum' && (
              <CurriculumView
                curriculum={curriculum}
                problems={problems}
                learner={userRole === 'learner' ? currentUser : null}
                selectedTopicCode={curriculumSelectedTopic}
                initialSubTab={curriculumSubTab}
                onSelectProblem={(pId) => {
                  setSelectedProblemId(pId);
                  setCurrentTab('ide');
                }}
              />
            )}

            {currentTab === 'ide' && (
              <CodingLab
                problemId={selectedProblemId}
                problems={problems}
                learner={userRole === 'learner' ? currentUser : null}
                onProblemSolved={handleProblemSolved}
                onOpenAuth={() => handleOpenAuth('learner')}
              />
            )}

            {currentTab === 'badges' && (
              <BadgesView
                badges={badges}
                earnedBadges={earnedBadges}
                learner={userRole === 'learner' ? currentUser : null}
                onOpenAuth={() => handleOpenAuth('learner')}
                onSelectTopic={(code) => {
                  setCurriculumSelectedTopic(code);
                  setCurrentTab('curriculum');
                }}
              />
            )}

            {currentTab === 'certificate' && (
              <CertificateView
                certificate={certificate}
                learner={userRole === 'learner' ? currentUser : null}
                onOpenAuth={() => handleOpenAuth('learner')}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                onBackToLearner={() => setCurrentTab('dashboard')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Python Programming With DSA</span>
            <span>&bull;</span>
            <span className="text-amber-600 font-semibold">Powered By Kapil</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Enterprise ISO 27001 & SOC-2 Compliant &bull; Isolated Container Sandbox Execution
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authInitialTab}
      />

      {/* Congratulatory Celebration Modal */}
      {congratsData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-950/20">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600">
                Milestone Accomplished
              </span>
              <h3 className="text-lg font-black text-slate-900">{congratsData.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {congratsData.description}
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setCongratsData(null);
                  setCurrentTab(congratsData.type === 'badge' ? 'badges' : 'certificate');
                }}
                className="flex-1 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Inspect Credential
              </button>
              <button
                onClick={() => setCongratsData(null)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
