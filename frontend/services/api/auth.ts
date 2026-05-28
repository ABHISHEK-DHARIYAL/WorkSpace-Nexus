import api from './client';

export const mapAuthError = (err: any): string => {
  const msg = err?.response?.data?.message || err?.message || 'An unexpected authentication error occurred.';
  return msg;
};

export const authService = {
  login: async (data: any) => {
    try {
      const response = await api.post('/auth/login', { 
        email: data.email, 
        password: data.password 
      });
      // Response contains direct data: { token, user: { email, role } }
      return response.data;
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  },

  signup: async (data: any) => {
    try {
      const response = await api.post('/auth/signup', { 
        email: data.email, 
        password: data.password,
        isSocial: !!data.isSocial
      });
      // Response contains direct data: { token, user: { email, role } }
      return response.data;
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  },

  updatePassword: async (data: any) => {
    try {
      const response = await api.put('/auth/update-password', { 
        password: data.password 
      });
      return response.data;
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/delete-account');
      console.log("[Auth Service] Backend cascade deletion completed successfully.");
      return response.data;
    } catch (err: any) {
      throw new Error(mapAuthError(err));
    }
  }
};
