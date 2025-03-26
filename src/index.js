require("dotenv").config();
const express = require("express");
const blogRoute = require("./routes/blog.route.js");
const authRoute = require("./routes/auth.route.js");
const logger = require("./utils/logger.js");
const app = express();
const PORT = process.env.PORT || 3000;
const redisClient = require("./config/redis.js");
const connectToDb = require("./config/db.js");
const helmet = require("helmet");
const limiter = require("./middlewares/rate.limiter.js");

//Middlewares
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use("/api/auth", authRoute);
app.use("/api/blogs", blogRoute);

app.get("/", (req, res) => {
  res.json({ message: "Blog Api" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

connectToDb();
// redisClient.connect();
