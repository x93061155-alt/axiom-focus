import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const activeCategory = selectedCategory || AVATARS.find((a) => a.id === avatar)?.category || 'Adult';
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
    <div id="settings-tab" className="flex-1 overflow-y-auto text-[#171717] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <form onSubmit={handleSubmit} className="space-y-7 max-w-6xl w-full mx-auto">
        
        {/* Header Title & Action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F7E7B0] pb-6">
          <div>
            <span className="text-xs font-semibold text-[#A67C00] block mb-1">Workspace Preferences</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-[#171717]">Profile & Settings</h2>
            <p className="text-sm text-[#666666] mt-1.5 max-w-2xl">
              Manage your identity, configure your focus notifications, and maintain your system preferences.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 axiom-btn-secondary rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Somali quote banner */}
        <div className="axiom-card border-[#D4AF37]/50 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />
          <p className="text-sm md:text-base font-semibold font-display text-[#A67C00] italic leading-relaxed max-w-4xl mx-auto z-10 relative">
            "wali dhismo ayaa ku socda wepsite kaan, mahadsanid sida quruxda badan aad uso boqatey wepkayga"
          </p>
          <span className="text-xs text-[#666666] block mt-2 z-10 relative">
            Axiom System Notification · Translation: Development Active · Thank You for Visiting
          </span>
        </div>

        {/* Saved Success Notification */}
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 flex items-center gap-3 text-sm">
            <Check size={16} className="text-emerald-600 shrink-0" />
            <span>Profile and system preferences saved successfully!</span>
          </div>
        )}

        {/* Main Grid: Personal Identity vs Focus Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 items-start">
          
          {/* Card 1: Personal Identity */}
          <div className="axiom-card rounded-2xl p-6 space-y-6">
            <div className="border-b border-[#F7E7B0] pb-3">
              <h3 className="text-base font-bold font-display text-[#171717]">Personal Identity</h3>
              <p className="text-xs text-[#666666] mt-0.5">Customize your avatar and account details</p>
            </div>

            {/* Avatar Selector Block */}
            <div className="axiom-inset p-4 rounded-xl flex items-center gap-5">
              <div 
                className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#D4AF37]/55 p-1 flex-shrink-0 cursor-pointer hover:border-[#A67C00] transition-colors shadow-sm" 
                dangerouslySetInnerHTML={{ __html: selectedAvatarData.svg }}
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                title="Click to select different avatar"
              />
              <div className="space-y-1">
                <span className="text-sm font-semibold text-[#171717] block">Profile Avatar</span>
                <span className="text-xs text-[#666666] block mb-2.5">Your current identity representation across the workspace.</span>
                <button
                  type="button"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="px-3.5 py-1.5 axiom-btn-secondary rounded-lg text-xs cursor-pointer"
                >
                  {showAvatarSelector ? 'Close Selector' : 'Select Avatar'}
                </button>
              </div>
            </div>

            {/* Expandable Avatar Selector */}
            {showAvatarSelector && (
              <div className="axiom-inset border-[#D4AF37]/55 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#F7E7B0] pb-2.5">
                  <span className="text-xs font-medium text-[#666666]">
                    Choose Your Avatar
                  </span>
                  <span className="text-xs text-[#A67C00] font-semibold font-mono tabular-nums">
                    {AVATARS.length} available
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#F7E7B0]">
                  {['Child', 'Adult', 'Older Adult', 'Senior'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer truncate px-1 ${
                        activeCategory === cat
                          ? 'bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-[#171717] font-semibold shadow-sm'
                          : 'text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-1">
                  {Array.from(
                    new Set(
                      AVATARS.filter((a) => a.category === activeCategory).map(
                        (a) => a.subcategory
                      )
                    )
                  ).map((subcat) => {
                    const subcatAvatars = AVATARS.filter(
                      (a) =>
                        a.category === activeCategory &&
                        a.subcategory === subcat
                    );
                    return (
                      <div key={subcat} className="space-y-2">
                        <h4 className="text-xs font-semibold text-[#A67C00]">
                          {subcat}s
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {subcatAvatars.map((av) => (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => {
                                setAvatar(av.id);
                                setShowAvatarSelector(false);
                                setSelectedCategory(null);
                              }}
                              className={`p-3 rounded-xl border transition-all flex items-center gap-3 text-left cursor-pointer ${
                                avatar === av.id
                                  ? 'border-[#D4AF37] bg-gradient-to-r from-[#FFF4B0]/55 to-[#FFFDF5] shadow-sm'
                                  : 'border-[#F7E7B0] bg-[#FFFFFF] hover:bg-[#FFFDF5] hover:border-[#D4AF37]/60'
                              }`}
                            >
                              <div
                                className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[#F7E7B0] p-0.5 shrink-0"
                                dangerouslySetInnerHTML={{ __html: av.svg }}
                              />
                              <div className="min-w-0">
                                <span className="text-xs font-semibold text-[#171717] block truncate">
                                  {av.name}
                                </span>
                                <span className="text-[11px] text-[#666666] block">
                                  {av.subcategory}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#666666] block mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Focus Signals */}
          <div className="axiom-card rounded-2xl p-6 space-y-5">
            <div className="border-b border-[#F7E7B0] pb-3">
              <h3 className="text-base font-bold font-display text-[#171717]">Focus Signals</h3>
              <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                Configure how Axiom delivers reminders while keeping notifications minimal.
              </p>
            </div>

            {/* Toggle Switch 1 */}
            <div className="axiom-inset p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-[#171717] block">Motivational Reminders</span>
                <span className="text-xs text-[#666666] block">Daily nudges to maintain steady momentum.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={motivationalReminders}
                aria-label="Toggle motivational reminders"
                onClick={() => setMotivationalReminders(!motivationalReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 border ${
                  motivationalReminders ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] border-[#A67C00]/50' : 'bg-[#FAFAFA] border-[#F7E7B0]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] shadow-sm border border-[#D4AF37]/30 transition-transform ${
                    motivationalReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Switch 2 */}
            <div className="axiom-inset p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-[#171717] block">Goal Milestones</span>
                <span className="text-xs text-[#666666] block">Alerts when passing major strategic milestones.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={goalMilestones}
                aria-label="Toggle goal milestones alerts"
                onClick={() => setGoalMilestones(!goalMilestones)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 border ${
                  goalMilestones ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] border-[#A67C00]/50' : 'bg-[#FAFAFA] border-[#F7E7B0]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#FFFFFF] shadow-sm border border-[#D4AF37]/30 transition-transform ${
                    goalMilestones ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Persistence info panel */}
            <div className="bg-gradient-to-r from-[#FFFDF5] to-[#FFF4B0]/35 border border-[#D4AF37]/45 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle size={16} className="text-[#A67C00] mt-0.5 flex-shrink-0" />
              <div className="text-xs text-[#666666] leading-relaxed">
                <strong className="text-[#171717] block mb-0.5">Persistence Status</strong>
                Your profile updates sync to your Axiom account or browser sandbox storage automatically.
              </div>
            </div>
          </div>

        </div>
      </form>

      <div className="max-w-6xl w-full mx-auto">
        <Footer idPrefix="settings" onOpenInfo={onOpenInfo} />
      </div>
    </div>
  );
}
