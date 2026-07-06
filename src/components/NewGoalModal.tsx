import React, { useState } from 'react';
import { X, Target, Plus, Calendar, Layers } from 'lucide-react';
import { GoalCategory, GoalStatus } from '../types';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (
    title: string,
    description: string,
    category: GoalCategory,
    dueDate: string,
    initialMilestones: string[],
    projectName?: string
  ) => void;
}

export default function NewGoalModal({ isOpen, onClose, onAddGoal }: NewGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('PERSONAL');
  const [dueDate, setDueDate] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Split initial milestones by comma or newline
    const initialMilestones = milestonesInput
      .split(/[,\n]/)
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    onAddGoal(
      title.trim(),
      description.trim(),
      category,
      dueDate || new Date().toISOString().split('T')[0],
      initialMilestones,
      projectName.trim() || undefined
    );

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory('PERSONAL');
    setDueDate('');
    setMilestonesInput('');
    setProjectName('');
    onClose();
  };

  return (
    <div id="new-goal-modal-backdrop" className="fixed inset-0 bg-[#050c16]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="new-goal-modal-content" 
        className="w-full max-w-xl bg-[#0b1d31] border border-[#142944] rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e0a96d]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#12243d] pb-4">
          <div className="flex items-center gap-2">
            <div className="text-[#e0a96d] bg-[#e0a96d]/10 p-1.5 rounded-lg">
              <Target size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">Create Strategic Node</h3>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-semibold mt-0.5">Axiom Goal Architecture</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#10243d] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Project Name */}
          <div>
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">PROJECT NAME</label>
            <input
              type="text"
              placeholder="e.g. Project Axiom, Fitness Tracker, Self Care"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">OBJECTIVE TITLE (Short name)</label>
            <input
              type="text"
              required
              placeholder="e.g. rg, fitness tracker, deep work blueprint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">DESCRIPTION / OUTCOME METRICS</label>
            <textarea
              placeholder="e.g. regfg, weekly target for threshold test..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors resize-none"
            />
          </div>

          {/* Row: Category & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1.5">BLUEPRINT CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
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
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white focus:outline-none focus:border-[#e0a96d]/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Initial Milestones / Tasks */}
          <div>
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold block mb-1">
              INITIAL MILESTONES (Optional)
            </label>
            <span className="text-[9px] text-gray-500 block mb-1.5 font-medium leading-tight">
              Type tasks separated by a comma or newline. You can also customize them later in Planning & Tasks.
            </span>
            <textarea
              placeholder="e.g. Read 2 chapters of deep focus, Complete 3 Pomodoros, Complete weekly review"
              rows={2}
              value={milestonesInput}
              onChange={(e) => setMilestonesInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#051120] border border-[#1a2c42] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#e0a96d]/50 transition-colors resize-none"
            />
          </div>

          {/* Footer Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#12243d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-gray-400 hover:text-white hover:bg-[#10243d] rounded-xl text-xs font-bold transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e0a96d] hover:bg-[#f3bf84] text-[#071324] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95"
            >
              <Plus size={14} />
              <span>CREATE STRATEGIC OBJECTIVE</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
