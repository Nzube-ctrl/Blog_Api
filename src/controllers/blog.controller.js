const blogService = require("../services/blog.service");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    res.json(blog);
  } catch (error) {
    res.json({ message: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = await blogService.createBlog(req.body, req.user.id);
    res.status(201).json({ message: "Blog created", data: { blog } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;
    const blog = await blogService.getBlogById(blogId);
    if (blog.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Forbidden. You are not the owner of this blog." });
    }
    await blogService.deleteBlog(blogId);

    res.json({ message: "Blog deleted successfully." });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const updatedBlog = await blogService.editBlog(blogId, userId, req.body);

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({
      message: "Blog Updated successfully",
      data: {
        updatedBlog,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const userBlogs = await userService.getUserBlogs(userId);
    res.json(userBlogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatedBlogState = async (req, res) => {
  try {
    const blogId = req.params;
    const userId = req.user.id;
    const newState = req.body.state;
    const updatedBlog = await blogService.updatedBlogState(
      blogId,
      userId,
      newState
    );
    res.json(updatedBlog);
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  deleteBlog,
  editBlog,
  getUserBlogs,
  updatedBlogState,
};
