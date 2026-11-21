import React, { useState } from 'react';
import { 
  TrendingUp, 
  MoreHorizontal, 
  ArrowUpRight, 
  Trophy, 
  Sparkles, 
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
  const [activeDropdownGoalId, setActiveDropdownGoalId] = useState<string | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGoalForDetails, setSelectedGoalForDetails] = useState<Goal | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<Goal | null>(null);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateOverallProgress = () => {
    if (goals.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;

    goals.forEach(goal => {
      if (goal.tasks.length > 0) {
        totalTasks += goal.tasks.length;
        completedTasks += goal.tasks.filter(t => t.isCompleted).length;
      } else {
        totalTasks += 1;
        if (goal.status === 'DONE') completedTasks += 1;
      }
    });

    return Math.round((completedTasks / totalTasks) * 100);
  };

  const calculateActiveFocusCount = () => {
    return goals.filter(g => g.status === 'IN_PROGRESS').length;
  };

  const overallProgress = calculateOverallProgress();
  const activeFocusCount = calculateActiveFocusCount();

  const getCategoryTextColor = (category: GoalCategory) => {
    switch (category) {
      case 'PERSONAL':
        return 'text-[#00A3FF]';
      case 'FITNESS':
        return 'text-sky-400';
      case 'BUSINESS':
        return 'text-indigo-400';
      case 'ACADEMIC':
        return 'text-emerald-400';
      case 'LIFESTYLE':
        return 'text-rose-400';
    }
  };

  const getStatusText = (status: GoalStatus) => {
    switch (status) {
      case 'DONE':
        return <span className="text-emerald-400 font-semibold">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="text-[#00A3FF] font-semibold">Active</span>;
      case 'EXPIRED':
        return <span className="text-rose-400 font-semibold">Expired</span>;
    }
  };

  return (
    <div id="dashboard-tab" className="flex-1 overflow-y-auto text-[#FFFFFF] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[#1D3555] pb-6">
          <span className="text-xs font-medium text-[#00A3FF] block mb-1">Dashboard</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-[#FFFFFF]">
            {getGreeting()}, <span className="text-[#00A3FF]">{profile.firstName || 'Aamina'}.</span>
          </h2>
        </div>

        {/* Summary KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Overall Progress */}
          <div className="md:col-span-2 axiom-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0066FF]/22 transition-all" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-xs font-medium text-[#A8B8CC]">Overall Progress</span>
              <div className="text-[#00A3FF] bg-[#0066FF]/15 border border-[#00A3FF]/30 p-2 rounded-xl">
                <TrendingUp size={16} />
              </div>
            </div>
            
            <div className="flex items-baseline gap-3 mb-4 relative z-10">
              <span className="text-4xl md:text-5xl font-bold font-display tabular-nums text-[#FFFFFF]">{overallProgress}%</span>
              <span className="text-sm text-[#A8B8CC]">of strategic objectives completed</span>
            </div>

            <div className="w-full bg-[#07111F] h-2.5 rounded-full overflow-hidden border border-[#1D3555] relative z-10">
              <motion.div 
                className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] h-full rounded-full shadow-[0_0_12px_rgba(0,163,255,0.45)]"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 16 }}
              />
            </div>
          </div>

          {/* Card 2: Active Focus */}
          <div className="axiom-card rounded-2xl p-6 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#00A3FF]/12 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00A3FF]/20 transition-all" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-xs font-medium text-[#A8B8CC]">Active Focus</span>
              <div className="text-[#00A3FF] bg-[#0066FF]/15 border border-[#00A3FF]/30 p-2 rounded-xl">
                <Sparkles size={16} />
              </div>
            </div>
            
            <div className="flex flex-col relative z-10">
              <span className="text-4xl md:text-5xl font-bold font-display tabular-nums text-[#00A3FF]">{activeFocusCount}</span>
              <span className="text-sm text-[#A8B8CC] mt-1.5">Active goals in progress</span>
            </div>
          </div>
        </div>

        {/* Section: Active Goals */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold font-display text-[#FFFFFF] flex items-center gap-2.5">
              <span>Active Goals</span>
              <span className="text-xs font-mono tabular-nums text-[#00A3FF]">({goals.length})</span>
            </h3>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-[#00A3FF] hover:text-[#FFFFFF] flex items-center gap-1 group transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="axiom-card rounded-2xl p-12 text-center text-[#A8B8CC]">
              <Trophy size={40} className="mx-auto text-[#1D3555] mb-3" />
              <p className="text-base font-semibold text-[#FFFFFF]">No goals set up yet</p>
              <p className="text-xs text-[#A8B8CC] mt-1">Establish your first strategic objective to start tracking milestones.</p>
              <button 
                onClick={() => setActiveTab('goals')}
                className="mt-5 px-4 py-2 axiom-btn-secondary text-xs rounded-xl cursor-pointer"
              >
                Create your first goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.slice(0, 6).map((goal) => {
                const totalTasks = goal.tasks.length;
                const completedTasks = goal.tasks.filter(t => t.isCompleted).length;
                const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);

                return (
                  <div
                    key={goal.id}
                    className="axiom-card axiom-card-interactive rounded-2xl p-5 relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Metadata Row + Menu */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-xs min-w-0">
                          <span className={`font-semibold capitalize ${getCategoryTextColor(goal.category)}`}>
                            {goal.category.toLowerCase()}
                          </span>
                          <span className="text-[#1D3555]" aria-hidden="true">·</span>
                          {getStatusText(goal.status)}
                        </div>
                        
                        <div className="relative">
                          <button 
                            onClick={() => {
                              setActiveDropdownGoalId(activeDropdownGoalId === goal.id ? null : goal.id);
                            }}
                            title="Options Menu"
                            aria-label="Goal options menu"
                            className="text-[#A8B8CC] hover:text-[#FFFFFF] hover:bg-[#0B172A] p-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {activeDropdownGoalId === goal.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setActiveDropdownGoalId(null)} 
                              />
                              <div 
                                id={`goal-menu-${goal.id}`}
                                className="absolute right-0 top-full mt-1.5 w-48 axiom-modal-panel rounded-xl py-1.5 z-40"
                              >
                                <button
                                  id={`btn-edit-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    handleOpenEditModal(goal);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#101F35] hover:text-[#00A3FF] transition-colors flex items-center gap-2.5 text-[#FFFFFF] cursor-pointer"
                                >
                                  <Edit size={13} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  id={`btn-complete-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    onUpdateGoalStatus(goal.id, 'DONE');
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#101F35] hover:text-emerald-400 transition-colors flex items-center gap-2.5 text-[#FFFFFF] cursor-pointer"
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
                                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#101F35] hover:text-[#00A3FF] transition-colors flex items-center gap-2.5 text-[#FFFFFF] cursor-pointer"
                                >
                                  <Info size={13} />
                                  <span>Details</span>
                                </button>
                                <div className="my-1 border-t border-[#1D3555]" />
                                <button
                                  id={`btn-delete-${goal.id}`}
                                  onClick={() => {
                                    setActiveDropdownGoalId(null);
                                    onDeleteGoal(goal.id);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-rose-500/10 text-rose-400 transition-colors flex items-center gap-2.5 cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <h4 className="text-base font-bold font-display text-[#FFFFFF] mb-1.5 group-hover:text-[#00A3FF] transition-colors">{goal.title}</h4>
                      <p className="text-xs text-[#A8B8CC] leading-relaxed mb-5 line-clamp-2">{goal.description || 'No description provided.'}</p>
                    </div>

                    {/* Footer Progress */}
                    <div className="border-t border-[#1D3555] pt-3.5 mt-2">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-[#A8B8CC] font-medium">Progress</span>
                        <span className="text-[#00A3FF] font-semibold font-mono tabular-nums">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-[#07111F] h-1.5 rounded-full overflow-hidden border border-[#1D3555]">
                        <motion.div 
                          className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ type: 'spring', stiffness: 80, damping: 16 }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#A8B8CC] mt-2.5">
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

      <div className="max-w-6xl w-full mx-auto">
        <Footer idPrefix="dashboard" onOpenInfo={onOpenInfo} />
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedGoalForDetails && (
        <div id="goal-details-modal-backdrop" className="fixed inset-0 bg-[#07111F]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="goal-details-modal-content" 
            className="w-full max-w-lg axiom-modal-panel rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#0066FF]/12 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#1D3555] pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="text-[#00A3FF] bg-[#0066FF]/15 border border-[#00A3FF]/30 p-2 rounded-xl">
                  <Target size={18} />
                </div>
                <div>
                  <h3 id="goal-details-title" className="text-lg font-bold font-display text-[#FFFFFF]">Goal Details</h3>
                  <span className="text-xs text-[#A8B8CC] block mt-0.5">Strategic Information</span>
                </div>
              </div>
              <button 
                id="btn-close-details"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedGoalForDetails(null);
                }}
                aria-label="Close goal details"
                className="p-2 rounded-lg text-[#A8B8CC] hover:text-[#FFFFFF] hover:bg-[#101F35] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Project Name</label>
                  <div id="details-project-name" className="text-xs font-semibold text-[#FFFFFF] axiom-inset rounded-xl px-4 py-2.5 truncate">
                    {selectedGoalForDetails.projectName || selectedGoalForDetails.category}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Goal Name</label>
                  <div id="details-goal-name" className="text-xs font-semibold text-[#FFFFFF] axiom-inset rounded-xl px-4 py-2.5 truncate">
                    {selectedGoalForDetails.title}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Description</label>
                <div id="details-description" className="text-xs text-[#A8B8CC] axiom-inset rounded-xl px-4 py-2.5 whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed">
                  {selectedGoalForDetails.description || 'No description provided.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Category</label>
                  <div id="details-category" className="text-xs font-semibold text-[#00A3FF] axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.category}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Deadline</label>
                  <div id="details-deadline" className="text-xs font-mono tabular-nums text-[#A8B8CC] axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.dueDate ? new Date(selectedGoalForDetails.dueDate).toLocaleDateString() : 'None'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Progress</label>
                  <div id="details-progress" className="text-xs font-semibold font-mono tabular-nums text-emerald-400 axiom-inset rounded-xl px-4 py-2">
                    {(() => {
                      const total = selectedGoalForDetails.tasks.length;
                      const completed = selectedGoalForDetails.tasks.filter(t => t.isCompleted).length;
                      return total > 0 ? `${Math.round((completed / total) * 100)}%` : (selectedGoalForDetails.status === 'DONE' ? '100%' : '0%');
                    })()}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Created</label>
                  <div id="details-created-at" className="text-xs font-mono tabular-nums text-[#A8B8CC] axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.createdAt || '2026-07-06'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Status</label>
                  <div id="details-status" className="text-xs font-semibold text-center axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.status === 'DONE' ? (
                      <span className="text-emerald-400">Completed</span>
                    ) : selectedGoalForDetails.status === 'EXPIRED' ? (
                      <span className="text-rose-400">Expired</span>
                    ) : (
                      <span className="text-[#00A3FF]">Active</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#A8B8CC] block mb-1">Milestones ({selectedGoalForDetails.tasks.length})</label>
                <div id="details-milestones" className="axiom-inset rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                  {selectedGoalForDetails.tasks.length === 0 ? (
                    <span className="text-xs text-[#A8B8CC]/70 italic">No milestones defined.</span>
                  ) : (
                    selectedGoalForDetails.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2.5 text-xs text-[#FFFFFF]">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.isCompleted ? 'bg-emerald-400' : 'bg-[#00A3FF]'}`} />
                        <span className={task.isCompleted ? 'line-through text-[#A8B8CC]/60' : ''}>{task.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#1D3555] mt-6 relative z-10">
              <button
                id="btn-close-details-footer"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedGoalForDetails(null);
                }}
                className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedGoalForEdit && (
        <div id="goal-edit-modal-backdrop" className="fixed inset-0 bg-[#07111F]/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="goal-edit-modal-content" 
            className="w-full max-w-xl axiom-modal-panel rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#0066FF]/12 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#1D3555] pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="text-[#00A3FF] bg-[#0066FF]/15 border border-[#00A3FF]/30 p-2 rounded-xl">
                  <Target size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-[#FFFFFF]">Edit Strategic Node</h3>
                  <span className="text-xs text-[#A8B8CC] block mt-0.5">Modify Goal Architecture</span>
                </div>
              </div>
              <button 
                id="btn-close-edit"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedGoalForEdit(null);
                }}
                aria-label="Close edit modal"
                className="p-2 rounded-lg text-[#A8B8CC] hover:text-[#FFFFFF] hover:bg-[#101F35] transition-colors cursor-pointer"
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
            }} className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-medium text-[#A8B8CC] block mb-1.5">Project Name</label>
                <input
                  id="edit-goal-project-name"
                  type="text"
                  placeholder="e.g. Project Axiom, Fitness Tracker, Self Care"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#A8B8CC] block mb-1.5">Objective Title</label>
                <input
                  id="edit-goal-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#A8B8CC] block mb-1.5">Description & Outcome Metrics</label>
                <textarea
                  id="edit-goal-description"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1.5">Blueprint Category</label>
                  <select
                    id="edit-goal-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as GoalCategory)}
                    className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm cursor-pointer"
                  >
                    <option value="PERSONAL">Personal</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="BUSINESS">Business</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#A8B8CC] block mb-1.5">Target Completion Date</label>
                  <input
                    id="edit-goal-due-date"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#A8B8CC] block mb-1">
                  Milestones (Tasks)
                </label>
                <span className="text-[11px] text-[#A8B8CC]/80 block mb-1.5 leading-tight">
                  Modify or add tasks separated by a comma or newline.
                </span>
                <textarea
                  id="edit-goal-milestones"
                  rows={2}
                  value={editMilestones}
                  onChange={(e) => setEditMilestones(e.target.value)}
                  className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1D3555]">
                <button
                  id="btn-edit-cancel"
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedGoalForEdit(null);
                  }}
                  className="px-4 py-2 axiom-btn-secondary rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="btn-edit-save"
                  type="submit"
                  className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
