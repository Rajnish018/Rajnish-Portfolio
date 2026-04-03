import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL ="http://localhost:5000/api";

// console.log("API Base URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject({
        message: "Network error. Check backend.",
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
      console.warn("Unauthorized");

      localStorage.removeItem("token");

      window.location.href = "/admin/login";
    }

    if (status === 403) console.warn("Forbidden");
    if (status === 404) console.warn("Not Found");
    if (status >= 500) console.error("Server Error");

    return Promise.reject({
      status,
      message: data?.message || "Something went wrong",
      data,
    });
  }
);

export default apiClient;