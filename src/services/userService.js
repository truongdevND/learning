import api from './Axios';

const userService = {
  getAllUser: async () => {
    try {
      
      const response = await api.get(`/api/course/tracking/all/user/infos`);
      return response;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  },
    getTrackingUser: async (param) => {
        try {
          const { user_id } = param || {};
          const response = await api.get(`/api/course/tracking/user/${user_id}`);
          return response;
        } catch (error) {
          console.error(error);
          throw error; 
        }
      },
      getTrackinglesson: async (param) => {
        try {
          const { user_id } = param || {};
          const response = await api.get(`/api/course/tracking/user/${user_id}`);
          return response;
        } catch (error) {
          console.error(error);
          throw error; 
        }
      },
      
    }

export default userService;