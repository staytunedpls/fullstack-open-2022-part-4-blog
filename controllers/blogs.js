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
  const { token, title, url, author, likes } = request.body;
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedToken);

  if (!decodedToken.id) {
    response.status(401).json({ error: "Invalid token" });
  }
  const decodedUser = await User.findById(decodedToken.id);

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
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
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
