import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-12 h-12 rounded-full bg-tracker-hover flex items-center justify-center mb-4">
      <svg className="w-6 h-6 text-tracker-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 className="text-sm font-semibold text-tracker-text mb-1">{title}</h3>
    <p className="text-xs text-tracker-muted mb-4 max-w-[220px]">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="text-xs font-medium text-tracker-primary hover:text-tracker-primary-hover transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);
