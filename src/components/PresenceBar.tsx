import React from 'react';
import { Avatar } from './Avatar';
import { useStore } from '../store';
import { USERS } from '../data/seed';

export const PresenceBar: React.FC = () => {
  const presences = useStore((s) => s.presences);
  const uniqueUserIds = [...new Set(presences.map((p) => p.userId))];
  const users = uniqueUserIds.map((id) => USERS.find((u) => u.id === id)).filter(Boolean);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-tracker-muted">
      <div className="flex -space-x-1.5">
        {users.slice(0, 4).map((u) =>
          u ? <Avatar key={u.id} initials={u.initials} color={u.color} size="sm" ring /> : null
        )}
      </div>
      <span>{users.length} {users.length === 1 ? 'person is' : 'people are'} viewing this board</span>
    </div>
  );
};
