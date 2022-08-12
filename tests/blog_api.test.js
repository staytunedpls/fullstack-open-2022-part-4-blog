const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

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

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test("GET returns all blogs", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body.length).toBe(initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
