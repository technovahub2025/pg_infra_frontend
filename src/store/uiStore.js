import { create } from 'zustand';

function readTheme() {
  try {
    return localStorage.getItem('pg-theme') || 'light';
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

export const useUiStore = create((set) => ({
  theme: readTheme(),
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
    writeTheme(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      writeTheme(theme);
      return { theme };
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
