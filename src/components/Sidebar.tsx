import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Target, 
  Layers, 
  Timer, 
  User, 
  HelpCircle, 
  LogOut, 
  Plus,
  X
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { AVATARS } from '../constants';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile;
  onOpenNewGoalModal: () => void;
  onOpenHelpCenter: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isAdmin?: boolean;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  profile, 
  onOpenNewGoalModal,
  onOpenHelpCenter,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  isAdmin = false
}: SidebarProps) {
  
  const navItems: { id: ActiveTab; name: string; icon: any }[] = [
    { id: 'overview', name: 'Overview', icon: Home },
    isAdmin
      ? { id: 'admin', name: 'Admin Dashboard', icon: LayoutDashboard }
      : { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'goals', name: 'My Goals', icon: Target },
    { id: 'planning', name: 'Planning & Tasks', icon: Layers },
    { id: 'timer', name: 'Focus Timer', icon: Timer },
    { id: 'settings', name: 'Profile & Settings', icon: User },
  ];

  const currentAvatar = AVATARS.find(a => a.id === profile.avatar) || AVATARS[0];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#07111F]/80 backdrop-blur-sm z-30 transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        id="sidebar-container" 
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0B172A]/95 backdrop-blur-xl text-[#A8B8CC] border-r border-[#1D3555] flex flex-col h-full justify-between select-none transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between">
            <div 
              id="sidebar-logo-container" 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => {
                setActiveTab('overview');
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <div className="w-10 h-10 bg-[#101F35] rounded-xl flex items-center justify-center border border-[#1D3555] relative overflow-hidden shadow-lg group-hover:border-[#00A3FF] transition-colors">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#00A3FF] stroke-current fill-none transition-transform duration-200 group-hover:scale-105" strokeWidth="6">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" />
                  <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold font-display text-[#FFFFFF] leading-none tracking-tight whitespace-nowrap">Axiom Focus</h1>
                <span className="text-[11px] text-[#A8B8CC] font-medium block mt-1 whitespace-nowrap">Peak Performance</span>
              </div>
            </div>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 text-[#A8B8CC] hover:text-[#FFFFFF] rounded-lg hover:bg-[#101F35] transition-colors cursor-pointer"
                title="Close sidebar menu"
                aria-label="Close sidebar menu"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* New Goal CTA */}
          <button
            id="btn-new-goal"
            onClick={onOpenNewGoalModal}
            className="w-full py-2.5 px-4 axiom-btn-primary rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Goal</span>
          </button>

          {/* Navigation Items */}
          <nav id="sidebar-nav" className="flex flex-col gap-1" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all duration-150 text-left cursor-pointer border whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0066FF]/18 text-[#FFFFFF] border-[#00A3FF]/40 shadow-sm'
                      : 'border-transparent text-[#A8B8CC] hover:text-[#FFFFFF] hover:bg-[#101F35]'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-[#00A3FF] shrink-0' : 'text-[#A8B8CC]/80 shrink-0'} />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile / Help */}
        <div id="sidebar-footer" className="p-4 border-t border-[#1D3555] flex flex-col gap-3 bg-[#07111F]/90">
          {/* Help Center */}
          <button
            id="btn-help-center"
            onClick={onOpenHelpCenter}
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#A8B8CC] hover:text-[#FFFFFF] hover:bg-[#101F35] rounded-lg transition-colors w-full text-left cursor-pointer"
          >
            <HelpCircle size={15} className="text-[#00A3FF] shrink-0" />
            <span>Help Center</span>
          </button>

          {/* User Block */}
          <div id="user-profile-block" className="flex items-center justify-between bg-[#101F35] p-2.5 rounded-xl border border-[#1D3555]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#1D3555] bg-[#0B172A] p-0.5 shrink-0" dangerouslySetInnerHTML={{ __html: currentAvatar.svg }} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#FFFFFF] leading-tight truncate">
                  {profile.firstName || 'User'}
                </span>
                <span className="text-[11px] text-[#A8B8CC] truncate">{profile.email}</span>
              </div>
            </div>
            <button
              id="btn-logout"
              onClick={onLogout}
              title="Reset Session / Sign out"
              aria-label="Sign out"
              className="p-2 text-[#A8B8CC] hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
