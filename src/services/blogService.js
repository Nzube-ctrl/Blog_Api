const Blog = require("../models/blogModel.js");

const createBlog = async (blogData, userId) => {
  const { title, description, body, tags } = blogData;
  const blog = new Blog({ title, description, body, tags, author: userId });
  await blog.save();
  return blog;
};

const editBlog = async (blogId, userId, updatedFields) => {
  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    if (blog.author.toString() !== userId) {
      throw new Error("You are not authorized to edit this blog");
    }

    if (updatedFields.body) {
      blog.read_count++; // Increment read_count if body is updated
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedFields, {
      new: true,
    });

    return updatedBlog;
  } catch (error) {
    throw error;
  }
};

const getAllBlogs = async () => {
  try {
    const blogs = await Blog.find({});
    return blogs;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async (id) => {
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    blog.read_count++;
    await blog.save();

    return blog;
  } catch (error) {
    throw error;
  }
};
const deleteBlog = async (id, userId) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({
      _id: id,
      author: userId,
    });

    if (!deletedBlog) {
      throw new Error(
        "Blog not found or you are not authorized to delete this blog"
      );
    }

    return deletedBlog;
  } catch (error) {
    throw error;
  }
};

const getUserBlogs = async (userId) => {
  try {
    const userBlogs = await Blog.find({ author: userId });
    return userBlogs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updatedBlogState = async (blogId, userId, newState) => {
  if (newState !== "published") {
    throw new Error("Invalid state");
  }
  return Blog.findByIdAndUpdate(
    blogId,
    userId,
    { state: newState },
    { new: true }
  );
};

module.exports = {
  getBlogById,
  createBlog,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getUserBlogs,
  updatedBlogState,
};
