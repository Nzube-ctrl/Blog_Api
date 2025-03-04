const Blog = require("../models/blog.model.js");

const createBlog = async (blogData, userId) => {
  try {
    const { title, description, body, tags } = blogData;
    const blog = new Blog({ title, description, body, tags, author: userId });
    await blog.save();
    return blog;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred`,
      error: error.message,
    };
  }
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
    return {
      success: false,
      message: `An error occurred`,
      error: error.message,
    };
  }
};

const getAllBlogs = async (Page = 1, limit = 10) => {
  try {
    const skip = (Page - 1) * limit;
    const blogs = await Blog.find({}).skip(skip).limit(limit).exec();
    const totalBlogs = await Blog.countDocuments({});
    return {
      success: true,
      data: blogs,
      pagination: {
        currentPage: Page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalItems: totalBlogs,
        pageSize: limit,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occurred`,
      error: error.message,
    };
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
    return {
      success: false,
      message: `An error occurred`,
      error: error.message,
    };
  }
};
const deleteBlog = async (id, userId) => {
  try {
    if (!id || !userId) {
      throw new Error("Invalid input: Blog ID and User ID are required");
    }
    const deletedBlog = await Blog.findOneAndDelete({
      _id: id,
      author: userId,
    });
    if (!deletedBlog) {
      return {
        success: false,
        message: "Blog not found or you are not authorized to delete this blog",
      };
    }
    return {
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog,
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the blog",
      error: error.message,
    };
  }
};

const getUserBlogs = async (userId) => {
  try {
    const userBlogs = await Blog.find({ author: userId });
    return userBlogs;
  } catch (error) {
    return {
      success: false,
      message: `An error occurred`,
      error: error.message,
    };
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
