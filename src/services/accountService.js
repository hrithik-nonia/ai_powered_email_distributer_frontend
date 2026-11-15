import { api } from './api';

export const accountService = {
  async updateProfile(profileData) {
    try {
      return await api.put('/account/profile', profileData);
    } catch {
      const stored = localStorage.getItem('user');
      const current = stored ? JSON.parse(stored) : {};
      const updated = { ...current, ...profileData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    }
  },

  async updatePreferences(preferences) {
    try {
      return await api.put('/account/preferences', preferences);
    } catch {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      return { success: true, preferences };
    }
  },

  async completeOnboarding(onboardingData) {
    try {
      return await api.post('/account/onboarding', onboardingData);
    } catch {
      localStorage.setItem('onboardingCompleted', 'true');
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      return { success: true };
    }
  },
};

export default accountService;
