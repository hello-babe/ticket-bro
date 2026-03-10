import api from "@/lib/axios";

const notificationsService = {
  getAll: (params) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
  deleteOne: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete("/notifications"),
  getPreferences: () => api.get("/notifications/preferences"),
  updatePreferences: (data) => api.put("/notifications/preferences", data),
  subscribePush: (sub) => api.post("/notifications/push/subscribe", sub),
  unsubscribePush: () => api.delete("/notifications/push/unsubscribe"),
};

const pushNotificationService = {
  isSupported: () => "Notification" in window && "serviceWorker" in navigator,
  requestPermission: async () => {
    if (!pushNotificationService.isSupported()) return "unsupported";
    return Notification.requestPermission();
  },
  subscribe: async () => {
    const permission = await pushNotificationService.requestPermission();
    if (permission !== "granted") return null;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "",
      });
      await notificationsService.subscribePush(sub.toJSON());
      return sub;
    } catch (e) {
      return null;
    }
  },
  unsubscribe: async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await notificationsService.unsubscribePush();
      }
    } catch {}
  },
};

export default notificationsService;
