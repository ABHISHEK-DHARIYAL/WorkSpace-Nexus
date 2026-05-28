import api from './client';

export const contentService = {
  getAll: async () => {
    try {
      const response = await api.get('/content');
      // Conforms to previous return shape `{ data: [] }`
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch content from resource system.';
      throw new Error(msg);
    }
  },

  getBySlug: async (slug: string) => {
    try {
      const response = await api.get(`/content/${slug}`);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || `Failed to fetch content slug "${slug}".`;
      throw new Error(msg);
    }
  },

  create: async (data: any) => {
    const { title, body, category, excerpt, image } = data;
    try {
      const response = await api.post('/content', {
        title,
        body,
        category: category || "General",
        excerpt: excerpt || "",
        image: image || ""
      });
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create content document.';
      throw new Error(msg);
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/content/${id}`);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to delete content document.';
      throw new Error(msg);
    }
  }
};
