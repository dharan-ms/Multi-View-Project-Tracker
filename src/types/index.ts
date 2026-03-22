export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ViewMode = 'kanban' | 'list' | 'timeline';
export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: Status;
  priority: Priority;
  startDate: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
  dueDateFrom: string | null;
  dueDateTo: string | null;
}

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface SimulatedPresence {
  userId: string;
  taskId: string;
}

export const STATUS_CONFIG: Record<Status, { label: string; order: number }> = {
  'todo': { label: 'To Do', order: 0 },
  'in-progress': { label: 'In Progress', order: 1 },
  'in-review': { label: 'In Review', order: 2 },
  'done': { label: 'Done', order: 3 },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; order: number }> = {
  'critical': { label: 'Critical', order: 0 },
  'high': { label: 'High', order: 1 },
  'medium': { label: 'Medium', order: 2 },
  'low': { label: 'Low', order: 3 },
};

export const ALL_STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
export const ALL_PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
