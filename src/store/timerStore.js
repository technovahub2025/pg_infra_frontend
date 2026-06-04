import { create } from 'zustand';

let tickerId = null;

function computeElapsedSeconds(startTime) {
  if (!startTime) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
}

export const useTimerStore = create((set, get) => ({
  activeLog: null,
  isRunning: false,
  elapsedSeconds: 0,
  syncing: false,
  setSyncing: (syncing) => set({ syncing }),
  setActiveLog: (activeLog) =>
    set({
      activeLog,
      isRunning: Boolean(activeLog),
      elapsedSeconds: activeLog ? activeLog.elapsedSeconds || computeElapsedSeconds(activeLog.startTime) : 0,
    }),
  clearActiveLog: () =>
    set({
      activeLog: null,
      isRunning: false,
      elapsedSeconds: 0,
    }),
  tick: () => {
    const { activeLog } = get();
    if (!activeLog?.startTime) return;
    set({ elapsedSeconds: computeElapsedSeconds(activeLog.startTime) });
  },
  startTicker: () => {
    if (tickerId) return;
    tickerId = setInterval(() => {
      const { activeLog } = get();
      if (!activeLog?.startTime) return;
      set({ elapsedSeconds: computeElapsedSeconds(activeLog.startTime) });
    }, 1000);
  },
  stopTicker: () => {
    if (tickerId) {
      clearInterval(tickerId);
      tickerId = null;
    }
  },
}));

export function formatDuration(seconds = 0) {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = Math.floor(total % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
