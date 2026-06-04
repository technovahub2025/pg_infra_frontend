import { create } from 'zustand';
import { authService } from '../services/authService';
import { getHomePathForRole } from '../utils/roleUtils';

const emptyState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
  initialized: false,
};

function normalizeUser(data) {
  return data?.user || data?.data?.user || data?.data || null;
}

function normalizeAccessToken(data) {
  return data?.accessToken || data?.data?.accessToken || null;
}

export const useAuthStore = create((set, get) => ({
  ...emptyState,

  initialize: async () => {
    if (get().initialized) return;
    set({ loading: true });

    try {
      const meResponse = await authService.me();
      set({
        user: normalizeUser(meResponse),
        accessToken: normalizeAccessToken(meResponse),
        isAuthenticated: true,
        loading: false,
        initialized: true,
      });
      return;
    } catch (error) {
      if (error?.response?.status === 401) {
        try {
          await authService.refreshToken();
          const retry = await authService.me();
          set({
            user: normalizeUser(retry),
            accessToken: normalizeAccessToken(retry),
            isAuthenticated: true,
            loading: false,
            initialized: true,
          });
          return;
        } catch (refreshError) {
          // fall through to clear state
        }
      }
    }

    set({
      ...emptyState,
      loading: false,
      initialized: true,
    });
  },

  setAuth: (payload) =>
    set({
      user: normalizeUser(payload),
      accessToken: normalizeAccessToken(payload),
      isAuthenticated: true,
      loading: false,
      initialized: true,
    }),

  login: async ({ email, password }) => {
    const response = await authService.login({ email, password });
    get().setAuth(response);
    return response;
  },

  register: async (payload) => {
    const response = await authService.register(payload);
    get().setAuth(response);
    return response;
  },

  acceptInvite: async (token, payload) => {
    const response = await authService.acceptInvite(token, payload);
    get().setAuth(response);
    return response;
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({
        ...emptyState,
        loading: false,
        initialized: true,
      });
    }
  },

  forgotPassword: authService.forgotPassword,
  resetPassword: authService.resetPassword,
  validateInvite: authService.validateInvite,
  sendInvite: authService.sendInvite,

  homePath: () => getHomePathForRole(get().user?.role),
}));
