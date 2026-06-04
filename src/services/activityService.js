import { api } from '../lib/api';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export const activityService = {
  async list(params = {}) {
    const response = await api.get('/activity-logs', { params });
    return unwrap(response);
  },
};
