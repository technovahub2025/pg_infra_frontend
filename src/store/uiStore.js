import { create } from 'zustand';

function readTheme() {
  try {
    const stored = localStorage.getItem('pg-theme');
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
  } catch {
    return 'light';
  }
}

function writeTheme(theme) {
  try {
    localStorage.setItem('pg-theme', theme);
  } catch {
    // ignore storage failures
  }
}

function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme) {
  if (theme === 'system') {
    return getSystemTheme();
  }

  return theme === 'dark' ? 'dark' : 'light';
}

export const useUiStore = create((set) => ({
  theme: readTheme(),
  resolvedTheme: resolveTheme(readTheme()),
  sidebarOpen: false,
  sidebarCollapsed: false,
  mobileSearchOpen: false,
  activeModal: null,
  modalData: null,
  confirmState: {
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    tone: 'amber',
    onConfirm: null,
  },
  setTheme: (theme) => {
    const nextTheme = theme === 'dark' || theme === 'light' || theme === 'system' ? theme : 'light';
    writeTheme(nextTheme);
    set({ theme: nextTheme, resolvedTheme: resolveTheme(nextTheme) });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.resolvedTheme === 'dark' ? 'light' : 'dark';
      writeTheme(nextTheme);
      return { theme: nextTheme, resolvedTheme: nextTheme };
    }),
  syncResolvedTheme: () =>
    set((state) => {
      const resolvedTheme = resolveTheme(state.theme);
      return state.resolvedTheme === resolvedTheme ? state : { resolvedTheme };
    }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setMobileSearchOpen: (mobileSearchOpen) => set({ mobileSearchOpen }),
  openModal: (activeModal, modalData = null) => set({ activeModal, modalData }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  openConfirm: (confirmState) =>
    set({
      confirmState: {
        open: true,
        title: confirmState?.title || 'Confirm action',
        message: confirmState?.message || 'Are you sure?',
        confirmLabel: confirmState?.confirmLabel || 'Confirm',
        cancelLabel: confirmState?.cancelLabel || 'Cancel',
        tone: confirmState?.tone || 'amber',
        onConfirm: confirmState?.onConfirm || null,
      },
    }),
  closeConfirm: () =>
    set((state) => ({
      confirmState: {
        ...state.confirmState,
        open: false,
        onConfirm: null,
      },
    })),
}));
