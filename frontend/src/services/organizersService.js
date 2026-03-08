import api from '@/api/api';

const organizersService = {
  // Public
  getBySlug:       (slug)      => api.get(`/organizers/${slug}`),
  getOrganizerEvents:(slug, p) => api.get(`/organizers/${slug}/events`, { params: p }),
  // Organizer (private — uses /organizer prefix)
  getProfile:      ()          => api.get('/organizer/profile'),
  updateProfile:   (data)      => api.put('/organizer/profile', data),
  submitVerification:(data)    => api.post('/organizer/verification', data),
  getVerification: ()          => api.get('/organizer/verification'),
  getDashboard:    ()          => api.get('/organizer/dashboard'),
  getMyEvents:     (params)    => api.get('/organizer/events', { params }),
  getMyBookings:   (params)    => api.get('/organizer/bookings', { params }),
  getRevenue:      (params)    => api.get('/organizer/revenue', { params }),
  getPayouts:      (params)    => api.get('/organizer/payouts', { params }),
};
export default organizersService;
