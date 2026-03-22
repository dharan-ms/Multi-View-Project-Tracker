import React, { useMemo } from 'react';
import { Task } from '../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { formatDueDate } from '../utils/dates';
import { useStore } from '../store';
import { USERS } from '../data/seed';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, isDragging = false, style }) => {
  const presences = useStore((s) => s.presences);
  const user = useMemo(() => USERS.find((u) => u.id === task.assigneeId), [task.assigneeId]);
  const dueInfo = useMemo(() => formatDueDate(task.dueDate), [task.dueDate]);
  const taskPresences = useMemo(
    () => presences.filter((p) => p.taskId === task.id),
    [presences, task.id]
  );

  return (
    <div
      className={`bg-white rounded-lg border border-tracker-border p-3 transition-shadow group ${isDragging ? 'shadow-xl opacity-80 rotate-1' : 'shadow-sm hover:shadow-md'}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-tracker-text leading-snug line-clamp-2 flex-1">{task.title}</h4>
        {user && <Avatar initials={user.initials} color={user.color} size="sm" />}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Badge priority={task.priority} />
        <span
          className={`text-[11px] font-medium ${
            dueInfo.isOverdue
              ? 'text-tracker-danger'
              : dueInfo.isDueToday
              ? 'text-tracker-warning'
              : 'text-tracker-muted'
          }`}
        >
          {dueInfo.text}
        </span>
      </div>
      {taskPresences.length > 0 && (
        <div className="flex items-center gap-0.5 mt-2 pt-2 border-t border-tracker-border/50">
          {taskPresences.slice(0, 3).map((p) => {
            const pu = USERS.find((u) => u.id === p.userId);
            return pu ? <Avatar key={p.userId} initials={pu.initials} color={pu.color} size="sm" ring /> : null;
          })}
          {taskPresences.length > 3 && (
            <span className="text-[10px] font-semibold text-tracker-muted ml-0.5">+{taskPresences.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
});

TaskCard.displayName = 'TaskCard';
