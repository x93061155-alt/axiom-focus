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
          className="md:hidden fixed inset-0 bg-[#171717]/25 backdrop-blur-sm z-30 transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        id="sidebar-container" 
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#FFFFFF]/95 backdrop-blur-xl text-[#666666] border-r border-[#F7E7B0] shadow-[4px_0_24px_-12px_rgba(166,124,0,0.12)] flex flex-col h-full justify-between select-none transition-transform duration-300 ease-out ${
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
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFFDF5] via-[#FFF4B0]/55 to-[#F7E7B0]/65 rounded-xl flex items-center justify-center border border-[#D4AF37]/60 relative overflow-hidden shadow-[0_4px_14px_-4px_rgba(166,124,0,0.28)] group-hover:border-[#A67C00] transition-colors">
                <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#A67C00] stroke-current fill-none transition-transform duration-200 group-hover:scale-105" strokeWidth="6">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" />
                  <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold font-display text-[#171717] leading-none tracking-tight whitespace-nowrap">Axiom Focus</h1>
                <span className="text-[11px] text-[#666666] font-medium block mt-1 whitespace-nowrap">Peak Performance</span>
              </div>
            </div>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 text-[#666666] hover:text-[#171717] rounded-lg hover:bg-[#FFFDF5] transition-colors cursor-pointer"
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
                      ? 'bg-gradient-to-r from-[#FFF4B0]/55 via-[#F7E7B0]/45 to-[#FFFDF5] text-[#171717] font-semibold border-[#D4AF37]/75 shadow-[0_4px_14px_-6px_rgba(166,124,0,0.22)]'
                      : 'border-transparent text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5]'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-[#A67C00] shrink-0' : 'text-[#666666] shrink-0'} />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile / Help */}
        <div id="sidebar-footer" className="p-4 border-t border-[#F7E7B0] flex flex-col gap-3 bg-[#FAFAFA]/90">
          {/* Help Center */}
          <button
            id="btn-help-center"
            onClick={onOpenHelpCenter}
            className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5] rounded-lg transition-colors w-full text-left cursor-pointer"
          >
            <HelpCircle size={15} className="text-[#A67C00] shrink-0" />
            <span>Help Center</span>
          </button>

          {/* User Block */}
          <div id="user-profile-block" className="flex items-center justify-between bg-[#FFFDF5] p-2.5 rounded-xl border border-[#F7E7B0] shadow-[0_2px_10px_-4px_rgba(166,124,0,0.12)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#D4AF37]/45 bg-[#FFFFFF] p-0.5 shrink-0" dangerouslySetInnerHTML={{ __html: currentAvatar.svg }} />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#171717] leading-tight truncate">
                  {profile.firstName || 'User'}
                </span>
                <span className="text-[11px] text-[#666666] truncate">{profile.email}</span>
              </div>
            </div>
            <button
              id="btn-logout"
              onClick={onLogout}
              title="Reset Session / Sign out"
              aria-label="Sign out"
              className="p-2 text-[#666666] hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
