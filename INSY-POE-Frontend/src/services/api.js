import axios from 'axios';

// Create axios instance with base configuration
// Switching to https
const api = axios.create({
  baseURL: 'https://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Note: Tokens are now stored in secure httpOnly cookies, so no need to manually add Authorization header
// The cookie will be automatically sent with each request

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if it's not a login/register request
      const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                           error.config?.url?.includes('/auth/register');
      
      if (!isAuthRequest) {
        // Token expired or invalid - redirect to login
        // Cookie will be cleared by server on logout
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  seedEmployee: () => api.post('/auth/seed-employee'),
};

// Test API functions
export const testAPI = {
  securityTest: () => api.get('/security-test'),
  healthCheck: () => api.get('/'),
};

// Employee API functions
export const employeeAPI = {
  getTransactions: (params = {}) => api.get('/employee/transactions', { params }),
  getPendingTransactions: (params = {}) =>
    api.get('/employee/transactions', {
      params: { ...params, status: 'PendingVerification' },
    }),

    //adeed
    massVerify: (ids) => api.post("/employee/transactions/mass-verify", { transactionIds: ids }),

  verifyTransaction: (transactionId) => api.post(`/employee/transactions/${transactionId}/verify`),
  rejectTransaction: (transactionId, reason) =>
    api.post(`/employee/transactions/${transactionId}/reject`, { reason }),
  submitToSwift: (transactionIds) =>
    api.post('/employee/transactions/submit-swift', { transactionIds }),
};

export default api;
