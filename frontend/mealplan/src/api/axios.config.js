import axios from "axios";

const baseURL = 'http://localhost:8080/api'; // 👈 Prefix chung cho toàn bộ API

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;  
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {



        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }


        const customMessage = error.response?.data?.message;
        console.log('==> customMessage', customMessage);

        if (customMessage) {
            error.message = customMessage;
            error.customMessage = customMessage; // Thêm property riêng
        }


        return Promise.reject(error); // Trả lỗi xuống cho `catch()` sử dụng
    }
);


export default axiosInstance;