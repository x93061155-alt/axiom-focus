import React, { useState } from 'react';
import { Target, Search, Plus, Trash2, CheckCircle, ArrowRight, MoreHorizontal, Edit, Info, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Goal, GoalCategory, GoalStatus } from '../types';
import Footer from './Footer';

interface MyGoalsProps {
  goals: Goal[];
  onOpenNewGoalModal: () => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoalStatus: (id: string, status: GoalStatus) => void;
  onSelectGoalForPlanning: (goalId: string) => void;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
  onEditGoal: (
    id: string,
    title: string,
    description: string,
    category: GoalCategory,
    dueDate: string,
    milestones: string[],
    projectName?: string
  ) => void;
}

export default function MyGoals({
  goals,
  onOpenNewGoalModal,
  onDeleteGoal,
  onUpdateGoalStatus,
  onSelectGoalForPlanning,
  onOpenInfo,
  onEditGoal,
}: MyGoalsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'ALL'>('ALL');

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

  const filteredGoals = goals.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (g.projectName && g.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const formatCategoryLabel = (cat: string) => cat.charAt(0) + cat.slice(1).toLowerCase();

  return (
    <div id="goals-tab" className="flex-1 overflow-y-auto text-[#171717] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header Title */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F7E7B0] pb-6">
          <div>
            <span className="text-xs font-semibold text-[#A67C00] block mb-1">Strategic Objectives</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-[#171717]">My Goals</h2>
          </div>
          <button
            onClick={onOpenNewGoalModal}
            className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Goal</span>
          </button>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="axiom-card rounded-2xl p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A67C00]">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Search goals by title or project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 axiom-input rounded-xl text-sm"
            />
          </div>

          {/* Segmented Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 axiom-inset p-1 rounded-xl">
            {(['ALL', 'PERSONAL', 'FITNESS', 'BUSINESS', 'ACADEMIC', 'LIFESTYLE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] text-[#171717] font-semibold shadow-sm'
                    : 'text-[#666666] hover:text-[#171717] hover:bg-[#FFFFFF]'
                }`}
              >
                {cat === 'ALL' ? 'All' : formatCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="axiom-card rounded-2xl p-14 text-center text-[#666666]">
            <Target size={44} className="mx-auto text-[#D4AF37] mb-4" />
            <p className="text-base font-semibold text-[#171717] mb-1.5">No objectives match your criteria</p>
            <p className="text-xs text-[#666666] max-w-md mx-auto">Create a new strategic objective or clear your active filters to view all blueprints.</p>
            {(searchTerm || selectedCategory !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                }}
                className="mt-5 px-4 py-2 axiom-btn-secondary text-xs rounded-xl cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => {
              const totalTasks = goal.tasks.length;
              const completedTasks = goal.tasks.filter((t) => t.isCompleted).length;
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (goal.status === 'DONE' ? 100 : 0);

              return (
                <div
                  key={goal.id}
                  className="axiom-card axiom-card-interactive rounded-2xl p-6 relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`font-semibold capitalize ${getCategoryTextColor(goal.category)}`}>
                          {goal.category.toLowerCase()}
                        </span>
                        <span className="text-[#D4AF37]" aria-hidden="true">·</span>
                        <span className={goal.status === 'DONE' ? 'text-emerald-700 font-semibold' : goal.status === 'EXPIRED' ? 'text-rose-700 font-semibold' : 'text-[#666666]'}>
                          {goal.status === 'DONE' ? 'Completed' : goal.status === 'EXPIRED' ? 'Expired' : 'Active'}
                        </span>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setActiveDropdownGoalId(activeDropdownGoalId === goal.id ? null : goal.id);
                          }}
                          title="Options Menu"
                          aria-label="Goal options menu"
                          className="text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5] p-1.5 rounded-lg transition-colors cursor-pointer"
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
                              id={`goals-menu-${goal.id}`}
                              className="absolute right-0 top-full mt-1.5 w-48 axiom-modal-panel rounded-xl py-1.5 z-40"
                            >
                              <button
                                id={`btn-goals-edit-${goal.id}`}
                                onClick={() => {
                                  setActiveDropdownGoalId(null);
                                  handleOpenEditModal(goal);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#FFFDF5] hover:text-[#A67C00] transition-colors flex items-center gap-2.5 text-[#171717] cursor-pointer"
                              >
                                <Edit size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                id={`btn-goals-complete-${goal.id}`}
                                onClick={() => {
                                  setActiveDropdownGoalId(null);
                                  onUpdateGoalStatus(goal.id, goal.status === 'DONE' ? 'IN_PROGRESS' : 'DONE');
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#FFFDF5] hover:text-emerald-700 transition-colors flex items-center gap-2.5 text-[#171717] cursor-pointer"
                              >
                                <CheckCircle size={13} />
                                <span>{goal.status === 'DONE' ? 'Mark In Progress' : 'Mark Complete'}</span>
                              </button>
                              <button
                                id={`btn-goals-details-${goal.id}`}
                                onClick={() => {
                                  setActiveDropdownGoalId(null);
                                  handleOpenDetailsModal(goal);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#FFFDF5] hover:text-[#A67C00] transition-colors flex items-center gap-2.5 text-[#171717] cursor-pointer"
                              >
                                <Info size={13} />
                                <span>Details</span>
                              </button>
                              <div className="my-1 border-t border-[#F7E7B0]" />
                              <button
                                id={`btn-goals-delete-${goal.id}`}
                                onClick={() => {
                                  setActiveDropdownGoalId(null);
                                  onDeleteGoal(goal.id);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-rose-50 text-rose-700 transition-colors flex items-center gap-2.5 cursor-pointer"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-display text-[#171717] mb-2 group-hover:text-[#A67C00] transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-[#666666] leading-relaxed mb-6 line-clamp-3">
                      {goal.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Progress & Action Footer */}
                  <div className="border-t border-[#F7E7B0] pt-4 mt-auto">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-[#666666] font-medium">Progress</span>
                      <span className="text-[#A67C00] font-semibold font-mono tabular-nums">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#FAFAFA] h-2 rounded-full overflow-hidden border border-[#F7E7B0] mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-[#A67C00] via-[#D4AF37] to-[#FFD700] h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
                      />
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-mono tabular-nums text-[#666666]">
                        {completedTasks}/{totalTasks} milestones
                      </span>
                      <button
                        onClick={() => onSelectGoalForPlanning(goal.id)}
                        className="text-xs font-semibold text-[#A67C00] hover:text-[#171717] flex items-center gap-1 group/btn cursor-pointer whitespace-nowrap"
                      >
                        <span>Plan Tasks</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedGoalForDetails && (
        <div id="goal-details-modal-backdrop" className="fixed inset-0 bg-[#171717]/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="goal-details-modal-content" 
            className="w-full max-w-lg axiom-modal-panel rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#F7E7B0] pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="text-[#A67C00] bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/65 border border-[#D4AF37]/50 p-2 rounded-xl shadow-sm">
                  <Target size={18} />
                </div>
                <div>
                  <h3 id="goal-details-title" className="text-lg font-bold font-display text-[#171717]">Goal Details</h3>
                  <span className="text-xs text-[#666666] block mt-0.5">Strategic Information</span>
                </div>
              </div>
              <button 
                id="btn-close-details"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedGoalForDetails(null);
                }}
                aria-label="Close goal details"
                className="p-2 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Project Name</label>
                  <div id="details-project-name" className="text-xs font-semibold text-[#171717] axiom-inset rounded-xl px-4 py-2.5 truncate">
                    {selectedGoalForDetails.projectName || selectedGoalForDetails.category}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Goal Name</label>
                  <div id="details-goal-name" className="text-xs font-semibold text-[#171717] axiom-inset rounded-xl px-4 py-2.5 truncate">
                    {selectedGoalForDetails.title}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#666666] block mb-1">Description</label>
                <div id="details-description" className="text-xs text-[#666666] axiom-inset rounded-xl px-4 py-2.5 whitespace-pre-wrap max-h-24 overflow-y-auto leading-relaxed">
                  {selectedGoalForDetails.description || 'No description provided.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Category</label>
                  <div id="details-category" className="text-xs font-semibold text-[#A67C00] axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.category}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Deadline</label>
                  <div id="details-deadline" className="text-xs font-mono tabular-nums text-[#666666] axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.dueDate ? new Date(selectedGoalForDetails.dueDate).toLocaleDateString() : 'None'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Progress</label>
                  <div id="details-progress" className="text-xs font-semibold font-mono tabular-nums text-emerald-700 axiom-inset rounded-xl px-4 py-2">
                    {(() => {
                      const total = selectedGoalForDetails.tasks.length;
                      const completed = selectedGoalForDetails.tasks.filter(t => t.isCompleted).length;
                      return total > 0 ? `${Math.round((completed / total) * 100)}%` : (selectedGoalForDetails.status === 'DONE' ? '100%' : '0%');
                    })()}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Created</label>
                  <div id="details-created-at" className="text-xs font-mono tabular-nums text-[#666666] axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.createdAt || '2026-07-06'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#666666] block mb-1">Status</label>
                  <div id="details-status" className="text-xs font-semibold text-center axiom-inset rounded-xl px-4 py-2">
                    {selectedGoalForDetails.status === 'DONE' ? (
                      <span className="text-emerald-700">Completed</span>
                    ) : selectedGoalForDetails.status === 'EXPIRED' ? (
                      <span className="text-rose-700">Expired</span>
                    ) : (
                      <span className="text-[#A67C00]">Active</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#666666] block mb-1">Milestones ({selectedGoalForDetails.tasks.length})</label>
                <div id="details-milestones" className="axiom-inset rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                  {selectedGoalForDetails.tasks.length === 0 ? (
                    <span className="text-xs text-[#666666]/75 italic">No milestones defined.</span>
                  ) : (
                    selectedGoalForDetails.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-2.5 text-xs text-[#171717]">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.isCompleted ? 'bg-emerald-600' : 'bg-[#D4AF37]'}`} />
                        <span className={task.isCompleted ? 'line-through text-[#666666]/65' : ''}>{task.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#F7E7B0] mt-6 relative z-10">
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
        <div id="goal-edit-modal-backdrop" className="fixed inset-0 bg-[#171717]/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div 
            id="goal-edit-modal-content" 
            className="w-full max-w-xl axiom-modal-panel rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6 border-b border-[#F7E7B0] pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="text-[#A67C00] bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/65 border border-[#D4AF37]/50 p-2 rounded-xl shadow-sm">
                  <Target size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-[#171717]">Edit Strategic Node</h3>
                  <span className="text-xs text-[#666666] block mt-0.5">Modify Goal Architecture</span>
                </div>
              </div>
              <button 
                id="btn-close-edit"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedGoalForEdit(null);
                }}
                aria-label="Close edit modal"
                className="p-2 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5] transition-colors cursor-pointer"
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
                <label className="text-xs font-medium text-[#666666] block mb-1.5">Project Name</label>
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
                <label className="text-xs font-medium text-[#666666] block mb-1.5">Objective Title</label>
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
                <label className="text-xs font-medium text-[#666666] block mb-1.5">Description & Outcome Metrics</label>
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
                  <label className="text-xs font-medium text-[#666666] block mb-1.5">Blueprint Category</label>
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
                  <label className="text-xs font-medium text-[#666666] block mb-1.5">Target Completion Date</label>
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
                <label className="text-xs font-medium text-[#666666] block mb-1">
                  Milestones (Tasks)
                </label>
                <span className="text-[11px] text-[#666666]/85 block mb-1.5 leading-tight">
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

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F7E7B0]">
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

      <div className="max-w-6xl w-full mx-auto">
        <Footer idPrefix="goals" onOpenInfo={onOpenInfo} />
      </div>
    </div>
  );
}
