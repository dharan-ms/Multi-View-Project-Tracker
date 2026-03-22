import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useStore } from '../store';
import { applyFilters, applySort } from '../utils/filters';
import { formatDueDate } from '../utils/dates';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Dropdown } from '../components/Dropdown';
import { EmptyState } from '../components/EmptyState';
import { USERS } from '../data/seed';
import { STATUS_CONFIG, ALL_STATUSES, SortField } from '../types';

const ROW_HEIGHT = 52;
const BUFFER = 5;

const STATUS_OPTIONS = ALL_STATUSES.map((s) => ({
  value: s,
  label: STATUS_CONFIG[s].label,
}));

export const ListView: React.FC = () => {
  const tasks = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const sort = useStore((s) => s.sort);
  const toggleSort = useStore((s) => s.toggleSort);
  const updateTaskStatus = useStore((s) => s.updateTaskStatus);
  const clearFilters = useStore((s) => s.clearFilters);

  const data = useMemo(() => {
    const filtered = applyFilters(tasks, filters);
    return applySort(filtered, sort);
  }, [tasks, filters, sort]);

  // Virtual scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop);
  }, []);

  const totalHeight = data.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(data.length, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER);
  const visibleItems = data.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sort.field === field;
    return (
      <button
        onClick={() => toggleSort(field)}
        className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          isActive ? 'text-tracker-primary' : 'text-tracker-muted hover:text-tracker-text'
        }`}
      >
        {label}
        {isActive && (
          <svg className={`w-3 h-3 transition-transform ${sort.direction === 'desc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        )}
      </button>
    );
  };

  if (data.length === 0) {
    return (
      <EmptyState
        title="No tasks match your filters"
        description="Try adjusting your filters to see more tasks"
        action={{ label: 'Clear all filters', onClick: clearFilters }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_100px_120px_120px] gap-2 px-4 py-2.5 border-b border-tracker-border bg-tracker-surface/50 rounded-t-xl">
        <SortHeader field="title" label="Title" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-tracker-muted">Assignee</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-tracker-muted">Status</span>
        <SortHeader field="priority" label="Priority" />
        <SortHeader field="dueDate" label="Due Date" />
      </div>

      {/* Virtualized body */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((task) => {
              const user = USERS.find((u) => u.id === task.assigneeId);
              const dueInfo = formatDueDate(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="grid grid-cols-[1fr_100px_100px_120px_120px] gap-2 px-4 items-center border-b border-tracker-border/50 hover:bg-tracker-hover/50 transition-colors"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span className="text-sm text-tracker-text truncate">{task.title}</span>
                  <div className="flex items-center">
                    {user && <Avatar initials={user.initials} color={user.color} size="sm" />}
                  </div>
                  <Dropdown
                    options={STATUS_OPTIONS}
                    value={task.status}
                    onChange={(v) => updateTaskStatus(task.id, v as any)}
                  />
                  <Badge priority={task.priority} />
                  <span className={`text-xs font-medium ${dueInfo.isOverdue ? 'text-tracker-danger' : dueInfo.isDueToday ? 'text-tracker-warning' : 'text-tracker-muted'}`}>
                    {dueInfo.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
