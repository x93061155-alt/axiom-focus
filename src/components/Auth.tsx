import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import { motion } from 'motion/react';
import { AVATARS } from '../constants';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onContinueAsGuest: () => void;
}

export default function Auth({ onAuthSuccess, onContinueAsGuest }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        if (!firstName || !lastName) {
          throw new Error('Please enter both your first name and last name.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        const userProfile = {
          uid: user.uid,
          firstName,
          lastName,
          email,
          avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)].id,
          motivationalReminders: true,
          goalMilestones: true,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        setSuccess('Account created successfully! Connecting to Axiom Cloud...');
        setTimeout(() => {
          onAuthSuccess(user);
        }, 1000);

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        setSuccess('Authentication approved. Accessing your workspace...');
        setTimeout(() => {
          onAuthSuccess(user);
        }, 1000);
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let friendlyMessage = err.message;
      if (err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid credentials. Please verify your email and password.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered in Axiom Cloud.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'The password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address is formatted incorrectly.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-fullscreen-container" className="fixed inset-0 z-50 flex items-center justify-center axiom-canvas-bg p-4 font-sans select-none overflow-y-auto">
      {/* Subtle ambient glow accents */}
      <div className="pointer-events-none fixed top-[-15%] right-[10%] w-[28rem] h-[28rem] rounded-full bg-[#0066FF]/14 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-15%] left-[10%] w-[26rem] h-[26rem] rounded-full bg-[#00A3FF]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md axiom-modal-panel rounded-3xl p-7 md:p-9 relative z-10 flex flex-col justify-between"
      >
        <div className="space-y-6">
          {/* Brand Block */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#0B172A] rounded-2xl flex items-center justify-center border border-[#1D3555] relative overflow-hidden shadow-xl mb-4">
              <svg viewBox="0 0 100 100" className="w-9 h-9 text-[#00A3FF] stroke-current fill-none" strokeWidth="6">
                <circle cx="50" cy="50" r="40" stroke="currentColor" />
                <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold font-display text-[#FFFFFF] leading-tight tracking-tight">
              {isSignUp ? 'Create Your Axiom Account' : 'Sign in to Axiom Focus'}
            </h2>
            <p className="text-xs text-[#A8B8CC] mt-1.5 leading-relaxed max-w-xs">
              {isSignUp ? 'Set up your cloud-synchronized personal performance workspace' : 'Access your goals, milestones, and deep work sessions'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A8B8CC] block">First Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B8CC]" />
                    <input
                      type="text"
                      required
                      placeholder="Cuthman"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full axiom-input rounded-xl pl-9 pr-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A8B8CC] block">Last Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B8CC]" />
                    <input
                      type="text"
                      required
                      placeholder="Sheikh"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full axiom-input rounded-xl pl-9 pr-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A8B8CC] block">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B8CC]" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full axiom-input rounded-xl pl-10 pr-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A8B8CC] block">Password</label>
              <div className="relative">
                <LockKeyhole size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B8CC]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full axiom-input rounded-xl pl-10 pr-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 axiom-btn-primary text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Form Switcher */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs text-[#A8B8CC] hover:text-[#00A3FF] transition-colors cursor-pointer font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Separator / Guest Option */}
        <div className="mt-6 pt-5 border-t border-[#1D3555] flex flex-col items-center space-y-3">
          <button
            onClick={onContinueAsGuest}
            className="text-xs font-medium text-[#A8B8CC] hover:text-[#FFFFFF] flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-[#101F35]"
          >
            <span>Continue in Guest Sandbox Mode</span>
            <ArrowRight size={13} className="text-[#00A3FF]" />
          </button>
          
          <span className="text-[11px] text-[#A8B8CC]/80 text-center">
            Axiom Peak Performance · Cuthman Adem Sheikh © 2026
          </span>
        </div>
      </motion.div>
    </div>
  );
}
