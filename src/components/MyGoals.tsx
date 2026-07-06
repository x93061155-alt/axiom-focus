import React, { useState } from 'react';
import { Target, Search, Plus, Trash2, CheckCircle, Circle, ArrowRight, MoreHorizontal, Edit, Info, X } from 'lucide-react';
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

  const filteredGoals = goals.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (g.projectName && g.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (g.description && g.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryStyle = (category: GoalCategory) => {
    switch (category) {
      case 'PERSONAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'FITNESS':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'BUSINESS':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'ACADEMIC':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'LIFESTYLE':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    }
  };

  return (
    <div id="goals-tab" className="flex-1 overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 flex flex-col justify-between min-h-screen">
      <div>
        {/* Header Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-semibold block mb-1">STRATEGIC OBJECTIVES</span>
            <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight">My Goals</h2>
          </div>
          <button
            onClick={onOpenNewGoalModal}
            className="px-5 py-2.5 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>NEW GOAL</span>
          </button>
        </div>

        {/* Filters and Search panel */}
        <div className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search goals by title or project name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
            />
          </div>

          {/* Categories Horizontal selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {(['ALL', 'PERSONAL', 'FITNESS', 'BUSINESS', 'ACADEMIC', 'LIFESTYLE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#e0a96d] text-[#071324] border-[#e0a96d]'
                    : 'bg-[#051120] text-gray-400 border-[#1a2c42] hover:text-gray-200 hover:bg-[#071324]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-16 text-center text-gray-400">
            <Target size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-base font-semibold mb-2">No objectives match your criteria.</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">Create a new objective node or clear filters to track architecture blueprints.</p>
            {(searchTerm || selectedCategory !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                }}
                className="mt-4 text-xs font-bold text-[#e0a96d] hover:underline cursor-pointer"
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
                  className="bg-[#0b1d31] border border-[#142944] rounded-2xl p-6 relative group hover:border-[#e0a96d]/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top */}
                    <div className="flex justify-between items-center mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${getCategoryStyle(goal.category)}`}>
                        {goal.category}
                      </span>
                      
                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setActiveDropdownGoalId(activeDropdownGoalId === goal.id ? null : goal.id);
                          }}
                          title={`Options Menu`}
                          className="text-gray-500 hover:text-gray-300 hover:bg-[#10243d] p-1.5 rounded-lg transition-colors cursor-pointer"
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
                              className="absolute right-0 top-full mt-1 w-44 bg-[#0b1d31] border border-[#142944] rounded-xl shadow-2xl py-1.5 z-40"
                            >
                              <button
                                id={`btn-goals-edit-${goal.id}`}
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
                                id={`btn-goals-delete-${goal.id}`}
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
                                id={`btn-goals-complete-${goal.id}`}
                                onClick={() => {
                                  setActiveDropdownGoalId(null);
                                  onUpdateGoalStatus(goal.id, goal.status === 'DONE' ? 'IN_PROGRESS' : 'DONE');
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#10243d] hover:text-emerald-400 transition-colors flex items-center gap-2 text-gray-300 cursor-pointer"
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

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#e0a96d] transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                      {goal.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Card Bottom / Progress */}
                  <div className="border-t border-[#12243d] pt-4 mt-auto">
                    <div className="flex justify-between items-center text-xs font-mono text-gray-500 mb-1.5">
                      <span>PROGRESS</span>
                      <span className="text-[#e0a96d] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#051120] h-2 rounded-full overflow-hidden border border-[#1a2c42]/40 mb-3">
                      <motion.div
                        className="bg-[#e0a96d] h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] font-mono text-gray-500">
                        {completedTasks} of {totalTasks} milestones complete
                      </span>
                      <button
                        onClick={() => onSelectGoalForPlanning(goal.id)}
                        className="text-xs font-semibold text-[#e0a96d] hover:text-[#f3bf84] flex items-center gap-1 group/btn cursor-pointer"
                      >
                        <span>PLAN TASKS</span>
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

      {/* Corporate Academic Footer credits exactly matching Screenshot 1 footer */}
      <Footer idPrefix="goals" onOpenInfo={onOpenInfo} />
    </div>
  );
}
