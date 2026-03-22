import { User, Task, Status, Priority } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Maya Chen', initials: 'MC', color: 'hsl(200, 70%, 50%)' },
  { id: 'u2', name: 'Raj Patel', initials: 'RP', color: 'hsl(340, 65%, 50%)' },
  { id: 'u3', name: 'Lena Okafor', initials: 'LO', color: 'hsl(160, 60%, 40%)' },
  { id: 'u4', name: 'Tom Eriksen', initials: 'TE', color: 'hsl(30, 75%, 50%)' },
  { id: 'u5', name: 'Sofia Ruiz', initials: 'SR', color: 'hsl(270, 55%, 55%)' },
  { id: 'u6', name: 'Jin Tanaka', initials: 'JT', color: 'hsl(50, 70%, 45%)' },
];

const TASK_PREFIXES = [
  'Implement', 'Fix', 'Update', 'Refactor', 'Design', 'Review', 'Test',
  'Optimize', 'Document', 'Configure', 'Migrate', 'Build', 'Debug', 'Deploy',
  'Integrate', 'Research', 'Prototype', 'Audit', 'Set up', 'Create',
];

const TASK_SUBJECTS = [
  'user authentication flow', 'payment gateway integration', 'dashboard analytics',
  'search functionality', 'notification system', 'file upload service',
  'API rate limiting', 'database indexing', 'caching layer', 'error handling',
  'onboarding wizard', 'settings page', 'email templates', 'data export',
  'role-based access', 'CI/CD pipeline', 'logging infrastructure', 'webhook handler',
  'GraphQL schema', 'mobile responsive layout', 'dark mode support', 'accessibility audit',
  'unit test coverage', 'load balancer config', 'SSL certificate renewal',
  'backup automation', 'monitoring alerts', 'feature flags', 'A/B testing framework',
  'localization support', 'password reset flow', 'two-factor authentication',
  'session management', 'image compression pipeline', 'CDN configuration',
  'microservice gateway', 'queue worker process', 'real-time sync engine',
  'data validation layer', 'admin panel controls',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function generateTasks(count: number = 500): Task[] {
  const rand = seededRandom(42);
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const tasks: Task[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const statuses: Status[] = ['todo', 'in-progress', 'in-review', 'done'];
  const priorities: Priority[] = ['critical', 'high', 'medium', 'low'];
  const statusWeights = [0.3, 0.25, 0.2, 0.25];
  const priorityWeights = [0.1, 0.25, 0.4, 0.25];

  function weightedPick<T>(items: T[], weights: number[]): T {
    const r = rand();
    let cumulative = 0;
    for (let i = 0; i < items.length; i++) {
      cumulative += weights[i];
      if (r <= cumulative) return items[i];
    }
    return items[items.length - 1];
  }

  function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function toISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  for (let i = 0; i < count; i++) {
    const prefix = pick(TASK_PREFIXES);
    const subject = pick(TASK_SUBJECTS);
    const title = `${prefix} ${subject}${i > 40 ? ` (#${i})` : ''}`;
    const status = weightedPick(statuses, statusWeights);
    const priority = weightedPick(priorities, priorityWeights);
    const assignee = pick(USERS);

    let dueDate: Date;
    let startDate: Date | null = null;

    // Ensure variety in dates
    if (i < 15) {
      // Overdue by more than 7 days
      dueDate = addDays(today, -Math.floor(rand() * 20 + 8));
    } else if (i < 30) {
      // Due today
      dueDate = new Date(today);
    } else if (i < 50) {
      // Overdue by 1-7 days
      dueDate = addDays(today, -Math.floor(rand() * 7 + 1));
    } else if (i < 80) {
      // Missing start dates
      dueDate = addDays(today, Math.floor(rand() * 30 + 1));
      startDate = null;
    } else {
      // Normal future tasks
      dueDate = addDays(today, Math.floor(rand() * 60 - 10));
    }

    // For non-special cases, generate start dates
    if (i >= 80 && rand() > 0.15) {
      const daysBefore = Math.floor(rand() * 14 + 1);
      startDate = addDays(dueDate, -daysBefore);
    }

    const createdAt = addDays(dueDate, -Math.floor(rand() * 30 + 7));

    tasks.push({
      id: `task-${i + 1}`,
      title,
      assigneeId: assignee.id,
      status,
      priority,
      startDate: startDate ? toISO(startDate) : null,
      dueDate: toISO(dueDate),
      createdAt: createdAt.toISOString(),
      updatedAt: new Date(createdAt.getTime() + rand() * 86400000 * 5).toISOString(),
    });
  }

  return tasks;
}
