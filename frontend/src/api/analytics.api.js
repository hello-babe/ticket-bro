import api from "@/lib/axios";

const analyticsService = {
  getOverview: (params) => api.get("/analytics/overview", { params }),
  getRevenue: (params) => api.get("/analytics/revenue", { params }),
  getTicketStats: (params) => api.get("/analytics/tickets", { params }),
  getEventStats: (params) => api.get("/analytics/events", { params }),
  getEventAnalytics: (id) => api.get(`/analytics/events/${id}`),
  getAudience: (params) => api.get("/analytics/audience", { params }),
};
export default analyticsService;
