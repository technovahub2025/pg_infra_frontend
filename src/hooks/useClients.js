import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { normalizeClient } from '../lib/phase2';
import { clientService } from '../services/clientService';

export function useClients(params = {}, queryOptions = {}) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const rows = await clientService.list(params);
      return rows.map(normalizeClient);
    },
    ...queryOptions,
  });
}

export function useClient(id, queryOptions = {}) {
  return useQuery({
    queryKey: ['client', id],
    enabled: Boolean(id),
    queryFn: async () => normalizeClient(await clientService.get(id)),
    ...queryOptions,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => clientService.create(payload),
    onSuccess: () => toast.success('Client created'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => clientService.update(id, payload),
    onSuccess: () => toast.success('Client updated'),
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables?.id] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => clientService.remove(id),
    onSuccess: () => toast.success('Client deleted'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
