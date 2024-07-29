const express = require("express");
const blogController = require("../controllers/blogController.js");
const authenticate = require("../middlewares/authentication.js");
const logger = require("../utils/logger.js");
const cacheMiddleware = require("../middlewares/cacheMiddleWare.js");
const redisClient = require("../middlewares/redis.js");
const blogValidatorMiddleWare = require("../validators/blogValidator.js");

const blogRoute = express.Router();

blogRoute.get("/", cacheMiddleware, async (req, res) => {
  logger.info("GET /blogs requested.");
  try {
    const blogs = await blogController.getAllBlogs(
      req.query.page,
      req.query.pageSize
    );
    // Cache the response data if the cacheKey is set
    if (res.locals.cacheKey) {
      redisClient.setEx(res.locals.cacheKey, 3600, JSON.stringify(blogs)); // Cache expires in 1 hour
    }
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
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
