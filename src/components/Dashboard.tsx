import React, { useState } from 'react';
import { 
  TrendingUp, 
  MoreHorizontal, 
  ArrowUpRight, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Info, 
  X, 
  Target 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Goal, GoalCategory, GoalStatus, UserProfile, ActiveTab } from '../types';
import Footer from './Footer';

interface DashboardProps {
  goals: Goal[];
  profile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onUpdateGoalStatus: (id: string, status: GoalStatus) => void;
  onDeleteGoal: (id: string) => void;
  onEditGoal: (
    id: string,
    title: string,
    description: string,
    category: GoalCategory,
    dueDate: string,
    milestones: string[],
    projectName?: string
  ) => void;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

export default function Dashboard({ 
  goals, 
  profile, 
  setActiveTab, 
  onUpdateGoalStatus, 
  onDeleteGoal,
  onEditGoal,
  onOpenInfo 
}: DashboardProps) {
  // Dropdown / Modal states
  const [activeDropdownGoalId, setActiveDropdownGoalId] = useState<string | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGoalForDetails, setSelectedGoalForDetails] = useState<Goal | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<Goal | null>(null);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<GoalCategory>('PERSONAL');
  const [editDueDate, setEditDueDate] = useState('');
  const [editMilestones, setEditMilestones] = useState('');
  const [editProjectName, setEditProjectName] = useState('');

  const handleOpenDetailsModal = (goal: Goal) => {
    setSelectedGoalForDetails(goal);
    setIsDetailsModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setSelectedGoalForEdit(goal);
    setEditTitle(goal.title);
    setEditDescription(goal.description || '');
    setEditCategory(goal.category);
    setEditDueDate(goal.dueDate ? goal.dueDate.split('T')[0] : '');
    setEditMilestones(goal.tasks.map((t) => t.title).join(', '));
    setEditProjectName(goal.projectName || goal.category);
    setIsEditModalOpen(true);
  };
  // Determine greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate overall progress across all goals
  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;

    goals.forEach(goal => {
      if (goal.tasks.length > 0) {
        totalTasks += goal.tasks.length;
        completedTasks += goal.tasks.filter(t => t.isCompleted).length;
      } else {
        // If no tasks, a completed goal counts as 1/1, in progress as 0/1
        totalTasks += 1;
        if (goal.status === 'DONE') completedTasks += 1;
      }
    });

