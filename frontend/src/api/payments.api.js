import api from "@/lib/axios";

const paymentsService = {
  createIntent: (data) => api.post("/payments/intent", data),
  verifyPayment: (data) => api.post("/payments/verify", data),
  getMyPayments: (params) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
  requestRefund: (id, d) => api.post(`/payments/${id}/refund`, d || {}),
  getRefundStatus: (id) => api.get(`/payments/${id}/refund`),
  getPaymentMethods: () => api.get("/payments/methods"),
  removePaymentMethod: (id) => api.delete(`/payments/methods/${id}`),
};
export default paymentsService;
