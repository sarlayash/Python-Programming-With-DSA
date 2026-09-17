import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Code2,
  Bug,
  Sparkles,
  RotateCw,
  Award,
  FileCheck,
  QrCode,
  Shield,
  CheckCircle2,
  Terminal,
  ExternalLink,
  ChevronRight,
  X,
  Trophy
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: 'learner' | 'admin' | null;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  earnedBadgesCount?: number;
  hasCertificate?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeStyle?: string;
  pulseDot?: boolean;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  earnedBadgesCount = 0,
  hasCertificate = false
}) => {
  const navGroups: NavGroup[] = [
    {
      groupTitle: 'Core Learning',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          description: 'Overview & Daily Progress',
          icon: LayoutDashboard
        },
        {
          id: 'fundamentals',
          label: 'Fundamentals',
          description: '5 Progressive Sections',
          icon: GraduationCap,
          badge: '5 Sec',
          badgeStyle: 'bg-amber-400/20 text-amber-300 border-amber-400/30'
        },
        {
          id: 'curriculum',
          label: 'Curriculum (T1-T10)',
          description: 'Day 1 to 10 Topics',
          icon: BookOpen,
          badge: '10 Days',
          badgeStyle: 'bg-slate-800 text-slate-300 border-slate-700'
        },
        {
          id: 'ide',
          label: 'Coding Lab',
          description: 'Isolated Python IDE',
          icon: Code2,
          badge: 'IDE',
          badgeStyle: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        }
      ]
    },
    {
      groupTitle: 'Interactive Labs',
      items: [
        {
          id: 'debugging',
          label: 'Debug Lab',
          description: 'Fix Flawed Scripts',
          icon: Bug,
          badge: '+350 PTS',
          badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'facts',
          label: 'Fun Facts',
          description: 'Lore & Easter Eggs',
          icon: Sparkles,
          badge: '+270 PTS',
          badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        {
          id: 'wheel',
          label: 'Spin & Quiz',
          description: 'Lucky Wheel & 10 MCQs',
          icon: RotateCw,
          badge: 'Daily',
          badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          pulseDot: true
        }
      ]
    },
    {
      groupTitle: 'Credentials & Audit',
      items: [
        {
          id: 'final-assessment',
          label: 'Final Assessment',
          description: 'Day 1-10 Certified Exam',
          icon: Trophy,
          badge: '90 MIN',
          badgeStyle: 'bg-amber-400/20 text-amber-300 border-amber-400/30 font-bold',
          pulseDot: true
        },
        {
          id: 'badges',
          label: 'My Badges',
          description: 'Earned Verifiable Badges',
          icon: Award,
          badge: earnedBadgesCount > 0 ? `${earnedBadgesCount}` : undefined,
          badgeStyle: 'bg-amber-500 text-slate-950 font-black'
        },
        {
          id: 'certificate',
          label: 'Final Certificate',
          description: 'Official Completion Document',
          icon: FileCheck,
          badge: hasCertificate ? 'Earned' : undefined,
          badgeStyle: 'bg-emerald-500 text-slate-950 font-black'
        },
        {
          id: 'verify',
          label: 'Verify QR',
          description: 'Public Cryptographic Check',
          icon: QrCode
        }
      ]
    }
  ];

  if (userRole === 'admin') {
    navGroups.push({
      groupTitle: 'Administration',
      items: [
        {
          id: 'admin',
          label: 'Admin Dashboard',
          description: 'Cohort & Learner Control',
          icon: Shield,
          badge: 'Admin',
          badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        }
      ]
    });
  }

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full select-none">
      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={group.groupTitle} className="space-y-1.5">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/90 font-mono">
                {group.groupTitle}
              </div>
            )}
            {isCollapsed && gIdx > 0 && (
              <div className="w-8 mx-auto my-2 border-t border-slate-800" />
            )}

            <div className="space-y-1">
              {group.items.map(item => {
                const IconComponent = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? `${item.label} - ${item.description}` : undefined}
                    className={`w-full flex items-center gap-3 rounded-xl transition-all duration-150 text-left relative group ${
                      isCollapsed
                        ? 'p-2.5 justify-center'
                        : 'px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    {/* Active highlight bar on left */}
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-amber-500 rounded-r-full" />
                    )}

                    {/* Icon container */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-800/80 text-slate-300 group-hover:text-amber-400 group-hover:bg-slate-800'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Expanded details */}
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-1.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold truncate block ${
                                isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.pulseDot && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block leading-tight">
                            {item.description}
                          </span>
                        </div>

                        {item.badge && (
                          <span
                            className={`shrink-0 px-2 py-0.5 text-[10px] rounded-md font-mono font-bold border ${
                              item.badgeStyle || 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Collapsed Badge indicator */}
                    {isCollapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Sandbox Status */}
      <div className="p-3 border-t border-slate-800 bg-[#0b1220]/60">
        {!isCollapsed ? (
          <div className="rounded-xl p-3 bg-slate-800/50 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Python Sandbox</span>
              </div>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Client & Container WebAssembly Engine with Fortune 500 Test Harness.
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Python Sandbox Online">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky under TopHeader) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-[#0f172a] text-white border-r border-slate-800 transition-all duration-200 z-30 sticky top-16 ${
          isCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Slide-in Panel */}
          <div className="relative flex flex-col w-4/5 max-w-xs bg-[#0f172a] text-white shadow-2xl h-full border-r border-slate-800 z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-mono font-black text-xs">
                  Py
                </div>
                <span className="font-bold text-sm text-white">Menu Navigation</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
