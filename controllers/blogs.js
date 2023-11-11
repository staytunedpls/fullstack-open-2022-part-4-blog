const BlogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

BlogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  response.json(blogs);
});

BlogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { title, url, author, likes, comments } = request.body;
  const decodedUser = request.user;

  const blog = new Blog({
    title,
    url,
    author,
    likes,
    user: decodedUser._id,
    comments: comments,
  });

  const savedBlog = await /* It saves the blog to the database. */ blog.save();
  await savedBlog.populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  if (!decodedUser.blogs) {
    decodedUser.blogs = [];
  }
  decodedUser.blogs = decodedUser.blogs.concat(savedBlog._id);
  await decodedUser.save();

  response.status(201).json(savedBlog);
});

BlogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
      return response.status(204).end();
    }

    const decodedUser = request.user;

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
  }
);

BlogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  if (!updatedBlog) {
    return response.status(200).end();
  }
  await updatedBlog.populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  response.json(updatedBlog);
});

BlogsRouter.post("/:id/comments", async (request, response) => {
  const comment = request.body.comment;
  const currentBlog = await Blog.findById(request.params.id);
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $push: { comments: comment } },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
  if (!updatedBlog) {
    return response.status(200).end();
  }
  await updatedBlog.populate("user", {
    username: 1,
    name: 1,
    _id: 1,
  });
  response.json(updatedBlog);
});

module.exports = BlogsRouter;
