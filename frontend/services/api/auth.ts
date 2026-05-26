import api from './client';

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  signup: (data: any) => api.post('/auth/signup', data),
  updatePassword: (data: any) => api.put('/auth/update-password', data),
  deleteAccount: () => api.delete('/auth/delete-account'),
};
