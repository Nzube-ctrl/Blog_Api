const redis = require("redis");
const redisClient = redis.createClient({
  host: "localHost",
  port: "6379",
});

redisClient.on("connect", () => {
  console.log("Redis client is connected");
});

module.exports = redisClient;
