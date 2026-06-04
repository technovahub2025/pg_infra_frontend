import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { employeeService } from '../services/employeeService';

export function useEmployees(params = {}) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeService.list(params),
  });
}

export function useEmployee(id) {
  return useQuery({
    queryKey: ['employee', id],
    enabled: Boolean(id),
    queryFn: () => employeeService.get(id),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => employeeService.create(payload),
    onSuccess: () => toast.success('Employee saved'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => employeeService.update(id, payload),
    onSuccess: () => toast.success('Employee updated'),
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables?.id] });
    },
  });
}

export function useUpdateEmployeeRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => employeeService.updateRole(id, payload),
    onSuccess: () => toast.success('Role updated'),
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables?.id] });
    },
  });
}

export function useDeactivateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => employeeService.deactivate(id),
    onSuccess: () => toast.success('Employee deactivated'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useEmployeeTasks(id) {
  return useQuery({
    queryKey: ['employee-tasks', id],
    enabled: Boolean(id),
    queryFn: () => employeeService.tasks(id),
  });
}

export function useEmployeeWorkload(id) {
  return useQuery({
    queryKey: ['employee-workload', id],
    enabled: Boolean(id),
    queryFn: () => employeeService.workload(id),
  });
}

export function useEmployeeDocuments(id) {
  return useQuery({
    queryKey: ['employee-documents', id],
    enabled: Boolean(id),
    queryFn: () => employeeService.documents(id),
  });
}
