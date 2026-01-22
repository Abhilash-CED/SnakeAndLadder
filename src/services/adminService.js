import authService from './authService';

const API_URL = '/api/admin';

class AdminService {
  async getAnalytics() {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access Denied: Admin privileges required');
      }
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  }
}

export default new AdminService();
