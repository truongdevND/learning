import api from './Axios';

const courseService = {
  // Get all courses
  getCourses: async (param) => {
    try {
      const { page = 0, pageSize = 10, key } = param || {};
      const response = await api.get(`api/courses?page=${page}&pageSize=${pageSize}&key=${key}`);
      return response;
    } catch (error) {
      console.error(error);
    } 
  },

  // Get a specific course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/api/courses', courseData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  // Update an existing course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/api/courses/${id}`, courseData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/api/courses/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default courseService;