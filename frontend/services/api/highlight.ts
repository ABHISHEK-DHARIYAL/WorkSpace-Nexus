import api from "./client";

export const highlightService = {
  getByPage: (pageId: string) => api.get(`/highlight/${pageId}`),
  create: (data: any) => api.post("/highlight", data),
};
