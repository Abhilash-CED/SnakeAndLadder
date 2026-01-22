import authService from './authService';

const API_URL = '/api/game';

class GameService {
  async recordGame(gameData) {
    const token = authService.getToken();
    if (!token) return; // If not logged in, don't record (or handle differently)

    try {
      const response = await fetch(`${API_URL}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        throw new Error('Failed to record game');
      }

      return await response.json();
    } catch (error) {
      console.error('Game Record Error:', error);
    }
  }
}

export default new GameService();
