import React, { useState } from 'react';
import {
  Bell,
  Flame,
  LogOut,
  Trophy,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  Check
} from 'lucide-react';
import { AppNotification } from '../types';
import { UserAvatar } from './UserAvatar';

interface TopHeaderProps {
  currentUser: any;
  userRole: 'learner' | 'admin' | null;
  onOpenAuth: (tab?: 'learner' | 'admin') => void;
  onLogout: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectTab: (tab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  userRole,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  isSidebarCollapsed,
  onToggleCollapse,
  onSelectTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] text-white border-b border-slate-800 shadow-sm select-none">
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar toggle + Brand */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-md transition-colors"
              title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Brand Logo & Title */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => onSelectTab('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-950/30 font-mono font-black text-base transition-transform group-hover:scale-105">
                Py
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    Python Programming With DSA
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                    Enterprise
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
                  <span>Powered By Kapil</span>
                  <span className="text-slate-600 hidden md:inline">&bull;</span>
                  <span className="text-slate-400 hidden md:inline text-[10px]">Fortune 500 DSA Rigor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Stats, Notifications & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak & Reward Points for Learners */}
            {userRole === 'learner' && currentUser && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold"
                  title="Daily Streak Secured"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-bold">{currentUser.streak || 1}d</span>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab('debugging')}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors cursor-pointer"
                  title="Your Reward Points - Click to visit Debug Lab"
                >
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold">{currentUser.rewardPoints || 0} PTS</span>
                </button>
              </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notifications
                    </span>
                    <span className="text-[11px] font-semibold text-amber-600">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onMarkNotificationRead(n.id);
                          }}
                          className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-amber-50/50 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Login CTA */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    photo={currentUser.photo}
                    name={currentUser.name}
                    email={currentUser.email}
                    size="sm"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-bold text-slate-100 leading-tight truncate max-w-[130px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                      {userRole === 'admin' ? 'Administrator' : currentUser.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('learner')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Learner Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('admin')}
                  className="hidden sm:inline-block px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg border border-slate-700 transition-colors"
                >
                  Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
