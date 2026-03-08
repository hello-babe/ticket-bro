import api from '@/api/api';

const searchService = {
  search:       (params)  => api.get('/search', { params }),
  autocomplete: (q)       => api.get('/search/autocomplete', { params: { q } }),
  getTrending:  ()        => api.get('/search/trending'),
  getNearby:    (params)  => api.get('/search/nearby', { params }),
  getFacets:    (params)  => api.get('/search/facets', { params }),
};
export default searchService;
