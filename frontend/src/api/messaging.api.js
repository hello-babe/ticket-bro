import api from "@/lib/axios";

const messagingService = {
  startConversation: (data) => api.post("/messaging/conversations", data),
  getConversations: (params) => api.get("/messaging/conversations", { params }),
  getConversation: (id) => api.get(`/messaging/conversations/${id}`),
  deleteConversation: (id) => api.delete(`/messaging/conversations/${id}`),
  getMessages: (id, params) =>
    api.get(`/messaging/conversations/${id}/messages`, { params }),
  sendMessage: (id, data) =>
    api.post(`/messaging/conversations/${id}/messages`, data),
  markAsRead: (id) => api.put(`/messaging/conversations/${id}/read`),
  getUnreadCount: () => api.get("/messaging/unread-count"),
};
export default messagingService;
