import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { applyFilters } from '../utils/filters';
import { Status, ALL_STATUSES, STATUS_CONFIG } from '../types';

const STATUS_COLORS: Record<Status, string> = {
  'todo': 'bg-slate-400',
  'in-progress': 'bg-blue-500',
  'in-review': 'bg-amber-500',
  'done': 'bg-emerald-500',
};

interface DragState {
  taskId: string;
  sourceStatus: Status;
  offsetX: number;
  offsetY: number;
  x: number;
  y: number;
  cardWidth: number;
  cardHeight: number;
}

export const KanbanView: React.FC = () => {
  const tasks = useStore((s) => s.tasks);
  const filters = useStore((s) => s.filters);
  const updateTaskStatus = useStore((s) => s.updateTaskStatus);

  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);
  const columns = useMemo(() => {
    const map: Record<Status, typeof tasks> = { 'todo': [], 'in-progress': [], 'in-review': [], 'done': [] };
    filtered.forEach((t) => map[t.status].push(t));
    return map;
  }, [filtered]);

  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<Status | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getColumnFromPoint = useCallback((x: number, y: number): Status | null => {
    for (const status of ALL_STATUSES) {
      const el = columnRefs.current[status];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return status;
      }
    }
    return null;
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent, taskId: string, sourceStatus: Status) => {
    if (e.button !== 0) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    target.setPointerCapture(e.pointerId);
    setDrag({
      taskId,
      sourceStatus,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      x: e.clientX,
      y: e.clientY,
      cardWidth: rect.width,
      cardHeight: rect.height,
    });
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag) return;
    setDrag((d) => d ? { ...d, x: e.clientX, y: e.clientY } : null);
    setHoveredColumn(getColumnFromPoint(e.clientX, e.clientY));
  }, [drag, getColumnFromPoint]);

  const onPointerUp = useCallback(() => {
    if (!drag) return;
    if (hoveredColumn && hoveredColumn !== drag.sourceStatus) {
      updateTaskStatus(drag.taskId, hoveredColumn);
    }
    setDrag(null);
    setHoveredColumn(null);
  }, [drag, hoveredColumn, updateTaskStatus]);

  // Touch support
  useEffect(() => {
    if (!drag) return;
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, [drag]);

  return (
    <div
      className="flex gap-4 h-full overflow-x-auto pb-4"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {ALL_STATUSES.map((status) => {
        const col = columns[status];
        const isTarget = hoveredColumn === status && drag && drag.sourceStatus !== status;

        return (
          <div
            key={status}
            ref={(el) => { columnRefs.current[status] = el; }}
            className={`flex-1 min-w-[280px] max-w-[360px] flex flex-col rounded-xl transition-colors duration-200 ${
              isTarget ? 'bg-tracker-primary/5 ring-2 ring-tracker-primary/20' : 'bg-tracker-surface/50'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 px-3 py-3">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status]}`} />
              <h3 className="text-sm font-semibold text-tracker-text">{STATUS_CONFIG[status].label}</h3>
              <span className="text-[11px] font-medium text-tracker-muted bg-tracker-hover rounded-full px-2 py-0.5">
                {col.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[200px]">
              {col.length === 0 ? (
                <EmptyState
                  title="No tasks"
                  description={`No tasks in ${STATUS_CONFIG[status].label}`}
                />
              ) : (
                col.map((task) => {
                  const isDragging = drag?.taskId === task.id;
                  return (
                    <div
                      key={task.id}
                      onPointerDown={(e) => onPointerDown(e, task.id, status)}
                      className="touch-none select-none cursor-grab active:cursor-grabbing"
                      style={isDragging ? { height: drag.cardHeight, opacity: 0.3, border: '2px dashed hsl(215,20%,80%)', borderRadius: 8, background: 'hsl(210,20%,97%)' } : undefined}
                    >
                      {!isDragging && <TaskCard task={task} />}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}

      {/* Dragging overlay */}
      {drag && (() => {
        const task = tasks.find((t) => t.id === drag.taskId);
        if (!task) return null;
        return (
          <div
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: drag.x - drag.offsetX,
              top: drag.y - drag.offsetY,
              width: drag.cardWidth,
            }}
          >
            <TaskCard task={task} isDragging />
          </div>
        );
      })()}
    </div>
  );
};
