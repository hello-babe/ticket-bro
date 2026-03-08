import api from '@/api/api';

const tagsService = {
  getAll:     (params) => api.get('/tags', { params }),
  getPopular: ()       => api.get('/tags/popular'),
  getBySlug:  (slug)   => api.get(`/tags/${slug}`),
};
export default tagsService;
