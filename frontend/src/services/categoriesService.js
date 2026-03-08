import api from '@/api/api';

const categoriesService = {
  getAll:            (params)       => api.get('/categories', { params }),
  getBySlug:         (slug)         => api.get(`/categories/${slug}`),
  getSubcategories:  (slug)         => api.get(`/categories/${slug}/subcategories`),
  // Admin
  create:            (data)         => api.post('/categories', data),
  update:            (slug, data)   => api.put(`/categories/${slug}`, data),
  remove:            (slug)         => api.delete(`/categories/${slug}`),
};
export default categoriesService;
