'use strict';

/**
 * Simple cache middleware
 * Usage: router.use("/search", cache("30s"), searchRoutes);
 * 
 * Currently a pass-through — replace with Redis logic if needed.
 */
const cache = (duration) => {
  return (req, res, next) => {
    // TODO: implement Redis caching using duration (e.g. "30s", "2min", "5min")
    next();
  };
};

module.exports = { cache };