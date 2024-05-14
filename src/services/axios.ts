import axios from 'axios';

// Créer une instance Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Ajouter un intercepteur de requête
axiosInstance.interceptors.request.use(
  function (config) {
    if (config.headers.AuthorizationRequired) {
      const token = localStorage.getItem('Token');
      if (token) {
        config.headers.Authorization = `${token}`;
      }
    }
    config.headers['Content-Type'] = config.headers.ContentType
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
