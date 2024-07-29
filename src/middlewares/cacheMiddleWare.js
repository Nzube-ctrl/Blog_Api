const redisClient = require("./redis.js");

const cacheMiddleware = async (req, res, next) => {
  const { page, pageSize } = req.query;
  const cacheKey = `blogs_page_${page}_size_${pageSize}`;

  try {
    // Check if the data is in the cache
    redisClient.get(cacheKey, (err, cachedData) => {
      if (err) {
        return next(err);
      }

      if (cachedData) {
        // If data is cached, send it as a response
        return res.json(JSON.parse(cachedData));
      }
      // If not cached, proceed to the next middleware or route handler
      res.locals.cacheKey = cacheKey; // Pass the cache key to the next handler
      next();
    });
  } catch (err) {
    next(err); 
  }
};

module.exports = cacheMiddleware;
