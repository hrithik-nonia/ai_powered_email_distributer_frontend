import { create } from 'zustand';
import { authService } from '../services/authService';

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return {
    id: 'user-assistant-1',
    name: 'Alex Johnson',
    email: 'alex@company.com',
    role: 'assistant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  };
};

const initialToken = localStorage.getItem('token') || 'demo-mock-jwt-token';

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateUser: (updates) => {
    set((state) => {
      const updated = { ...state.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
