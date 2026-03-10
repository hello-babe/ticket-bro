import api from "@/lib/axios";

const locationsService = {
  getAll: (params) => api.get("/locations", { params }),
  getCities: (params) => api.get("/locations/cities", { params }),
  getCountries: () => api.get("/locations/countries"),
  getBySlug: (slug) => api.get(`/locations/${slug}`),
};
export default locationsService;
