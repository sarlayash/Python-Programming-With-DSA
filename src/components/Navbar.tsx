import React, { useState } from 'react';
import {
  Code2,
  BookOpen,
  Award,
  FileCheck,
  Shield,
  Bell,
  Flame,
  LogOut,
  User,
  CheckCircle,
  LayoutDashboard,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { LearnerProfile, AppNotification } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: any;
  userRole: 'learner' | 'admin' | null;
  onOpenAuth: (tab?: 'learner' | 'admin') => void;
  onLogout: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  userRole,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-950/20 font-mono font-bold text-base">
              Py
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">Python Programming With DSA</span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">Enterprise</span>
              </div>
              <p className="text-[11px] text-amber-400/90 font-medium">Powered By Kapil</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
            <button
              onClick={() => onSelectTab('curriculum')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'curriculum'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Curriculum (T1-T10)
            </button>
            <button
              onClick={() => onSelectTab('ide')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'ide'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Coding Lab
            </button>
            <button
              onClick={() => onSelectTab('badges')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'badges'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              My Badges
            </button>
            <button
              onClick={() => onSelectTab('certificate')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'certificate'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Final Certificate
            </button>
            <button
              onClick={() => onSelectTab('verify')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentTab === 'verify'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Official QR Verification"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              Verify QR
            </button>

            {userRole === 'admin' && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-amber-300 hover:bg-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* Right actions: notifications, user badge, auth button */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                    <span className="text-[11px] font-semibold text-amber-600">{unreadCount} new</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-amber-50/40 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Streak Indicator for Learners */}
            {userRole === 'learner' && currentUser && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{currentUser.streak || 1} Day Streak</span>
              </div>
            )}

            {/* User Profile or Login CTA */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  {currentUser.photo ? (
                    <img
                      src={currentUser.photo}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-400">
                      {currentUser.name ? currentUser.name[0] : 'U'}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold text-slate-200 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {userRole === 'admin' ? 'Administrator' : currentUser.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('learner')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Learner Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('admin')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg border border-slate-700 transition-colors"
                >
                  Admin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800 text-xs gap-2">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'dashboard' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('curriculum')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'curriculum' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300'}`}
          >
            Curriculum
          </button>
          <button
            onClick={() => onSelectTab('ide')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'ide' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300'}`}
          >
            Coding Lab
          </button>
          <button
            onClick={() => onSelectTab('badges')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'badges' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300'}`}
          >
            Badges
          </button>
          <button
            onClick={() => onSelectTab('certificate')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'certificate' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300'}`}
          >
            Certificate
          </button>
          <button
            onClick={() => onSelectTab('verify')}
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${currentTab === 'verify' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300'}`}
          >
            <QrCode className="w-3 h-3 text-amber-400" />
            Verify QR
          </button>
          {userRole === 'admin' && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`px-2.5 py-1 rounded whitespace-nowrap ${currentTab === 'admin' ? 'text-amber-400 font-bold bg-slate-800' : 'text-amber-300'}`}
            >
              Admin Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
