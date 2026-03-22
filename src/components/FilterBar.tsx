import React from 'react';
import { useStore } from '../store';
import { MultiDropdown } from './Dropdown';
import { Button } from './Button';
import { ALL_STATUSES, ALL_PRIORITIES, STATUS_CONFIG, PRIORITY_CONFIG } from '../types';
import { USERS } from '../data/seed';
import { isFiltersActive } from '../utils/filters';

const statusColors: Record<string, string> = {
  'todo': '#94a3b8',
  'in-progress': '#3b82f6',
  'in-review': '#f59e0b',
  'done': '#22c55e',
};

export const FilterBar: React.FC = () => {
  const filters = useStore((s) => s.filters);
  const setFilters = useStore((s) => s.setFilters);
  const clearFilters = useStore((s) => s.clearFilters);
  const active = isFiltersActive(filters);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <MultiDropdown
        label="Status"
        options={ALL_STATUSES.map((s) => ({ value: s, label: STATUS_CONFIG[s].label, color: statusColors[s] }))}
        values={filters.statuses}
        onChange={(v) => setFilters({ statuses: v as any })}
      />
      <MultiDropdown
        label="Priority"
        options={ALL_PRIORITIES.map((p) => ({ value: p, label: PRIORITY_CONFIG[p].label }))}
        values={filters.priorities}
        onChange={(v) => setFilters({ priorities: v as any })}
      />
      <MultiDropdown
        label="Assignee"
        options={USERS.map((u) => ({ value: u.id, label: u.name, color: u.color }))}
        values={filters.assigneeIds}
        onChange={(v) => setFilters({ assigneeIds: v })}
      />
      <div className="flex items-center gap-1.5">
        <label className="text-[11px] text-tracker-muted font-medium">From</label>
        <input
          type="date"
          value={filters.dueDateFrom || ''}
          onChange={(e) => setFilters({ dueDateFrom: e.target.value || null })}
          className="px-2 py-1 text-xs border border-tracker-border rounded-lg bg-tracker-surface focus:outline-none focus:ring-2 focus:ring-tracker-ring"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <label className="text-[11px] text-tracker-muted font-medium">To</label>
        <input
          type="date"
          value={filters.dueDateTo || ''}
          onChange={(e) => setFilters({ dueDateTo: e.target.value || null })}
          className="px-2 py-1 text-xs border border-tracker-border rounded-lg bg-tracker-surface focus:outline-none focus:ring-2 focus:ring-tracker-ring"
        />
      </div>
      {active && (
        <Button variant="danger" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
};
