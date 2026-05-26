import api from './api/client';

export const annotationService = {
  getAll: () => api.get('/highlight'),
  getByPage: (pageId: string) => api.get(`/highlight/${pageId}`),
  create: (data: any) => api.post('/highlight', data),
};
