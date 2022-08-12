const BlogsRouter = require("express").Router();
const Blog = require("../models/blog");

BlogsRouter.get("/", async (request, response) => {
  blogs = await Blog.find({});
  response.json(blogs);
});

BlogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = BlogsRouter;
