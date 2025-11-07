import axios from "axios";

// Prefer same-origin in production; allow override via VITE_BACKEND_URL if explicitly set
const base =
  (import.meta.env.VITE_BACKEND_URL &&
    import.meta.env.VITE_BACKEND_URL.trim()) ||
  "";
const instance = axios.create({
  baseURL: base, // '' => same-origin
});

// Attach JWT automatically if present
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: surface auth errors
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // token invalid/expired -> log out gracefully
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export const isAuthed = () => !!localStorage.getItem("token");
export default instance;
