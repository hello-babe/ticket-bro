import api from "@/lib/axios";

const ticketsService = {
  getMyTickets: (params) => api.get("/tickets", { params }),
  getByCode: (code) => api.get(`/tickets/${code}`),
  download: (code) =>
    api.get(`/tickets/${code}/download`, { responseType: "blob" }),
  validate: (code) => api.post(`/tickets/${code}/validate`),
  transfer: (code, data) => api.post(`/tickets/${code}/transfer`, data),
  cancel: (code) => api.post(`/tickets/${code}/cancel`),
};
export default ticketsService;
