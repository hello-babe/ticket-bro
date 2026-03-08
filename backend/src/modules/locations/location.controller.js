'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');
const CITIES = [
  { slug: 'new-york', name: 'New York', state: 'NY', country: 'USA', count: 45 },
  { slug: 'los-angeles', name: 'Los Angeles', state: 'CA', country: 'USA', count: 38 },
  { slug: 'chicago', name: 'Chicago', state: 'IL', country: 'USA', count: 29 },
  { slug: 'boston', name: 'Boston', state: 'MA', country: 'USA', count: 22 },
  { slug: 'las-vegas', name: 'Las Vegas', state: 'NV', country: 'USA', count: 31 },
];
class LocationController {
  getAll      = asyncHandler(async (req, res) => { sendSuccess(res, 'Locations fetched.', { locations: CITIES }); });
  getCities   = asyncHandler(async (req, res) => { sendSuccess(res, 'Cities fetched.', { cities: CITIES }); });
  getCountries= asyncHandler(async (req, res) => { sendSuccess(res, 'Countries fetched.', { countries: [{ slug: 'usa', name: 'United States', count: 165 }] }); });
  getBySlug   = asyncHandler(async (req, res) => {
    const loc = CITIES.find(c => c.slug === req.params.slug);
    sendSuccess(res, 'Location fetched.', { location: loc || { slug: req.params.slug } });
  });
}
module.exports = new LocationController();
