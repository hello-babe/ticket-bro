import api from "@/lib/axios";

const reviewsService = {
  getEventReviews: (slug, params) =>
    api.get(`/reviews/event/${slug}`, { params }),
  getSummary: (slug) => api.get(`/reviews/event/${slug}/summary`),
  create: (data) => api.post("/reviews", data),
  getMyReviews: (params) => api.get("/reviews/my", { params }),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  remove: (id) => api.delete(`/reviews/${id}`),
};
export default reviewsService;
