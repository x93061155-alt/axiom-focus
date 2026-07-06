import React, { useState, useEffect } from 'react';
import { Layers, Search, Check, Plus, Trash2, CheckSquare, Square, CornerDownRight, GripVertical } from 'lucide-react';
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

  // Automatically select the first available goal if none is selected
  useEffect(() => {
    if (!selectedGoalId && goals.length > 0) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId, setSelectedGoalId]);

  // Filter plans based on search or category
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

  return (
    <div id="planning-tab" className="flex-1 overflow-y-auto bg-[#071324] text-white p-4 sm:p-6 md:p-10 flex flex-col justify-between min-h-screen">
      <div>
        {/* Title Header exactly as Screenshot 2 */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#12243d] pb-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-extrabold font-display leading-tight flex items-center gap-2">
              <span>Planning & Tasks</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Organize and execute your architectural blueprints</p>
          </div>

          {/* Search/Filters layout on the right */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search plans & tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#e0a96d]/40 transition-colors"
              />
            </div>

            {/* Category Select Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GoalCategory | 'ALL')}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-400 hover:text-gray-200 focus:outline-none focus:border-[#e0a96d]/40 transition-colors cursor-pointer"
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

        {/* Two-Column Workspace layout exactly matching Screenshot 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Plans List (span 5) */}
          <div className="lg:col-span-5 bg-[#0b1d31]/40 border border-[#142944] rounded-2xl p-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#12243d]">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Active Plans</h3>
              <span className="text-xs font-mono bg-[#051120] border border-[#1a2c42] text-[#e0a96d] px-2.5 py-0.5 rounded-full font-semibold">
                {filteredGoals.length} Plans
              </span>
            </div>

            {/* Scrollable list */}
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredGoals.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No active blueprints found matching query.
                </div>
              ) : (
                filteredGoals.map((g) => {
                  const isActive = g.id === selectedGoalId;
                  const totalTasks = g.tasks.length;
                  const completedTasks = g.tasks.filter((t) => t.isCompleted).length;
                  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (g.status === 'DONE' ? 100 : 0);

                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGoalId(g.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0f243c] border-[#e0a96d]/40 shadow-md scale-[1.01]'
                          : 'bg-[#0b1d31] border-[#142944] hover:bg-[#0c1a2e] hover:border-[#1a3a5f]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="truncate pr-2">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-[#e0a96d]">{g.title}</h4>
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                            📅 {g.dueDate ? new Date(g.dueDate).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase border ${getCategoryStyle(g.category)}`}>
                          {g.category}
                        </span>
                      </div>

                      {/* Info / Progress bar exactly as in Screenshot 2 */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mb-1.5 mt-3">
                        <span>{completedTasks}/{totalTasks} tasks</span>
                        <span className="text-[#e0a96d] font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-[#051120] h-1.5 rounded-full overflow-hidden border border-[#1a2c42]/30">
                        <div
                          className="bg-[#e0a96d] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: TASKS & MILESTONES (span 7) */}
          <div className="lg:col-span-7 bg-[#0b1d31] border border-[#142944] rounded-2xl p-6 min-h-[450px] flex flex-col justify-between">
            {selectedGoal ? (
              <div>
                {/* Active Plan Detail Header */}
                <div className="mb-6 border-b border-[#12243d] pb-5">
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="text-xl font-extrabold text-white font-display">{selectedGoal.title}</h3>
                    <span className="text-lg font-mono text-[#e0a96d] font-extrabold">
                      {selectedGoal.tasks.length > 0
                        ? `${Math.round((selectedGoal.tasks.filter(t => t.isCompleted).length / selectedGoal.tasks.length) * 100)}%`
                        : (selectedGoal.status === 'DONE' ? '100%' : '0%')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-3">{selectedGoal.description || 'No description'}</p>
                  <span className="text-[10px] font-mono uppercase bg-[#e0a96d]/10 text-[#e0a96d] border border-[#e0a96d]/20 px-2.5 py-1 rounded-md">
                    PROGRESS
                  </span>
                </div>

                {/* Task Creation Form */}
                <form onSubmit={handleAddTaskSubmit} className="mb-6 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter task / milestone description..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#e0a96d]/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} />
                    <span>ADD TASK</span>
                  </button>
                </form>

                {/* Tasks Header */}
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">TASKS & MILESTONES</h4>
                  <span className="text-[10px] text-gray-500 font-mono">Drag to reorder</span>
                </div>

                {/* Scrollable list of Tasks */}
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedGoal.tasks.length === 0 ? (
                    <div className="border border-dashed border-[#1a2c42] rounded-xl p-12 text-center text-gray-500 text-xs my-4">
                      No tasks created for this plan yet.
                    </div>
                  ) : (
                    selectedGoal.tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, idx)}
                        className="bg-[#051120] border border-[#1a2c42] rounded-xl p-3 flex items-center justify-between group hover:border-[#e0a96d]/20 transition-all duration-200 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <GripVertical size={14} className="text-gray-600 group-hover:text-gray-400 cursor-grab flex-shrink-0" />
                          <button
                            type="button"
                            onClick={() => onToggleTask(selectedGoal.id, task.id)}
                            className={`p-0.5 rounded-md transition-colors ${
                              task.isCompleted
                                ? 'text-emerald-400'
                                : 'text-gray-500 hover:text-[#e0a96d]'
                            }`}
                          >
                            {task.isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                          </button>
                          <span
                            className={`text-xs truncate transition-all ${
                              task.isCompleted
                                ? 'line-through text-gray-500 font-medium'
                                : 'text-gray-200 font-semibold'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteTask(selectedGoal.id, task.id)}
                          className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete Milestone"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-12">
                <Layers size={40} className="text-gray-600 mb-3" />
                <p className="text-xs">Select an active plan from the left panel to map milestones.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Corporate Academic Footer credits exactly matching Reusable footer */}
      <Footer idPrefix="planning" onOpenInfo={onOpenInfo} />
    </div>
  );
}
