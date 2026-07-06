import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
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

        // Create user in firebase auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile in Firebase auth
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });

        // Initialize user document in Firestore users collection
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
        // Sign in with Firebase auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        setSuccess('Authentication approved. Accessing secure vault...');
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
    <div id="auth-fullscreen-container" className="fixed inset-0 z-50 flex items-center justify-center bg-[#050c16] p-4 font-sans select-none overflow-y-auto">
      {/* Dynamic Grid / Particles Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0c2444] via-[#050c16] to-[#01050a] opacity-80" />
      
      {/* Decorative Blueprint Style Grid Lines */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#e0a96d_1px,transparent_1px),linear-gradient(to_bottom,#e0a96d_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#071324] border border-[#142944] rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 flex flex-col justify-between"
      >
        <div className="space-y-6">
          {/* Brand/Logo Block */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#0c1a30] rounded-2xl flex items-center justify-center border border-[#e0a96d]/30 relative overflow-hidden group shadow-xl mb-4">
              <div className="absolute top-1 left-1 text-[#e0a96d] opacity-80 text-[10px] font-bold">↘</div>
              <div className="absolute top-1 right-1 text-[#e0a96d] opacity-80 text-[10px] font-bold">↙</div>
              <div className="absolute bottom-1 left-1 text-[#e0a96d] opacity-80 text-[10px] font-bold">↗</div>
              <div className="absolute bottom-1 right-1 text-[#e0a96d] opacity-80 text-[10px] font-bold">↖</div>
              <svg viewBox="0 0 100 100" className="w-10 h-10 text-[#e0a96d] stroke-current fill-none" strokeWidth="6">
                <circle cx="50" cy="50" r="40" stroke="#e0a96d" />
                <circle cx="50" cy="50" r="25" stroke="#e0a96d" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" fill="#e0a96d" />
              </svg>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold font-display text-[#e0a96d] leading-none tracking-tight">
              {isSignUp ? 'Initialize Axiom Account' : 'Authenticate to Axiom'}
            </h2>
            <p className="text-xs text-gray-400 mt-1.5 font-mono uppercase tracking-wider">
              {isSignUp ? 'Setup local-first cloud synchronized profile' : 'Unlocking cloud storage and data synchronization'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-wider block">First Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="Cuthman"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#051120] border border-[#1a2c42] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/40 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-wider block">Last Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="Sheikh"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#051120] border border-[#1a2c42] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-wider block">Security Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#051120] border border-[#1a2c42] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-wider block">Cryptographic Password</label>
              <div className="relative">
                <LockKeyhole size={14} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#051120] border border-[#1a2c42] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/40 transition-all"
                />
              </div>
            </div>

            {/* Notifications panel for errors and success */}
            {error && (
              <div className="p-3.5 bg-red-500/5 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2.5 font-sans leading-relaxed">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2.5 font-sans leading-relaxed">
                <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl flex items-center justify-center gap-2 tracking-wider transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer uppercase"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#071324] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Register Security Key' : 'Unlock Secure Vault'}</span>
                  <ArrowRight size={14} />
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
              className="text-xs text-gray-400 hover:text-[#e0a96d] transition-colors cursor-pointer font-sans"
            >
              {isSignUp ? 'Already have an Axiom key? Sign In' : "Don't have an account? Sign Up now"}
            </button>
          </div>
        </div>

        {/* Separator / Guest Option */}
        <div className="mt-6 pt-5 border-t border-[#12243d] flex flex-col items-center space-y-3">
          <button
            onClick={onContinueAsGuest}
            className="text-[11px] font-mono font-semibold text-gray-500 hover:text-gray-300 tracking-wider flex items-center gap-1.5 transition-colors uppercase cursor-pointer"
          >
            <span>Continue in Guest Sandbox Mode</span>
            <ArrowRight size={11} className="text-gray-600" />
          </button>
          
          <span className="text-[9px] font-mono text-gray-600 text-center uppercase tracking-widest leading-normal">
            Axiom Peak Performance • Cuthman Adem Sheikh © 2026
          </span>
        </div>
      </motion.div>
    </div>
  );
}
