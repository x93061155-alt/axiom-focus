import React, { useState } from 'react';
import { User, ShieldAlert, Sparkles, AlertCircle, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { AVATARS } from '../constants';
import Footer from './Footer';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onCancel: () => void;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

export default function ProfileSettings({ profile, onSaveProfile, onCancel, onOpenInfo }: ProfileSettingsProps) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [motivationalReminders, setMotivationalReminders] = useState(profile.motivationalReminders);
  const [goalMilestones, setGoalMilestones] = useState(profile.goalMilestones);
  
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      firstName,
      lastName,
      email,
      avatar,
      motivationalReminders,
      goalMilestones,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const selectedAvatarData = AVATARS.find((a) => a.id === avatar) || AVATARS[0];

  return (
    <div id="settings-tab" className="flex-1 overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 flex flex-col justify-between min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Header Title & Action buttons matching Screenshot 3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#12243d] pb-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">Profile & Settings</h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage your architectural clarity. Update your identity, configure your focus notifications, and maintain your system preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-[#1a2c42] rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-[#10243d] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-md shadow-[#e0a96d]/10"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>

        {/* Somali quote banner exactly as displayed in yellow-gold in Screenshot 3 */}
        <div className="bg-[#0b1d31] border-2 border-dashed border-[#e0a96d]/30 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#e0a96d]/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-sm md:text-base font-semibold font-display text-[#e0a96d] italic leading-relaxed max-w-4xl mx-auto z-10 relative">
            "wali dhismo ayaa ku socda wepsite kaan, mahadsanid sida quruxda badan aad uso boqatey wepkayga"
          </p>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mt-2 z-10 relative">
            AXIOM SYSTEM NOTIFICATION • TRANSLATION: DEVELOPMENT ACTIVE • THANK YOU FOR VISITING
          </span>
        </div>

        {/* Saved Success Notification */}
        {savedSuccess && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4 flex items-center gap-3 text-xs">
            <Check size={16} />
            <span>Profile and system preferences saved successfully to persistent local storage!</span>
          </div>
        )}

        {/* Main Grid: Personal Identity vs Focus Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Card 1: Personal Identity exactly as Screenshot 3 */}
          <div className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold font-display text-[#e0a96d] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#e0a96d]" />
              <span>Personal Identity</span>
            </h3>

            {/* Avatar Selector Block */}
            <div className="bg-[#051120] border border-[#1a2c42] p-4 rounded-xl flex items-center gap-5">
              <div 
                className="w-16 h-16 rounded-2xl overflow-hidden bg-[#1e293b] border-2 border-[#e0a96d]/20 p-1 flex-shrink-0 cursor-pointer" 
                dangerouslySetInnerHTML={{ __html: selectedAvatarData.svg }}
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                title="Click to select different avatar"
              />
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">Profile Avatar</span>
                <span className="text-[10px] text-gray-400 block mb-2">Your current identity representation across the system.</span>
                <button
                  type="button"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="px-3 py-1.5 border border-[#1a2c42] hover:border-[#e0a96d]/40 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white hover:bg-[#10243d] transition-colors"
                >
                  {showAvatarSelector ? 'CLOSE SELECTOR' : 'SELECT AVATAR'}
                </button>
              </div>
            </div>

            {/* Hidden Avatar Carousel */}
            {showAvatarSelector && (
              <div className="bg-[#051120] border border-[#e0a96d]/20 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-3 font-semibold">Choose Your Node Agent Icon</span>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setAvatar(av.id);
                        setShowAvatarSelector(false);
                      }}
                      className={`p-2 bg-[#0b1d31] hover:bg-[#10243d] border rounded-xl transition-all flex flex-col items-center gap-1.5 ${
                        avatar === av.id ? 'border-[#e0a96d] bg-[#10243d]' : 'border-[#1a2c42]'
                      }`}
                    >
                      <div className="w-10 h-10" dangerouslySetInnerHTML={{ __html: av.svg }} />
                      <span className="text-[9px] font-mono text-gray-400">{av.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs styled with clean labels exactly as Screenshot 3 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold block mb-1.5">FIRST NAME</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold block mb-1.5">LAST NAME</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold block mb-1.5">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Focus Signals exactly as Screenshot 3 */}
          <div className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold font-display text-[#e0a96d] flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e0a96d]" />
                <span>Focus Signals</span>
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Configure how Axiom interrupts your flow state. We recommend keeping notifications minimal to preserve architectural clarity.
              </p>
            </div>

            {/* Toggle Switch 1 */}
            <div className="bg-[#051120] border border-[#1a2c42] p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">Motivational Reminders</span>
                <span className="text-[10px] text-gray-400 block">Daily pushes to maintain momentum.</span>
              </div>
              <button
                type="button"
                onClick={() => setMotivationalReminders(!motivationalReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  motivationalReminders ? 'bg-[#e0a96d]' : 'bg-[#1e293b]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#071324] transition-transform ${
                    motivationalReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Switch 2 */}
            <div className="bg-[#051120] border border-[#1a2c42] p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">Goal Milestones</span>
                <span className="text-[10px] text-gray-400 block">Alerts when passing major milestones.</span>
              </div>
              <button
                type="button"
                onClick={() => setGoalMilestones(!goalMilestones)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  goalMilestones ? 'bg-[#e0a96d]' : 'bg-[#1e293b]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#071324] transition-transform ${
                    goalMilestones ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Extra Settings Panel helper */}
            <div className="bg-amber-500/5 border border-[#e0a96d]/15 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle size={16} className="text-[#e0a96d] mt-0.5 flex-shrink-0" />
              <div className="text-[11px] text-gray-400 leading-relaxed">
                <strong className="text-white block mb-0.5">Persistence Status</strong>
                Your profile updates are stored locally. Clearing your web browser cookies or offline storage will reset configuration parameters.
              </div>
            </div>
          </div>

        </div>
      </form>

      {/* Corporate Academic Footer credits exactly matching Reusable footer */}
      <Footer idPrefix="settings" onOpenInfo={onOpenInfo} />
    </div>
  );
}
