import api from "@/lib/axios";

const bookingService = {
  create: (data) => api.post("/bookings", data),
  getMyBookings: (params) => api.get("/bookings", { params }),
  getByRef: (ref) => api.get(`/bookings/${ref}`),
  cancel: (ref, data) => api.post(`/bookings/${ref}/cancel`, data || {}),
  requestRefund: (ref, data) => api.post(`/bookings/${ref}/refund`, data || {}),
  getTickets: (ref) => api.get(`/bookings/${ref}/tickets`),
  getInvoice: (ref) => api.get(`/bookings/${ref}/invoice`),
  // Organizer
  getOrganizerBookings: (params) =>
    api.get("/bookings/organizer/all", { params }),
  checkIn: (ref) => api.post(`/bookings/organizer/${ref}/checkin`),
};
export default bookingService;
