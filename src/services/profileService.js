import authService from './authService';

const API_URL = '/api/profile';

class ProfileService {
  async getProfile() {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async updateProfile(data) {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  }
}

export default new ProfileService();
