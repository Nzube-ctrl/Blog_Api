const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const blogRoute = require("./routes/blogRoute.js");
const authRoute = require("./routes/authRoute.js");
const logger = require("./utils/logger.js");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

//Middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/user", authRoute);
app.use("/api", blogRoute);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Blog Api" });
});

app.all("*", (req, res) => {
  res.json({ message: "Page Not Found" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
