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
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        id="sidebar-container" 
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#071120] text-gray-300 border-r border-[#1a2c42] flex flex-col h-full justify-between select-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 flex flex-col gap-6">
          {/* Logo and Brand with mobile close trigger */}
          <div className="flex items-center justify-between">
            <div 
              id="sidebar-logo-container" 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {
                setActiveTab('overview');
                if (onCloseMobile) onCloseMobile();
              }}
            >
              {/* Custom SVG Logo matching the uploaded picture logo exactly */}
              <div className="w-10 h-10 bg-[#0c1a30] rounded-xl flex items-center justify-center border border-[#e0a96d]/20 relative overflow-hidden group shadow-lg">
                {/* Arrows pointing inwards */}
                <div className="absolute top-1 left-1 text-[#e0a96d] opacity-80 text-[8px] font-bold">↘</div>
                <div className="absolute top-1 right-1 text-[#e0a96d] opacity-80 text-[8px] font-bold">↙</div>
                <div className="absolute bottom-1 left-1 text-[#e0a96d] opacity-80 text-[8px] font-bold">↗</div>
                <div className="absolute bottom-1 right-1 text-[#e0a96d] opacity-80 text-[8px] font-bold">↖</div>
                
                {/* Concentric Gold Circles */}
                <svg viewBox="0 0 100 100" className="w-7 h-7 text-[#e0a96d] stroke-current fill-none" strokeWidth="6">
                  <circle cx="50" cy="50" r="40" stroke="#e0a96d" />
                  <circle cx="50" cy="50" r="25" stroke="#e0a96d" strokeWidth="4" />
                  <circle cx="50" cy="50" r="10" fill="#e0a96d" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold font-display text-[#e0a96d] leading-none tracking-tight">Axiom Focus</h1>
                <span className="text-[10px] font-mono text-gray-500 tracking-wider font-medium uppercase">Peak Performance</span>
              </div>
            </div>

            {/* Mobile close trigger button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#10243d] transition-colors"
                title="Close sidebar menu"
              >
                <X size={18} />
              </button>
            )}
          </div>

        {/* New Goal Button */}
        <button
          id="btn-new-goal"
          onClick={onOpenNewGoalModal}
          className="w-full py-2.5 px-4 bg-[#091629] border border-[#e0a96d]/40 rounded-xl text-[#e0a96d] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#e0a96d]/10 transition-all duration-300 shadow-md active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>NEW GOAL</span>
        </button>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-[#10243d] text-white border-l-4 border-[#e0a96d] shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#0c1a30]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#e0a96d]' : 'text-gray-500'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile / Help */}
      <div id="sidebar-footer" className="p-4 border-t border-[#1a2c42] flex flex-col gap-3 bg-[#050e1b]">
        {/* Help Center */}
        <button
          id="btn-help-center"
          onClick={onOpenHelpCenter}
          className="flex items-center gap-3 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors w-full text-left"
        >
          <HelpCircle size={16} className="text-gray-500" />
          <span>Help Center</span>
        </button>

        {/* User Block */}
        <div id="user-profile-block" className="flex items-center justify-between bg-[#0a1526] p-2.5 rounded-xl border border-[#14263b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#e0a96d]/20 bg-[#1e293b] p-0.5" dangerouslySetInnerHTML={{ __html: currentAvatar.svg }} />
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white leading-tight truncate">
                {profile.firstName || 'User'}
              </span>
              <span className="text-[10px] text-gray-500 truncate">{profile.email}</span>
            </div>
          </div>
          <button
            id="btn-logout"
            onClick={onLogout}
            title="Reset Session / Sign out"
            className="p-1.5 text-gray-500 hover:text-[#ef4444] rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
