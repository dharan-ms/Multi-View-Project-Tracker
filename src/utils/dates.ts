export function formatDueDate(dueDate: string): { text: string; isOverdue: boolean; isSevere: boolean; isDueToday: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { text: 'Due Today', isOverdue: false, isSevere: false, isDueToday: true };
  if (diffDays < -7) return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true, isSevere: true, isDueToday: false };
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isSevere: false, isDueToday: false };

  const d = due;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return { text: `${months[d.getMonth()]} ${d.getDate()}`, isOverdue: false, isSevere: false, isDueToday: false };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}
