import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
      console.log('Making request with token:', formattedToken.substring(0, 20) + '...');
      
      if (axiosInstance.defaults.headers.common) {
        axiosInstance.defaults.headers.common['Authorization'] = formattedToken;
      }
    } else {
      console.log('Making request without token');
      if (config.headers) {
        delete config.headers.Authorization;
      }
      if (axiosInstance.defaults.headers.common) {
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Received 401, checking if we can refresh token');
      
      // If we're already trying to refresh, queue the request
      if (isRefreshing) {
        console.log('Already refreshing token, adding to queue');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('No refresh token available, clearing auth state');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          processQueue(new Error('No refresh token available'), null);
          return Promise.reject(new Error('Session expired'));
        }

        console.log('Attempting to refresh token');
        const response = await axios.post<{ accessToken: string }>('http://localhost:8080/auth/refresh-token', {
          refreshToken
        });

        const { accessToken } = response.data;
        console.log('Received new access token');
        localStorage.setItem('accessToken', accessToken);
        
        if (axiosInstance.defaults.headers.common) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(new Error('Session expired'));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 