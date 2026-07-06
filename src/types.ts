export type GoalCategory = 'PERSONAL' | 'FITNESS' | 'BUSINESS' | 'ACADEMIC' | 'LIFESTYLE';
export type GoalStatus = 'DONE' | 'IN_PROGRESS' | 'EXPIRED';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  dueDate: string;
  tasks: Task[];
  projectName?: string;
  createdAt?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  motivationalReminders: boolean;
  goalMilestones: boolean;
  createdAt?: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  userId: string;
  description?: string;
}

export type ActiveTab = 'overview' | 'dashboard' | 'goals' | 'planning' | 'timer' | 'settings' | 'admin';
