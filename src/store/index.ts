import { create } from 'zustand';
import { Task, Filters, SortConfig, ViewMode, Status, SimulatedPresence } from '../types';
import { generateTasks, USERS } from '../data/seed';

interface AppState {
  tasks: Task[];
  users: typeof USERS;
  filters: Filters;
  sort: SortConfig;
  view: ViewMode;
  presences: SimulatedPresence[];

  setView: (view: ViewMode) => void;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  setSort: (sort: SortConfig) => void;
  toggleSort: (field: SortConfig['field']) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  setPresences: (presences: SimulatedPresence[]) => void;
}

const DEFAULT_FILTERS: Filters = {
  statuses: [],
  priorities: [],
  assigneeIds: [],
  dueDateFrom: null,
  dueDateTo: null,
};

export const useStore = create<AppState>((set, get) => ({
  tasks: generateTasks(500),
  users: USERS,
  filters: { ...DEFAULT_FILTERS },
  sort: { field: 'dueDate', direction: 'asc' },
  view: 'kanban',
  presences: [],

  setView: (view) => set({ view }),

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  clearFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  setSort: (sort) => set({ sort }),

  toggleSort: (field) =>
    set((s) => {
      if (s.sort.field === field) {
        return { sort: { field, direction: s.sort.direction === 'asc' ? 'desc' : 'asc' } };
      }
      return { sort: { field, direction: 'asc' } };
    }),

  updateTaskStatus: (taskId, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    })),

  setPresences: (presences) => set({ presences }),
}));
