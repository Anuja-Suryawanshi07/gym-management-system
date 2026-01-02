import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api",
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gym_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;