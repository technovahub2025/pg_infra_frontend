import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { normalizeTask } from '../lib/phase2';
import { taskService } from '../services/taskService';
import { useAuthStore } from '../store/authStore';

export function useTasks(filters = {}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const rows = await taskService.list(filters);
      return rows.map(normalizeTask);
    },
  });
}

export function useMyTasks() {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ['my-tasks', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const rows = await taskService.mine();
      return rows.map(normalizeTask);
    },
  });
}

export function useTask(id) {
  return useQuery({
    queryKey: ['task', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const payload = await taskService.get(id);
      return normalizeTask(payload);
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => taskService.create(payload),
    onSuccess: () => toast.success('Task created'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => taskService.update(id, payload),
    onSuccess: () => toast.success('Task updated'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => taskService.remove(id),
    onSuccess: () => toast.success('Task deleted'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useReorderTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items) => taskService.reorder(items),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

export function useAddTaskComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, text }) => taskService.comment(id, { text }),
    onSuccess: () => toast.success('Comment added'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
