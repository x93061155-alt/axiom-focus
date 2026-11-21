import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Play, 
  Compass, 
  Shield, 
  Award, 
  Search, 
  ChevronRight, 
  ChevronDown, 
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
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, GoalCategory, GoalStatus } from '../types';
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

const playCompletionSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(293.66, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);

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
  onDeleteTask
}: OverviewProps) {
  const [activeModule, setActiveModule] = useState<'roadmap' | 'clarity' | 'timer' | null>(null);

  const getCategoryTextColor = (category: GoalCategory) => {
    switch (category) {
      case 'PERSONAL':
        return 'text-[#A67C00]';
      case 'FITNESS':
        return 'text-emerald-700';
      case 'BUSINESS':
        return 'text-[#171717]';
      case 'ACADEMIC':
        return 'text-amber-700';
      case 'LIFESTYLE':
        return 'text-rose-700';
    }
  };

  // 1. STRATEGIC ROADMAP STATES
  const [roadmapSearch, setRoadmapSearch] = useState('');
  const [roadmapCategory, setRoadmapCategory] = useState<GoalCategory | 'ALL'>('ALL');
  const [expandedRoadmapGoals, setExpandedRoadmapGoals] = useState<Record<string, boolean>>({});
  const [newRoadmapTask, setNewRoadmapTask] = useState<Record<string, string>>({});

  const toggleRoadmapGoalExpand = (id: string) => {
    setExpandedRoadmapGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRoadmapGoals = goals.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(roadmapSearch.toLowerCase());
    const matchesCat = roadmapCategory === 'ALL' || g.category === roadmapCategory;
    return matchesSearch && matchesCat;
  });

  const totalRoadmapTasks = filteredRoadmapGoals.reduce((sum, g) => sum + g.tasks.length, 0);
  const completedRoadmapTasks = filteredRoadmapGoals.reduce((sum, g) => sum + g.tasks.filter(t => t.isCompleted).length, 0);
  const overallRoadmapProgress = totalRoadmapTasks > 0 
    ? Math.round((completedRoadmapTasks / totalRoadmapTasks) * 100) 
    : 0;

  // 2. ARCHITECTURAL CLARITY STATES
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

  const isGoalOverdue = (g: Goal) => {
    if (g.status === 'DONE' || !g.dueDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const goalDate = new Date(g.dueDate);
    return goalDate < today;
  };

  const categories: GoalCategory[] = ['PERSONAL', 'FITNESS', 'BUSINESS', 'ACADEMIC', 'LIFESTYLE'];

  // 3. DEEP WORK PROTOCOL (POMODORO TIMER) STATES
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

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
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

              if (selectedMilestoneId) {
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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalSeconds = (timerMode === 'focus' ? timerMinutes : timerBreakMinutes) * 60;
  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;

  return (
    <div id="overview-tab" className="flex-1 flex flex-col justify-between overflow-y-auto text-[#171717] p-5 sm:p-8 md:p-10 relative min-h-full">
      {/* Subtle atmospheric ambient light */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-[#FFD700]/16 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-[#F7E7B0]/30 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {activeModule === 'roadmap' && (
          <motion.div 
            key="roadmap-workspace"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-between z-10 max-w-6xl w-full mx-auto"
          >
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#F7E7B0] pb-6 mb-8">
                <div>
                  <button 
                    id="btn-roadmap-back"
                    onClick={() => setActiveModule(null)}
                    className="text-xs font-medium text-[#A67C00] hover:text-[#171717] flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>← Return to Overview</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight flex items-center gap-3 text-[#171717]">
                    <Compass className="text-[#A67C00]" size={26} />
                    <span>Strategic Roadmap Workspace</span>
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">Interactive roadmap connecting milestones and active blueprints</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-52">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#666666]">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search goals..."
                      value={roadmapSearch}
                      onChange={(e) => setRoadmapSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 axiom-input rounded-xl text-xs"
                    />
                  </div>

                  <select
                    value={roadmapCategory}
                    onChange={(e) => setRoadmapCategory(e.target.value as GoalCategory | 'ALL')}
                    className="w-full sm:w-auto px-3.5 py-2 axiom-input rounded-xl text-xs cursor-pointer"
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

              {/* Statistics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 axiom-card rounded-2xl p-5">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#666666]">Active Blueprints</span>
                  <span className="text-2xl font-bold font-display tabular-nums text-[#171717] mt-1">{filteredRoadmapGoals.length} Goals</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#666666]">Total Milestones</span>
                  <span className="text-2xl font-bold font-display tabular-nums text-[#171717] mt-1">{completedRoadmapTasks} / {totalRoadmapTasks} Done</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-medium text-[#666666]">Roadmap Completion</span>
                    <span className="text-[#A67C00] font-semibold font-mono tabular-nums">{overallRoadmapProgress}%</span>
                  </div>
                  <div className="w-full bg-[#FFFDF5] h-2 rounded-full overflow-hidden border border-[#F7E7B0]">
                    <div 
                      className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700] h-full rounded-full transition-all duration-300"
                      style={{ width: `${overallRoadmapProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* INTERACTIVE ROADMAP CANVAS */}
              <div className="flex flex-col gap-6 relative">
                {filteredRoadmapGoals.length === 0 ? (
                  <div className="text-center py-20 axiom-card border-dashed rounded-2xl">
                    <Compass size={40} className="text-[#D4AF37] mx-auto mb-3" />
                    <p className="text-sm text-[#666666]">No matching goal blueprints found on your strategic roadmap.</p>
                  </div>
                ) : (
                  filteredRoadmapGoals.map((goal, idx) => {
                    const totalTasks = goal.tasks.length;
                    const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
                    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);
                    const isExpanded = !!expandedRoadmapGoals[goal.id];

                    return (
                      <div key={goal.id} className="relative flex flex-col md:flex-row gap-6 items-stretch">
                        {idx < filteredRoadmapGoals.length - 1 && (
                          <div className="hidden md:block absolute left-8 top-16 w-px bg-[#D4AF37]/45 h-full z-0 pointer-events-none" style={{ height: 'calc(100% + 24px)' }} />
                        )}

                        <div className="md:w-1/2 axiom-card rounded-2xl p-5 relative z-10 flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-3 gap-3">
                            <div className="min-w-0">
                              <span className={`text-xs font-semibold capitalize ${getCategoryTextColor(goal.category)}`}>
                                {goal.category.toLowerCase()}
                              </span>
                              <h3 className="text-base font-bold font-display text-[#171717] mt-1 truncate">{goal.title}</h3>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className="text-sm font-mono tabular-nums text-[#A67C00] font-bold">{progress}%</span>
                              <span className="text-[11px] text-[#666666]">Progress</span>
                            </div>
                          </div>

                          <p className="text-xs text-[#666666] line-clamp-2 mb-4 leading-relaxed">{goal.description || 'No description provided.'}</p>

                          <div className="grid grid-cols-3 gap-2 py-3 border-t border-[#F7E7B0] text-center text-xs font-mono tabular-nums text-[#171717]">
                            <div className="border-r border-[#F7E7B0]">
                              <span className="block text-[11px] font-sans text-[#666666]">Milestones</span>
                              <span className="text-[#171717] font-semibold mt-0.5 block">{totalTasks}</span>
                            </div>
                            <div className="border-r border-[#F7E7B0]">
                              <span className="block text-[11px] font-sans text-[#666666]">Completed</span>
                              <span className="text-emerald-700 font-semibold mt-0.5 block">{completedTasks}</span>
                            </div>
                            <div>
                              <span className="block text-[11px] font-sans text-[#666666]">Remaining</span>
                              <span className="text-[#A67C00] font-semibold mt-0.5 block">{totalTasks - completedTasks}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-[#F7E7B0] text-xs">
                            <span className="text-[#666666]">Milestones</span>
                            <button
                              onClick={() => toggleRoadmapGoalExpand(goal.id)}
                              className="text-[#A67C00] hover:text-[#171717] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isExpanded ? 'Collapse' : 'Manage Milestones'}</span>
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="md:w-1/2 flex flex-col justify-center relative">
                          <div className="hidden md:block absolute left-[-24px] top-1/2 w-6 h-px border-t border-[#D4AF37]/45 z-0" />

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="axiom-inset rounded-2xl p-4 space-y-3 z-10"
                              >
                                <div className="flex justify-between items-center border-b border-[#F7E7B0] pb-2">
                                  <span className="text-xs font-semibold text-[#171717]">Connected Milestones</span>
                                  <span className="text-[11px] text-[#666666]">Click to toggle</span>
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                  {goal.tasks.length === 0 ? (
                                    <p className="text-xs text-[#666666]/80 italic py-2">No milestones defined for this node.</p>
                                  ) : (
                                    goal.tasks.map((task) => (
                                      <div 
                                        key={task.id}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFFFFF] border border-[#F7E7B0] hover:border-[#D4AF37] transition-all text-xs shadow-xs"
                                      >
                                        <button
                                          onClick={() => onToggleTask(goal.id, task.id)}
                                          className="flex items-center gap-2.5 flex-1 text-left cursor-pointer min-w-0"
                                        >
                                          <div className={task.isCompleted ? 'text-emerald-700 shrink-0' : 'text-[#666666] hover:text-[#A67C00] shrink-0'}>
                                            {task.isCompleted ? <CheckSquare size={15} /> : <Square size={15} />}
                                          </div>
                                          <span className={`truncate ${task.isCompleted ? 'line-through text-[#666666]/65' : 'text-[#171717] font-medium'}`}>
                                            {task.title}
                                          </span>
                                        </button>

                                        <button
                                          onClick={() => onDeleteTask(goal.id, task.id)}
                                          className="text-[#666666] hover:text-rose-700 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                                          title="Remove milestone"
                                          aria-label="Remove milestone"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>

                                <form 
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const title = newRoadmapTask[goal.id]?.trim();
                                    if (!title) return;
                                    onAddTask(goal.id, title);
                                    setNewRoadmapTask(prev => ({ ...prev, [goal.id]: '' }));
                                  }}
                                  className="flex gap-2 pt-2 border-t border-[#F7E7B0]"
                                >
                                  <input
                                    type="text"
                                    placeholder="Add milestone..."
                                    value={newRoadmapTask[goal.id] || ''}
                                    onChange={(e) => setNewRoadmapTask(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                    className="flex-1 px-3 py-2 axiom-input rounded-xl text-xs"
                                  />
                                  <button
                                    type="submit"
                                    className="px-3.5 axiom-btn-primary text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <Plus size={13} strokeWidth={2.5} />
                                    <span>Add</span>
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {!isExpanded && (
                            <div className="hidden md:block text-center py-6 border border-dashed border-[#F7E7B0] rounded-2xl text-xs text-[#666666] px-4">
                              Expand a strategic node to manage child milestones and inspect progress.
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-between z-10 max-w-6xl w-full mx-auto"
          >
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#F7E7B0] pb-6 mb-8">
                <div>
                  <button 
                    id="btn-clarity-back"
                    onClick={() => setActiveModule(null)}
                    className="text-xs font-medium text-[#A67C00] hover:text-[#171717] flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>← Return to Overview</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight flex items-center gap-3 text-[#171717]">
                    <Shield className="text-[#A67C00]" size={26} />
                    <span>Architectural Clarity Planning</span>
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">Hierarchical view mapping categories, blueprints, and active milestones</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-52">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#666666]">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search goals..."
                      value={claritySearch}
                      onChange={(e) => setClaritySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 axiom-input rounded-xl text-xs"
                    />
                  </div>

                  <select
                    value={clarityStatusFilter}
                    onChange={(e) => setClarityStatusFilter(e.target.value as GoalStatus | 'ALL')}
                    className="w-full sm:w-auto px-3.5 py-2 axiom-input rounded-xl text-xs cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Completed</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryGoals = goals.filter(g => {
                    const isCat = g.category === category;
                    const matchesSearch = g.title.toLowerCase().includes(claritySearch.toLowerCase());
                    const matchesStatus = clarityStatusFilter === 'ALL' || g.status === clarityStatusFilter;
                    return isCat && matchesSearch && matchesStatus;
                  });

                  if (categoryGoals.length === 0 && claritySearch) return null;

                  const isProjectExpanded = !!expandedClarityProjects[category];
                  const projTotalTasks = categoryGoals.reduce((sum, g) => sum + g.tasks.length, 0);
                  const projCompletedTasks = categoryGoals.reduce((sum, g) => sum + g.tasks.filter(t => t.isCompleted).length, 0);
                  const projectProgress = projTotalTasks > 0 ? Math.round((projCompletedTasks / projTotalTasks) * 100) : 0;

                  return (
                    <div key={category} className="axiom-card rounded-2xl overflow-hidden">
                      <div 
                        onClick={() => toggleClarityProjectExpand(category)}
                        className="p-4 sm:px-6 bg-[#FFFDF5] border-b border-[#F7E7B0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-[#666666]">
                            {isProjectExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                          <div>
                            <span className={`text-xs font-semibold capitalize block ${getCategoryTextColor(category)}`}>
                              {category.toLowerCase()} Architecture
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="flex-1 sm:w-36">
                            <div className="flex justify-between items-center text-[11px] mb-1">
                              <span className="text-[#666666]">Progress</span>
                              <span className="text-[#A67C00] font-mono tabular-nums font-semibold">{projectProgress}%</span>
                            </div>
                            <div className="w-full bg-[#FFFFFF] h-1.5 rounded-full overflow-hidden border border-[#F7E7B0]">
                              <div className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700] h-full rounded-full" style={{ width: `${projectProgress}%` }} />
                            </div>
                          </div>

                          <span className="text-xs font-mono tabular-nums text-[#666666]">
                            {categoryGoals.length} {categoryGoals.length === 1 ? 'blueprint' : 'blueprints'}
                          </span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isProjectExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-5 space-y-4 divide-y divide-[#F7E7B0]"
                          >
                            {categoryGoals.length === 0 ? (
                              <p className="text-xs text-[#666666]/80 italic py-2 pl-4">No active goal blueprints in this module.</p>
                            ) : (
                              categoryGoals.map((goal, goalIdx) => {
                                const isGoalExpanded = !!expandedClarityGoals[goal.id];
                                const isOverdue = isGoalOverdue(goal);
                                const totalTasks = goal.tasks.length;
                                const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
                                const goalProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);

                                return (
                                  <div key={goal.id} className={goalIdx === 0 ? '' : 'pt-4'}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pl-2 sm:pl-4">
                                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                        <button 
                                          onClick={() => toggleClarityGoalExpand(goal.id)}
                                          className="text-[#666666] hover:text-[#171717] cursor-pointer"
                                          aria-label="Toggle goal milestones"
                                        >
                                          {isGoalExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                                        </button>

                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-semibold text-[#171717]">{goal.title}</h4>
                                            <span className="text-[#D4AF37]" aria-hidden="true">·</span>
                                            <span className={`text-xs font-medium ${goal.status === 'DONE' ? 'text-emerald-700' : 'text-[#A67C00]'}`}>
                                              {goal.status === 'DONE' ? 'Completed' : 'Active'}
                                            </span>
                                            {isOverdue && (
                                              <>
                                                <span className="text-[#D4AF37]" aria-hidden="true">·</span>
                                                <span className="text-xs font-medium text-rose-700 inline-flex items-center gap-1">
                                                  <AlertTriangle size={12} />
                                                  <span>Overdue</span>
                                                </span>
                                              </>
                                            )}
                                          </div>

                                          <span className="text-[11px] font-mono tabular-nums text-[#666666] mt-0.5 block">
                                            Deadline: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No Deadline'}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 w-full sm:w-auto pl-7 sm:pl-0">
                                        <div className="w-24 bg-[#FFFDF5] h-1.5 rounded-full overflow-hidden border border-[#F7E7B0]">
                                          <div className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700] h-full rounded-full" style={{ width: `${goalProgress}%` }} />
                                        </div>
                                        <span className="text-xs font-mono tabular-nums text-[#666666] font-semibold w-10 text-right">{goalProgress}%</span>
                                      </div>
                                    </div>

                                    <AnimatePresence>
                                      {isGoalExpanded && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="pl-10 sm:pl-14 pr-2 sm:pr-4 py-2 mt-2 space-y-2"
                                        >
                                          {goal.tasks.length === 0 ? (
                                            <p className="text-xs text-[#666666]/80 italic py-1">No tasks defined yet.</p>
                                          ) : (
                                            goal.tasks.map((task, tIdx) => {
                                              const isLastTask = tIdx === goal.tasks.length - 1;
                                              return (
                                                <div key={task.id} className="relative flex items-center pl-6 py-0.5">
                                                  <div 
                                                    className="absolute left-1.5 top-0 w-px bg-[#D4AF37]/45" 
                                                    style={{ height: isLastTask ? '50%' : '100%' }} 
                                                  />
                                                  <div className="absolute left-1.5 top-1/2 w-3.5 h-px bg-[#D4AF37]/45" />

                                                  <div className="flex items-center justify-between p-2 rounded-xl axiom-inset hover:border-[#D4AF37]/60 text-xs w-full relative z-10">
                                                    <button
                                                      onClick={() => onToggleTask(goal.id, task.id)}
                                                      className="flex items-center gap-2.5 flex-1 text-left cursor-pointer min-w-0"
                                                    >
                                                      <div className={task.isCompleted ? 'text-emerald-700 shrink-0' : 'text-[#666666] hover:text-[#A67C00] shrink-0'}>
                                                        {task.isCompleted ? <CheckSquare size={14} /> : <Square size={14} />}
                                                      </div>
                                                      <span className={`truncate ${task.isCompleted ? 'line-through text-[#666666]/65' : 'text-[#171717]'}`}>
                                                        {task.title}
                                                      </span>
                                                    </button>

                                                    <button
                                                      onClick={() => onDeleteTask(goal.id, task.id)}
                                                      className="text-[#666666] hover:text-rose-700 p-1 rounded transition-colors cursor-pointer shrink-0"
                                                      title="Remove"
                                                      aria-label="Remove task"
                                                    >
                                                      <Trash2 size={12} />
                                                    </button>
                                                  </div>
                                                </div>
                                              );
                                            })
                                          )}

                                          <form 
                                            onSubmit={(e) => {
                                              e.preventDefault();
                                              const title = newClarityTask[goal.id]?.trim();
                                              if (!title) return;
                                              onAddTask(goal.id, title);
                                              setNewClarityTask(prev => ({ ...prev, [goal.id]: '' }));
                                            }}
                                            className="flex gap-2 pt-1 pl-6"
                                          >
                                            <input
                                              type="text"
                                              placeholder="Add tactical milestone..."
                                              value={newClarityTask[goal.id] || ''}
                                              onChange={(e) => setNewClarityTask(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                              className="flex-1 px-3 py-1.5 axiom-input rounded-xl text-xs"
                                            />
                                            <button
                                              type="submit"
                                              className="px-3 py-1.5 axiom-btn-secondary text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                              <Plus size={12} />
                                              <span>Add</span>
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-between z-10 max-w-6xl w-full mx-auto"
          >
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#F7E7B0] pb-6 mb-8">
                <div>
                  <button 
                    id="btn-timer-back"
                    onClick={() => {
                      setActiveModule(null);
                      saveTimerState({});
                    }}
                    className="text-xs font-medium text-[#A67C00] hover:text-[#171717] flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
                  >
                    <span>← Return to Overview</span>
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight flex items-center gap-3 text-[#171717]">
                    <Award className="text-[#A67C00]" size={26} />
                    <span>Deep Work Protocol Workspace</span>
                  </h2>
                  <p className="text-sm text-[#666666] mt-1">Custom Pomodoro workspace with live milestone integration</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                {/* Left Panel: Countdown Timer */}
                <div className="lg:col-span-5 axiom-card rounded-2xl p-6 flex flex-col items-center">
                  <span className="text-xs font-semibold text-[#A67C00] mb-6">
                    {timerMode === 'focus' ? 'Deep Focus Interval' : 'Cognitive Recovery'}
                  </span>

                  <div className="relative w-56 h-56 flex items-center justify-center mb-6">
                    <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.28)]" viewBox="0 0 224 224">
                      <circle 
                        cx="112" 
                        cy="112" 
                        r="90" 
                        stroke="#F7E7B0" 
                        strokeWidth="8" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="112" 
                        cy="112" 
                        r="90" 
                        stroke={timerMode === 'focus' ? '#D4AF37' : '#15803d'} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray="565" 
                        strokeDashoffset={565 - (565 * progressPercent) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold font-mono tabular-nums tracking-tight text-[#171717]">
                        {formatTime(remainingSeconds)}
                      </span>
                      <span className="text-xs text-[#666666] mt-1.5 font-medium">
                        {isTimerActive ? 'Running' : 'Paused'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                    <button
                      onClick={handleReset}
                      title="Reset focus"
                      aria-label="Reset focus"
                      className="p-3 axiom-btn-secondary rounded-xl cursor-pointer"
                    >
                      <RotateCcw size={16} />
                    </button>

                    <button
                      onClick={handleStartPause}
                      className={`px-6 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        isTimerActive 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' 
                          : 'axiom-btn-primary'
                      }`}
                    >
                      {isTimerActive ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                      <span>{isTimerActive ? 'Pause Session' : 'Start Focus'}</span>
                    </button>
                  </div>

                  <div className="w-full border-t border-[#F7E7B0] pt-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold text-[#171717] block">Study Block Duration</span>
                        <span className="text-[11px] text-[#666666] block">Length of focus session</span>
                      </div>
                      <div className="flex items-center gap-2 axiom-inset rounded-xl p-1">
                        <button 
                          onClick={() => handleAdjustDuration('focus', false)} 
                          className="px-2.5 py-1 text-[#666666] hover:text-[#171717] transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono tabular-nums font-bold text-[#171717] px-1 w-8 text-center">{timerMinutes}m</span>
                        <button 
                          onClick={() => handleAdjustDuration('focus', true)} 
                          className="px-2.5 py-1 text-[#666666] hover:text-[#171717] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold text-[#171717] block">Recovery Break Duration</span>
                        <span className="text-[11px] text-[#666666] block">Rest between intervals</span>
                      </div>
                      <div className="flex items-center gap-2 axiom-inset rounded-xl p-1">
                        <button 
                          onClick={() => handleAdjustDuration('break', false)} 
                          className="px-2.5 py-1 text-[#666666] hover:text-[#171717] transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono tabular-nums font-bold text-[#171717] px-1 w-8 text-center">{timerBreakMinutes}m</span>
                        <button 
                          onClick={() => handleAdjustDuration('break', true)} 
                          className="px-2.5 py-1 text-[#666666] hover:text-[#171717] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Milestone Target & Metrics */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="axiom-card rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F7E7B0]">
                      <div>
                        <span className="text-xs font-medium text-[#A67C00]">Integrated Task Target</span>
                        <h3 className="text-base font-bold text-[#171717] mt-0.5 font-display">Select Live Milestone</h3>
                      </div>
                      <Clock size={18} className="text-[#A67C00]" />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-[#666666] block mb-1.5">Active Milestone</label>
                        <select
                          value={selectedMilestoneId}
                          onChange={(e) => {
                            setSelectedMilestoneId(e.target.value);
                            saveTimerState({ selectedMilestoneId: e.target.value });
                          }}
                          className="w-full px-4 py-2.5 axiom-input rounded-xl text-xs cursor-pointer"
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
                        <div className="p-4 axiom-inset rounded-xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() => {
                                const parent = goals.find(g => g.tasks.some(t => t.id === selectedMilestone.id));
                                if (parent) {
                                  onToggleTask(parent.id, selectedMilestone.id);
                                }
                              }}
                              className="text-[#666666] hover:text-emerald-700 cursor-pointer shrink-0"
                            >
                              {selectedMilestone.isCompleted ? (
                                <CheckSquare size={18} className="text-emerald-700" />
                              ) : (
                                <Square size={18} />
                              )}
                            </button>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-[#171717] block truncate">{selectedMilestone.title}</span>
                              <span className="text-[11px] text-[#666666] block mt-0.5 truncate">Goal: {selectedMilestone.goalTitle}</span>
                            </div>
                          </div>

                          <span className={`text-xs font-semibold shrink-0 ${
                            selectedMilestone.isCompleted ? 'text-emerald-700' : 'text-[#A67C00]'
                          }`}>
                            {selectedMilestone.isCompleted ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      ) : (
                        <div className="p-6 border border-dashed border-[#F7E7B0] rounded-xl text-center text-xs text-[#666666] leading-relaxed">
                          Select a milestone above to automatically mark it completed when your focus interval finishes.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="axiom-card rounded-2xl p-6">
                    <span className="text-xs font-semibold text-[#171717] block mb-4">Daily Focus Metrics</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="axiom-inset rounded-xl p-4 text-center">
                        <span className="text-xs text-[#666666] block">Completed Sessions</span>
                        <span className="text-3xl font-bold font-display tabular-nums text-[#171717] block mt-1">{completedSessions}</span>
                      </div>

                      <div className="axiom-inset rounded-xl p-4 text-center">
                        <span className="text-xs text-[#666666] block">Total Study Minutes</span>
                        <span className="text-3xl font-bold font-display tabular-nums text-[#A67C00] block mt-1">{totalFocusedMinutes}m</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-[#F7E7B0] flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity size={15} className="text-[#A67C00]" />
                        <span className="text-xs text-[#666666]">Session Alerts</span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSoundEnabled(!soundEnabled);
                            saveTimerState({ soundEnabled: !soundEnabled });
                          }}
                          className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                            soundEnabled 
                              ? 'bg-gradient-to-r from-[#FFF4B0]/65 to-[#FFFDF5] text-[#171717] border-[#D4AF37]' 
                              : 'bg-[#FFFFFF] text-[#666666] border-[#F7E7B0] hover:text-[#171717]'
                          }`}
                        >
                          {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                          <span>Audio alerts</span>
                        </button>

                        <button
                          onClick={requestNotificationPermission}
                          className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                            notificationsEnabled 
                              ? 'bg-gradient-to-r from-[#FFF4B0]/65 to-[#FFFDF5] text-[#171717] border-[#D4AF37]' 
                              : 'bg-[#FFFFFF] text-[#666666] border-[#F7E7B0] hover:text-[#171717]'
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
            className="flex-1 flex flex-col justify-between max-w-6xl w-full mx-auto"
          >
            {/* Hero Section */}
            <div className="my-auto max-w-3xl flex flex-col items-center text-center mx-auto z-10 py-8 md:py-12">
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-semibold tracking-wide text-[#A67C00] mb-4"
              >
                Axiom Focus Methodology
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-display leading-[1.08] tracking-tight mb-6 text-[#171717]"
              >
                Achieve Your <span className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#A67C00] bg-clip-text text-transparent">Ambitions.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#666666] text-base md:text-lg leading-relaxed max-w-2xl mb-10"
              >
                A high-performance environment for deep focus. Bring architectural clarity to your goals, eliminate noise, and measure meaningful daily progress.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
              >
                <button
                  id="btn-overview-start"
                  onClick={onStartBuilding}
                  className="w-full sm:w-auto px-7 py-3.5 axiom-btn-primary text-sm rounded-xl flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Start Building Today</span>
                  <ArrowRight size={17} />
                </button>
                
                <button
                  id="btn-overview-demo"
                  onClick={onViewDemo}
                  className="w-full sm:w-auto px-7 py-3.5 axiom-btn-secondary text-sm rounded-xl flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <Play size={15} className="text-[#A67C00]" />
                  <span>View Planning</span>
                </button>
              </motion.div>
            </div>

            {/* Feature Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10 w-full z-10 border-t border-[#F7E7B0] pt-10">
              <div 
                id="overview-card-roadmap"
                onClick={() => setActiveModule('roadmap')}
                className="axiom-card axiom-card-interactive p-6 rounded-2xl flex flex-col gap-3.5 group cursor-pointer relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/65 border border-[#D4AF37]/50 flex items-center justify-center text-[#A67C00] group-hover:scale-105 transition-transform shadow-xs">
                  <Compass size={20} />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-base font-bold font-display text-[#171717] group-hover:text-[#A67C00] transition-colors">Strategic Roadmap</h3>
                  <span className="text-xs font-medium text-[#666666] group-hover:text-[#A67C00] transition-colors">Open →</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">Map goals into logical nodes. Group milestones and track weighted completion progress as you execute.</p>
              </div>

              <div 
                id="overview-card-clarity"
                onClick={() => setActiveModule('clarity')}
                className="axiom-card axiom-card-interactive p-6 rounded-2xl flex flex-col gap-3.5 group cursor-pointer relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/65 border border-[#D4AF37]/50 flex items-center justify-center text-[#A67C00] group-hover:scale-105 transition-transform shadow-xs">
                  <Shield size={20} />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-base font-bold font-display text-[#171717] group-hover:text-[#A67C00] transition-colors">Architectural Clarity</h3>
                  <span className="text-xs font-medium text-[#666666] group-hover:text-[#A67C00] transition-colors">Open →</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">Structured hierarchy keeps your daily agenda clean and tightly aligned with your core system objectives.</p>
              </div>

              <div 
                id="overview-card-timer"
                onClick={() => setActiveModule('timer')}
                className="axiom-card axiom-card-interactive p-6 rounded-2xl flex flex-col gap-3.5 group cursor-pointer relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/65 border border-[#D4AF37]/50 flex items-center justify-center text-[#A67C00] group-hover:scale-105 transition-transform shadow-xs">
                  <Award size={20} />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <h3 className="text-base font-bold font-display text-[#171717] group-hover:text-[#A67C00] transition-colors">Deep Work Protocol</h3>
                  <span className="text-xs font-medium text-[#666666] group-hover:text-[#A67C00] transition-colors">Open →</span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed">A native Pomodoro timer integrated directly into your workspace keeps you focused on one milestone at a time.</p>
              </div>
            </div>

            <Footer idPrefix="overview" onOpenInfo={onOpenInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
