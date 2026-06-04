import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { exportProjectsToExcel } from '../lib/export';
import { useProjects } from './useProjects';

export function useExportProjects() {
  const { data: projects = [] } = useProjects();
  return useMemo(
    () => ({
      exportProjects: () => exportProjectsToExcel(projects),
    }),
    [projects],
  );
}

export function useDashboardProjects() {
  return useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: async () => [],
  });
}

