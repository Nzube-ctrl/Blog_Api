const {
  createBlog,
  editBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
} = require("../services/blogService.js");
const Blog = require("../models/blogModel.js");

jest.mock("../models/blogModel.js");

describe("Blog Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createBlog", () => {
    it("should create a new blog", async () => {
      const userId = "user123";
      const blogData = {
        title: "Test Blog",
        description: "Test description",
        body: "Test body",
        tags: ["test", "example"],
      };
      const expectedBlog = { ...blogData, author: userId };
      const newBlogInstance = new Blog(expectedBlog);
      Blog.mockReturnValue(newBlogInstance);

      const createdBlog = await createBlog(blogData, userId);

      expect(Blog).toHaveBeenCalledWith(expectedBlog);
      expect(newBlogInstance.save).toHaveBeenCalled();
      expect(createdBlog).toEqual(newBlogInstance);
    });
  });

  describe("editBlog", () => {
    it("should edit an existing blog", async () => {
      const blogId = "blog123";
      const userId = "user123";
      const updatedFields = { body: "Updated body" };
      const existingBlog = { _id: blogId, author: userId, read_count: 0 };
      Blog.findById.mockResolvedValue(existingBlog);
      const updatedBlog = { ...existingBlog, ...updatedFields };
      Blog.findByIdAndUpdate.mockResolvedValue(updatedBlog);

      const result = await editBlog(blogId, userId, updatedFields);

      expect(Blog.findById).toHaveBeenCalledWith(blogId);
      expect(updatedBlog.read_count).toBe(existingBlog.read_count + 1);
      expect(Blog.findByIdAndUpdate).toHaveBeenCalledWith(
        blogId,
        updatedFields,
        { new: true }
      );
      expect(result).toEqual(updatedBlog);
    });

    it("should throw an error if blog not found", async () => {
      const blogId = "nonexistentBlog";
      const userId = "user123";
      Blog.findById.mockResolvedValue(null);

      await expect(editBlog(blogId, userId, {})).rejects.toThrow(
        "Blog not found"
      );
    });

    it("should throw an error if unauthorized", async () => {
      const blogId = "blog123";
      const userId = "unauthorizedUser";
      const updatedFields = { body: "Updated body" };
      const existingBlog = { _id: blogId, author: "user123", read_count: 0 };
      Blog.findById.mockResolvedValue(existingBlog);

      await expect(editBlog(blogId, userId, updatedFields)).rejects.toThrow(
        "You are not authorized to edit this blog"
      );
    });
  });

  describe("deleteBlog", () => {
    it("should delete an existing blog", async () => {
      const blogId = "blog123";
      const userId = "user123";
      const existingBlog = { _id: blogId, author: userId };
      Blog.findById.mockResolvedValue(existingBlog);
      Blog.findByIdAndDelete.mockResolvedValue(existingBlog);

      const deletedBlog = await deleteBlog(blogId, userId);

      expect(Blog.findById).toHaveBeenCalledWith(blogId);
      expect(Blog.findByIdAndDelete).toHaveBeenCalledWith(blogId);
      expect(deletedBlog).toEqual(existingBlog);
    });

    it("should throw an error if blog not found", async () => {
      const blogId = "nonexistentBlog";
      const userId = "user123";
      Blog.findById.mockResolvedValue(null);

      await expect(deleteBlog(blogId, userId)).rejects.toThrow(
        "Blog not found"
      );
    });

    it("should throw an error if unauthorized", async () => {
      const blogId = "blog123";
      const userId = "unauthorizedUser";
      const existingBlog = { _id: blogId, author: "user123" };
      Blog.findById.mockResolvedValue(existingBlog);

      await expect(deleteBlog(blogId, userId)).rejects.toThrow(
        "You are not authorized to delete this blog"
      );
    });
  });

  describe("getAllBlogs", () => {
    it("should return all blogs", async () => {
      const blogs = [{ title: "Blog 1" }, { title: "Blog 2" }];
      Blog.find.mockResolvedValue(blogs);

      const result = await getAllBlogs();

      expect(Blog.find).toHaveBeenCalled();
      expect(result).toEqual(blogs);
    });

    it("should throw an error if retrieval fails", async () => {
      const errorMessage = "Database error";
      Blog.find.mockRejectedValue(new Error(errorMessage));

      await expect(getAllBlogs()).rejects.toThrow(errorMessage);
    });
  });

  describe("getBlogById", () => {
    it("should return blog by id", async () => {
      const blogId = "blog123";
      const existingBlog = { _id: blogId };
      Blog.findById.mockResolvedValue(existingBlog);

      const result = await getBlogById(blogId);

      expect(Blog.findById).toHaveBeenCalledWith(blogId);
      expect(existingBlog.read_count).toBe(1);
      expect(existingBlog.save).toHaveBeenCalled();
      expect(result).toEqual(existingBlog);
    });

    it("should throw an error if blog not found", async () => {
      const blogId = "nonexistentBlog";
      Blog.findById.mockResolvedValue(null);

      await expect(getBlogById(blogId)).rejects.toThrow("Blog not found");
    });
  });
});
