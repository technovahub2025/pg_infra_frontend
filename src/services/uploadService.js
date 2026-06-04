import { api } from './api';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

function toFormData(payload = {}) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, value);
  });
  return formData;
}

export const uploadService = {
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/upload/avatar', formData);
    return unwrap(response);
  },
  async uploadDocument(payload) {
    const formData = toFormData(payload);
    const response = await api.post('/upload/document', formData);
    return unwrap(response);
  },
  async deleteDocument(publicId) {
    const response = await api.delete(`/upload/${encodeURIComponent(publicId)}`);
    return unwrap(response);
  },
  async getProjectDocuments(projectId) {
    const response = await api.get(`/projects/${projectId}/documents`);
    return unwrap(response);
  },
  async getEmployeeDocuments(employeeId) {
    const response = await api.get(`/employees/${employeeId}/documents`);
    return unwrap(response);
  },
};