    return Math.round((completedTasks / totalTasks) * 100);
  };

  // Calculate count of active goals
  const calculateActiveFocusCount = () => {
    return goals.filter(g => g.status === 'IN_PROGRESS').length;
  };

  const overallProgress = calculateOverallProgress();
  const activeFocusCount = calculateActiveFocusCount();

  const getCategoryColor = (category: GoalCategory) => {
    switch (category) {
      case 'PERSONAL':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'FITNESS':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'BUSINESS':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'ACADEMIC':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'LIFESTYLE':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
    }
  };

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'DONE':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">DONE</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">ACTIVE</span>;
      case 'EXPIRED':
        return <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">EXPIRED</span>;
    }
  };

  return (
    <div id="dashboard-tab" className="flex-1 overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 flex flex-col justify-between min-h-screen">
      <div>
        {/* Breadcrumb Header */}
        <div className="mb-6">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold block mb-1">DASHBOARD</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">
            {getGreeting()}, <span className="text-[#e0a96d]">{profile.firstName || 'Aamina'}.</span>
          </h2>
        </div>

        {/* Dashboard Grid Card (Overview progress vs Strategic nodes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Overall Progress */}
          <div className="md:col-span-2 bg-[#0b1d31] border border-[#142944] rounded-2xl p-6 relative overflow-hidden group hover:border-[#e0a96d]/30 transition-all duration-300 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0a96d]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#e0a96d]/10 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">OVERALL PROGRESS</span>
              <div className="text-[#e0a96d] bg-[#e0a96d]/10 p-1.5 rounded-lg">
                <TrendingUp size={16} />
              </div>
            </div>
            
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-4xl md:text-5xl font-extrabold font-display text-white">{overallProgress}%</span>
              <span className="text-xs text-gray-400 font-medium">Of strategic objectives completed.</span>
            </div>

            {/* Slider progress bar */}
            <div className="w-full bg-[#051120] h-2.5 rounded-full overflow-hidden border border-[#1a2c42]">
              <motion.div 
                className="bg-[#e0a96d] h-full rounded-full shadow-[0_0_12px_rgba(224,169,109,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              />
            </div>
          </div>

          {/* Card 2: Active Focus */}
          <div className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">ACTIVE FOCUS</span>
              <div className="text-blue-400 bg-blue-500/10 p-1.5 rounded-lg">
                <Sparkles size={16} />
              </div>
            </div>
            
            <div className="flex flex-col mb-1">
              <span className="text-4xl md:text-5xl font-extrabold font-display text-[#e0a96d]">{activeFocusCount}</span>
              <span className="text-xs text-gray-400 font-medium mt-1">Active goals in progress.</span>
            </div>
          </div>
        </div>

        {/* Section: Active Goals */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <span>Active Goals</span>
              <span className="text-xs font-mono bg-[#0b1d31] border border-[#142944] text-[#e0a96d] px-2 py-0.5 rounded-md">{goals.length}</span>
            </h3>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-bold text-[#e0a96d] hover:text-[#f3bf84] flex items-center gap-1 group transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Goal Cards Grid matching the pictures */}
          {goals.length === 0 ? (
            <div className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-12 text-center text-gray-400">
              <Trophy size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-sm font-semibold">No goals set up yet.</p>
              <button 
                onClick={() => setActiveTab('goals')}
                className="mt-4 text-xs font-bold text-[#e0a96d] hover:underline"
              >
                Create your first goal now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goals.slice(0, 6).map((goal) => {
                const totalTasks = goal.tasks.length;
                const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
                const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);

                return (
                  <div
                    key={goal.id}
                    className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-5 hover:border-[#e0a96d]/20 transition-all duration-300 relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-1.5 items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          {getStatusBadge(goal.status)}
                        </div>
                        
                        {/* Dropdown triggers or ellipses */}
                        <div className="relative">
                          <button 
                            onClick={() => {
                              setActiveDropdownGoalId(activeDropdownGoalId === goal.id ? null : goal.id);
                            }}
                            title={`Options Menu`}
                            className="text-gray-500 hover:text-gray-300 hover:bg-[#10243d] p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {activeDropdownGoalId === goal.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setActiveDropdownGoalId(null)} 
                              />
                              <div 
                                id={`goal-menu-${goal.id}`}
                                className="absolute right-0 top-full mt-1 w-44 bg-[#0b1d31] border border-[#142944] rounded-xl shadow-2xl py-1.5 z-40"
                              >
                                <button
                                  id={`btn-edit-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    handleOpenEditModal(goal);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#10243d] hover:text-[#e0a96d] transition-colors flex items-center gap-2 text-gray-300 cursor-pointer"
                                >
                                  <Edit size={13} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  id={`btn-delete-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    onDeleteGoal(goal.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#10243d] hover:text-[#ef4444] transition-colors flex items-center gap-2 text-gray-300 cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                                <button
                                  id={`btn-complete-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    onUpdateGoalStatus(goal.id, 'DONE');
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#10243d] hover:text-emerald-400 transition-colors flex items-center gap-2 text-gray-300 cursor-pointer"
                                >
                                  <CheckCircle size={13} />
                                  <span>Mark as Completed</span>
                                </button>
                                <button
                                  id={`btn-details-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    handleOpenDetailsModal(goal);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#10243d] hover:text-blue-400 transition-colors flex items-center gap-2 text-gray-300 cursor-pointer"
                                >
                                  <Info size={13} />
                                  <span>Details</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-base font-bold text-white mb-1 group-hover:text-[#e0a96d] transition-colors">{goal.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{goal.description || 'No description provided.'}</p>
                    </div>

                    {/* Footer Progress inside card */}
                    <div className="border-t border-[#12243d] pt-3 mt-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mb-1.5">
                        <span>PROGRESS</span>
                        <span className="text-[#e0a96d] font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-[#051120] h-1.5 rounded-full overflow-hidden border border-[#1a2c42]/40">
                        <motion.div 
                          className="bg-[#e0a96d] h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 mt-2">
                        <span>Tasks: {completedTasks}/{totalTasks}</span>
                        <span>Due: {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'None'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Corporate Academic Footer credits exactly matching Screenshot 1 footer */}
      <Footer idPrefix="dashboard" onOpenInfo={onOpenInfo} />

      {/* Details Modal */}
      {isDetailsModalOpen && selectedGoalForDetails && (
        <div id="goal-details-modal-backdrop" className="fixed inset-0 bg-[#050c16]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            id="goal-details-modal-content" 
            className="w-full max-w-lg bg-[#0b1d31] border border-[#142944] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#12243d] pb-4">
              <div className="flex items-center gap-2">
                <div className="text-[#e0a96d] bg-[#e0a96d]/10 p-1.5 rounded-lg">
                  <Target size={18} />
                </div>
                <div>
                  <h3 id="goal-details-title" className="text-lg font-bold font-display text-white">Goal Details</h3>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-semibold mt-0.5">Strategic Information</span>
                </div>
              </div>
              <button 
                id="btn-close-details"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedGoalForDetails(null);
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#10243d] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">PROJECT NAME</label>
                  <div id="details-project-name" className="text-xs font-semibold text-white bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2.5 truncate">
                    {selectedGoalForDetails.projectName || selectedGoalForDetails.category}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">GOAL NAME</label>
                  <div id="details-goal-name" className="text-xs font-semibold text-white bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2.5 truncate">
                    {selectedGoalForDetails.title}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">DESCRIPTION</label>
                <div id="details-description" className="text-xs text-gray-300 bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2.5 whitespace-pre-wrap max-h-24 overflow-y-auto">
                  {selectedGoalForDetails.description || 'No description provided.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">CATEGORY</label>
                  <div id="details-category" className="text-xs font-mono font-semibold text-[#e0a96d] bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2">
                    {selectedGoalForDetails.category}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">DEADLINE</label>
                  <div id="details-deadline" className="text-xs font-mono text-gray-300 bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2">
                    {selectedGoalForDetails.dueDate ? new Date(selectedGoalForDetails.dueDate).toLocaleDateString() : 'None'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">PROGRESS</label>
                  <div id="details-progress" className="text-xs font-semibold text-emerald-400 bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2">
                    {(() => {
                      const total = selectedGoalForDetails.tasks.length;
                      const completed = selectedGoalForDetails.tasks.filter(t => t.isCompleted).length;
                      return total > 0 ? `${Math.round((completed / total) * 100)}%` : (selectedGoalForDetails.status === 'DONE' ? '100%' : '0%');
                    })()}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">CREATION DATE</label>
                  <div id="details-created-at" className="text-xs font-mono text-gray-300 bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2">
                    {selectedGoalForDetails.createdAt || '2026-07-06'}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">CURRENT STATUS</label>
                  <div id="details-status" className="text-xs font-bold text-center bg-[#051120] border border-[#1a2c42] rounded-xl px-4 py-2">
                    {selectedGoalForDetails.status === 'DONE' ? (
                      <span className="text-emerald-400">Completed</span>
                    ) : selectedGoalForDetails.status === 'EXPIRED' ? (
                      <span className="text-red-400">Expired</span>
                    ) : (
                      <span className="text-blue-400">Active</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">MILESTONES ({selectedGoalForDetails.tasks.length})</label>
                <div id="details-milestones" className="bg-[#051120] border border-[#1a2c42] rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                  {selectedGoalForDetails.tasks.length === 0 ? (
                    <span className="text-xs text-gray-500 italic">No milestones defined.</span>
                  ) : (
                    selectedGoalForDetails.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2 text-xs text-gray-300">
                        <div className={`w-1.5 h-1.5 rounded-full ${task.isCompleted ? 'bg-emerald-500' : 'bg-[#e0a96d]'}`} />
                        <span className={task.isCompleted ? 'line-through text-gray-500' : ''}>{task.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#12243d] mt-6">
              <button
                id="btn-close-details-footer"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedGoalForDetails(null);
                }}
                className="px-5 py-2.5 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedGoalForEdit && (
        <div id="goal-edit-modal-backdrop" className="fixed inset-0 bg-[#050c16]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            id="goal-edit-modal-content" 
            className="w-full max-w-xl bg-[#0b1d31] border border-[#142944] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0a96d]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#12243d] pb-4">
              <div className="flex items-center gap-2">
                <div className="text-[#e0a96d] bg-[#e0a96d]/10 p-1.5 rounded-lg">
                  <Target size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white">Edit Strategic Node</h3>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-semibold mt-0.5">Modify Goal Architecture</span>
                </div>
              </div>
              <button 
                id="btn-close-edit"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedGoalForEdit(null);
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#10243d] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editTitle.trim()) return;
              const milestoneArray = editMilestones
                .split(/[,\n]/)
                .map((m) => m.trim())
                .filter((m) => m.length > 0);
              
              onEditGoal(
                selectedGoalForEdit.id,
                editTitle.trim(),
                editDescription.trim(),
                editCategory,
                editDueDate,
                milestoneArray,
                editProjectName.trim() || undefined
              );

              setIsEditModalOpen(false);
              setSelectedGoalForEdit(null);
            }} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">PROJECT NAME</label>
                <input
                  id="edit-goal-project-name"
                  type="text"
                  placeholder="e.g. Project Axiom, Fitness Tracker, Self Care"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">OBJECTIVE TITLE (Short name)</label>
                <input
                  id="edit-goal-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">DESCRIPTION / OUTCOME METRICS</label>
                <textarea
                  id="edit-goal-description"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">BLUEPRINT CATEGORY</label>
                  <select
                    id="edit-goal-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as GoalCategory)}
                    className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-gray-300 focus:outline-none focus:border-[#e0a96d]/50 transition-colors cursor-pointer"
                  >
                    <option value="PERSONAL">PERSONAL</option>
                    <option value="FITNESS">FITNESS</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="ACADEMIC">ACADEMIC</option>
                    <option value="LIFESTYLE">LIFESTYLE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">TARGET COMPLETION DATE</label>
                  <input
                    id="edit-goal-due-date"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">
                  MILESTONES (Tasks)
                </label>
                <span className="text-[9px] text-gray-500 block mb-1.5 font-medium leading-tight">
                  Modify or add tasks separated by a comma or newline.
                </span>
                <textarea
                  id="edit-goal-milestones"
                  rows={2}
                  value={editMilestones}
                  onChange={(e) => setEditMilestones(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#12243d]">
                <button
                  id="btn-edit-cancel"
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedGoalForEdit(null);
                  }}
                  className="px-4 py-2 bg-transparent text-gray-400 hover:text-white hover:bg-[#10243d] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  id="btn-edit-save"
                  type="submit"
                  className="px-5 py-2.5 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>SAVE CHANGES</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
