const API_URL = '/api/auth';

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      if (typeof window !== 'undefined') {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('username', data.user.username);
        }
      }

      return data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

  async register(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data
      if (typeof window !== 'undefined') {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('username', data.user.username);
        }
      }

      return data;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
    }
  }

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('user'));
    }
    return null;
  }

  getCurrentUsername() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;
