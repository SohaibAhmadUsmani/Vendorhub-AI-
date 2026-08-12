import axios from "axios";

/* --------------------------------------------------------------------------
   httpClient — centralized Axios instance.
   Components never call fetch/axios directly; they go through the dashboard
   services, which all use this client. The payloads are wrapped as
   `{ success, data }`, so services unwrap `response.data.data ?? response.data`.
   -------------------------------------------------------------------------- */

export const API_BASE_URL = "http://localhost:5000";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to automatically attach the JWT token
httpClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error reading token from localStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Unwraps a backend response into its `data` payload. */
export async function getData(path, config) {
  const response = await httpClient.get(path, config);
  return response?.data?.data ?? response?.data;
}

export default httpClient;