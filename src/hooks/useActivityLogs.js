import { useQuery } from '@tanstack/react-query';
import { activityService } from '../services/activityService';

export function useActivityLogs(params = {}) {
  return useQuery({
    queryKey: ['activity-logs', params],
    queryFn: () => activityService.list(params),
  });
}
