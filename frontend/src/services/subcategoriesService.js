import api from '@/api/api';
const subcategoriesService = {
  getAll:    (params)      => api.get('/subcategories', { params }),
  getBySlug: (slug)        => api.get(`/subcategories/${slug}`),
  create:    (data)        => api.post('/subcategories', data),
  update:    (slug, data)  => api.put(`/subcategories/${slug}`, data),
  remove:    (slug)        => api.delete(`/subcategories/${slug}`),
};
export default subcategoriesService;
