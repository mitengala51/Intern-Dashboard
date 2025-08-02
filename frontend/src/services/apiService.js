export class ApiService {
    constructor() {
      this.baseURL = 'https://intern-dashboard-production-5588.up.railway.app';
      this.token = localStorage.getItem('accessToken');
    }
  
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  
    async request(endpoint, options = {}) {
      console.log(this.baseURL)
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
        ...options,
      };
  
      try {
        const response = await fetch(url, config);
        const data = await response.json();
  
        if (!response.ok) {
          if (response.status === 401 && data.code === 'TOKEN_EXPIRED') {
            await this.refreshToken();
            return this.request(endpoint, options);
          }
          throw new Error(data.message || 'Request failed');
        }
  
        return data;
      } catch (error) {
        console.error('API Request failed:', error);
        throw error;
      }
    }
  
    async refreshToken() {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
  
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
  
        const data = await response.json();
        if (data.success) {
          this.setToken(data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        this.logout();
        throw error;
      }
    }
  
    async login(credentials) {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      this.setToken(data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data;
    }
  
    async register(userData) {
      const data = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      this.setToken(data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      return data;
    }
  
    async getProfile() {
      return this.request('/user/profile');
    }
  
    async getLeaderboard(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/leaderboard?${queryString}`);
    }
  
    async updateDonations(amount) {
      return this.request('/user/donations', {
        method: 'PATCH',
        body: JSON.stringify({ amount }),
      });
    }
  
    logout() {
      this.setToken(null);
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
    }
  }
  
