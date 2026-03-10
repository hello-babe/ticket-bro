import api from "@/lib/axios";

const promotionsService = {
  validateCode: (code) => api.post("/promotions/validate", { code }),
  // Organizer
  create: (data) => api.post("/promotions/organizer", data),
  getMyPromotions: (params) => api.get("/promotions/organizer", { params }),
  update: (id, data) => api.put(`/promotions/organizer/${id}`, data),
  remove: (id) => api.delete(`/promotions/organizer/${id}`),
};
export default promotionsService;
