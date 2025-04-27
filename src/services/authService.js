import api from './Axios';

const authService = {
  register: async (userData) => {
    const response = await api.post('/v1/onboard/register', userData);
    return response;
  },

  login: async (credentials) => {
    const response = await api.post('/v1/onboard/login', credentials);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  verifyEmail: async (data) => {
    const response = await api.put('/v1/onboard/verify', data);
    return response;
  },

  resendVerificationEmail: async (email) => {
    const response = await api.post('/v1/onboard/resend-verification', { email });
    return response;
  }
};

export default authService;
