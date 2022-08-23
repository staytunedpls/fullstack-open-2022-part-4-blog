const Blog = require("../models/blog");
const User = require("../models/user");

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

const initialUsers = [
  {
    username: "Test username 1",
    name: "Test name 1",
    passwordHash:
      "$2b$10$mXisHVd2PgMdV1fswzbqGewtxWUrm3DUu9ehxR5UoZPdgP7D99eLi",
  },
  {
    username: "Test username 2",
    name: "Test name 2",
    passwordHash:
      "$2b$10$MSDTkPhYqb00Ao6YJQZnUOqExoTYhWF2nYuvi0P80RWnDxqYl4A.S",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb,
};
