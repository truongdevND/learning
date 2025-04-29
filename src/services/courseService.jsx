import api from './Axios';

const courseService = {
  getCourses: async (param) => {
    try {
      const { page = 0, pageSize = 10, key='' } = param || {};
      const response = await api.get(`api/courses?page=${page}&pageSize=${pageSize}&key=${key}`);
      return response;
    } catch (error) {
      console.error(error);
    } 
  },

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
      const response = await api.post(`/api/media`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'  
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;  
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

  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/api/courses/${id}`, courseData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  updateCoursAssignLesson: async (id, ids) => {
    try {
      const response = await api.put(`/api/courses/${id}/assign/lesson/${ids}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

 
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/api/courses/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  getLession: async (param) => {
    try {
      const { page = 0, pageSize = 10, key='' } = param || {};
      const response = await api.get(`api/course/lessons?page=${page}&pageSize=${pageSize}&key=${key}`);
      return response;
    } catch (error) {
      console.error(error);
    } 
  },
  createLesson: async (lessonData) => {
    try {
      const response = await api.post('/api/course/lessons', lessonData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
 
  deleteLesson: async (id) => {
    try {
      const response = await api.delete(`/api/course/lessons/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  getLessonById: async (id) => {
    try {
      const response = await api.get(`/api/lessons/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  updateLesson: async (id, lessonData) => {
    try {
      const response = await api.put(`/api/lessons/${id}`, lessonData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },


  getQuestion: async (idLesson, page = 0, pageSize = 10 ) => {
    try {
     
      const response = await api.get(`api/course/questions/lesson/${idLesson}?page=${page}&pageSize=${pageSize}`);
      return response;
    } catch (error) {
      console.error(error);
    } 
  },
  createQuestion: async (idLesson, lessonData) => {
    try {
      const response = await api.post(`api/course/questions/lesson/${idLesson}`, lessonData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  updateQuestion: async (idLesson, lessonData) => {
    try {
      const response = await api.put(`api/course/questions/lesson/${idLesson}`, lessonData);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  deleteLQuestion: async (id) => {
    try {
      const response = await api.delete(`/api/course/questions/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
};

export default courseService;