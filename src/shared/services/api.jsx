import axios from "axios";
import { getToken, clearAuth } from "../../modules/auth/utils/authStorage";
import { isTokenExpired } from "../../modules/auth/utils/jwt";

const api = axios.create({

  //baseURL: "http://10.14.92.154:3000", //PROD
  baseURL: "http://localhost:3000", //DEV
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Skip untuk login endpoint
    if (config.url === "/apis/users/login") {
      return config;
    }

    if (token) {
      // kalau token expired, stop request
      if (isTokenExpired(token)) {
        clearAuth();
        window.location.href = "/";
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url;

    // Jangan redirect kalau error dari login request
    if (status === 401 && url !== "/apis/users/login") {
      clearAuth();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;