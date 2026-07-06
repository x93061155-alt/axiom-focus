import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Play, 
  Compass, 
  Shield, 
  Award, 
  Calendar, 
  X, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Square, 
  CheckSquare, 
  Plus, 
  Trash2, 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  Bell, 
  Volume2, 
  VolumeX, 
  Activity, 
  Target, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, GoalCategory, GoalStatus, Task } from '../types';
import Footer from './Footer';

interface OverviewProps {
  onStartBuilding: () => void;
  onViewDemo: () => void;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
  goals: Goal[];
  onToggleTask: (goalId: string, taskId: string) => Promise<void> | void;
  onAddTask: (goalId: string, taskTitle: string) => Promise<void> | void;
  onDeleteTask: (goalId: string, taskId: string) => Promise<void> | void;
  onUpdateGoalStatus: (goalId: string, status: GoalStatus) => Promise<void> | void;
}

// Warm Retro-Synth Alarm/Beep for Pomodoro completion
const playCompletionSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(293.66, audioCtx.currentTime); // D4
    osc2.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15); // A4

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.6);
    osc2.stop(audioCtx.currentTime + 0.6);
  } catch (err) {
    console.error('Audio synthesis failed', err);
  }
};

export default function Overview({ 
  onStartBuilding, 
  onViewDemo, 
  onOpenInfo,
  goals,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUpdateGoalStatus
}: OverviewProps) {
  // Navigation active module inside Overview ('roadmap' | 'clarity' | 'timer' | null)
  const [activeModule, setActiveModule] = useState<'roadmap' | 'clarity' | 'timer' | null>(null);

  // --- Shared helper styling ---
  const getCategoryStyle = (category: GoalCategory) => {
    switch (category) {
      case 'PERSONAL':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'FITNESS':
        return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      case 'BUSINESS':
        return 'text-purple-400 border-purple-500/20 bg-purple-500/10';
      case 'ACADEMIC':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      case 'LIFESTYLE':
        return 'text-pink-400 border-pink-500/20 bg-pink-500/10';
    }
  };

  // ----------------------------------------------------------------
  // 1. STRATEGIC ROADMAP STATES & LOGIC
  // ----------------------------------------------------------------
  const [roadmapSearch, setRoadmapSearch] = useState('');
  const [roadmapCategory, setRoadmapCategory] = useState<GoalCategory | 'ALL'>('ALL');
  const [expandedRoadmapGoals, setExpandedRoadmapGoals] = useState<Record<string, boolean>>({});
  const [newRoadmapTask, setNewRoadmapTask] = useState<Record<string, string>>({});

  const toggleRoadmapGoalExpand = (id: string) => {
    setExpandedRoadmapGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter goals
  const filteredRoadmapGoals = goals.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(roadmapSearch.toLowerCase());
    const matchesCat = roadmapCategory === 'ALL' || g.category === roadmapCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate overall roadmap completion percentage
  const totalRoadmapTasks = filteredRoadmapGoals.reduce((sum, g) => sum + g.tasks.length, 0);
  const completedRoadmapTasks = filteredRoadmapGoals.reduce((sum, g) => sum + g.tasks.filter(t => t.isCompleted).length, 0);
  const overallRoadmapProgress = totalRoadmapTasks > 0 
    ? Math.round((completedRoadmapTasks / totalRoadmapTasks) * 100) 
    : 0;

  // ----------------------------------------------------------------
  // 2. ARCHITECTURAL CLARITY STATES & LOGIC
  // ----------------------------------------------------------------
  const [claritySearch, setClaritySearch] = useState('');
  const [clarityStatusFilter, setClarityStatusFilter] = useState<GoalStatus | 'ALL'>('ALL');
  const [expandedClarityProjects, setExpandedClarityProjects] = useState<Record<string, boolean>>({
    'PERSONAL': true,
    'FITNESS': true,
    'BUSINESS': true,
    'ACADEMIC': true,
    'LIFESTYLE': true,
  });
  const [expandedClarityGoals, setExpandedClarityGoals] = useState<Record<string, boolean>>({});
  const [newClarityTask, setNewClarityTask] = useState<Record<string, string>>({});

  const toggleClarityProjectExpand = (cat: string) => {
    setExpandedClarityProjects(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleClarityGoalExpand = (id: string) => {
    setExpandedClarityGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to determine if goal is overdue
  const isGoalOverdue = (g: Goal) => {
    if (g.status === 'DONE' || !g.dueDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const goalDate = new Date(g.dueDate);
    return goalDate < today;
  };

  // Categorize goals by category
  const categories: GoalCategory[] = ['PERSONAL', 'FITNESS', 'BUSINESS', 'ACADEMIC', 'LIFESTYLE'];

  // ----------------------------------------------------------------
  // 3. DEEP WORK PROTOCOL (POMODORO TIMER) STATES & LOGIC
  // ----------------------------------------------------------------
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerBreakMinutes, setTimerBreakMinutes] = useState(5);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusedMinutes, setTotalFocusedMinutes] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer state from LocalStorage to maintain state through refresh
  useEffect(() => {
    const saved = localStorage.getItem('axiom_deep_work_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimerMinutes(parsed.timerMinutes ?? 25);
        setTimerBreakMinutes(parsed.timerBreakMinutes ?? 5);
        setRemainingSeconds(parsed.remainingSeconds ?? (25 * 60));
        setIsTimerActive(parsed.isTimerActive ?? false);
        setTimerMode(parsed.timerMode ?? 'focus');
        setSelectedMilestoneId(parsed.selectedMilestoneId ?? '');
        setCompletedSessions(parsed.completedSessions ?? 0);
        setTotalFocusedMinutes(parsed.totalFocusedMinutes ?? 0);
        setSoundEnabled(parsed.soundEnabled ?? true);
        setNotificationsEnabled(parsed.notificationsEnabled ?? false);
      } catch (e) {
        console.error('Error loading deep work state', e);
      }
    }
  }, []);

  // Save state to LocalStorage
  const saveTimerState = (updates: Record<string, any>) => {
    const currentState = {
      timerMinutes,
      timerBreakMinutes,
      remainingSeconds,
      isTimerActive,
      timerMode,
      selectedMilestoneId,
      completedSessions,
      totalFocusedMinutes,
      soundEnabled,
      notificationsEnabled,
      ...updates
    };
    localStorage.setItem('axiom_deep_work_state', JSON.stringify(currentState));
  };

  // Notification setup
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        saveTimerState({ notificationsEnabled: true });
      } else {
        setNotificationsEnabled(false);
        saveTimerState({ notificationsEnabled: false });
      }
    }
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  };

  // Timer loop
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // Timer Finished!
            clearInterval(timerRef.current!);
            setIsTimerActive(false);

            if (soundEnabled) {
              playCompletionSound();
            }

            if (timerMode === 'focus') {
              const nextSessions = completedSessions + 1;
              const nextMinutes = totalFocusedMinutes + timerMinutes;
              setCompletedSessions(nextSessions);
              setTotalFocusedMinutes(nextMinutes);
              setTimerMode('break');
              const nextSeconds = timerBreakMinutes * 60;
              setRemainingSeconds(nextSeconds);

              showNotification('Session Completed!', 'Excellent work. Time to take a recovery break.');

              // Auto-toggle milestone if selected
              if (selectedMilestoneId) {
                // Find corresponding goal
                const parentGoal = goals.find(g => g.tasks.some(t => t.id === selectedMilestoneId));
                if (parentGoal) {
                  onToggleTask(parentGoal.id, selectedMilestoneId);
                }
              }

              saveTimerState({
                completedSessions: nextSessions,
                totalFocusedMinutes: nextMinutes,
                timerMode: 'break',
                remainingSeconds: nextSeconds,
                isTimerActive: false
              });
            } else {
              setTimerMode('focus');
              const nextSeconds = timerMinutes * 60;
              setRemainingSeconds(nextSeconds);

              showNotification('Break Over!', 'Get ready to dive back into deep focus.');

              saveTimerState({
                timerMode: 'focus',
                remainingSeconds: nextSeconds,
                isTimerActive: false
              });
            }
            return 0;
          }

          const nextSec = prev - 1;
          // Periodically save state to local storage (every 5 seconds to prevent excessive writes)
          if (nextSec % 5 === 0) {
            saveTimerState({ remainingSeconds: nextSec });
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive, timerMode, timerMinutes, timerBreakMinutes, completedSessions, totalFocusedMinutes, selectedMilestoneId, soundEnabled, goals]);

  const handleStartPause = () => {
    const nextState = !isTimerActive;
    setIsTimerActive(nextState);
    saveTimerState({ isTimerActive: nextState });
  };

  const handleReset = () => {
    setIsTimerActive(false);
    const nextSeconds = (timerMode === 'focus' ? timerMinutes : timerBreakMinutes) * 60;
    setRemainingSeconds(nextSeconds);
    saveTimerState({ isTimerActive: false, remainingSeconds: nextSeconds });
  };

  const handleAdjustDuration = (type: 'focus' | 'break', increment: boolean) => {
    if (type === 'focus') {
      setTimerMinutes(prev => {
        const val = increment ? prev + 1 : Math.max(1, prev - 1);
        if (timerMode === 'focus' && !isTimerActive) {
          setRemainingSeconds(val * 60);
          saveTimerState({ timerMinutes: val, remainingSeconds: val * 60 });
        } else {
          saveTimerState({ timerMinutes: val });
        }
        return val;
      });
    } else {
      setTimerBreakMinutes(prev => {
        const val = increment ? prev + 1 : Math.max(1, prev - 1);
        if (timerMode === 'break' && !isTimerActive) {
          setRemainingSeconds(val * 60);
          saveTimerState({ timerBreakMinutes: val, remainingSeconds: val * 60 });
        } else {
          saveTimerState({ timerBreakMinutes: val });
        }
        return val;
      });
    }
  };

  // Get all milestones for selection dropdown
  const allMilestones: { id: string; title: string; goalTitle: string; isCompleted: boolean }[] = [];
  goals.forEach(g => {
    g.tasks.forEach(t => {
      allMilestones.push({
        id: t.id,
        title: t.title,
        goalTitle: g.title,
        isCompleted: t.isCompleted
      });
    });
  });

  const selectedMilestone = allMilestones.find(m => m.id === selectedMilestoneId);

  // Helper to format remaining timer time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate Progress Ring Circle metrics
  const totalSeconds = (timerMode === 'focus' ? timerMinutes : timerBreakMinutes) * 60;
  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;
  const strokeDashoffset = 280 - (280 * progressPercent) / 100;

  return (
    <div id="overview-tab" className="flex-1 flex flex-col justify-between overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 relative min-h-screen">
      {/* Decorative ambient glow background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e0a96d]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* RENDER ACTIVE FULL-PAGE WORKSPACE MODULES */}
      <AnimatePresence mode="wait">
        {activeModule === 'roadmap' && (
          <motion.div 
            key="roadmap-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between z-10"
          >
            <div>
              {/* Workspace Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#12243d] pb-6 mb-8">
                <div>
                  <button 
                    id="btn-roadmap-back"
                    onClick={() => setActiveModule(null)}
                    className="text-xs font-mono text-[#e0a96d] hover:text-[#f3bf84] flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>← RETURN TO OVERVIEW</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight flex items-center gap-2.5">
                    <Compass className="text-[#e0a96d]" size={26} />
                    <span>Strategic Roadmap Workspace</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Interactive roadmap connecting milestones and active blueprints</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-48">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Search size={13} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search goals..."
                      value={roadmapSearch}
                      onChange={(e) => setRoadmapSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#e0a96d]/40"
                    />
                  </div>

                  <select
                    value={roadmapCategory}
                    onChange={(e) => setRoadmapCategory(e.target.value as GoalCategory | 'ALL')}
                    className="w-full sm:w-auto px-3 py-1.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-400 focus:outline-none focus:border-[#e0a96d]/40 cursor-pointer"
                  >
                    <option value="ALL">All Projects</option>
                    <option value="PERSONAL">Personal</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="BUSINESS">Business</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                  </select>
                </div>
              </div>

              {/* High-level Completion Statistics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-[#0b1d31]/30 border border-[#142944] rounded-2xl p-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">ACTIVE BLUEPRINTS</span>
                  <span className="text-2xl font-extrabold text-white mt-1">{filteredRoadmapGoals.length} Goals</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">TOTAL MILESTONES</span>
                  <span className="text-2xl font-extrabold text-white mt-1">{totalRoadmapTasks} / {completedRoadmapTasks} Done</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mb-1">
                    <span className="font-bold uppercase tracking-widest">ROADMAP COMPLETION</span>
                    <span className="text-[#e0a96d] font-bold">{overallRoadmapProgress}%</span>
                  </div>
                  <div className="w-full bg-[#051120] h-2 rounded-full overflow-hidden border border-[#1a2c42]/30">
                    <div 
                      className="bg-[#e0a96d] h-full rounded-full transition-all duration-300"
                      style={{ width: `${overallRoadmapProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* INTERACTIVE ROADMAP CANVAS */}
              <div className="flex flex-col gap-6 relative">
                {filteredRoadmapGoals.length === 0 ? (
                  <div className="text-center py-20 bg-[#0b1d31]/20 border border-dashed border-[#142944] rounded-2xl">
                    <Compass size={40} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No matching goal blueprints found on your strategic roadmap.</p>
                  </div>
                ) : (
                  filteredRoadmapGoals.map((goal, idx) => {
                    const totalTasks = goal.tasks.length;
                    const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);
                    const isExpanded = !!expandedRoadmapGoals[goal.id];

                    return (
                      <div key={goal.id} className="relative flex flex-col md:flex-row gap-6 items-stretch">
                        {/* SVG Visual connection line helper (connects goals sequentially on desktop) */}
                        {idx < filteredRoadmapGoals.length - 1 && (
                          <div className="hidden md:block absolute left-8 top-16 w-0.5 bg-[#142944] h-full z-0 pointer-events-none" style={{ height: 'calc(100% + 24px)' }} />
                        )}

                        {/* Left: Goal Node Card */}
                        <div className="md:w-1/2 bg-[#0b1d31] border border-[#142944] rounded-2xl p-5 relative z-10 flex flex-col justify-between hover:border-[#e0a96d]/20 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div className="truncate pr-2">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase border ${getCategoryStyle(goal.category)}`}>
                                Project: {goal.category}
                              </span>
                              <h3 className="text-base font-bold text-white mt-1.5 truncate">{goal.title}</h3>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-mono text-[#e0a96d] font-bold">{progress}%</span>
                              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Progress</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">{goal.description || 'No description provided.'}</p>

                          {/* Explicit metrics as requested */}
                          <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#12243d] text-center text-[10px] font-mono text-gray-400">
                            <div className="border-r border-[#12243d]">
                              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider">Milestones</span>
                              <span className="text-white font-semibold">{totalTasks}</span>
                            </div>
                            <div className="border-r border-[#12243d]">
                              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider">Completed</span>
                              <span className="text-emerald-400 font-semibold">{completedTasks}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider">Remaining</span>
                              <span className="text-amber-400/90 font-semibold">{totalTasks - completedTasks}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-[#12243d]/60 text-[10px] font-mono text-gray-500">
                            <span className="text-[9px] uppercase tracking-wider text-gray-500">Node Action</span>
                            <button
                              onClick={() => toggleRoadmapGoalExpand(goal.id)}
                              className="text-[#e0a96d] hover:text-[#f3bf84] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isExpanded ? 'Collapse Milestones' : 'Manage Milestones'}</span>
                              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </button>
                          </div>
                        </div>

                        {/* Right: Connected Milestones Container */}
                        <div className="md:w-1/2 flex flex-col justify-center relative">
                          {/* Desktop visual connection bridge line */}
                          <div className="hidden md:block absolute left-[-24px] top-1/2 w-6 h-0.5 bg-dashed border-t border-[#142944] z-0" />

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-[#051120] border border-[#1a2c42] rounded-2xl p-4 space-y-3 z-10"
                              >
                                <div className="flex justify-between items-center border-b border-[#12243d] pb-2">
                                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Connected Milestones</span>
                                  <span className="text-[9px] font-mono text-gray-500">Click to Toggle Complete</span>
                                </div>

                                {/* Milestone check list */}
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {goal.tasks.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic py-2">No milestones defined for this node.</p>
                                  ) : (
                                    goal.tasks.map((task) => (
                                      <div 
                                        key={task.id}
                                        className="flex items-center justify-between p-2 rounded-xl bg-[#0b1d31]/50 border border-[#142944] hover:border-[#e0a96d]/20 transition-all text-xs"
                                      >
                                        <button
                                          onClick={() => onToggleTask(goal.id, task.id)}
                                          className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
                                        >
                                          <div className={task.isCompleted ? 'text-emerald-400' : 'text-gray-500 hover:text-[#e0a96d]'}>
                                            {task.isCompleted ? <CheckSquare size={15} /> : <Square size={15} />}
                                          </div>
                                          <span className={task.isCompleted ? 'line-through text-gray-500' : 'text-gray-200 font-medium'}>
                                            {task.title}
                                          </span>
                                        </button>

                                        <button
                                          onClick={() => onDeleteTask(goal.id, task.id)}
                                          className="text-gray-500 hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                                          title="Remove milestone"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>

                                {/* Fast milestone creator */}
                                <form 
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const title = newRoadmapTask[goal.id]?.trim();
                                    if (!title) return;
                                    onAddTask(goal.id, title);
                                    setNewRoadmapTask(prev => ({ ...prev, [goal.id]: '' }));
                                  }}
                                  className="flex gap-2 pt-2 border-t border-[#12243d]"
                                >
                                  <input
                                    type="text"
                                    placeholder="Add milestone..."
                                    value={newRoadmapTask[goal.id] || ''}
                                    onChange={(e) => setNewRoadmapTask(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                    className="flex-1 px-3 py-1.5 bg-[#0b1d31] border border-[#142944] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#e0a96d]/40"
                                  />
                                  <button
                                    type="submit"
                                    className="px-3 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Plus size={13} />
                                    <span>ADD</span>
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {!isExpanded && (
                            <div className="hidden md:block text-center py-6 border border-dashed border-[#142944] rounded-2xl text-xs text-gray-500">
                              Expand strategic node to manage child milestones and view pipeline flow.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Footer idPrefix="roadmap-ws" onOpenInfo={onOpenInfo} />
          </motion.div>
        )}

        {activeModule === 'clarity' && (
          <motion.div 
            key="clarity-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between z-10"
          >
            <div>
              {/* Workspace Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#12243d] pb-6 mb-8">
                <div>
                  <button 
                    id="btn-clarity-back"
                    onClick={() => setActiveModule(null)}
                    className="text-xs font-mono text-[#e0a96d] hover:text-[#f3bf84] flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>← RETURN TO OVERVIEW</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight flex items-center gap-2.5">
                    <Shield className="text-blue-400" size={26} />
                    <span>Architectural Clarity Planning</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Hierarchical tree view mapping categories, blueprints and active child milestones</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-48">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                      <Search size={13} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search goals..."
                      value={claritySearch}
                      onChange={(e) => setClaritySearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#e0a96d]/40"
                    />
                  </div>

                  <select
                    value={clarityStatusFilter}
                    onChange={(e) => setClarityStatusFilter(e.target.value as GoalStatus | 'ALL')}
                    className="w-full sm:w-auto px-3 py-1.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-400 focus:outline-none focus:border-[#e0a96d]/40 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Completed</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>

              {/* Collapsible tree structure */}
              <div className="space-y-4">
                {categories.map((category) => {
                  // Filter goals under this category matching search & status
                  const categoryGoals = goals.filter(g => {
                    const isCat = g.category === category;
                    const matchesSearch = g.title.toLowerCase().includes(claritySearch.toLowerCase());
                    const matchesStatus = clarityStatusFilter === 'ALL' || g.status === clarityStatusFilter;
                    return isCat && matchesSearch && matchesStatus;
                  });

                  if (categoryGoals.length === 0 && claritySearch) return null; // skip empty matching search groups

                  const isProjectExpanded = !!expandedClarityProjects[category];
                  
                  // Project stats
                  const projTotalTasks = categoryGoals.reduce((sum, g) => sum + g.tasks.length, 0);
                  const projCompletedTasks = categoryGoals.reduce((sum, g) => sum + g.tasks.filter(t => t.isCompleted).length, 0);
                  const projectProgress = projTotalTasks > 0 ? Math.round((projCompletedTasks / projTotalTasks) * 100) : 0;

                  return (
                    <div key={category} className="bg-[#0b1d31]/30 border border-[#142944] rounded-2xl overflow-hidden">
                      {/* Level 1: Project/Category header */}
                      <div 
                        onClick={() => toggleClarityProjectExpand(category)}
                        className="p-4 bg-[#0b1d31] border-b border-[#142944]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-[#0d2139] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-gray-400">
                            {isProjectExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 font-bold tracking-widest uppercase block">PROJECT CORE</span>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{category} ARCHITECTURE</h3>
                          </div>
                        </div>

                        {/* Project progress */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="flex-1 sm:w-36">
                            <div className="flex justify-between items-center text-[9px] font-mono text-gray-500 mb-1">
                              <span>PROGRESS</span>
                              <span className="text-[#e0a96d] font-bold">{projectProgress}%</span>
                            </div>
                            <div className="w-full bg-[#051120] h-1 rounded-full overflow-hidden">
                              <div className="bg-[#e0a96d] h-full" style={{ width: `${projectProgress}%` }} />
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-gray-400 bg-[#051120] border border-[#1a2c42] px-2.5 py-1 rounded-md">
                            {categoryGoals.length} Blueprint{categoryGoals.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Level 2 & 3: Goals and Tasks hierarchy */}
                      <AnimatePresence>
                        {isProjectExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 space-y-4 divide-y divide-[#12243d]/30"
                          >
                            {categoryGoals.length === 0 ? (
                              <p className="text-xs text-gray-500 italic py-2 pl-4">No active goal blueprints in this module.</p>
                            ) : (
                              categoryGoals.map((goal, goalIdx) => {
                                const isGoalExpanded = !!expandedClarityGoals[goal.id];
                                const isOverdue = isGoalOverdue(goal);
                                const totalTasks = goal.tasks.length;
                                const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
                                const goalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);

                                return (
                                  <div key={goal.id} className={`pt-3 ${goalIdx === 0 ? '' : 'pt-4'}`}>
                                    {/* Level 2: Goal Core Row */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pl-4">
                                      <div className="flex items-center gap-2 flex-1">
                                        {/* Visual hierarchical indicator vertical bracket line */}
                                        <div className="hidden sm:block w-3.5 h-3.5 border-l-2 border-b-2 border-dashed border-[#1a2c42] transform -translate-y-2 mr-1" />
                                        
                                        <button 
                                          onClick={() => toggleClarityGoalExpand(goal.id)}
                                          className="text-gray-400 hover:text-white cursor-pointer"
                                        >
                                          {isGoalExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        </button>

                                        <div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-xs font-bold text-gray-200">{goal.title}</h4>
                                            
                                            {/* Status Badge */}
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider ${
                                              goal.status === 'DONE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                              {goal.status}
                                            </span>

                                            {/* Overdue Alert */}
                                            {isOverdue && (
                                              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 animate-pulse">
                                                <AlertTriangle size={8} />
                                                <span>OVERDUE</span>
                                              </span>
                                            )}
                                          </div>

                                          <span className="text-[9px] font-mono text-gray-500 mt-0.5 block">
                                            📅 Deadline: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No Deadline'}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Goal Progress bar */}
                                      <div className="flex items-center gap-4 w-full sm:w-auto pl-8 sm:pl-0">
                                        <div className="w-24 bg-[#051120] h-1 rounded-full overflow-hidden">
                                          <div className="bg-blue-400 h-full" style={{ width: `${goalProgress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-500 font-bold w-10 text-right">{goalProgress}%</span>
                                      </div>
                                    </div>

                                    {/* Level 3: Milestones/Tasks nested */}
                                    <AnimatePresence>
                                      {isGoalExpanded && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="pl-14 pr-4 py-2 mt-2 space-y-2"
                                        >
                                          {goal.tasks.length === 0 ? (
                                            <p className="text-[10px] text-gray-500 italic py-1">No micro-tasks defined.</p>
                                          ) : (
                                            goal.tasks.map((task, tIdx) => {
                                              const isLastTask = tIdx === goal.tasks.length - 1;
                                              return (
                                                <div key={task.id} className="relative flex items-center pl-6 py-0.5">
                                                  {/* Branch connector guides */}
                                                  <div 
                                                    className="absolute left-1.5 top-0 w-px bg-[#1a2c42]" 
                                                    style={{ height: isLastTask ? '50%' : '100%' }} 
                                                  />
                                                  <div className="absolute left-1.5 top-1/2 w-3.5 h-px bg-[#1a2c42]" />

                                                  <div 
                                                    className="flex items-center justify-between p-1.5 rounded-lg bg-[#051120]/40 border border-[#1a2c42]/40 hover:border-blue-500/30 text-[11px] w-full relative z-10"
                                                  >
                                                    <button
                                                      onClick={() => onToggleTask(goal.id, task.id)}
                                                      className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                                                    >
                                                      <div className={task.isCompleted ? 'text-emerald-400' : 'text-gray-500 hover:text-blue-400'}>
                                                        {task.isCompleted ? <CheckSquare size={13} /> : <Square size={13} />}
                                                      </div>
                                                      <span className={task.isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}>
                                                        {task.title}
                                                      </span>
                                                    </button>

                                                    <button
                                                      onClick={() => onDeleteTask(goal.id, task.id)}
                                                      className="text-gray-600 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                                                      title="Remove"
                                                    >
                                                      <Trash2 size={11} />
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })
                                          )}

                                          {/* Add task fast */}
                                          <form 
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              const title = newClarityTask[goal.id]?.trim();
                                              if (!title) return;
                                              onAddTask(goal.id, title);
                                              setNewClarityTask(prev => ({ ...prev, [goal.id]: '' }));
                                            }}
                                            className="flex gap-2 pt-1"
                                          >
                                            <input
                                              type="text"
                                              placeholder="Add tactical milestone..."
                                              value={newClarityTask[goal.id] || ''}
                                              onChange={(e) => setNewClarityTask(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                              className="flex-1 px-2.5 py-1 bg-[#051120] border border-[#1a2c42] rounded-lg text-[10px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/40"
                                            />
                                            <button
                                              type="submit"
                                              className="px-2.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-bold text-[10px] rounded-lg flex items-center justify-center cursor-pointer"
                                            >
                                              <Plus size={11} />
                                              <span>ADD</span>
                                            </button>
                                          </form>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            <Footer idPrefix="clarity-ws" onOpenInfo={onOpenInfo} />
          </motion.div>
        )}

        {activeModule === 'timer' && (
          <motion.div 
            key="timer-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col justify-between z-10"
          >
            <div>
              {/* Workspace Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#12243d] pb-6 mb-8">
                <div>
                  <button 
                    id="btn-timer-back"
                    onClick={() => {
                      setActiveModule(null);
                      // Make sure state is synchronized back
                      saveTimerState({});
                    }}
                    className="text-xs font-mono text-[#e0a96d] hover:text-[#f3bf84] flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>← RETURN TO OVERVIEW</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-extrabold font-display leading-tight flex items-center gap-2.5">
                    <Award className="text-emerald-400" size={26} />
                    <span>Deep Work Protocol Workspace</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">High-performance custom Pomodoro module with live milestone integration</p>
                </div>
              </div>

              {/* Main Timer Split Screen Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Panel: Circular glowing countdown timer (span 5) */}
                <div className="lg:col-span-5 bg-[#0b1d31]/50 border border-[#142944] rounded-2xl p-6 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold mb-6">
                    {timerMode === 'focus' ? '🎯 DEEP FOCUS INTERVAL' : '☕ COGNITIVE RECOVERY'}
                  </span>

                  {/* Circular progress ring */}
                  <div className="relative w-56 h-56 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="112" 
                        cy="112" 
                        r="90" 
                        stroke="#0d2139" 
                        strokeWidth="8" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="112" 
                        cy="112" 
                        r="90" 
                        stroke={timerMode === 'focus' ? '#e0a96d' : '#10b981'} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="565" 
                        strokeDashoffset={565 - (565 * progressPercent) / 100}
                        className="transition-all duration-1000"
                      />
                    </svg>

                    {/* Countdown digits */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
                        {formatTime(remainingSeconds)}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 mt-1 uppercase">
                        {isTimerActive ? 'RUNNING' : 'PAUSED'}
                      </span>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={handleReset}
                      title="Reset focus"
                      className="p-3 bg-[#0d2139] hover:bg-[#112d4e] border border-[#1e3a5f] rounded-xl text-gray-300 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={16} />
                    </button>

                    <button
                      onClick={handleStartPause}
                      className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                        isTimerActive 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30' 
                          : 'bg-[#e0a96d] text-[#071324] hover:bg-[#f3bf84] shadow-lg shadow-[#e0a96d]/10'
                      }`}
                    >
                      {isTimerActive ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                      <span>{isTimerActive ? 'PAUSE PROTOCOL' : 'ACTIVATE STUDY'}</span>
                    </button>
                  </div>

                  {/* Custom Focus and Break Durations */}
                  <div className="w-full border-t border-[#12243d] pt-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-gray-200">Study Block Duration</span>
                        <span className="text-[10px] text-gray-500 block">Length of focus session</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#051120] border border-[#1a2c42] rounded-xl p-1">
                        <button 
                          onClick={() => handleAdjustDuration('focus', false)} 
                          className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1 w-6 text-center">{timerMinutes}m</span>
                        <button 
                          onClick={() => handleAdjustDuration('focus', true)} 
                          className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-gray-200">Recovery Break Duration</span>
                        <span className="text-[10px] text-gray-500 block">Rest between intervals</span>
                      </div>
                      <div className="flex items-center gap-2 bg-[#051120] border border-[#1a2c42] rounded-xl p-1">
                        <button 
                          onClick={() => handleAdjustDuration('break', false)} 
                          className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1 w-6 text-center">{timerBreakMinutes}m</span>
                        <button 
                          onClick={() => handleAdjustDuration('break', true)} 
                          className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Integrated Milestone Selection & Daily Stats (span 7) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Focus Milestone Integrated Card */}
                  <div className="bg-[#0b1d31]/50 border border-[#142944] rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#12243d]">
                      <div>
                        <span className="text-[10px] font-mono text-[#e0a96d] uppercase tracking-widest font-bold">INTEGRATED TASK TARGET</span>
                        <h3 className="text-sm font-bold text-white mt-0.5">Select Live Milestone</h3>
                      </div>
                      <Clock size={16} className="text-[#e0a96d]" />
                    </div>

                    {/* Selector */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1.5 font-bold">ACTIVE MILESTONE PIPELINE</label>
                        <select
                          value={selectedMilestoneId}
                          onChange={(e) => {
                            setSelectedMilestoneId(e.target.value);
                            saveTimerState({ selectedMilestoneId: e.target.value });
                          }}
                          className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-300 focus:outline-none focus:border-[#e0a96d]/40 cursor-pointer"
                        >
                          <option value="">-- No integrated focus task selected --</option>
                          {allMilestones.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.isCompleted ? '[Completed] ' : ''}{m.title} ({m.goalTitle})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedMilestone ? (
                        <div className="p-4 bg-[#051120] border border-[#1a2c42] rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                // find parent goal
                                const parent = goals.find(g => g.tasks.some(t => t.id === selectedMilestone.id));
                                if (parent) {
                                  onToggleTask(parent.id, selectedMilestone.id);
                                }
                              }}
                              className="text-gray-400 hover:text-emerald-400 cursor-pointer"
                            >
                              {selectedMilestone.isCompleted ? (
                                <CheckSquare size={18} className="text-emerald-400" />
                              ) : (
                                <Square size={18} />
                              )}
                            </button>
                            <div>
                              <span className="text-xs font-bold text-white block">{selectedMilestone.title}</span>
                              <span className="text-[10px] text-gray-500 block mt-0.5">Blueprint: {selectedMilestone.goalTitle}</span>
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase border ${
                            selectedMilestone.isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {selectedMilestone.isCompleted ? 'DONE' : 'IN STRATEGY'}
                          </span>
                        </div>
                      ) : (
                        <div className="p-6 border border-dashed border-[#1a2c42] rounded-xl text-center text-xs text-gray-500">
                          Select a milestone above to automatically mark it completed upon timer expiration, and monitor work blocks directly from this study deck.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Daily statistics */}
                  <div className="bg-[#0b1d31]/50 border border-[#142944] rounded-2xl p-6">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold mb-4">DAILY FOCUS METRICS</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#051120] border border-[#1a2c42] rounded-xl p-4 text-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">COMPLETED SESSIONS</span>
                        <span className="text-3xl font-extrabold text-white block mt-1">{completedSessions}</span>
                      </div>

                      <div className="bg-[#051120] border border-[#1a2c42] rounded-xl p-4 text-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase font-bold">TOTAL STUDY MINUTES</span>
                        <span className="text-3xl font-extrabold text-[#e0a96d] block mt-1">{totalFocusedMinutes}m</span>
                      </div>
                    </div>

                    {/* Audio & Notification settings */}
                    <div className="mt-5 pt-5 border-t border-[#12243d] flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-emerald-400" />
                        <span className="text-xs text-gray-400">Environmental Integration Options</span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSoundEnabled(!soundEnabled);
                            saveTimerState({ soundEnabled: !soundEnabled });
                          }}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                            soundEnabled 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                        >
                          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                          <span>Audio alerts</span>
                        </button>

                        <button
                          onClick={requestNotificationPermission}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                            notificationsEnabled 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                        >
                          <Bell size={13} />
                          <span>Push alerts</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <Footer idPrefix="timer-ws" onOpenInfo={onOpenInfo} />
          </motion.div>
        )}

        {/* DEFAULT OVERVIEW / HERO PAGE */}
        {activeModule === null && (
          <motion.div 
            key="overview-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Main Hero Section */}
            <div className="my-auto max-w-3xl flex flex-col items-center text-center mx-auto z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d2139] border border-[#e0a96d]/20 text-xs text-[#e0a96d] font-mono mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-[#e0a96d] animate-pulse" />
                AXIOM METHODOLOGY ACTIVE
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold font-display leading-tight tracking-tight mb-6"
              >
                Achieve Your <span className="text-[#e0a96d] underline decoration-wavy decoration-[#e0a96d]/30">Ambitions.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mb-10"
              >
                A high-performance environment for focus. Architectural clarity for your goals, removing distractions and elevating your daily progress.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
              >
                <button
                  id="btn-overview-start"
                  onClick={onStartBuilding}
                  className="w-full sm:w-auto px-8 py-4 bg-[#e0a96d] text-[#071324] font-bold rounded-xl flex items-center justify-center gap-2.5 hover:bg-[#f3bf84] active:scale-95 transition-all duration-200 shadow-lg shadow-[#e0a96d]/10 hover:shadow-[#e0a96d]/20 cursor-pointer"
                >
                  <span>START BUILDING TODAY</span>
                  <ArrowRight size={18} />
                </button>
                
                <button
                  id="btn-overview-demo"
                  onClick={onViewDemo}
                  className="w-full sm:w-auto px-8 py-4 bg-[#0d2139] border border-[#1e3a5f] hover:border-[#e0a96d]/40 rounded-xl font-bold text-gray-200 flex items-center justify-center gap-2.5 hover:bg-[#112d4e] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <Play size={16} className="text-[#e0a96d]" />
                  <span>VIEW PLANNING</span>
                </button>
              </motion.div>
            </div>

            {/* Feature pillars - NEW FULLY CLICKABLE MODULES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 w-full z-10 border-t border-[#142944] pt-12">
              <div 
                id="overview-card-roadmap"
                onClick={() => setActiveModule('roadmap')}
                className="bg-[#0b1d31] p-6 rounded-2xl border border-[#142944] flex flex-col gap-3 group hover:border-[#e0a96d]/40 hover:bg-[#0d2139] active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e0a96d]/2 rounded-full blur-xl pointer-events-none group-hover:bg-[#e0a96d]/5 transition-all" />
                <div className="w-10 h-10 rounded-xl bg-[#e0a96d]/10 flex items-center justify-center text-[#e0a96d] group-hover:scale-110 transition-transform">
                  <Compass size={20} />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold font-display text-white group-hover:text-[#e0a96d] transition-colors">Strategic Roadmap</h3>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-[#e0a96d]/70">OPEN</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Map goals into logical nodes. Group milestones and track percentage weights elegantly as you execute.</p>
              </div>

              <div 
                id="overview-card-clarity"
                onClick={() => setActiveModule('clarity')}
                className="bg-[#0b1d31] p-6 rounded-2xl border border-[#142944] flex flex-col gap-3 group hover:border-blue-400/40 hover:bg-[#0d2139] active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/2 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/5 transition-all" />
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Shield size={20} />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold font-display text-white group-hover:text-blue-400 transition-colors">Architectural Clarity</h3>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-blue-400/70">OPEN</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Structured planning keeps your daily agenda clean and highly aligned with your larger core system objectives.</p>
              </div>

              <div 
                id="overview-card-timer"
                onClick={() => setActiveModule('timer')}
                className="bg-[#0b1d31] p-6 rounded-2xl border border-[#142944] flex flex-col gap-3 group hover:border-emerald-400/40 hover:bg-[#0d2139] active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/2 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/5 transition-all" />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Award size={20} />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold font-display text-white group-hover:text-emerald-400 transition-colors">Deep Work Protocol</h3>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest group-hover:text-emerald-400/70">OPEN</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">A native Pomodoro timer integrated directly into your workspace keeps you focused on one milestone at a time.</p>
              </div>
            </div>

            {/* Corporate / Academic Footer credits */}
            <Footer idPrefix="overview" onOpenInfo={onOpenInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
