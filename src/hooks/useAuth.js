import { useAuthStore } from '../store/authStore';

export function useAuth(selector) {
  return useAuthStore(selector || ((state) => state));
}
