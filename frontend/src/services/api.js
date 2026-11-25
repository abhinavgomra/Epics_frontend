import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export function apiError(error, fallback) {
  return new Error(error.response?.data?.message || fallback);
}

export default api;
