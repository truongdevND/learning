import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notification: null,
  messageApi: null,
  setMessageApi: (api) => set({ messageApi: api }),
  showSuccess: (content, duration = 3) => {
    set((state) => {
      if (state.messageApi) {
        state.messageApi.open({
          type: 'success',
          content,
          duration,
        });
      }
      return { notification: { type: 'success', content, duration } };
    });
  },
  showError: (content, duration = 3) => {
    set((state) => {
      if (state.messageApi) {
        state.messageApi.open({
          type: 'error',
          content,
          duration,
        });
      }
      return { notification: { type: 'error', content, duration } };
    });
  },
  showWarning: (content, duration = 3) => {
    set((state) => {
      if (state.messageApi) {
        state.messageApi.open({
          type: 'warning',
          content,
          duration,
        });
      }
      return { notification: { type: 'warning', content, duration } };
    });
  },
  showInfo: (content, duration = 3) => {
    set((state) => {
      if (state.messageApi) {
        state.messageApi.open({
          type: 'info',
          content,
          duration,
        });
      }
      return { notification: { type: 'info', content, duration } };
    });
  },
  clearNotification: () => set({ notification: null }),
}));

export default useNotificationStore;