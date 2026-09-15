import React, { useState, useEffect } from 'react';
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
  Download
} from 'lucide-react';
import { api } from '../lib/api';
import { DayCurriculum, Problem, Badge, LearnerProfile } from '../types';

interface AdminDashboardProps {
  onBackToLearner: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToLearner }) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'learners' | 'curriculum' | 'problems' | 'badges' | 'audit'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [curriculum, setCurriculum] = useState<DayCurriculum[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchLearner, setSearchLearner] = useState('');
  const [selectedLearner, setSelectedLearner] = useState<LearnerProfile | null>(null);

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

  const fetchData = async () => {
    setLoading(true);
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
      setLearners(learnersData);
      setCurriculum(curriculumData);
      setProblems(problemsData);
      setBadges(badgesData);
      setAuditLogs(auditData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProblem(newProblem);
      setShowAddProblem(false);
      fetchData();
      alert('Problem added to curriculum!');
    } catch (err: any) {
      alert(err.message || 'Failed to create problem');
    }
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
      fetchData();
      alert(`Badge ${badge.name} granted to learner!`);
    } catch (err: any) {
      alert(err.message || 'Failed to grant badge');
    }
  };

  const handleIssueCert = async (learnerId: string) => {
    try {
      await api.issueCertificateManually(learnerId);
      fetchData();
      alert('Certificate issued to learner!');
    } catch (err: any) {
      alert(err.message || 'Failed to issue certificate');
    }
  };

  const filteredLearners = learners.filter(l =>
    l.name.toLowerCase().includes(searchLearner.toLowerCase()) ||
    l.email.toLowerCase().includes(searchLearner.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Admin Header */}
      <div className="bg-[#0f172a] text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Executive Management Console</h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-slate-950 rounded">
                KAPILADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Curriculum governance, isolated Python runner telemetry, and verifiable credentials registry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={onBackToLearner}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            Return to Learner View
          </button>
        </div>
      </div>

      {/* Admin Sub Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto shadow-sm">
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
          onClick={() => setAdminTab('learners')}
          className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            adminTab === 'learners' ? 'border-amber-500 text-slate-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-amber-600" />
          Learners Registry ({learners.length})
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

      {/* 1. Analytics Tab */}
      {adminTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{analytics.totalLearners}</div>
              <span className="text-[11px] text-emerald-600 font-medium">+100% Google OAuth</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Submissions Logged</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{analytics.totalSubmissions}</div>
              <span className="text-[11px] text-slate-500 font-medium">Sandbox Runs</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cohort Pass Rate</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{analytics.passRate}%</div>
              <span className="text-[11px] text-emerald-600 font-medium">{analytics.passedSubmissions} accepted</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Reveals Consumed</span>
              <div className="text-2xl font-black text-indigo-700 font-mono mt-1">{analytics.revealsUsed}</div>
              <span className="text-[11px] text-indigo-600 font-medium">2+ Wrong attempts</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Badges Awarded</span>
              <div className="text-2xl font-black text-amber-700 font-mono mt-1">{analytics.totalBadgesEarned}</div>
              <span className="text-[11px] text-amber-600 font-medium">Verifiable QR</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400">Certificates Issued</span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">{analytics.totalCertificatesIssued}</div>
              <span className="text-[11px] text-slate-500 font-medium">Full Completion</span>
            </div>
          </div>

          {/* Hardest / Most Failed Problems */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Highest Failure Rate Problems (Requires Mentorship Attention)
            </h3>
            <div className="divide-y divide-slate-100">
              {analytics.mostFailedProblems && analytics.mostFailedProblems.length > 0 ? (
                analytics.mostFailedProblems.map((item: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="text-slate-400 ml-2 font-mono">({item.problemId})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                      {item.failCount} failed runs
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No recurring failures detected across test runs.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Learners Management */}
      {adminTab === 'learners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchLearner}
                onChange={e => setSearchLearner(e.target.value)}
                placeholder="Search learner name or email..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Current Day</th>
                  <th className="py-3 px-4">Problems Solved</th>
                  <th className="py-3 px-4">Streak</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLearners.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      {l.photo ? (
                        <img src={l.photo} alt={l.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                          {l.name[0]}
                        </div>
                      )}
                      <span>{l.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{l.email}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{l.currentDay}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-700">{l.solvedProblems.length}</span>
                      <span className="text-slate-400"> / {problems.length}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">{l.streak} days</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLearner(l)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] mr-2"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => handleIssueCert(l.id)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded text-[11px]"
                      >
                        Issue Cert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Learner Inspect Modal */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Learner Profile: {selectedLearner.name}</h3>
              <button onClick={() => setSelectedLearner(null)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <div className="space-y-2">
              <div><strong>Email:</strong> {selectedLearner.email}</div>
              <div><strong>Registered:</strong> {new Date(selectedLearner.joinedAt).toLocaleString()}</div>
              <div><strong>Completed Days:</strong> {selectedLearner.completedDays.join(', ') || 'None'}</div>
              <div><strong>Revealed Answers:</strong> {selectedLearner.revealedProblems.length} problems</div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-700 mb-1">Manually Grant Badge:</label>
              <div className="flex gap-2">
                <select id="admin-badge-select" className="flex-1 p-2 border border-slate-200 rounded text-xs">
                  {badges.map(b => (
                    <option key={b.id} value={b.id}>{b.topicCode}: {b.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const sel = document.getElementById('admin-badge-select') as HTMLSelectElement;
                    handleGrantBadge(selectedLearner.id, sel.value);
                  }}
                  className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded"
                >
                  Grant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Problems Bank */}
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

      {/* 4. Audit Logs */}
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
    </div>
  );
};
