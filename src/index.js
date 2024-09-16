const express = require("express");
require("dotenv").config();
const blogRoute = require("./routes/blogRoute.js");
const authRoute = require("./routes/authRoute.js");
const logger = require("./utils/logger.js");
const app = express();
const PORT = process.env.PORT || 3000;
const redisClient = require("./config/redis.js");
const connectToDb = require("./config/db.js");

//Middlewares
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/blog", blogRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Blog Api" });
});

app.all("*", (req, res) => {
  res.status.json({ message: "Page Not Found" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

connectToDb();
redisClient.connect();
