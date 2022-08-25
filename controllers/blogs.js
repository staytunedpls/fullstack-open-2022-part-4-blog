const jwt = require("jsonwebtoken");
const BlogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

BlogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  response.json(blogs);
});

BlogsRouter.post("/", async (request, response) => {
  const { title, url, author, likes } = request.body;
  const decodedUser = request.user

  const blog = new Blog({
    title,
    url,
    author,
    likes,
    user: decodedUser._id,
  });

  const savedBlog = await blog.save();
  if (!decodedUser.blogs) {
    decodedUser.blogs = [];
  }
  decodedUser.blogs = decodedUser.blogs.concat(savedBlog._id);
  await decodedUser.save();

  response.status(201).json(savedBlog);
});

BlogsRouter.delete("/:id", async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) {
    return response.status(204).end();
  }

  const decodedUser = request.user

  if (blogToDelete.user.toString() === decodedUser.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id);

    decodedUser.blogs = decodedUser.blogs.filter(
      (blog) => blog._id.toString() !== request.params.id
    );
    await decodedUser.save();

    response.status(204).end();
  } else {
    response
      .status(401)
      .json({ error: "Only a user that has created a blog can delete it" });
  }
});

BlogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedBlog);
});

module.exports = BlogsRouter;
