const express = require("express");
const authController = require("../controllers/authController.js");
const authenticate = require("../middlewares/authentication.js");
const logger = require("../utils/logger.js");

const authRoute = express.Router();

authRoute.post("/signup", (req, res) => {
  logger.info("POST /signup requested.");
  authController.signUp(req, res);
});

authRoute.post("/signin", (req, res) => {
  logger.info("POST /signin requested.");
  authController.signIn(req, res);
});

authRoute.get("/blogs", authenticate, (req, res) => {
  logger.info("GET /user/blogs requested.");
  blogController.getUserBlogs(req, res);
});

module.exports = authRoute;
