import React from 'react';
import { Priority } from '../types';

const priorityStyles: Record<Priority, string> = {
  critical: 'bg-tracker-priority-critical/12 text-tracker-priority-critical border-tracker-priority-critical/25',
  high: 'bg-tracker-priority-high/12 text-tracker-priority-high border-tracker-priority-high/25',
  medium: 'bg-tracker-priority-medium/12 text-tracker-priority-medium border-tracker-priority-medium/25',
  low: 'bg-tracker-priority-low/12 text-tracker-priority-low border-tracker-priority-low/25',
};

const labels: Record<Priority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

interface BadgeProps {
  priority: Priority;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ priority, className = '' }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold leading-tight border ${priorityStyles[priority]} ${className}`}
  >
    {labels[priority]}
  </span>
);
