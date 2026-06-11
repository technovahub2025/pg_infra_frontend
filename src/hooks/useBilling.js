import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { billingService } from '../services/billingService';

export function useBilling(params = {}) {
  return useQuery({
    queryKey: ['billing', params],
    queryFn: () => billingService.list(params),
  });
}

export function useBillingSummary() {
  return useQuery({
    queryKey: ['billing-summary'],
    queryFn: () => billingService.summary(),
  });
}

export function useProjectInvoice(projectId) {
  return useQuery({
    queryKey: ['invoice', projectId],
    enabled: Boolean(projectId),
    queryFn: () => billingService.byProject(projectId),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => billingService.create(payload),
    onSuccess: () => {
      toast.success('Invoice created');
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => billingService.update(id, payload),
    onSuccess: () => {
      toast.success('Invoice updated');
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => billingService.remove(id),
    onSuccess: () => {
      toast.success('Invoice deleted');
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['billing-summary'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
