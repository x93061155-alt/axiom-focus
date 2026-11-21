import React, { useState } from 'react';
import { X, Target, Plus } from 'lucide-react';
import { GoalCategory } from '../types';

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

    setTitle('');
    setDescription('');
    setCategory('PERSONAL');
    setDueDate('');
    setMilestonesInput('');
    setProjectName('');
    onClose();
  };

  return (
    <div id="new-goal-modal-backdrop" className="fixed inset-0 bg-[#171717]/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        id="new-goal-modal-content" 
        className="w-full max-w-xl axiom-modal-panel rounded-2xl p-6 md:p-7 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD700]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#F7E7B0] pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-[#A67C00] bg-gradient-to-br from-[#FFFDF5] to-[#F7E7B0]/65 border border-[#D4AF37]/50 p-2 rounded-xl shadow-sm">
              <Target size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#171717]">Create Strategic Node</h3>
              <span className="text-xs text-[#666666] block mt-0.5">Axiom Goal Architecture</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#FFFDF5] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="text-xs font-medium text-[#666666] block mb-1.5">Project Name</label>
            <input
              type="text"
              placeholder="e.g. Project Axiom, Fitness Tracker, Self Care"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#666666] block mb-1.5">Objective Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Deep work blueprint, Threshold training"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#666666] block mb-1.5">Description & Outcome Metrics</label>
            <textarea
              placeholder="Define measurable targets and desired outcomes..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#666666] block mb-1.5">Blueprint Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
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
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#666666] block mb-1">
              Initial Milestones (Optional)
            </label>
            <span className="text-[11px] text-[#666666]/85 block mb-1.5 leading-snug">
              Separate tasks with a comma or newline. You can refine them later in Planning & Tasks.
            </span>
            <textarea
              placeholder="e.g. Read 2 chapters of deep focus, Complete 3 Pomodoros, Weekly review"
              rows={2}
              value={milestonesInput}
              onChange={(e) => setMilestonesInput(e.target.value)}
              className="w-full px-4 py-2.5 axiom-input rounded-xl text-sm resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#F7E7B0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 axiom-btn-secondary rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 axiom-btn-primary text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} />
              <span>Create Strategic Objective</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
