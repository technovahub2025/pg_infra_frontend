import { api } from '../lib/api';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export const stageService = {
  async list(params = {}) {
    const response = await api.get('/stages', { params });
    const payload = unwrap(response);
    return payload.data || payload || [];
  },

  async create(projectId, payload) {
    const response = await api.post(`/projects/${projectId}/stages`, payload);
    return unwrap(response);
  },

  async update(id, payload) {
    const response = await api.put(`/stages/${id}`, payload);
    return unwrap(response);
  },

  async remove(id) {
    const response = await api.delete(`/stages/${id}`);
    return unwrap(response);
  },

  async approve(id, payload) {
    const response = await api.put(`/stages/${id}/approval`, payload);
    return unwrap(response);
  },
};

