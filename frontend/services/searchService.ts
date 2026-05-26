import api from './api/client';

export const searchService = {
  search: (query: string, listingId?: string) => api.get('/search', { params: { query, listingId } }),
};
