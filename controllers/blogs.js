const BlogsRouter = require("express").Router();
const Blog = require("../models/blog");

BlogsRouter.get("/", async (request, response) => {
  blogs = await Blog.find({});
  response.json(blogs);
});

BlogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

BlogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = BlogsRouter;
