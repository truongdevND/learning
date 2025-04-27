import api from './Axios';

const courseService = {
  // Get all courses
  getCourses: async (param) => {
    try {
      const { page = 0, pageSize = 10 } = param || {};
      const response = await api.get(`api/courses?page=${page}&pageSize=${pageSize}`);
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
  createMedia: async (data) => {
    try {
      const response = await api.get(`/api/media` ,data);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  getMedia: async (link) => {
    try {
      const response = await api.get(`/api/media/${link}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

getLessonTest:async (link) => {
  try {
    const response = await api.get(`/api/media/${link}`);
    return response;
  } catch (error) {
    console.error(error);
  }
},

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