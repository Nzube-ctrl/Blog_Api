const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 Minutes
  max: 100, //Limit each IP to 100 requests per 'window'
  standardHeaders: true, //Return rate limit info in the rateLimit-* headers
  legacyHeaders: false,
});

module.exports = limiter;
