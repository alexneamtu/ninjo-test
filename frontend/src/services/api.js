import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.173:3000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      await this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    await this.removeToken();
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  // Feature endpoints
  async getFeatures() {
    return await this.request('/features');
  }

  async getFeature(id) {
    return await this.request(`/features/${id}`);
  }

  async createFeature(featureData) {
    return await this.request('/features', {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
  }

  async updateFeature(id, featureData) {
    return await this.request(`/features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(featureData),
    });
  }

  async deleteFeature(id) {
    return await this.request(`/features/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleVote(featureId, userId) {
    return await this.request(`/features/${featureId}/toggle-vote`, {
      method: 'POST',
      body: JSON.stringify({ createdBy: userId }),
    });
  }

  // User endpoints
  async getUsers() {
    return await this.request('/users');
  }

  async getUser(id) {
    return await this.request(`/users/${id}`);
  }

  // Vote endpoints
  async getVotes() {
    return await this.request('/votes');
  }

  async createVote(voteData) {
    return await this.request('/votes', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  }

  async deleteVote(id) {
    return await this.request(`/votes/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

export default new ApiService();