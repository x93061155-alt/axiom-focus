import { Goal, UserProfile } from './types';

export const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Aamina',
  lastName: 'adam',
  email: 'x93061155@gmail.com',
  avatar: 'avatar_woman_glasses',
  motivationalReminders: true,
  goalMilestones: true,
};

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'rg',
    description: 'regfg',
    category: 'PERSONAL',
    status: 'DONE',
    dueDate: '2026-05-13',
    tasks: [
      { id: 'task-1-1', title: 'Complete personal blueprint validation', isCompleted: true },
      { id: 'task-1-2', title: 'Perform weekly review of node parameters', isCompleted: true }
    ]
  },
  {
    id: 'goal-2',
    title: 'ethe',
    description: 'ethhtgh',
    category: 'FITNESS',
    status: 'DONE',
    dueDate: '2026-06-05',
    tasks: [
      { id: 'task-2-1', title: 'Cardio threshold test (Level 4)', isCompleted: true },
      { id: 'task-2-2', title: 'Sustained peak heart rate for 30 minutes', isCompleted: true }
    ]
  },
  {
    id: 'goal-3',
    title: 'hth',
    description: 'th',
    category: 'FITNESS',
    status: 'EXPIRED',
    dueDate: '2026-05-21',
    tasks: [
      { id: 'task-3-1', title: 'Morning stretching routing', isCompleted: false },
      { id: 'task-3-2', title: 'Caloric balance tracking logs', isCompleted: false }
    ]
  },
  {
    id: 'goal-4',
    title: 'jkjuk',
    description: 'Personal growth and mental focus systems',
    category: 'PERSONAL',
    status: 'IN_PROGRESS',
    dueDate: '2026-05-04',
    tasks: [
      { id: 'task-4-1', title: 'Read 2 chapters of deep focus theory', isCompleted: false },
      { id: 'task-4-2', title: 'Complete 3 daily Pomodoro sessions', isCompleted: false }
    ]
  }
];

export const AVATARS = [
  {
    id: 'avatar_woman_glasses',
    name: 'Aamina',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full text-amber-500 fill-current"><circle cx="50" cy="50" r="50" fill="#1e293b"/><path d="M50 25c-15 0-22 8-22 18 0 4 3 6 5 6s4-2 4-5c0-4 4-8 13-8s13 4 13 8c0 3 2 5 4 5s5-2 5-6c0-10-7-18-22-18z" fill="#f59e0b"/><circle cx="38" cy="46" r="10" fill="none" stroke="#ef4444" stroke-width="3"/><circle cx="62" cy="46" r="10" fill="none" stroke="#ef4444" stroke-width="3"/><path d="M48 46h4" stroke="#ef4444" stroke-width="3"/><path d="M42 65c0 5 4 8 8 8s8-3 8-8" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/><path d="M50 15c10 0 18 4 18 12 0 2-2 4-4 4s-4-2-4-4c0-3-4-6-10-6s-10 3-10 6c0 2-2 4-4 4s-4-2-4-4c0-8 8-12 18-12z" fill="#ea580c"/></svg>`
  },
  {
    id: 'avatar_man_beard',
    name: 'Cuthman',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#1e293b"/><path d="M30 65c0-10 10-15 20-15s20 5 20 15v10H30V65z" fill="#475569"/><circle cx="50" cy="40" r="18" fill="#f59e0b"/><path d="M38 48c4 10 20 10 24 0" fill="#78350f"/><circle cx="44" cy="36" r="2" fill="#0f172a"/><circle cx="56" cy="36" r="2" fill="#0f172a"/></svg>`
  },
  {
    id: 'avatar_woman_cyber',
    name: 'Aura',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#1e293b"/><path d="M30 70c5-15 15-20 20-20s15 5 20 20v5H30V70z" fill="#06b6d4"/><circle cx="50" cy="42" r="16" fill="#fb7185"/><path d="M34 42h32v4H34z" fill="#3b82f6"/><path d="M45 54c3 3 7 3 10 0" stroke="#fff" stroke-width="2" fill="none"/></svg>`
  },
  {
    id: 'avatar_minimal_gold',
    name: 'Axiom',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#111827"/><circle cx="50" cy="50" r="30" fill="none" stroke="#d4af37" stroke-width="4"/><circle cx="50" cy="50" r="15" fill="none" stroke="#d4af37" stroke-width="2"/><circle cx="50" cy="50" r="5" fill="#d4af37"/></svg>`
  }
];
