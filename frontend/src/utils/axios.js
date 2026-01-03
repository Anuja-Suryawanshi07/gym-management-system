import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:7000/api",
    headers: { 
        "Content-Type": "application/json"
    }
});

// Automatically attach token to every request
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("gym_auth_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);   
// To handle global response errors

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized - Token expired or invalid");
        }
        return Promise.reject(error);
    }
);

export default instance;

/*
This file:1.sets backend base URL
2.injects JWT automatically
3.keeps your code clean
 */