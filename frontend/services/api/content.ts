import api from './client';

export const contentService = {
  getAll: () => api.get('/content'),
  getBySlug: (slug: string) => api.get(`/content/${slug}`),
  create: (data: any) => api.post('/content', data),
  delete: (id: string) => api.delete(`/content/${id}`),
};
