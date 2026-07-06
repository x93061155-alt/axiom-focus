import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Goal, UserProfile } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Error helper specified by the firebase-integration skill
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error in Admin: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AdminUserRecord {
  uid: string;
  profile: UserProfile;
  goals: Goal[];
  progress: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all users
      const usersPath = 'users';
      let usersSnap;
      try {
        usersSnap = await getDocs(collection(db, usersPath));
      } catch (err) {
        handleFirestoreError(err, 'list' as OperationType, usersPath);
      }

      // 2. Fetch all goals
      const goalsPath = 'goals';
      let goalsSnap;
      try {
        goalsSnap = await getDocs(collection(db, goalsPath));
      } catch (err) {
        handleFirestoreError(err, 'list' as OperationType, goalsPath);
      }

      const allGoals: Goal[] = [];
      goalsSnap.forEach((doc) => {
        const data = doc.data();
        allGoals.push({
          ...data,
          id: data.id || doc.id
        } as Goal);
      });

      const userRecords: AdminUserRecord[] = [];
      usersSnap.forEach((docSnap) => {
        const uid = docSnap.id;
        const profile = docSnap.data() as UserProfile;
        
        // Find goals belonging to this user
        // Note: some goals might have userId set to the goal's actual owner. 
        // Let's inspect 'userId' field in goals.
        const userGoals = allGoals.filter(g => (g as any).userId === uid);

        // Calculate progress for this user
        let totalTasks = 0;
        let completedTasks = 0;

        userGoals.forEach(goal => {
          if (goal.tasks && goal.tasks.length > 0) {
            totalTasks += goal.tasks.length;
            completedTasks += goal.tasks.filter(t => t.isCompleted).length;
          } else {
            totalTasks += 1;
            if (goal.status === 'DONE') completedTasks += 1;
          }
        });

        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        userRecords.push({
          uid,
          profile,
          goals: userGoals,
          progress
        });
      });

      // Sort users by registration/email
      userRecords.sort((a, b) => {
        const emailA = a.profile.email || '';
        const emailB = b.profile.email || '';
        return emailA.localeCompare(emailB);
      });

      setUsers(userRecords);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRefresh = () => {
    fetchAdminData();
  };

  const filteredUsers = users.filter(u => {
    const email = u.profile.email || '';
    const name = `${u.profile.firstName || ''} ${u.profile.lastName || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return email.toLowerCase().includes(query) || name.includes(query);
  });

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Not available';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div id="admin-dashboard-tab" className="flex-1 overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 flex flex-col justify-between min-h-screen">
      <div>
        {/* Breadcrumb Header with Admin Badge */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#e0a96d] uppercase tracking-wider">Axiom Cloud Console</span>
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-amber-500/10 border border-amber-500/30 text-[#e0a96d] rounded-full flex items-center gap-1">
                <ShieldAlert size={10} />
                ADMIN SECURE NODE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white mt-1">
              {selectedUser ? 'User Detailed Telemetry' : 'System Registry'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {selectedUser ? (
              <button
                onClick={() => setSelectedUser(null)}
                className="py-2 px-4 bg-[#0c1a30] border border-[#1a2c42] hover:border-[#e0a96d]/40 rounded-xl text-xs font-semibold flex items-center gap-2 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                Back to Registry
              </button>
            ) : (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="py-2 px-4 bg-[#0c1a30] border border-[#1a2c42] hover:border-[#e0a96d]/40 rounded-xl text-xs font-semibold flex items-center gap-2 text-gray-300 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin text-[#e0a96d]' : ''} />
                Refresh Data
              </button>
            )}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && !users.length ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0b1d31]/40 border border-[#142944] rounded-2xl">
            <RefreshCw size={36} className="text-[#e0a96d] animate-spin mb-4" />
            <span className="text-sm font-mono text-gray-400">Querying Firestore secure vectors...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-2xl mb-6">
            <h3 className="text-red-400 font-bold mb-2">Access Control Error</h3>
            <p className="text-sm text-gray-300 font-mono">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-semibold rounded-xl transition-all"
            >
              Retry Secure Fetch
            </button>
          </div>
        ) : !selectedUser ? (
          /* MAIN LIST VIEW */
          <div className="space-y-6">
            {/* SEARCH AND COUNTERS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search registered accounts by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b1d31]/80 border border-[#142944] focus:border-[#e0a96d]/40 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
                />
              </div>
              <div className="md:col-span-4 flex items-center justify-end gap-3 bg-[#0b1d31]/40 border border-[#142944] p-2.5 rounded-xl h-full">
                <div className="flex items-center gap-2 px-3">
                  <Users size={16} className="text-[#e0a96d]" />
                  <span className="text-xs font-mono text-gray-400">Total Users: <strong className="text-white">{users.length}</strong></span>
                </div>
              </div>
            </div>

            {/* USERS REGISTRY */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 bg-[#0b1d31]/20 border border-[#142944]/40 rounded-2xl">
                <Users size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No matching user records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-mono text-gray-400 uppercase tracking-wider border-b border-[#142944]/60">
                  <div className="col-span-4">User Identity</div>
                  <div className="col-span-3">Registered On</div>
                  <div className="col-span-2 text-center">Progress</div>
                  <div className="col-span-2 text-center">Total Goals</div>
                  <div className="col-span-1 text-right">View</div>
                </div>

                {filteredUsers.map((u) => {
                  const name = `${u.profile.firstName || ''} ${u.profile.lastName || ''}`.trim() || 'Anonymous Node';
                  return (
                    <div
                      key={u.uid}
                      onClick={() => setSelectedUser(u)}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#0b1d31]/40 border border-[#142944] hover:border-[#e0a96d]/30 p-4 md:px-5 md:py-3.5 rounded-2xl cursor-pointer hover:bg-[#0b1d31]/75 transition-all group"
                    >
                      {/* Name & Email */}
                      <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#071120] border border-[#e0a96d]/10 rounded-xl flex items-center justify-center shrink-0">
                          <Users size={18} className="text-[#e0a96d]" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#e0a96d] transition-colors">
                            {name}
                          </h4>
                          <span className="text-xs text-gray-400 font-mono truncate block">
                            {u.profile.email || 'No email registered'}
                          </span>
                        </div>
                      </div>

                      {/* Created At */}
                      <div className="col-span-1 md:col-span-3 flex items-center gap-2 text-gray-300 md:text-white text-xs font-mono">
                        <Calendar size={14} className="text-gray-500 md:hidden" />
                        <span className="md:hidden text-gray-500 mr-1">Registered:</span>
                        {formatDate(u.profile.createdAt)}
                      </div>

                      {/* Progress */}
                      <div className="col-span-1 md:col-span-2 text-center flex md:block items-center justify-between border-t border-[#142944] pt-2 md:pt-0 md:border-t-0">
                        <span className="text-xs text-gray-500 md:hidden">Progress:</span>
                        <div className="flex items-center justify-end md:justify-center gap-2">
                          <div className="w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
                            <div 
                              className="bg-[#e0a96d] h-full rounded-full" 
                              style={{ width: `${u.progress}%` }} 
                            />
                          </div>
                          <span className="text-xs font-bold font-mono text-[#e0a96d]">{u.progress}%</span>
                        </div>
                      </div>

                      {/* Goals count */}
                      <div className="col-span-1 md:col-span-2 text-center flex md:block items-center justify-between">
                        <span className="text-xs text-gray-500 md:hidden">Goals:</span>
                        <span className="px-2 py-0.5 bg-[#0c2036] border border-[#1a3455] text-white text-xs font-mono rounded-lg">
                          {u.goals.length} Goals
                        </span>
                      </div>

                      {/* Link Trigger */}
                      <div className="col-span-1 md:col-span-1 text-right flex md:block justify-end">
                        <span className="py-1 px-3 bg-[#0c2036] border border-[#1a3455] text-xs font-semibold text-gray-300 rounded-xl md:hidden group-hover:text-[#e0a96d] group-hover:border-[#e0a96d]/40 transition-all">
                          View Telemetry
                        </span>
                        <ChevronRight size={18} className="text-gray-500 group-hover:text-[#e0a96d] group-hover:translate-x-1 transition-all hidden md:inline-block" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* USER DETAILS TELEMETRY VIEW */
          <div className="space-y-8 animate-fadeIn">
            {/* User Info Card */}
            <div className="bg-[#0b1d31]/50 border border-[#142944] rounded-2xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#071120] border-2 border-[#e0a96d]/30 rounded-2xl flex items-center justify-center">
                    <Users size={28} className="text-[#e0a96d]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {`${selectedUser.profile.firstName || ''} ${selectedUser.profile.lastName || ''}`.trim() || 'Anonymous Node'}
                    </h3>
                    <span className="text-xs font-mono text-gray-400 block mt-0.5">{selectedUser.profile.email}</span>
                    <span className="text-[10px] font-mono text-[#e0a96d]/80 bg-[#e0a96d]/5 px-2 py-0.5 rounded-md border border-[#e0a96d]/10 inline-block mt-1.5">
                      UID: {selectedUser.uid}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 w-full md:w-auto border-t md:border-t-0 border-[#142944] pt-4 md:pt-0">
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Registered On</span>
                    <strong className="text-xs font-mono text-white block mt-0.5">
                      {formatDate(selectedUser.profile.createdAt)}
                    </strong>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Goals</span>
                    <strong className="text-xs font-mono text-[#e0a96d] block mt-0.5">
                      {selectedUser.goals.length} Goals
                    </strong>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Telemetry Index</span>
                    <strong className="text-xs font-mono text-green-400 block mt-0.5">
                      {selectedUser.progress}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals Information */}
            <div>
              <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                <Target size={18} className="text-[#e0a96d]" />
                Goals &amp; Milestones ({selectedUser.goals.length})
              </h2>

              {selectedUser.goals.length === 0 ? (
                <div className="py-12 bg-[#0b1d31]/20 border border-[#142944]/40 rounded-2xl text-center">
                  <Target size={36} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm font-mono">This user has not established any strategic nodes yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedUser.goals.map((goal) => {
                    // Calculate individual goal progress
                    const totalT = goal.tasks.length;
                    const compT = goal.tasks.filter(t => t.isCompleted).length;
                    const goalProgress = totalT > 0 ? Math.round((compT / totalT) * 100) : (goal.status === 'DONE' ? 100 : 0);

                    return (
                      <div 
                        key={goal.id} 
                        className="bg-[#0b1d31]/30 border border-[#142944] rounded-2xl p-5 hover:border-[#e0a96d]/20 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Goal Header */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <span className="text-[9px] font-mono font-bold tracking-widest text-[#e0a96d] uppercase bg-[#e0a96d]/10 px-2 py-0.5 rounded-full border border-[#e0a96d]/20">
                                {goal.category}
                              </span>
                              <h3 className="text-base font-bold text-white mt-1.5 leading-tight">{goal.title}</h3>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-lg border shrink-0 ${
                              goal.status === 'DONE'
                                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                                : goal.status === 'EXPIRED'
                                ? 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                                : 'bg-amber-950/40 border-amber-500/30 text-[#e0a96d]'
                            }`}>
                              {goal.status}
                            </span>
                          </div>

                          {/* Goal description */}
                          <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                            {goal.description || 'No description provided.'}
                          </p>

                          {/* Individual Progress Bar */}
                          <div className="space-y-1.5 mb-5 bg-[#071120] p-3 rounded-xl border border-[#142944]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 font-mono">Completion Rate</span>
                              <span className="font-bold text-[#e0a96d] font-mono">{goalProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-[#e0a96d] h-full rounded-full transition-all duration-300" 
                                style={{ width: `${goalProgress}%` }} 
                              />
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 mt-1">
                              <Clock size={11} />
                              <span>Due {goal.dueDate || 'No set date'}</span>
                              {goal.projectName && (
                                <>
                                  <span className="text-gray-700">•</span>
                                  <span>Project: {goal.projectName}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Tasks Sub-list */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Tasks &amp; Checkpoints</span>
                            {goal.tasks.length === 0 ? (
                              <span className="text-xs text-gray-500 italic block">No tasks defined for this goal.</span>
                            ) : (
                              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                {goal.tasks.map(task => (
                                  <div 
                                    key={task.id} 
                                    className="flex items-start gap-2 bg-[#071120]/50 p-2 rounded-lg border border-[#12243d]"
                                  >
                                    <div className="mt-0.5 shrink-0">
                                      {task.isCompleted ? (
                                        <CheckCircle2 size={13} className="text-emerald-400" />
                                      ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border border-gray-600" />
                                      )}
                                    </div>
                                    <span className={`text-xs ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                      {task.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-12 pt-6 border-t border-[#142944] text-center text-xs font-mono text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Axiom Focus Secure Core v1.2</span>
        <span>Secure Session ID: {auth.currentUser?.uid?.substring(0, 8)}...</span>
      </div>
    </div>
  );
}
