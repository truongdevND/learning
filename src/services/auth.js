import api from './Axios';

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/v1/onboard/register', userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
        console.error(error)     
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/v1/onboard/login', credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {

       console.error(error)
    }
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


  verify: async (data) => {
    try {
      await api.post('/v1/onboard/verify', data );
    } catch (error) {
        console.error(error)
    }
  },

    
};


export default authService;
