import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

   
    if (url.includes("/auth/login")) {
      return Promise.reject(error);
    }

    
    if (url.includes("/subscribers") || url.includes("/contact")) {
      return Promise.reject(error);
    }

  
    if (status === 401 || status === 403) {
      
      if (localStorage.getItem("token")) {
        localStorage.clear();
        // window.location.href = "/"; // <--- Əgər bu sətir çox narahat edirsə şərhə al
      }
    }

    return Promise.reject(error);
  }
);

export default api;