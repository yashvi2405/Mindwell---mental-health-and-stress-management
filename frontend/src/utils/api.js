// API base URL - update this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important: This sends cookies with the request
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    return apiRequest('/api/users/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register user
  register: async (name, email, password) => {
    return apiRequest('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Logout user
  logout: async () => {
    return apiRequest('/api/users/logout', {
      method: 'POST',
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/api/users/profile', {
      method: 'GET',
    });
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

export default apiRequest;
