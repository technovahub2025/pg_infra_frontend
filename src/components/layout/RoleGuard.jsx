import { useAuthStore } from '../../store/authStore';

export function RoleGuard({ roles = [], fallback = null, children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return fallback;
  }

  if (roles.length === 0 || roles.includes(user.role)) {
    return children;
  }

  return fallback;
}
