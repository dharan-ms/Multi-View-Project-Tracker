import React, { useMemo, useRef } from 'react';
import { useStore } from '../store';
import { applyFilters } from '../utils/filters';
import { getDaysInMonth } from '../utils/dates';
import { USERS } from '../data/seed';
import { Priority } from '../types';

const ROW_HEIGHT = 36;
const DAY_WIDTH = 40;
const LABEL_WIDTH = 240;

const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#94a3b8',
};

export const TimelineView: React.FC = () => {
  const tasks = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const todayDate = now.getDate();

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);

  // Only show tasks that have some overlap with this month
  const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

  const timelineTasks = useMemo(() => {
    return filtered.filter((t) => {
      const start = t.startDate || t.dueDate;
      const end = t.dueDate;
      return start <= monthEnd && end >= monthStart;
    });
  }, [filtered, monthStart, monthEnd]);

  const totalWidth = daysInMonth * DAY_WIDTH;

  return (
    <div className="flex flex-col h-full">
      <div className="text-sm font-semibold text-tracker-text px-4 py-2">{monthName}</div>

      <div className="flex-1 overflow-auto border border-tracker-border rounded-xl" ref={scrollRef}>
        <div style={{ minWidth: LABEL_WIDTH + totalWidth }}>
          {/* Day headers */}
          <div className="flex sticky top-0 z-10 bg-tracker-surface border-b border-tracker-border">
            <div className="shrink-0 border-r border-tracker-border px-3 py-2 text-[11px] font-semibold text-tracker-muted uppercase" style={{ width: LABEL_WIDTH }}>
              Task
            </div>
            <div className="flex relative" style={{ width: totalWidth }}>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const d = i + 1;
                const isToday = d === todayDate;
                const isWeekend = new Date(year, month, d).getDay() % 6 === 0;
                return (
                  <div
                    key={d}
                    className={`text-center text-[10px] py-2 border-r border-tracker-border/50 font-medium ${
                      isToday ? 'bg-tracker-primary/10 text-tracker-primary font-bold' : isWeekend ? 'bg-tracker-hover/50 text-tracker-muted' : 'text-tracker-muted'
                    }`}
                    style={{ width: DAY_WIDTH }}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows */}
          {timelineTasks.map((task) => {
            const user = USERS.find((u) => u.id === task.assigneeId);
            const startDay = task.startDate
              ? Math.max(1, new Date(task.startDate + 'T00:00:00').getMonth() === month ? new Date(task.startDate + 'T00:00:00').getDate() : 1)
              : new Date(task.dueDate + 'T00:00:00').getDate();
            const endDay = Math.min(daysInMonth, new Date(task.dueDate + 'T00:00:00').getMonth() === month ? new Date(task.dueDate + 'T00:00:00').getDate() : daysInMonth);

            const left = (startDay - 1) * DAY_WIDTH;
            const width = task.startDate ? Math.max(DAY_WIDTH, (endDay - startDay + 1) * DAY_WIDTH) : DAY_WIDTH * 0.6;
            const barLeft = task.startDate ? left : left + DAY_WIDTH * 0.2;

            return (
              <div key={task.id} className="flex border-b border-tracker-border/30 hover:bg-tracker-hover/30 transition-colors" style={{ height: ROW_HEIGHT }}>
                <div className="shrink-0 flex items-center gap-2 px-3 border-r border-tracker-border text-xs text-tracker-text truncate" style={{ width: LABEL_WIDTH }}>
                  {user && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white font-semibold shrink-0" style={{ backgroundColor: user.color }}>
                      {user.initials}
                    </span>
                  )}
                  <span className="truncate">{task.title}</span>
                </div>
                <div className="relative flex-1" style={{ width: totalWidth }}>
                  {/* Today line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-tracker-primary/40 z-10"
                    style={{ left: (todayDate - 0.5) * DAY_WIDTH }}
                  />
                  <div
                    className={`absolute top-1.5 rounded-full ${task.startDate ? 'h-5' : 'h-5 rounded-md'}`}
                    style={{
                      left: barLeft,
                      width,
                      backgroundColor: PRIORITY_COLORS[task.priority],
                      opacity: 0.85,
                    }}
                    title={`${task.title} (${task.priority})`}
                  />
                </div>
              </div>
            );
          })}

          {timelineTasks.length === 0 && (
            <div className="py-16 text-center text-sm text-tracker-muted">No tasks visible in this month range</div>
          )}
        </div>
      </div>
    </div>
  );
};
