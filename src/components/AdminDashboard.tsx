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
  Calendar
} from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

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
      const usersPath = 'users';
      let usersSnap;
      try {
        usersSnap = await getDocs(collection(db, usersPath));
      } catch (err) {
        handleFirestoreError(err, 'list' as OperationType, usersPath);
      }

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
        const userGoals = allGoals.filter(g => (g as any).userId === uid);

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
    <div id="admin-dashboard-tab" className="flex-1 overflow-y-auto text-[#171717] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#F7E7B0] pb-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#A67C00] mb-1">
              <span>Axiom Cloud Console</span>
              <span className="text-[#D4AF37]" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[#666666]">
                <ShieldAlert size={12} className="text-[#A67C00]" />
                Admin Node
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-[#171717]">
              {selectedUser ? 'User Detailed Telemetry' : 'System Registry'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {selectedUser ? (
              <button
                onClick={() => setSelectedUser(null)}
                className="py-2.5 px-4 axiom-btn-secondary rounded-xl text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft size={14} />
                <span>Back to Registry</span>
              </button>
            ) : (
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="py-2.5 px-4 axiom-btn-secondary rounded-xl text-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin text-[#A67C00]' : ''} />
                <span>Refresh Data</span>
              </button>
            )}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && !users.length ? (
          <div className="flex flex-col items-center justify-center py-20 axiom-card rounded-2xl">
            <RefreshCw size={32} className="text-[#D4AF37] animate-spin mb-4" />
            <span className="text-sm text-[#666666]">Querying Firestore records...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl mb-6">
            <h3 className="text-rose-700 font-bold mb-2">Access Control Error</h3>
            <p className="text-xs text-[#666666] font-mono">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Retry Fetch
            </button>
          </div>
        ) : !selectedUser ? (
          <div className="space-y-6">
            {/* SEARCH AND COUNTERS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A67C00]" />
                <input
                  type="text"
                  placeholder="Search registered accounts by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 axiom-input rounded-xl text-sm"
                />
              </div>
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3 axiom-card px-4 py-2.5 rounded-xl h-full">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#A67C00]" />
                  <span className="text-xs text-[#666666]">
                    Total Users: <strong className="text-[#171717] font-mono tabular-nums">{users.length}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* USERS REGISTRY */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 axiom-card rounded-2xl">
                <Users size={38} className="text-[#D4AF37] mx-auto mb-3" />
                <p className="text-[#666666] text-sm">No matching user records found.</p>
              </div>
            ) : (
              <div className="axiom-card rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 text-xs font-semibold text-[#666666] border-b border-[#F7E7B0] bg-[#FFFDF5]">
                  <div className="col-span-4">User Identity</div>
                  <div className="col-span-3">Registered On</div>
                  <div className="col-span-2 text-center">Progress</div>
                  <div className="col-span-2 text-center">Total Goals</div>
                  <div className="col-span-1 text-right">View</div>
                </div>

                <div className="divide-y divide-[#F7E7B0]">
                  {filteredUsers.map((u) => {
                    const name = `${u.profile.firstName || ''} ${u.profile.lastName || ''}`.trim() || 'Anonymous Node';
                    return (
                      <div
                        key={u.uid}
                        onClick={() => setSelectedUser(u)}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-5 py-4 md:px-6 hover:bg-[#FFFDF5] cursor-pointer transition-colors group"
                      >
                        <div className="col-span-1 md:col-span-4 flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 axiom-inset rounded-xl flex items-center justify-center shrink-0">
                            <Users size={17} className="text-[#A67C00]" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-[#171717] truncate group-hover:text-[#A67C00] transition-colors">
                              {name}
                            </h4>
                            <span className="text-xs text-[#666666] truncate block">
                              {u.profile.email || 'No email registered'}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-3 flex items-center gap-2 text-[#666666] text-xs font-mono tabular-nums">
                          <Calendar size={14} className="text-[#A67C00] md:hidden" />
                          <span className="md:hidden text-[#666666] mr-1">Registered:</span>
                          {formatDate(u.profile.createdAt)}
                        </div>

                        <div className="col-span-1 md:col-span-2 flex md:justify-center items-center justify-between pt-2 md:pt-0 border-t border-[#F7E7B0] md:border-t-0">
                          <span className="text-xs text-[#666666] md:hidden">Progress:</span>
                          <div className="flex items-center gap-2.5">
                            <div className="w-16 bg-[#FAFAFA] rounded-full h-1.5 overflow-hidden hidden sm:block border border-[#F7E7B0]">
                              <div 
                                className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700] h-full rounded-full" 
                                style={{ width: `${u.progress}%` }} 
                              />
                            </div>
                            <span className="text-xs font-semibold font-mono tabular-nums text-[#A67C00]">{u.progress}%</span>
                          </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex md:justify-center items-center justify-between">
                          <span className="text-xs text-[#666666] md:hidden">Goals:</span>
                          <span className="text-xs font-mono tabular-nums text-[#171717]">
                            {u.goals.length} {u.goals.length === 1 ? 'goal' : 'goals'}
                          </span>
                        </div>

                        <div className="col-span-1 md:col-span-1 text-right flex md:justify-end">
                          <span className="text-xs font-semibold text-[#A67C00] md:hidden">
                            View Telemetry →
                          </span>
                          <ChevronRight size={17} className="text-[#666666] group-hover:text-[#A67C00] group-hover:translate-x-0.5 transition-all hidden md:inline-block" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* USER DETAILS TELEMETRY VIEW */
          <div className="space-y-8">
            <div className="axiom-card rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 axiom-inset border-[#D4AF37]/60 rounded-2xl flex items-center justify-center shrink-0">
                    <Users size={26} className="text-[#A67C00]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#171717] font-display">
                      {`${selectedUser.profile.firstName || ''} ${selectedUser.profile.lastName || ''}`.trim() || 'Anonymous Node'}
                    </h3>
                    <span className="text-xs text-[#666666] block mt-0.5">{selectedUser.profile.email}</span>
                    <span className="text-[11px] font-mono text-[#A67C00] block mt-1">
                      UID: {selectedUser.uid}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 w-full md:w-auto border-t md:border-t-0 border-[#F7E7B0] pt-4 md:pt-0">
                  <div>
                    <span className="text-xs text-[#666666] block">Registered On</span>
                    <strong className="text-xs font-mono tabular-nums text-[#171717] block mt-1">
                      {formatDate(selectedUser.profile.createdAt)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-xs text-[#666666] block">Total Goals</span>
                    <strong className="text-xs font-mono tabular-nums text-[#A67C00] block mt-1">
                      {selectedUser.goals.length}
                    </strong>
                  </div>
                  <div>
                    <span className="text-xs text-[#666666] block">Completion</span>
                    <strong className="text-xs font-mono tabular-nums text-emerald-700 block mt-1">
                      {selectedUser.progress}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold font-display text-[#171717] mb-4 flex items-center gap-2">
                <Target size={18} className="text-[#A67C00]" />
                <span>Goals & Milestones ({selectedUser.goals.length})</span>
              </h2>

              {selectedUser.goals.length === 0 ? (
                <div className="py-12 axiom-card rounded-2xl text-center">
                  <Target size={36} className="text-[#D4AF37] mx-auto mb-2" />
                  <p className="text-[#666666] text-sm">This user has not established any strategic goals yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedUser.goals.map((goal) => {
                    const totalT = goal.tasks.length;
                    const compT = goal.tasks.filter(t => t.isCompleted).length;
                    const goalProgress = totalT > 0 ? Math.round((compT / totalT) * 100) : (goal.status === 'DONE' ? 100 : 0);

                    return (
                      <div 
                        key={goal.id} 
                        className="axiom-card rounded-2xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2.5">
                            <div>
                              <span className="text-xs font-semibold text-[#A67C00] capitalize">
                                {goal.category.toLowerCase()}
                              </span>
                              <h3 className="text-base font-bold font-display text-[#171717] mt-0.5 leading-tight">{goal.title}</h3>
                            </div>
                            <span className={`text-xs font-semibold shrink-0 ${
                              goal.status === 'DONE'
                                ? 'text-emerald-700'
                                : goal.status === 'EXPIRED'
                                ? 'text-rose-700'
                                : 'text-[#A67C00]'
                            }`}>
                              {goal.status === 'DONE' ? 'Completed' : goal.status === 'EXPIRED' ? 'Expired' : 'Active'}
                            </span>
                          </div>

                          <p className="text-xs text-[#666666] mb-4 line-clamp-2 leading-relaxed">
                            {goal.description || 'No description provided.'}
                          </p>

                          <div className="space-y-2 mb-5 axiom-inset p-3.5 rounded-xl">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#666666]">Completion Rate</span>
                              <span className="font-semibold text-[#A67C00] font-mono tabular-nums">{goalProgress}%</span>
                            </div>
                            <div className="w-full bg-[#FAFAFA] rounded-full h-1.5 overflow-hidden border border-[#F7E7B0]">
                              <div 
                                className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700] h-full rounded-full transition-all duration-300" 
                                style={{ width: `${goalProgress}%` }} 
                              />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums text-[#666666] pt-1">
                              <Clock size={12} />
                              <span>Due {goal.dueDate || 'No set date'}</span>
                              {goal.projectName && (
                                <>
                                  <span className="text-[#D4AF37]" aria-hidden="true">·</span>
                                  <span className="font-sans">{goal.projectName}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-medium text-[#666666] block">Tasks & Checkpoints</span>
                            {goal.tasks.length === 0 ? (
                              <span className="text-xs text-[#666666]/75 italic block">No tasks defined for this goal.</span>
                            ) : (
                              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                {goal.tasks.map(task => (
                                  <div 
                                    key={task.id} 
                                    className="flex items-start gap-2.5 axiom-inset p-2.5 rounded-lg"
                                  >
                                    <div className="mt-0.5 shrink-0">
                                      {task.isCompleted ? (
                                        <CheckCircle2 size={14} className="text-emerald-700" />
                                      ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border border-[#D4AF37]/60" />
                                      )}
                                    </div>
                                    <span className={`text-xs ${task.isCompleted ? 'text-[#666666]/65 line-through' : 'text-[#171717]'}`}>
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
      <div className="max-w-6xl w-full mx-auto mt-12 pt-6 border-t border-[#F7E7B0] text-center text-xs text-[#666666] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>Axiom Focus Secure Core v1.2</span>
        <span className="font-mono tabular-nums">Secure Session ID: {auth.currentUser?.uid?.substring(0, 8)}...</span>
      </div>
    </div>
  );
}
