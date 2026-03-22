import { useEffect } from 'react';
import { useStore } from '../store';
import { SimulatedPresence } from '../types';

const SIMULATED_USERS = ['u2', 'u3', 'u5', 'u6'];

export function usePresenceSimulation() {
  const tasks = useStore((s) => s.tasks);
  const setPresences = useStore((s) => s.setPresences);

  useEffect(() => {
    if (tasks.length === 0) return;

    const pickRandom = () => {
      const presences: SimulatedPresence[] = SIMULATED_USERS.map((userId) => ({
        userId,
        taskId: tasks[Math.floor(Math.random() * Math.min(50, tasks.length))].id,
      }));
      // Sometimes two users look at same task
      if (Math.random() > 0.5 && presences.length > 1) {
        presences[1].taskId = presences[0].taskId;
      }
      setPresences(presences);
    };

    pickRandom();
    const interval = setInterval(pickRandom, 4000);
    return () => clearInterval(interval);
  }, [tasks, setPresences]);
}
