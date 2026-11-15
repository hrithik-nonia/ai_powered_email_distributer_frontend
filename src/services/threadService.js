import { api } from './api';
import { mockThreads } from '../mock/emails';

let localThreads = [...mockThreads];

export const threadService = {
  async getThreads(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      return await api.get(`/threads?${queryParams}`);
    } catch {
      let result = [...localThreads];
      if (filters.status && filters.status !== 'all') {
        result = result.filter((t) => t.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.subject.toLowerCase().includes(q) ||
            t.sender.name.toLowerCase().includes(q) ||
            t.sender.email.toLowerCase().includes(q) ||
            t.aiSummary.toLowerCase().includes(q)
        );
      }
      if (filters.label && filters.label !== 'all') {
        result = result.filter((t) => t.labels.includes(filters.label));
      }
      return result;
    }
  },

  async getThreadById(id) {
    try {
      return await api.get(`/threads/${id}`);
    } catch {
      const thread = localThreads.find((t) => t.id === id);
      if (!thread) throw new Error('Thread not found');
      return thread;
    }
  },

  async updateThreadStatus(id, status) {
    try {
      return await api.put(`/threads/${id}/status`, { status });
    } catch {
      localThreads = localThreads.map((t) => (t.id === id ? { ...t, status } : t));
      return localThreads.find((t) => t.id === id);
    }
  },

  async sendReply(threadId, content) {
    try {
      return await api.post(`/threads/${threadId}/reply`, { content });
    } catch {
      const newMsg = {
        id: `msg-${Date.now()}`,
        sender: 'Alex Johnson',
        senderEmail: 'alex@company.com',
        senderType: 'assistant',
        timestamp: 'Just now',
        content,
      };
      localThreads = localThreads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              draft: '',
              status: 'completed',
            }
          : t
      );
      return newMsg;
    }
  },

  async saveDraft(threadId, draft) {
    try {
      return await api.put(`/threads/${threadId}/draft`, { draft });
    } catch {
      localThreads = localThreads.map((t) => (t.id === threadId ? { ...t, draft } : t));
      return { success: true, draft };
    }
  },
};

export default threadService;
