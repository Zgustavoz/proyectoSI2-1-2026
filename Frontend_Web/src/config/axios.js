import axios from 'axios';

const instancia = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

instancia.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const rutasIgnorar = ['/usuarios/token/', '/usuarios/token/refresh/'];
    const esRutaIgnorada = rutasIgnorar.some(r => originalRequest.url?.includes(r));

    if (error.response?.status === 401 && !originalRequest._retry && !esRutaIgnorada) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/usuarios/token/refresh/`,
          {},
          { withCredentials: true }
        );
        return instancia(originalRequest);
      } catch {
        // window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instancia;