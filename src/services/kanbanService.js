import { api } from '../lib/api';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export const kanbanService = {
  async getColumns(boardType) {
    const response = await api.get('/kanban/columns', { params: { boardType } });
    return unwrap(response);
  },

  async saveColumns(boardType, columns) {
    const response = await api.put('/kanban/columns', { boardType, columns });
    return unwrap(response);
  },
};
