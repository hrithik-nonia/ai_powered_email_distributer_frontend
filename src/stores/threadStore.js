import { create } from 'zustand';
import { threadService } from '../services/threadService';

export const useThreadStore = create((set, get) => ({
  threads: [],
  activeThreadId: null,
  activeThread: null,
  searchQuery: '',
  statusFilter: 'all',
  labelFilter: 'all',
  isLoading: false,
  error: null,

  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      const { statusFilter, labelFilter, searchQuery } = get();
      const threads = await threadService.getThreads({
        status: statusFilter,
        label: labelFilter,
        search: searchQuery,
      });
      set({ threads, isLoading: false });

      // Automatically sync activeThread if activeThreadId is set
      const { activeThreadId } = get();
      if (activeThreadId) {
        const found = threads.find((t) => t.id === activeThreadId);
        if (found) set({ activeThread: found });
      }
    } catch (err) {
      set({ error: err.message || 'Failed to load threads', isLoading: false });
    }
  },

  selectThread: async (threadId) => {
    if (!threadId) {
      set({ activeThreadId: null, activeThread: null });
      return;
    }
    set({ activeThreadId: threadId, isLoading: true });
    try {
      const thread = await threadService.getThreadById(threadId);
      // Mark as read in store
      set((state) => ({
        activeThread: { ...thread, unread: false },
        threads: state.threads.map((t) => (t.id === threadId ? { ...t, unread: false } : t)),
        isLoading: false,
      }));
    } catch {
      const fallback = get().threads.find((t) => t.id === threadId);
      set({ activeThread: fallback || null, isLoading: false });
    }
  },

  updateStatus: async (threadId, newStatus) => {
    try {
      await threadService.updateThreadStatus(threadId, newStatus);
      set((state) => ({
        threads: state.threads.map((t) => (t.id === threadId ? { ...t, status: newStatus } : t)),
        activeThread: state.activeThread?.id === threadId ? { ...state.activeThread, status: newStatus } : state.activeThread,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  sendReply: async (threadId, content) => {
    try {
      const newMsg = await threadService.sendReply(threadId, content);
      set((state) => {
        const updatedThreads = state.threads.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [...t.messages, newMsg],
                draft: '',
                status: 'completed',
              }
            : t
        );
        const updatedActive =
          state.activeThread?.id === threadId
            ? {
                ...state.activeThread,
                messages: [...state.activeThread.messages, newMsg],
                draft: '',
                status: 'completed',
              }
            : state.activeThread;

        return { threads: updatedThreads, activeThread: updatedActive };
      });
      return newMsg;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  saveDraft: async (threadId, draft) => {
    try {
      await threadService.saveDraft(threadId, draft);
      set((state) => ({
        threads: state.threads.map((t) => (t.id === threadId ? { ...t, draft } : t)),
        activeThread: state.activeThread?.id === threadId ? { ...state.activeThread, draft } : state.activeThread,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().fetchThreads();
  },

  setStatusFilter: (statusFilter) => {
    set({ statusFilter });
    get().fetchThreads();
  },

  setLabelFilter: (labelFilter) => {
    set({ labelFilter });
    get().fetchThreads();
  },
}));

export default useThreadStore;
