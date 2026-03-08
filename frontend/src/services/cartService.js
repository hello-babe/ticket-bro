import api from '@/api/api';

const cartService = {
  getCart:         ()              => api.get('/cart'),
  addItem:         (data)          => api.post('/cart/items', data),
  updateItem:      (itemId, data)  => api.put(`/cart/items/${itemId}`, data),
  removeItem:      (itemId)        => api.delete(`/cart/items/${itemId}`),
  clearCart:       ()              => api.delete('/cart'),
  applyPromo:      (code)          => api.post('/cart/apply-promo', { code }),
  removePromo:     ()              => api.delete('/cart/promo'),
  checkout:        (data)          => api.post('/cart/checkout', data),
};
export default cartService;
