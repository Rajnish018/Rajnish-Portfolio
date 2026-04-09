import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";


const RENDER_SERVER_URL =  import.meta.env.VITE_API_URL ||
   "http://localhost:5000/api";

  // 
  
// console.log(RENDER_SERVER_URL)

const apiClient = axios.create({
  baseURL: RENDER_SERVER_URL,
  timeout: 10000,
});

// REQUEST
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData automatically
    
    if (config.data instanceof FormData) {
      // Let Axios set Content-Type automatically
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
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
