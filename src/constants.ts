import { Goal, UserProfile } from './types';

export const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Aamina',
  lastName: 'adam',
  email: 'x93061155@gmail.com',
  avatar: 'adult_female_1',
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
  // CHILD AVATARS
  {
    id: 'child_boy_1',
    name: 'Young Boy (Sporty Cap)',
    category: 'Child',
    subcategory: 'Young Boy',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="46" r="18" fill="#fed7aa"/><path d="M32 40c0-10 8-18 18-18s18 8 18 18H32z" fill="#3b82f6"/><path d="M44 22l20-6 8 4-18 8z" fill="#1d4ed8"/><rect x="25" y="36" width="20" height="4" rx="2" fill="#1d4ed8" transform="rotate(-5 25 36)"/><path d="M32 40c0-2 4-6 6-6s4 4 6 6" stroke="#f59e0b" stroke-width="2" fill="none"/><circle cx="44" cy="44" r="2" fill="#111827"/><circle cx="56" cy="44" r="2" fill="#111827"/><path d="M45 52c2 3 8 3 10 0" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 74c0-8 8-12 20-12s20 4 20 12v6H30v-6z" fill="#60a5fa"/></svg>`
  },
  {
    id: 'child_boy_2',
    name: 'Young Boy (Winter Beanie)',
    category: 'Child',
    subcategory: 'Young Boy',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M31 42c0-12 8-20 19-20s19 8 19 20H31z" fill="#10b981"/><rect x="28" y="38" width="44" height="6" rx="3" fill="#047857"/><circle cx="50" cy="20" r="4" fill="#047857"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><path d="M44 51c3 4 9 4 12 0" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 74c0-8 8-12 20-12s20 4 20 12v6H30v-6z" fill="#34d399"/></svg>`
  },
  {
    id: 'child_girl_1',
    name: 'Young Girl (Pink Ribbon)',
    category: 'Child',
    subcategory: 'Young Girl',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="34" cy="36" r="10" fill="#f59e0b"/><circle cx="66" cy="36" r="10" fill="#f59e0b"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M32 36c5-10 31-10 36 0 0 0-10-3-18-3s-18 3-18 3z" fill="#d97706"/><path d="M28 32l10 4-10 4z" fill="#ec4899"/><path d="M72 32l-10 4 10 4z" fill="#ec4899"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><path d="M44 51c3 3 9 3 12 0" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 74c0-8 8-12 20-12s20 4 20 12v6H30v-6z" fill="#f472b6"/></svg>`
  },
  {
    id: 'child_girl_2',
    name: 'Young Girl (Playful Ponytails)',
    category: 'Child',
    subcategory: 'Young Girl',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><path d="M26 40c-6-10-14-4-10 6s14 4 10-6z" fill="#7c2d12"/><path d="M74 40c6-10 14-4 10 6s-14 4-10-6z" fill="#7c2d12"/><circle cx="50" cy="46" r="18" fill="#fee2e2"/><path d="M32 38c3-8 33-8 36 0-3-4-11-4-18-4s-15 0-18 4z" fill="#9a3412"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><circle cx="38" cy="48" r="2.5" fill="#f43f5e" opacity="0.4"/><circle cx="62" cy="48" r="2.5" fill="#f43f5e" opacity="0.4"/><path d="M45 52c2 2 8 2 10 0" stroke="#111827" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M30 74c0-8 8-12 20-12s20 4 20 12v6H30v-6z" fill="#fb7185"/></svg>`
  },

  // ADULT AVATARS
  {
    id: 'adult_male_1',
    name: 'Adult Male (Tech Beard)',
    category: 'Adult',
    subcategory: 'Young/Middle-aged Male',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="45" r="18" fill="#ffedd5"/><path d="M32 40c0-12 8-18 18-18s18 6 18 18" fill="none" stroke="#1e293b" stroke-width="4"/><path d="M34 46c0 10 10 16 16 16s16-6 16-16H34z" fill="#1e293b"/><path d="M38 44c0 7 8 11 12 11s12-4 12-11H38z" fill="#ffedd5"/><circle cx="42" cy="42" r="6" fill="none" stroke="#e0a96d" stroke-width="2"/><circle cx="58" cy="42" r="6" fill="none" stroke="#e0a96d" stroke-width="2"/><line x1="48" y1="42" x2="52" y2="42" stroke="#e0a96d" stroke-width="2"/><path d="M46 50c2 2 6 2 8 0" stroke="#111827" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#1e3a8a"/><path d="M47 59h6l-3 12z" fill="#e0a96d"/></svg>`
  },
  {
    id: 'adult_male_2',
    name: 'Adult Male (Sleek Crop)',
    category: 'Adult',
    subcategory: 'Young/Middle-aged Male',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="45" r="18" fill="#fbcfe8"/><path d="M31 38c2-12 12-16 19-16s17 4 19 16c-3-4-9-5-19-5s-16 1-19 5z" fill="#4c1d95"/><circle cx="43" cy="43" r="2" fill="#111827"/><circle cx="57" cy="43" r="2" fill="#111827"/><path d="M45 52c2 3 8 3 10 0" stroke="#111827" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#6d28d9"/><path d="M42 59l8 6 8-6" fill="none" stroke="#fff" stroke-width="2"/></svg>`
  },
  {
    id: 'adult_female_1',
    name: 'Adult Female (Professional)',
    category: 'Adult',
    subcategory: 'Young/Middle-aged Female',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="22" r="10" fill="#78350f"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M31 42c0-12 8-18 19-18s19 6 19 18H31z" fill="#9a3412"/><circle cx="42" cy="44" r="6" fill="none" stroke="#06b6d4" stroke-width="2"/><circle cx="58" cy="44" r="6" fill="none" stroke="#06b6d4" stroke-width="2"/><line x1="48" y1="44" x2="52" y2="44" stroke="#06b6d4" stroke-width="2"/><path d="M46 54c2 2 6 2 8 0" stroke="#db2777" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#0f172a"/><path d="M40 59l10 10 10-10" fill="none" stroke="#db2777" stroke-width="2"/></svg>`
  },
  {
    id: 'adult_female_2',
    name: 'Adult Female (Cyber Wave)',
    category: 'Adult',
    subcategory: 'Young/Middle-aged Female',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="45" r="18" fill="#fee2e2"/><path d="M30 40c0-15 10-20 20-20s20 5 20 20v25c0 3-4 6-6 6s-4-3-4-6V42h-20v23c0 3-4 6-6 6s-4-3-4-6V40z" fill="#ec4899"/><path d="M33 40h34l-3 6H36z" fill="#06b6d4" opacity="0.9"/><line x1="33" y1="42" x2="67" y2="42" stroke="#fff" stroke-width="1"/><path d="M46 53c2 1 6 1 8 0" stroke="#be185d" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#3b82f6"/></svg>`
  },

  // OLDER ADULT AVATARS
  {
    id: 'elderly_man_1',
    name: 'Elderly Man (Silver Crop)',
    category: 'Older Adult',
    subcategory: 'Elderly Man',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M31 40c0-12 8-18 19-18s19 6 19 18H31z" fill="#e2e8f0"/><path d="M44 32h12" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/><path d="M46 35h8" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><rect x="36" y="40" width="12" height="8" rx="2" fill="none" stroke="#475569" stroke-width="1.5"/><rect x="52" y="40" width="12" height="8" rx="2" fill="none" stroke="#475569" stroke-width="1.5"/><line x1="48" y1="44" x2="52" y2="44" stroke="#475569" stroke-width="1.5"/><path d="M45 54c2 2 8 2 10 0" stroke="#111827" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#047857"/></svg>`
  },
  {
    id: 'elderly_man_2',
    name: 'Elderly Man (Classic Specs)',
    category: 'Older Adult',
    subcategory: 'Elderly Man',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M30 46c0-6 4-10 6-12" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M70 46c0-6-4-10-6-12" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M38 52c3-3 9-3 12 0s9 3 12 0" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><circle cx="42" cy="44" r="5.5" fill="none" stroke="#f59e0b" stroke-width="1.5"/><circle cx="58" cy="44" r="5.5" fill="none" stroke="#f59e0b" stroke-width="1.5"/><line x1="47.5" y1="44" x2="52.5" y2="44" stroke="#f59e0b" stroke-width="1.5"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#7c2d12"/></svg>`
  },
  {
    id: 'elderly_woman_1',
    name: 'Elderly Woman (Wavy Silver)',
    category: 'Older Adult',
    subcategory: 'Elderly Woman',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="32" cy="40" r="10" fill="#cbd5e1"/><circle cx="68" cy="40" r="10" fill="#cbd5e1"/><circle cx="50" cy="24" r="12" fill="#cbd5e1"/><circle cx="50" cy="46" r="18" fill="#ffe4e6"/><path d="M31 38c3-10 12-14 19-14s16 4 19 14" fill="none" stroke="#94a3b8" stroke-width="3"/><path d="M44 32h12" stroke="#f43f5e" opacity="0.2" stroke-width="1.5" stroke-linecap="round"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><path d="M45 54c2 2 8 2 10 0" stroke="#e11d48" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#db2777"/></svg>`
  },
  {
    id: 'elderly_woman_2',
    name: 'Elderly Woman (Pearl Necklace)',
    category: 'Older Adult',
    subcategory: 'Elderly Woman',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="24" r="9" fill="#94a3b8"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M31 42c0-12 8-18 19-18s19 6 19 18H31z" fill="#cbd5e1"/><circle cx="42" cy="44" r="5.5" fill="none" stroke="#7c2d12" stroke-width="1.5"/><circle cx="58" cy="44" r="5.5" fill="none" stroke="#7c2d12" stroke-width="1.5"/><line x1="47.5" y1="44" x2="52.5" y2="44" stroke="#7c2d12" stroke-width="1.5"/><circle cx="40" cy="62" r="1.5" fill="#fff"/><circle cx="44" cy="64" r="1.5" fill="#fff"/><circle cx="50" cy="65" r="1.5" fill="#fff"/><circle cx="56" cy="64" r="1.5" fill="#fff"/><circle cx="60" cy="62" r="1.5" fill="#fff"/><path d="M46 53c2 1.5 6 1.5 8 0" stroke="#dc2626" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#4f46e5"/></svg>`
  },

  // SENIOR AVATARS
  {
    id: 'senior_grandpa_1',
    name: 'Grandfather (Classic Balding)',
    category: 'Senior',
    subcategory: 'Grandfather',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M31 46c-2-8 2-14 4-14" stroke="#f1f5f9" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M69 46c2-8-2-14-4-14" stroke="#f1f5f9" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M42 32h16" stroke="#94a3b8" opacity="0.3" stroke-width="1.5" stroke-linecap="round"/><path d="M44 35h12" stroke="#94a3b8" opacity="0.3" stroke-width="1.5" stroke-linecap="round"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><rect x="36" y="41" width="12" height="7" rx="1.5" fill="none" stroke="#475569" stroke-width="1"/><rect x="52" y="41" width="12" height="7" rx="1.5" fill="none" stroke="#475569" stroke-width="1"/><line x1="48" y1="44" x2="52" y2="44" stroke="#475569" stroke-width="1"/><path d="M44 54c3 3 9 3 12 0" stroke="#111827" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#b45309"/></svg>`
  },
  {
    id: 'senior_grandpa_2',
    name: 'Grandfather (White Mustache)',
    category: 'Senior',
    subcategory: 'Grandfather',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="46" r="18" fill="#fed7aa"/><circle cx="31" cy="42" r="5" fill="#f8fafc"/><circle cx="32" cy="48" r="5" fill="#f8fafc"/><circle cx="69" cy="42" r="5" fill="#f8fafc"/><circle cx="68" cy="48" r="5" fill="#f8fafc"/><path d="M35 52c4-3 10-3 15 0s11 3 15 0" stroke="#f1f5f9" stroke-width="4.5" stroke-linecap="round" fill="none"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><circle cx="42" cy="44" r="6" fill="none" stroke="#d97706" stroke-width="1.5"/><circle cx="58" cy="44" r="6" fill="none" stroke="#d97706" stroke-width="1.5"/><line x1="48" y1="44" x2="52" y2="44" stroke="#d97706" stroke-width="1.5"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#451a03"/></svg>`
  },
  {
    id: 'senior_grandma_1',
    name: 'Grandmother (High Silver Bun)',
    category: 'Senior',
    subcategory: 'Grandmother',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="50" cy="22" r="8" fill="#e2e8f0"/><path d="M47 18h6v4h-6z" fill="#94a3b8"/><circle cx="50" cy="46" r="18" fill="#ffe4e6"/><path d="M31 42c0-12 8-18 19-18s19 6 19 18H31z" fill="#f1f5f9"/><path d="M38 38c2-1 5-1 7 0" stroke="#94a3b8" stroke-width="1.5" fill="none"/><path d="M55 38c2-1 5-1 7 0" stroke="#94a3b8" stroke-width="1.5" fill="none"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><circle cx="42" cy="44" r="5" fill="none" stroke="#475569" stroke-width="1.5"/><circle cx="58" cy="44" r="5" fill="none" stroke="#475569" stroke-width="1.5"/><line x1="47" y1="44" x2="53" y2="44" stroke="#475569" stroke-width="1.5"/><path d="M44 54c3 3 9 3 12 0" stroke="#be123c" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#6b21a8"/></svg>`
  },
  {
    id: 'senior_grandma_2',
    name: 'Grandmother (Cozy Knit)',
    category: 'Senior',
    subcategory: 'Grandmother',
    svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="50" fill="#0f172a"/><circle cx="32" cy="42" r="7" fill="#f1f5f9"/><circle cx="68" cy="42" r="7" fill="#f1f5f9"/><circle cx="50" cy="46" r="18" fill="#ffedd5"/><path d="M31 38c3-8 12-12 19-12s16 4 19 12" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="43" cy="44" r="2" fill="#111827"/><circle cx="57" cy="44" r="2" fill="#111827"/><circle cx="37" cy="48" r="2.5" fill="#f43f5e" opacity="0.3"/><circle cx="63" cy="48" r="2.5" fill="#f43f5e" opacity="0.3"/><path d="M45 54c2 2 8 2 10 0" stroke="#e11d48" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M28 74c0-10 10-15 22-15s22 5 22 15v6H28v-6z" fill="#0369a1"/><path d="M35 59c5 10 10 15 15 15s10-5 15-15" fill="none" stroke="#bae6fd" stroke-width="2"/></svg>`
  }
];
