import axios from "axios";

const isProduction = import.meta.env.MODE === "production";

const api = axios.create({
  baseURL: isProduction
    ? "https://gym-management-system-production-474f.up.railway.app/api" 
    : "http://localhost:7000/api",
}); 

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gym_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  }
  return config;
});

export default api;