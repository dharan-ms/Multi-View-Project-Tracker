import { Filters, Status, Priority, ViewMode } from '../types';

export function filtersToSearchParams(filters: Filters, view: ViewMode): string {
  const params = new URLSearchParams();
  if (view !== 'kanban') params.set('view', view);
  if (filters.statuses.length) params.set('status', filters.statuses.join(','));
  if (filters.priorities.length) params.set('priority', filters.priorities.join(','));
  if (filters.assigneeIds.length) params.set('assignee', filters.assigneeIds.join(','));
  if (filters.dueDateFrom) params.set('from', filters.dueDateFrom);
  if (filters.dueDateTo) params.set('to', filters.dueDateTo);
  return params.toString();
}

export function searchParamsToFilters(search: string): { filters: Partial<Filters>; view: ViewMode } {
  const params = new URLSearchParams(search);
  const view = (params.get('view') as ViewMode) || 'kanban';
  const filters: Partial<Filters> = {};

  const status = params.get('status');
  if (status) filters.statuses = status.split(',') as Status[];

  const priority = params.get('priority');
  if (priority) filters.priorities = priority.split(',') as Priority[];

  const assignee = params.get('assignee');
  if (assignee) filters.assigneeIds = assignee.split(',');

  const from = params.get('from');
  if (from) filters.dueDateFrom = from;

  const to = params.get('to');
  if (to) filters.dueDateTo = to;

  return { filters, view };
}
