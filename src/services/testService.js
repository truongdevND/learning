import api from './Axios';

const testService = {
    getTest: async (param) => {
        try {
          const { id, user_id } = param || {};
          const response = await api.get(`api/course/test/${id}/user/${user_id}`);
          return response;
        } catch (error) {
          console.error(error);
          throw error; 
        }
      },
      

  createTest: async (param) => {
    try {
        const { id, user_id } = param || {};
      const response = await api.post(`/api/course/test/lesson/${id}/user/${user_id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  submitTest: async (param) => {
    try {
        const { id, user_id,score } = param || {};
      const response = await api.put(`/api/course/test/${id}/user/${user_id}/submit/${score}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  // Delete a test
  deleteTest: async (id) => {
    try {
      const response = await api.delete(`/api/test/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default testService;