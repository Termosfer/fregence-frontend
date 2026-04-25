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
    // Sorğu atılan URL-i yoxlayırıq (məsələn: /auth/login)
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    // Əgər status 401-dirsə
    if (error.response?.status === 401) {
      
      // ƏGƏR BU LOGİN SORĞUSU DEYİLDİRSƏ (Məsələn, səbətə baxanda tokenin vaxtı bitibsə)
      if (!isLoginRequest) {
        localStorage.clear(); 
        window.location.href = "/"; // Yalnız bu halda refresh etsin
      }
      
      // Əgər bu bir logindirsə, burada heç nə etmirik (window.location yazmırıq)
      // Beləliklə, Login.tsx-dəki catch bloku işləyəcək və sən xətanı görəcəksən.
    }

    return Promise.reject(error);
  }
);


export default api;