'use strict';
const asyncHandler = require('../../common/utils/asyncHandler');
const { sendSuccess } = require('../../common/utils/apiResponse');

const MOCK_EVENTS = [
  { id: 1, title: 'Taylor Swift: The Eras Tour', slug: 'taylor-swift-eras-tour-2024', category: 'concerts', city: 'New York', price: 199.99, rating: 4.9, date: '2024-06-15T19:30:00' },
  { id: 2, title: 'NBA Finals: Lakers vs Celtics', slug: 'nba-finals-game-7-2024', category: 'sports', city: 'Boston', price: 399.99, rating: 4.9, date: '2024-06-05T20:00:00' },
  { id: 3, title: 'Hamilton', slug: 'hamilton-broadway-2024', category: 'theater', city: 'New York', price: 199.99, rating: 4.9, date: '2024-09-01T19:00:00' },
];

class SearchController {
  search = asyncHandler(async (req, res) => {
    const { q = '', category, city, minPrice, maxPrice } = req.query;
    let results = MOCK_EVENTS;
    if (q) results = results.filter(e => e.title.toLowerCase().includes(q.toLowerCase()));
    if (category) results = results.filter(e => e.category === category);
    if (city) results = results.filter(e => e.city.toLowerCase().includes(city.toLowerCase()));
    sendSuccess(res, 'Search results.', { results, total: results.length, query: q });
  });
  autocomplete = asyncHandler(async (req, res) => {
    const { q = '' } = req.query;
    const suggestions = MOCK_EVENTS
      .filter(e => e.title.toLowerCase().includes(q.toLowerCase()))
      .map(e => ({ id: e.id, title: e.title, slug: e.slug, category: e.category }))
      .slice(0, 5);
    sendSuccess(res, 'Suggestions.', { suggestions });
  });
  getTrending    = asyncHandler(async (req, res) => { sendSuccess(res, 'Trending searches.', { trending: ['Taylor Swift', 'NBA Finals', 'Hamilton', 'Beyoncé'] }); });
  getNearby      = asyncHandler(async (req, res) => { sendSuccess(res, 'Nearby events.', { events: MOCK_EVENTS }); });
  getFacets      = asyncHandler(async (req, res) => { sendSuccess(res, 'Search facets.', { categories: [], cities: [], priceRanges: [] }); });
  reindex        = asyncHandler(async (req, res) => { sendSuccess(res, 'Reindex started.'); });
  reindexEvent   = asyncHandler(async (req, res) => { sendSuccess(res, 'Event reindexed.', { id: req.params.id }); });
  removeFromIndex= asyncHandler(async (req, res) => { sendSuccess(res, 'Removed from index.'); });
}
module.exports = new SearchController();
