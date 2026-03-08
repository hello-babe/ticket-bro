import api from '@/api/api';

const notificationsService = {
  getAll:            (params) => api.get('/notifications', { params }),
  getUnreadCount:    ()       => api.get('/notifications/unread-count'),
  markRead:          (id)     => api.put(`/notifications/${id}/read`),
  markAllRead:       ()       => api.put('/notifications/read-all'),
  deleteOne:         (id)     => api.delete(`/notifications/${id}`),
  clearAll:          ()       => api.delete('/notifications'),
  getPreferences:    ()       => api.get('/notifications/preferences'),
  updatePreferences: (data)   => api.put('/notifications/preferences', data),
  subscribePush:     (sub)    => api.post('/notifications/push/subscribe', sub),
  unsubscribePush:   ()       => api.delete('/notifications/push/unsubscribe'),
};
export default notificationsService;
