import { Task, Filters, SortConfig, PRIORITY_CONFIG } from '../types';

export function applyFilters(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter(t => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(t.status)) return false;
    if (filters.priorities.length > 0 && !filters.priorities.includes(t.priority)) return false;
    if (filters.assigneeIds.length > 0 && !filters.assigneeIds.includes(t.assigneeId)) return false;
    if (filters.dueDateFrom && t.dueDate < filters.dueDateFrom) return false;
    if (filters.dueDateTo && t.dueDate > filters.dueDateTo) return false;
    return true;
  });
}

export function applySort(tasks: Task[], sort: SortConfig): Task[] {
  const sorted = [...tasks];
  const dir = sort.direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sort.field) {
      case 'title':
        return dir * a.title.localeCompare(b.title);
      case 'priority':
        return dir * (PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order);
      case 'dueDate':
        return dir * a.dueDate.localeCompare(b.dueDate);
      default:
        return 0;
    }
  });

  return sorted;
}

export function isFiltersActive(filters: Filters): boolean {
  return (
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assigneeIds.length > 0 ||
    filters.dueDateFrom !== null ||
    filters.dueDateTo !== null
  );
}
