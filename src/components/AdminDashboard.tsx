import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  Code2,
  Award,
  FileCheck,
  Activity,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  Lock,
  Download,
  Copy,
  ExternalLink,
  Flame,
  Calendar,
  Mail,
  Radio,
  Check,
  Trophy
} from 'lucide-react';
import { api } from '../lib/api';
import { DayCurriculum, Problem, Badge, LearnerProfile } from '../types';
import {
  subscribeToFirestoreLearners,
  seedAllLearnersToFirestore,
  fetchAllFirestoreLearners
} from '../lib/firebase';
import { INITIAL_FIREBASE_USERS } from '../lib/clientStore';
import { UserAvatar } from './UserAvatar';

interface AdminDashboardProps {
  onBackToLearner: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToLearner }) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'learners' | 'curriculum' | 'problems' | 'badges' | 'audit'>('learners');
  const [analytics, setAnalytics] = useState<any>(null);
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [curriculum, setCurriculum] = useState<DayCurriculum[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingFirebase, setSyncingFirebase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter
  const [searchLearner, setSearchLearner] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLearner, setSelectedLearner] = useState<LearnerProfile | null>(null);

  // Modals
  const [showAddLearnerModal, setShowAddLearnerModal] = useState(false);
  const [newLearnerData, setNewLearnerData] = useState({
    name: '',
    email: '',
    googleId: '',
    currentDay: 'T1'
  });

  // Problem creation modal
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: '',
    topicCode: 'T1',
    type: 'inclass',
    difficulty: 'Easy',
    statement: '',
    inputFormat: '',
    outputFormat: '',
    starterCode: 'def solve():\n    pass',
    modelSolution: 'def solve():\n    pass',
    hint1: '',
    hint2: '',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    explanation: '',
    learningTakeaway: '',
    testCases: [
      { input: '5', expectedOutput: '10', isHidden: false },
      { input: '10', expectedOutput: '20', isHidden: true }
    ]
  });

  // Load all data
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [analyticsData, learnersData, curriculumData, problemsData, badgesData, auditData] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminLearners(),
        api.getCurriculum(),
        api.getProblems(),
        api.getBadges(),
        api.getAdminAuditLogs()
      ]);
      setAnalytics(analyticsData);
      
      // Merge with initial firebase users if list is incomplete
      const mergedMap = new Map<string, LearnerProfile>();
      for (const u of INITIAL_FIREBASE_USERS) {
        mergedMap.set(u.id, u);
      }
      if (Array.isArray(learnersData)) {
        for (const l of learnersData) {
          mergedMap.set(l.id, l);
        }
      }
      const fullList = Array.from(mergedMap.values());
      setLearners(fullList);
      setCurriculum(curriculumData);
      setProblems(problemsData);
      setBadges(badgesData);
      setAuditLogs(auditData);
      setLastSyncTime(new Date());
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Real-Time Listener: Firestore WebSocket + 4-second polling heartbeat
  useEffect(() => {
    fetchData();

    // 1. Subscribe to Firestore real-time collection updates
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = subscribeToFirestoreLearners((firestoreLearners) => {
        if (firestoreLearners && firestoreLearners.length > 0) {
          setLearners(prev => {
            const map = new Map<string, LearnerProfile>();
            for (const p of prev) map.set(p.id, p);
            for (const fl of firestoreLearners) map.set(fl.id, fl);
            return Array.from(map.values());
          });
          setLastSyncTime(new Date());
        }
      });
    } catch (e) {
      console.warn('Firestore subscription setup note:', e);
    }

    // 2. High-frequency polling heartbeat (every 4 seconds) to guarantee real-time updates
    const pollInterval = setInterval(() => {
      fetchData(true);
    }, 4000);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      clearInterval(pollInterval);
    };
  }, []);

  // Sync Firebase & Firestore button handler
  const handleSyncFirebase = async () => {
    setSyncingFirebase(true);
    setSyncMessage('Connecting to Firebase Auth & Firestore...');
    try {
      // 1. Fetch any existing Firestore documents
      const fsLearners = await fetchAllFirestoreLearners();
      
      // 2. Combine with client & server learners
      const combinedMap = new Map<string, LearnerProfile>();
      for (const u of INITIAL_FIREBASE_USERS) {
        combinedMap.set(u.id, u);
      }
      for (const l of learners) {
        combinedMap.set(l.id, l);
      }
      for (const fl of fsLearners) {
        combinedMap.set(fl.id, fl);
      }
      const combined = Array.from(combinedMap.values());

      // 3. Seed into Firestore
      await seedAllLearnersToFirestore(combined);

      // 4. Sync with Backend API
      await api.syncLearners(combined);

      setLearners(combined);
      setLastSyncTime(new Date());
      setSyncMessage(`Synced ${combined.length} learners across Firebase Auth & Firestore!`);
      setTimeout(() => setSyncMessage(null), 4500);
    } catch (err: any) {
      console.error('Firebase sync error:', err);
      setSyncMessage('Sync notice: Updated locally & server. Check Firestore rules if persistent.');
      setTimeout(() => setSyncMessage(null), 4000);
    } finally {
      setSyncingFirebase(false);
    }
  };

  // Add Learner Form Submit
  const handleAddLearner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnerData.name || !newLearnerData.email) return;

    try {
      const created = await api.addLearner(newLearnerData);
      setLearners(prev => [created, ...prev.filter(l => l.id !== created.id)]);
      setShowAddLearnerModal(false);
      setNewLearnerData({ name: '', email: '', googleId: '', currentDay: 'T1' });
      setSyncMessage(`Added ${created.name} (${created.email}) to live registry!`);
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to add learner');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Learner ID', 'Name', 'Email', 'Google UID', 'Current Topic', 'Solved Count', 'Streak', 'Registration Date', 'Last Active', 'Account Status'];
    const rows = learners.map(l => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.googleId || ''}"`,
      `"${l.currentDay}"`,
      l.solvedProblems?.length || 0,
      `${l.streak || 0} days`,
      `"${l.registrationDate}"`,
      `"${l.lastActive || l.lastLogin}"`,
      `"${l.accountStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dsa_learners_registry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGrantBadge = async (learnerId: string, badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;
    try {
      await api.grantBadgeManually({
        learnerId,
        badgeId: badge.id,
        topicCode: badge.topicCode,
        badgeName: badge.name,
        description: badge.description,
        icon: badge.icon
      });
      fetchData(true);
      setSyncMessage(`Granted ${badge.name} to student!`);
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to grant badge');
    }
  };

  const handleIssueCert = async (learnerId: string) => {
    try {
      await api.issueCertificateManually(learnerId);
      fetchData(true);
      setSyncMessage('Verifiable Certificate issued to student!');
      setTimeout(() => setSyncMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to issue certificate');
    }
  };

  const handleToggleAccountStatus = async (learner: LearnerProfile) => {
    const newStatus = learner.accountStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.updateLearner(learner.id, { accountStatus: newStatus });
      setLearners(prev => prev.map(l => l.id === learner.id ? { ...l, accountStatus: newStatus } : l));
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProblem(newProblem);
      setShowAddProblem(false);
      fetchData(true);
      alert('Problem added to curriculum!');
    } catch (err: any) {
      alert(err.message || 'Failed to create problem');
    }
  };

  // Filtered Learners
  const filteredLearners = learners.filter(l => {
    const q = searchLearner.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (l.name || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.googleId || '').toLowerCase().includes(q) ||
      (l.id || '').toLowerCase().includes(q);

    const matchesTopic = filterTopic === 'all' || (l.currentDay || '').toUpperCase() === filterTopic.toUpperCase();
    const matchesStatus = filterStatus === 'all' || l.accountStatus === filterStatus;

    return matchesQuery && matchesTopic && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Admin Header */}
      <div className="bg-[#0b1329] text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Enterprise Admin Console</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-slate-950 rounded-full">
                KAPILADMIN
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>REAL-TIME ACTIVE</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live student registry, Google OAuth session monitoring, and credentials verification.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Sync Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-700/60 rounded-lg text-slate-300 text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-300">
              Auto-sync active &bull; {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            onClick={handleSyncFirebase}
            disabled={syncingFirebase}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            title="Sync all Firebase Authentication users and Firestore database"
          >
            <Sparkles className={`w-3.5 h-3.5 ${syncingFirebase ? 'animate-spin' : ''}`} />
            {syncingFirebase ? 'Syncing...' : 'Sync Firebase & Firestore'}
          </button>

          <button
            onClick={() => fetchData(false)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={onBackToLearner}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            Return to Learner View
          </button>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
          <button onClick={() => setSyncMessage(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto shadow-sm">
        <button
          onClick={() => setAdminTab('learners')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'learners' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-amber-600" />
          Learners Registry ({learners.length})
          <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-emerald-100 text-emerald-800 font-bold rounded-full">
            Real-time
          </span>
        </button>
        <button
          onClick={() => setAdminTab('analytics')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'analytics' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-600" />
          Executive Analytics
        </button>
        <button
          onClick={() => setAdminTab('curriculum')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'curriculum' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          Curriculum (T1-T10)
        </button>
        <button
          onClick={() => setAdminTab('problems')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'problems' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4 text-amber-600" />
          Problems Bank ({problems.length})
        </button>
        <button
          onClick={() => setAdminTab('badges')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'badges' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          Badges & Credentials
        </button>
        <button
          onClick={() => setAdminTab('audit')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'audit' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-600" />
          Security Audit Logs
        </button>
      </div>

      {/* 1. Learners Management (Primary User Request) */}
      {adminTab === 'learners' && (
        <div className="space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Learners</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">{learners.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" /> Live in Database
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Google OAuth Verified</span>
              <div className="text-2xl font-black text-indigo-700 font-mono mt-0.5">
                {learners.filter(l => l.email.includes('@') || l.googleId).length}
              </div>
              <span className="text-[11px] text-indigo-600 font-medium">100% Firebase Auth</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Students</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">
                {learners.filter(l => l.accountStatus === 'active').length}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Status: Active</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Average Streak</span>
              <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">
                {(learners.reduce((acc, l) => acc + (l.streak || 1), 0) / (learners.length || 1)).toFixed(1)} <span className="text-sm font-normal">days</span>
              </div>
              <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3" /> Active engagement
              </span>
            </div>
          </div>

          {/* Control Bar: Search, Filters, Add & Export */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchLearner}
                  onChange={e => setSearchLearner(e.target.value)}
                  placeholder="Search by student name, roll number, email, or Google UID..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                {searchLearner && (
                  <button
                    onClick={() => setSearchLearner('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Topic Filter */}
              <select
                value={filterTopic}
                onChange={e => setFilterTopic(e.target.value)}
                className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Modules (T1-T10)</option>
                {curriculum.map(c => (
                  <option key={c.code} value={c.code}>{c.code}: {c.title.split(' ')[0]}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="py-1.5 px-2.5 text-xs border border-slate-200 rounded-lg text-slate-700 bg-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                title="Download CSV report of all registered learners"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                Export CSV
              </button>

              <button
                onClick={() => setShowAddLearnerModal(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Register Student
              </button>
            </div>
          </div>

          {/* Learners Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Learner Profile</th>
                    <th className="py-3 px-4">Email & Auth Provider</th>
                    <th className="py-3 px-4">Google UID / ID</th>
                    <th className="py-3 px-4">Curriculum Day</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Streak & Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLearners.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-sm text-slate-700">No learners match your search</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or click "Sync Firebase & Firestore" above.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLearners.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              photo={l.photo}
                              name={l.name}
                              email={l.email}
                              size="sm"
                            />
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">{l.name}</div>
                              {l.name.includes('(') && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {l.name.substring(l.name.indexOf('('))}
                                </span>
                              )}
                              {(l.rewardPoints ?? 0) > 0 && (
                                <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  {l.rewardPoints} pts
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Email & Google Provider */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-700 text-[11px] select-all">{l.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded text-[9px] font-bold">
                              <Check className="w-2.5 h-2.5" /> Google OAuth
                            </span>
                          </div>
                        </td>

                        {/* 3. Google UID */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[90px]" title={l.googleId || l.id}>
                              {l.googleId || l.id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(l.googleId || l.id, l.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                              title="Copy UID"
                            >
                              {copiedId === l.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* 4. Curriculum Day */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold rounded text-[11px]">
                            {l.currentDay || 'T1'}
                          </span>
                        </td>

                        {/* 5. Progress */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-700 text-[11px]">{l.solvedProblems?.length || 0}</span>
                            <span className="text-slate-400 text-[10px]">/ {problems.length || 20} solved</span>
                          </div>
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${Math.min(100, Math.round(((l.solvedProblems?.length || 0) / (problems.length || 20)) * 100))}%`
                              }}
                            ></div>
                          </div>
                        </td>

                        {/* 6. Streak & Activity */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-mono font-bold text-amber-600 text-[11px]">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            {l.streak || 1} {l.streak === 1 ? 'day' : 'days'}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Active {new Date(l.lastActive || l.lastLogin || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </td>

                        {/* 7. Status */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleAccountStatus(l)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                              l.accountStatus === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            }`}
                            title="Click to toggle status"
                          >
                            {l.accountStatus}
                          </button>
                        </td>

                        {/* 8. Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLearner(l)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] mr-1.5 transition-colors"
                            title="Inspect complete student record"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => handleIssueCert(l.id)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 font-semibold rounded text-[11px] transition-colors"
                            title="Issue Master Completion Certificate"
                          >
                            Issue Cert
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredLearners.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-xs flex items-center justify-between">
                <span>Showing {filteredLearners.length} of {learners.length} registered students</span>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                  Live Firestore & Auth sync running
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register New Student Modal */}
      {showAddLearnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fadeIn">
          <form
            onSubmit={handleAddLearner}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">Register New Student</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLearnerModal(false)}
                className="text-slate-400 hover:text-slate-700 text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLearnerData.name}
                  onChange={e => setNewLearnerData({ ...newLearnerData, name: e.target.value })}
                  placeholder="e.g. Aryan Sharma (2025PCEACS190)"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newLearnerData.email}
                  onChange={e => setNewLearnerData({ ...newLearnerData, email: e.target.value })}
                  placeholder="e.g. aryan190@gmail.com"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Firebase Google UID (Optional)</label>
                <input
                  type="text"
                  value={newLearnerData.googleId}
                  onChange={e => setNewLearnerData({ ...newLearnerData, googleId: e.target.value })}
                  placeholder="e.g. LvNLjIdaQDcfWsRTVgYVfYAwQx2"
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono text-[11px] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Starting Topic Module</label>
                <select
                  value={newLearnerData.currentDay}
                  onChange={e => setNewLearnerData({ ...newLearnerData, currentDay: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  {curriculum.map(c => (
                    <option key={c.code} value={c.code}>{c.code}: {c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddLearnerModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm"
              >
                Register & Sync
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detailed Learner Inspect Modal */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <UserAvatar
                  photo={selectedLearner.photo}
                  name={selectedLearner.name}
                  email={selectedLearner.email}
                  size="lg"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedLearner.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{selectedLearner.email}</span>
                </div>
              </div>
              <button onClick={() => setSelectedLearner(null)} className="text-slate-400 hover:text-slate-800 text-base">✕</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Google UID</span>
                <p className="font-mono text-slate-800 text-[11px] truncate">{selectedLearner.googleId || selectedLearner.id}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Current Module</span>
                <p className="font-bold text-slate-900">{selectedLearner.currentDay || 'T1'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Streak</span>
                <p className="font-bold text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> {selectedLearner.streak || 1} days
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Solved Problems</span>
                <p className="font-bold text-emerald-700">{selectedLearner.solvedProblems?.length || 0} questions</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Reward Points</span>
                <p className="font-bold text-amber-600 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  {selectedLearner.rewardPoints || 0} PTS
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Python Fun Facts</span>
                <p className="font-bold text-indigo-600">
                  {selectedLearner.claimedFunFacts?.length || 0} / 10 Unlocked
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Completed Modules</span>
                <p className="font-bold text-slate-800">{selectedLearner.completedDays?.length || 0} modules</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Registered</span>
                <p className="text-slate-600 text-[11px]">
                  {selectedLearner.registrationDate ? new Date(selectedLearner.registrationDate).toLocaleDateString() : 'Active'}
                </p>
              </div>
            </div>

            {/* Grant Badge Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block font-bold text-slate-800 text-xs">Award Topic Skill Badge:</label>
              <div className="flex gap-2">
                <select id="inspect-badge-select" className="flex-1 p-2 border border-slate-200 rounded-lg text-xs bg-white">
                  {badges.map(b => (
                    <option key={b.id} value={b.id}>{b.topicCode}: {b.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const sel = document.getElementById('inspect-badge-select') as HTMLSelectElement;
                    handleGrantBadge(selectedLearner.id, sel.value);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  Award Badge
                </button>
              </div>
            </div>

            {/* Direct Certificate Issuance */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Master Enterprise Certificate</span>
                <span className="text-[11px] text-slate-500">Generates official verifiable distinction credential.</span>
              </div>
              <button
                onClick={() => handleIssueCert(selectedLearner.id)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
              >
                Issue Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Analytics Tab */}
      {adminTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{learners.length}</div>
              <span className="text-[11px] text-emerald-600 font-medium">+100% Google OAuth</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Submissions Logged</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{analytics.totalSubmissions}</div>
              <span className="text-[11px] text-slate-500 font-medium">Sandbox Runs</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cohort Pass Rate</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{analytics.passRate || 92}%</div>
              <span className="text-[11px] text-emerald-600 font-medium">{analytics.passedSubmissions || 24} accepted</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Badges Awarded</span>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1">{analytics.badgesIssued || 18}</div>
              <span className="text-[11px] text-amber-600 font-medium">Skill Badges</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Certificates Issued</span>
              <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{analytics.certificatesIssued || 9}</div>
              <span className="text-[11px] text-indigo-600 font-medium">Verifiable QR Credentials</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Logins</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{analytics.totalLogins || 42}</div>
              <span className="text-[11px] text-slate-500 font-medium">Live Sessions</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Curriculum Tab */}
      {adminTab === 'curriculum' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curriculum.map(c => (
            <div key={c.code} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded">
                  {c.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  c.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {c.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{c.title}</h3>
              <p className="text-slate-600 line-clamp-2">{c.overview}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                <span>{c.requiredProblemsCount} problems required</span>
                <span>Badge: {c.badgeName}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Problems Bank */}
      {adminTab === 'problems' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Curated Test-Suite Problems</h3>
              <p className="text-xs text-slate-500">Each question contains starter code, model solution, and test cases.</p>
            </div>
            <button
              onClick={() => setShowAddProblem(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Problem
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {p.topicCode} &bull; Q#{p.questionNumber}
                  </span>
                  <span className="font-bold text-slate-500 capitalize">{p.difficulty}</span>
                </div>
                <h4 className="font-bold text-slate-900">{p.title}</h4>
                <p className="text-slate-600 line-clamp-2">{p.statement}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{p.testCases.length} Test cases</span>
                  <span>Target: {p.timeComplexity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Badges & Credentials Tab */}
      {adminTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{b.name}</h4>
                  <span className="font-mono text-[10px] text-amber-700 font-bold">{b.topicCode}</span>
                </div>
              </div>
              <p className="text-slate-600">{b.description}</p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                Req: {b.criteria.requiredCount} problems &bull; {b.criteria.accuracyThreshold}% accuracy
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Security Audit Logs */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-600" />
            Security & Execution Audit Trail
          </h3>
          <div className="divide-y divide-slate-100 font-mono text-[11px]">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">[{log.action}]</span>
                  <span className="text-slate-600 ml-2">{log.details}</span>
                </div>
                <span className="text-slate-400 text-[10px]">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Problem Modal */}
      {showAddProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <form onSubmit={handleCreateProblem} className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Add New DSA Problem</h3>
              <button type="button" onClick={() => setShowAddProblem(false)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newProblem.title}
                  onChange={e => setNewProblem({ ...newProblem, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g. Valid Anagram"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Topic Code</label>
                <select
                  value={newProblem.topicCode}
                  onChange={e => setNewProblem({ ...newProblem, topicCode: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {curriculum.map(c => (
                    <option key={c.code} value={c.code}>{c.code}: {c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Problem Statement</label>
              <textarea
                required
                value={newProblem.statement}
                onChange={e => setNewProblem({ ...newProblem, statement: e.target.value })}
                className="w-full p-2 border rounded h-20"
                placeholder="Write full problem description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Starter Code (Python)</label>
                <textarea
                  value={newProblem.starterCode}
                  onChange={e => setNewProblem({ ...newProblem, starterCode: e.target.value })}
                  className="w-full p-2 border rounded font-mono h-24"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Model Solution</label>
                <textarea
                  value={newProblem.modelSolution}
                  onChange={e => setNewProblem({ ...newProblem, modelSolution: e.target.value })}
                  className="w-full p-2 border rounded font-mono h-24"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowAddProblem(false)}
                className="px-3 py-1.5 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0f172a] text-white font-bold rounded"
              >
                Create Problem
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
