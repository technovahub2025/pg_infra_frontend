import { useQuery } from '@tanstack/react-query';
import { fetchDashboard, fetchEmployeeDashboard, fetchSuperadminDashboard } from '../api/dashboard';

export function useDashboard(role = 'superadmin') {
  return useQuery({
    queryKey: ['dashboard', role],
    queryFn: async () => {
      if (role === 'employee') return fetchEmployeeDashboard();
      if (role === 'superadmin') return fetchSuperadminDashboard();
      return fetchDashboard();
    },
  });
}
