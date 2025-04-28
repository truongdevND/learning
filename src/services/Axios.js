import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location = "/login";
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, params = {}) => instance.get(url, { params }).then((response) => response.data),
  
  post: (url, data = {}, config = {}) => instance.post(url, data, config).then((response) => response.data),
  
  put: (url, data = {}, config = {}) => instance.put(url, data, config).then((response) => response.data),
  
  delete: (url) => instance.delete(url).then((response) => response.data),
};
export default api;
