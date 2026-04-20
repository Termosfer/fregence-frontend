import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. SORĞU GEDƏNDƏ (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    // LocalStorage-dən tokeni götürürük
    const token = localStorage.getItem("token");
    
    // Əgər token varsa, onu sorğunun Header hissəsinə əlavə edirik
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. CAVAB GƏLƏNDƏ (Response Interceptor - Opsional amma tövsiyə olunur)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Əgər backend 401 qaytarırsa (tokenin vaxtı bitib və ya səhvdir)
    if (error.response?.status === 401) {
      // 1. LocalStorage-i tam təmizləyirik (token, role, userName silinir)
      localStorage.clear(); 
      
      // 2. Səhifəni kökündən yeniləyirik və Loginə atırıq.
      // Səhifə reload olduğu üçün TanStack Query-nin yaddaşındakı (memory) 
      // bütün Wishlist və Cart dataları avtomatik sıfırlanır (0 olur).
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


export default api;