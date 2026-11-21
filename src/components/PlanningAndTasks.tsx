import React, { useState, useEffect } from 'react';
import { Layers, Search, Plus, Trash2, CheckSquare, Square, GripVertical } from 'lucide-react';
import { Goal, GoalCategory, Task } from '../types';
import Footer from './Footer';

interface PlanningAndTasksProps {
  goals: Goal[];
  selectedGoalId: string | null;
  setSelectedGoalId: (id: string | null) => void;
  onAddTask: (goalId: string, taskTitle: string) => void;
  onToggleTask: (goalId: string, taskId: string) => void;
  onDeleteTask: (goalId: string, taskId: string) => void;
  onReorderTasks: (goalId: string, updatedTasks: Task[]) => void;
  onOpenInfo: (type: 'storage' | 'terms' | 'security' | 'api') => void;
}

export default function PlanningAndTasks({
  goals,
  selectedGoalId,
  setSelectedGoalId,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onReorderTasks,
  onOpenInfo
}: PlanningAndTasksProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'ALL'>('ALL');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceIndexStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex || !selectedGoal) return;

    const updatedTasks = [...selectedGoal.tasks];
    const [removed] = updatedTasks.splice(sourceIndex, 1);
    updatedTasks.splice(targetIndex, 0, removed);

    onReorderTasks(selectedGoal.id, updatedTasks);
  };

  useEffect(() => {
    if (!selectedGoalId && goals.length > 0) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId, setSelectedGoalId]);

  const filteredGoals = goals.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedGoalId) return;
    onAddTask(selectedGoalId, newTaskTitle.trim());
    setNewTaskTitle('');
  };

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

  return (
    <div id="planning-tab" className="flex-1 overflow-y-auto text-[#FFFFFF] p-5 sm:p-8 md:p-10 flex flex-col justify-between min-h-full">
      <div className="max-w-6xl w-full mx-auto">
        {/* Title & Filter Toolbar */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#1D3555] pb-6">
          <div>
            <span className="text-xs font-medium text-[#00A3FF] block mb-1">Execution Blueprint</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight text-[#FFFFFF]">Planning & Tasks</h2>
            <p className="text-sm text-[#A8B8CC] mt-1.5">Organize and execute your strategic milestones</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#A8B8CC]">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search plans & tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 axiom-input rounded-xl text-xs"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GoalCategory | 'ALL')}
              className="w-full sm:w-auto px-3.5 py-2 axiom-input rounded-xl text-xs cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="PERSONAL">Personal</option>
              <option value="FITNESS">Fitness</option>
              <option value="BUSINESS">Business</option>
              <option value="ACADEMIC">Academic</option>
              <option value="LIFESTYLE">Lifestyle</option>
            </select>
          </div>
        </div>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left Column: Active Plans List */}
          <div className="lg:col-span-5 axiom-card rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#1D3555]">
              <h3 className="text-sm font-semibold text-[#FFFFFF]">Active Plans</h3>
              <span className="text-xs font-mono tabular-nums text-[#00A3FF]">
                {filteredGoals.length} {filteredGoals.length === 1 ? 'plan' : 'plans'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredGoals.length === 0 ? (
                <div className="text-center py-12 text-[#A8B8CC] text-xs">
                  No active blueprints found matching your query.
                </div>
              ) : (
                filteredGoals.map((g) => {
                  const isActive = g.id === selectedGoalId;
                  const totalTasks = g.tasks.length;
                  const completedTasks = g.tasks.filter((t) => t.isCompleted).length;
                  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (g.status === 'DONE' ? 100 : 0);

                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setSelectedGoalId(g.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 w-full ${
                        isActive
                          ? 'bg-[#0066FF]/18 border-[#00A3FF]/50 shadow-sm'
                          : 'bg-[#0B172A] border-[#1D3555] hover:bg-[#101F35] hover:border-[#00A3FF]/40'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-[#00A3FF]' : 'text-[#FFFFFF]'}`}>{g.title}</h4>
                          <span className="text-[11px] text-[#A8B8CC] font-mono tabular-nums mt-0.5 block">
                            Due {g.dueDate ? new Date(g.dueDate).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                        <span className={`text-[11px] font-semibold capitalize shrink-0 ${getCategoryTextColor(g.category)}`}>
                          {g.category.toLowerCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#A8B8CC] mb-1.5 mt-3">
                        <span>{completedTasks}/{totalTasks} tasks</span>
                        <span className="text-[#00A3FF] font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full bg-[#07111F] h-1.5 rounded-full overflow-hidden border border-[#1D3555]">
                        <div
                          className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Tasks & Milestones */}
          <div className="lg:col-span-7 axiom-card rounded-2xl p-6 min-h-[460px] flex flex-col justify-between">
            {selectedGoal ? (
              <div>
                <div className="mb-6 border-b border-[#1D3555] pb-5">
                  <div className="flex justify-between items-start gap-4 mb-1.5">
                    <h3 className="text-xl font-bold text-[#FFFFFF] font-display">{selectedGoal.title}</h3>
                    <span className="text-xl font-mono tabular-nums text-[#00A3FF] font-bold shrink-0">
                      {selectedGoal.tasks.length > 0
                        ? `${Math.round((selectedGoal.tasks.filter(t => t.isCompleted).length / selectedGoal.tasks.length) * 100)}%`
                        : (selectedGoal.status === 'DONE' ? '100%' : '0%')}
                    </span>
                  </div>
                  <p className="text-xs text-[#A8B8CC] leading-relaxed">{selectedGoal.description || 'No description provided.'}</p>
                </div>

                {/* Task Creation Form */}
                <form onSubmit={handleAddTaskSubmit} className="mb-6 flex gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Add a milestone or actionable task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-2.5 axiom-input rounded-xl text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 axiom-btn-primary text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Add Task</span>
                  </button>
                </form>

                {/* Tasks Header */}
                <div className="flex justify-between items-center mb-3.5">
                  <h4 className="text-xs font-semibold text-[#FFFFFF]">Tasks & Milestones</h4>
                  <span className="text-xs text-[#A8B8CC]">Drag to reorder</span>
                </div>

                {/* Task List */}
                <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {selectedGoal.tasks.length === 0 ? (
                    <div className="border border-dashed border-[#1D3555] rounded-xl p-12 text-center text-[#A8B8CC] text-xs my-2">
                      No tasks created for this plan yet. Add your first milestone above.
                    </div>
                  ) : (
                    selectedGoal.tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        className="axiom-inset rounded-xl p-3 flex items-center justify-between group hover:border-[#00A3FF]/40 transition-all duration-150 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <GripVertical size={14} className="text-[#1D3555] group-hover:text-[#A8B8CC] cursor-grab flex-shrink-0" />
                          <button
                            type="button"
                            onClick={() => onToggleTask(selectedGoal.id, task.id)}
                            aria-label={task.isCompleted ? 'Mark task incomplete' : 'Mark task complete'}
                            className={`p-0.5 rounded-md transition-colors cursor-pointer ${
                              task.isCompleted
                                ? 'text-emerald-400'
                                : 'text-[#A8B8CC] hover:text-[#00A3FF]'
                            }`}
                          >
                            {task.isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                          </button>
                          <span
                            className={`text-sm truncate transition-all ${
                              task.isCompleted
                                ? 'line-through text-[#A8B8CC]/60'
                                : 'text-[#FFFFFF] font-medium'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteTask(selectedGoal.id, task.id)}
                          className="text-[#A8B8CC] hover:text-rose-400 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete Milestone"
                          aria-label="Delete Milestone"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#A8B8CC] py-14">
                <Layers size={40} className="text-[#1D3555] mb-3" />
                <p className="text-sm font-medium text-[#FFFFFF]">Select an active plan</p>
                <p className="text-xs text-[#A8B8CC] mt-1">Choose a goal from the left panel to map and reorder milestones.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto">
        <Footer idPrefix="planning" onOpenInfo={onOpenInfo} />
      </div>
    </div>
  );
}
