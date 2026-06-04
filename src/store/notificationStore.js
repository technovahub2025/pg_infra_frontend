import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  panelOpen: false,
  setNotifications: (notifications = []) => set({ notifications }),
  prependNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification?.isRead ? 0 : 1),
    })),
  updateNotification: (id, patch) =>
    set((state) => ({
      notifications: state.notifications.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
      unreadCount: 0,
    })),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),
  clear: () =>
    set({
      notifications: [],
      unreadCount: 0,
      panelOpen: false,
    }),
}));
