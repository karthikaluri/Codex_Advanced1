import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL ||
    "https://codex-advanced1-1.onrender.com",
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
