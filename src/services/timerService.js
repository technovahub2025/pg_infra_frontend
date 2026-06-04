import { api } from './api';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export const timerService = {
  async active() {
    const response = await api.get('/timer/active');
    return unwrap(response);
  },
  async start(payload) {
    const response = await api.post('/timer/start', payload);
    return unwrap(response);
  },
  async stop() {
    const response = await api.put('/timer/stop');
    return unwrap(response);
  },
  async mine(params) {
    const response = await api.get('/timer/logs/mine', { params });
    return unwrap(response);
  },
  async manual(payload) {
    const response = await api.post('/timer/manual', payload);
    return unwrap(response);
  },
  async remove(id) {
    const response = await api.delete(`/timer/${id}`);
    return unwrap(response);
  },
};
