import axios from "axios";

// Base API URL
axios.defaults.baseURL = "http://localhost:3002";
axios.defaults.withCredentials = true;

// Attach JWT automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
