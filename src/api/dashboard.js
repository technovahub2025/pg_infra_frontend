import { api } from '../lib/api';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export async function fetchDashboard() {
  const response = await api.get('/dashboard');
  return unwrap(response);
}

export async function fetchSuperadminDashboard() {
  const response = await api.get('/dashboard/superadmin');
  return unwrap(response);
}

export async function fetchEmployeeDashboard() {
  const response = await api.get('/dashboard/employee');
  return unwrap(response);
}

export async function fetchProjects(params = {}) {
  const response = await api.get('/projects', { params });
  const payload = unwrap(response);
  return payload.projects || payload.data?.projects || payload.data || payload || [];
}

export async function fetchStages(params = {}) {
  const response = await api.get('/stages', { params });
  const payload = unwrap(response);
  return payload.data || payload || [];
}

export async function fetchActions() {
  const response = await api.get('/actions');
  const payload = unwrap(response);
  return payload.data || payload || [];
}

export async function fetchReports() {
  const response = await api.get('/reports');
  return unwrap(response);
}

export async function fetchTeam() {
  const response = await api.get('/team');
  const payload = unwrap(response);
  return payload.data || payload || [];
}

export async function createProject(payload) {
  const response = await api.post('/projects', payload);
  return unwrap(response);
}

export async function updateProject(id, payload) {
  const response = await api.put(`/projects/${id}`, payload);
  return unwrap(response);
}
