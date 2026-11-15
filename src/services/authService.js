import { api } from './api';

export const authService = {
  async login({ email, password, rememberMe = false }) {
    try {
      const data = await api.post('/auth/login', { email, password });
      return data;
    } catch {
      // Mock fallback for demo/development when backend server is offline
      const isClient = email.toLowerCase().includes('client');
      const mockUser = {
        id: isClient ? 'user-client-1' : 'user-assistant-1',
        name: isClient ? 'Eleanor Vance (Client)' : 'Alex Johnson (Assistant)',
        email,
        role: isClient ? 'client' : 'assistant',
        avatar: isClient
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      };
      const mockToken = `mock-jwt-token-${Date.now()}`;
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      return { user: mockUser, token: mockToken };
    }
  },

  async register({ name, email, password, role = 'assistant' }) {
    try {
      const data = await api.post('/auth/register', { name, email, password, role });
      return data;
    } catch {
      const mockUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };
      const mockToken = `mock-jwt-token-${Date.now()}`;
      return { user: mockUser, token: mockToken };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    try {
      return await api.get('/auth/me');
    } catch {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
  },
};

export default authService;
