const express = require("express");
const blogController = require("../controllers/blogController.js");
const authenticate = require("../middlewares/authentication.js");
const logger = require("../utils/logger.js");
const blogValidatorMiddleWare = require("../validators/blogValidator.js");

const blogRoute = express.Router();

blogRoute.get("/", async (req, res) => {
  logger.info("GET /blogs requested.");
  blogController.getAllBlogs(req, res);
});

blogRoute.get("/:id", (req, res) => {
  logger.info(`GET /blogs/${req.params.id} requested.`);
  blogController.getBlog(req, res);
});

blogRoute.post("/", authenticate, blogValidatorMiddleWare, (req, res) => {
  logger.info("POST /blogs requested.");
  blogController.createBlog(req, res);
});

blogRoute.put("/:id", authenticate, blogValidatorMiddleWare, (req, res) => {
  logger.info(`PUT /blogs/${req.params.id} requested.`);
  blogController.editBlog(req, res);
});

blogRoute.put("/:id/state", authenticate, (req, res) => {
  logger.info(`PUT /blogs/${req.params.id} requested.`);
  blogController.updatedBlogState(req, res);
});

blogRoute.delete("/:id", authenticate, (req, res) => {
  logger.info(`DELETE /blogs/${req.params.id} requested.`);
  blogController.deleteBlog(req, res);
});

module.exports = blogRoute;
