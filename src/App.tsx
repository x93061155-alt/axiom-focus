/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Goal, GoalCategory, GoalStatus, UserProfile, Task } from './types';
import { DEFAULT_GOALS, DEFAULT_PROFILE } from './constants';

import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import MyGoals from './components/MyGoals';
import PlanningAndTasks from './components/PlanningAndTasks';
import FocusTimer from './components/FocusTimer';
import ProfileSettings from './components/ProfileSettings';
import AdminDashboard from './components/AdminDashboard';
import NewGoalModal from './components/NewGoalModal';
import InfoModal, { InfoModalType } from './components/InfoModal';
import Auth from './components/Auth';
import { Menu } from 'lucide-react';

// Firebase integrations
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc
} from 'firebase/firestore';
import { auth, db } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Authentication states
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Core application data states
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdminUser = user?.uid === '9ZiRLy3D71SgLxAWAaBaUFW3tvA2';

  // Secure protection for Admin Dashboard
  useEffect(() => {
    if (activeTab === 'admin' && !isAdminUser) {
      setActiveTab('overview');
    }
  }, [activeTab, isAdminUser]);
  const [infoModalType, setInfoModalType] = useState<InfoModalType | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleOpenInfoModal = (type: InfoModalType) => {
    setInfoModalType(type);
    setIsInfoModalOpen(true);
  };

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setGuestMode(false);
        await loadUserDataFromFirestore(currentUser.uid);
      } else {
        const wasGuest = sessionStorage.getItem('axiom_guest') === 'true';
        if (wasGuest) {
          setGuestMode(true);
          loadGuestDataFromLocalStorage();
        } else {
          setGuestMode(false);
        }
      }
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  // Load Firestore Data for authenticated user
  const loadUserDataFromFirestore = async (uid: string) => {
    try {
      // 1. Fetch profile
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let userProfile = DEFAULT_PROFILE;
      if (userDocSnap.exists()) {
        userProfile = userDocSnap.data() as UserProfile;
        if (!userProfile.createdAt) {
          userProfile.createdAt = new Date().toISOString();
          await setDoc(userDocRef, userProfile);
        }
        setProfile(userProfile);
      } else {
        const now = new Date().toISOString();
        await setDoc(userDocRef, {
          ...DEFAULT_PROFILE,
          email: auth.currentUser?.email || '',
          createdAt: now
        });
        setProfile({
          ...DEFAULT_PROFILE,
          email: auth.currentUser?.email || '',
          createdAt: now
        });
      }

      // 2. Fetch goals
      const goalsQuery = query(collection(db, 'goals'), where('userId', '==', uid));
      const goalsSnap = await getDocs(goalsQuery);
      
      if (!goalsSnap.empty) {
        const loadedGoals: Goal[] = [];
        goalsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          loadedGoals.push({
            ...data,
            id: data.id || docSnap.id
          } as Goal);
        });
        setGoals(loadedGoals);
        if (loadedGoals.length > 0) {
          setSelectedGoalId(loadedGoals[0].id);
        } else {
          setSelectedGoalId(null);
        }
      } else {
        setGoals([]);
        setSelectedGoalId(null);
      }

      // Automatically show Admin Dashboard if Admin UID logs in
      if (uid === '9ZiRLy3D71SgLxAWAaBaUFW3tvA2') {
        setActiveTab('admin');
      }

    } catch (e) {
      console.error('Error fetching user data from firestore', e);
    }
  };

  // Load fallback guest storage
  const loadGuestDataFromLocalStorage = () => {
    const savedProfile = localStorage.getItem('axiom_profile');
    const savedGoals = localStorage.getItem('axiom_goals');

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error parsing guest profile', e);
      }
    } else {
      setProfile(DEFAULT_PROFILE);
    }

    if (savedGoals) {
      try {
        const parsed = JSON.parse(savedGoals) as Goal[];
        setGoals(parsed);
        if (parsed.length > 0) {
          setSelectedGoalId(parsed[0].id);
        } else {
          setSelectedGoalId(null);
        }
      } catch (e) {
        console.error('Error parsing guest goals', e);
      }
    } else {
      setGoals([]);
      setSelectedGoalId(null);
    }


  };

  // Save profile state helper
  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), updatedProfile);
      } catch (err) {
        console.error('Error saving profile to Firestore:', err);
      }
    } else {
      localStorage.setItem('axiom_profile', JSON.stringify(updatedProfile));
    }
  };

  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
      providerInfo?: {
        providerId?: string | null;
        email?: string | null;
      }[];
    };
  }

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
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
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  // Save/update goal helper
  const saveGoal = async (goal: Goal) => {
    if (user) {
      try {
        await setDoc(doc(db, 'goals', goal.id), {
          ...goal,
          userId: user.uid
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `goals/${goal.id}`);
      }
    }
  };

  // Delete goal helper
  const removeGoal = async (goalId: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'goals', goalId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `goals/${goalId}`);
      }
    }
  };

  // Sync goals local state helper
  const syncGoalsState = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    if (!user) {
      localStorage.setItem('axiom_goals', JSON.stringify(updatedGoals));
    }
  };

  // Task: Reordering handler
  const handleReorderTasks = async (goalId: string, updatedTasks: Task[]) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        const updatedGoal = { ...g, tasks: updatedTasks };
        if (user) {
          saveGoal(updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });
    syncGoalsState(updatedGoals);
  };

  // Goal: Add new
  const handleAddGoal = async (
    title: string,
    description: string,
    category: GoalCategory,
    dueDate: string,
    initialMilestones: string[],
    projectName?: string
  ) => {
    const newGoalId = `goal-${Date.now()}`;
    const initialTasks = initialMilestones.map((m, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      title: m,
      isCompleted: false,
    }));

    const newGoal: Goal = {
      id: newGoalId,
      title,
      description,
      category,
      status: 'IN_PROGRESS',
      dueDate,
      tasks: initialTasks,
      projectName: projectName || category,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (user) {
      await saveGoal(newGoal);
    }

    const updatedGoals = [newGoal, ...goals];
    syncGoalsState(updatedGoals);
    setSelectedGoalId(newGoalId);
    setActiveTab('dashboard');
  };

  // Goal: Delete
  const handleDeleteGoal = async (goalId: string) => {
    const updatedGoals = goals.filter((g) => g.id !== goalId);
    syncGoalsState(updatedGoals);

    if (user) {
      await removeGoal(goalId);
    }

    if (selectedGoalId === goalId) {
      setSelectedGoalId(updatedGoals.length > 0 ? updatedGoals[0].id : null);
    }
  };

  // Goal: Update Status
  const handleUpdateGoalStatus = async (goalId: string, status: GoalStatus) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        const updatedTasks = status === 'DONE' 
          ? g.tasks.map((t) => ({ ...t, isCompleted: true }))
          : g.tasks;
        const updatedGoal = { ...g, status, tasks: updatedTasks };
        if (user) {
          saveGoal(updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });
    syncGoalsState(updatedGoals);
  };

  // Goal: Edit
  const handleEditGoal = async (
    id: string,
    title: string,
    description: string,
    category: GoalCategory,
    dueDate: string,
    milestones: string[],
    projectName?: string
  ) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === id) {
        // Build updated tasks from edited milestones list
        // Try to match existing task titles to keep completion status
        const currentTasksMap = new Map<string, Task>();
        g.tasks.forEach(t => currentTasksMap.set(t.title.toLowerCase().trim(), t));
        
        const updatedTasks = milestones.map((m, idx) => {
          const key = m.toLowerCase().trim();
          const existing = currentTasksMap.get(key);
          if (existing) {
            return {
              ...existing,
              title: m // preserve casing
            };
          }
          return {
            id: `task-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
            title: m,
            isCompleted: false,
          };
        });

        // Determine if goal should remain completed if all tasks are completed
        const allCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.isCompleted);
        const nextStatus = allCompleted ? 'DONE' : (g.status === 'DONE' ? 'IN_PROGRESS' : g.status);

        const updatedGoal: Goal = {
          ...g,
          title,
          description,
          category,
          dueDate,
          status: nextStatus as GoalStatus,
          tasks: updatedTasks,
          projectName: projectName || g.projectName || category,
        };

        if (user) {
          saveGoal(updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });

    syncGoalsState(updatedGoals);
  };

  // Task: Add
  const handleAddTask = async (goalId: string, taskTitle: string) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        const newTask = {
          id: `task-${Date.now()}`,
          title: taskTitle,
          isCompleted: false,
        };
        const updatedTasks = [...g.tasks, newTask];
        const newStatus = g.status === 'DONE' ? 'IN_PROGRESS' : g.status;
        const updatedGoal = { ...g, tasks: updatedTasks, status: newStatus as GoalStatus };
        if (user) {
          saveGoal(updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });
    syncGoalsState(updatedGoals);
  };

  // Task: Toggle completion
  const handleToggleTask = async (goalId: string, taskId: string) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        const updatedTasks = g.tasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, isCompleted: !t.isCompleted };
          }
          return t;
        });

        const allCompleted = updatedTasks.length > 0 && updatedTasks.every((t) => t.isCompleted);
        const newStatus: GoalStatus = allCompleted ? 'DONE' : 'IN_PROGRESS';
        const updatedGoal = { ...g, tasks: updatedTasks, status: newStatus };
        if (user) {
          saveGoal(updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });
    syncGoalsState(updatedGoals);
  };

  // Task: Delete
  const handleDeleteTask = async (goalId: string, taskId: string) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        const updatedTasks = g.tasks.filter((t) => t.id !== taskId);
        const updatedGoal = { ...g, tasks: updatedTasks };
        if (user) {
          saveGoal(updatedGoal);
        }
        return updatedGoal;
      }
      return g;
    });
    syncGoalsState(updatedGoals);
  };

  const handleSelectGoalForPlanning = (goalId: string) => {
    setSelectedGoalId(goalId);
    setActiveTab('planning');
  };



  // Continue as Guest Handler
  const handleContinueAsGuest = () => {
    sessionStorage.setItem('axiom_guest', 'true');
    setGuestMode(true);
    loadGuestDataFromLocalStorage();
  };

  // Logout Handler
  const handleLogout = async () => {
    if (user) {
      await signOut(auth);
    }
    sessionStorage.removeItem('axiom_guest');
    localStorage.removeItem('axiom_profile');
    localStorage.removeItem('axiom_goals');
    localStorage.removeItem('axiom_deep_work_state');
    setGuestMode(false);
    setUser(null);
    setProfile(DEFAULT_PROFILE);
    setGoals([]);
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            onStartBuilding={() => setActiveTab('dashboard')} 
            onViewDemo={() => setActiveTab('planning')} 
            onOpenInfo={handleOpenInfoModal}
            goals={goals}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateGoalStatus={handleUpdateGoalStatus}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            goals={goals} 
            profile={profile} 
            setActiveTab={setActiveTab} 
            onUpdateGoalStatus={handleUpdateGoalStatus}
            onDeleteGoal={handleDeleteGoal}
            onEditGoal={handleEditGoal}
            onOpenInfo={handleOpenInfoModal}
          />
        );
      case 'goals':
        return (
          <MyGoals 
            goals={goals} 
            onOpenNewGoalModal={() => setIsModalOpen(true)}
            onDeleteGoal={handleDeleteGoal}
            onUpdateGoalStatus={handleUpdateGoalStatus}
            onSelectGoalForPlanning={handleSelectGoalForPlanning}
            onOpenInfo={handleOpenInfoModal}
            onEditGoal={handleEditGoal}
          />
        );
      case 'planning':
        return (
          <PlanningAndTasks 
            goals={goals}
            selectedGoalId={selectedGoalId}
            setSelectedGoalId={setSelectedGoalId}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onReorderTasks={handleReorderTasks}
            onOpenInfo={handleOpenInfoModal}
          />
        );
      case 'timer':
        return <FocusTimer onOpenInfo={handleOpenInfoModal} />;
      case 'settings':
        return (
          <ProfileSettings 
            profile={profile} 
            onSaveProfile={handleSaveProfile} 
            onCancel={() => setActiveTab('dashboard')}
            onOpenInfo={handleOpenInfoModal}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <Dashboard 
            goals={goals} 
            profile={profile} 
            setActiveTab={setActiveTab} 
            onUpdateGoalStatus={handleUpdateGoalStatus} 
            onDeleteGoal={handleDeleteGoal}
            onEditGoal={handleEditGoal}
            onOpenInfo={handleOpenInfoModal}
          />
        );
    }
  };

  // Global Auth Loading Gate
  if (!authInitialized) {
    return (
      <div id="axiom-loader-gate" className="fixed inset-0 flex items-center justify-center bg-[#050c16] text-white">
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#e0a96d] stroke-current fill-none animate-spin" strokeWidth="6">
            <circle cx="50" cy="50" r="40" stroke="#e0a96d" strokeDasharray="180 50" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#e0a96d]">Initializing Secure Vault...</span>
        </div>
      </div>
    );
  }

  // Auth Protection Gate
  if (!user && !guestMode) {
    return (
      <Auth 
        onAuthSuccess={(u) => setUser(u)} 
        onContinueAsGuest={handleContinueAsGuest} 
      />
    );
  }

  return (
    <div id="axiom-app-root" className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#050c16] font-sans antialiased">
      {/* Mobile Top Header Bar */}
      <header id="mobile-top-header" className="md:hidden flex items-center justify-between bg-[#071120] border-b border-[#1a2c42] px-4 py-3 h-14 z-20 shrink-0">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab(isAdminUser ? 'admin' : 'overview')}>
          <div className="w-8 h-8 bg-[#0c1a30] rounded-lg flex items-center justify-center border border-[#e0a96d]/20 relative overflow-hidden shadow-md">
            <svg viewBox="0 0 100 100" className="w-5 h-5 text-[#e0a96d] stroke-current fill-none" strokeWidth="6">
              <circle cx="50" cy="50" r="40" stroke="#e0a96d" />
              <circle cx="50" cy="50" r="25" stroke="#e0a96d" strokeWidth="4" />
              <circle cx="50" cy="50" r="10" fill="#e0a96d" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-bold font-display text-[#e0a96d] leading-none block">Axiom Focus</span>
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest leading-none mt-0.5">Peak Performance</span>
          </div>
        </div>
        
        {/* Mobile menu trigger */}
        <button 
          id="mobile-menu-trigger"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#10243d] transition-colors cursor-pointer"
          title="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }} 
        profile={profile}
        onOpenNewGoalModal={() => {
          setIsModalOpen(true);
          setIsMobileMenuOpen(false);
        }}
        onOpenHelpCenter={() => {
          handleOpenInfoModal('help');
          setIsMobileMenuOpen(false);
        }}
        onLogout={() => {
          handleLogout();
          setIsMobileMenuOpen(false);
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isAdmin={isAdminUser}
      />

      {/* Main Workspace Frame */}
      <main id="axiom-workspace-viewport" className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* New Goal Creation Modal Popup */}
      <NewGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddGoal={handleAddGoal}
      />

      {/* Info Specifications Dialog */}
      <AnimatePresence>
        {isInfoModalOpen && (
          <InfoModal 
            isOpen={isInfoModalOpen} 
            type={infoModalType} 
            onClose={() => setIsInfoModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
