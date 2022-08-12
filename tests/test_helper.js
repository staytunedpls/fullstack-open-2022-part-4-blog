const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Test blog 1",
    author: "Test author 1",
    likes: 1,
  },
  {
    title: "Test blog 2",
    author: "Test author 2",
    likes: 2,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
