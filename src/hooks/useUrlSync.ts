import { useEffect } from 'react';
import { useStore } from '../store';
import { filtersToSearchParams, searchParamsToFilters } from '../utils/url';

export function useUrlSync() {
  const filters = useStore((s) => s.filters);
  const view = useStore((s) => s.view);
  const setFilters = useStore((s) => s.setFilters);
  const setView = useStore((s) => s.setView);

  // Read from URL on mount
  useEffect(() => {
    const { filters: parsed, view: parsedView } = searchParamsToFilters(window.location.search);
    if (Object.keys(parsed).length > 0) setFilters(parsed);
    if (parsedView) setView(parsedView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write to URL on change
  useEffect(() => {
    const search = filtersToSearchParams(filters, view);
    const url = search ? `?${search}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [filters, view]);

  // Handle back/forward
  useEffect(() => {
    const handler = () => {
      const { filters: parsed, view: parsedView } = searchParamsToFilters(window.location.search);
      setFilters({
        statuses: parsed.statuses || [],
        priorities: parsed.priorities || [],
        assigneeIds: parsed.assigneeIds || [],
        dueDateFrom: parsed.dueDateFrom || null,
        dueDateTo: parsed.dueDateTo || null,
      });
      setView(parsedView);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [setFilters, setView]);
}
