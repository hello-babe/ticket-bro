import api from "@/lib/axios";

const tagsService = {
  getAll: (params) => api.get("/tags", { params }),
  getPopular: () => api.get("/tags/popular"),
  getBySlug: (slug) => api.get(`/tags/${slug}`),
};
export default tagsService;
