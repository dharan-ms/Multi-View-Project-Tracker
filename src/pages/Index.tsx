import React from 'react';
import { useStore } from '../store';
import { FilterBar } from '../components/FilterBar';
import { PresenceBar } from '../components/PresenceBar';
import { KanbanView } from '../views/KanbanView';
import { ListView } from '../views/ListView';
import { TimelineView } from '../views/TimelineView';
import { usePresenceSimulation } from '../hooks/usePresenceSimulation';
import { useUrlSync } from '../hooks/useUrlSync';
import { ViewMode } from '../types';

const VIEW_TABS: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'kanban',
    label: 'Board',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4H5a1 1 0 00-1 1v5a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zm10 0h-4a1 1 0 00-1 1v7a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1zM9 14H5a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1zm10 0h-4a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1z" />
      </svg>
    ),
  },
  {
    value: 'list',
    label: 'List',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    value: 'timeline',
    label: 'Timeline',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const Index: React.FC = () => {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);

  usePresenceSimulation();
  useUrlSync();

  return (
    <div className="flex flex-col h-screen bg-tracker-bg">
      {/* Top bar */}
      <header className="shrink-0 border-b border-tracker-border bg-white px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Multi-View Project Tracker"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
            />
            <h1 className="text-lg font-bold text-tracker-text tracking-tight">Multi-View Project Tracker</h1>
          </div>
          <PresenceBar />
        </div>
      </header>

      {/* View tabs + filters */}
      <div className="shrink-0 px-4 md:px-6 py-3 bg-white border-b border-tracker-border space-y-3">
        <div className="flex items-center gap-1 bg-tracker-surface rounded-lg p-0.5 w-fit">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setView(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                view === tab.value
                  ? 'bg-white text-tracker-text shadow-sm'
                  : 'text-tracker-muted hover:text-tracker-text'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <FilterBar />
      </div>

      {/* View content */}
      <main className="flex-1 overflow-hidden px-4 md:px-6 py-4">
        {view === 'kanban' && <KanbanView />}
        {view === 'list' && <ListView />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
};

export default Index;
