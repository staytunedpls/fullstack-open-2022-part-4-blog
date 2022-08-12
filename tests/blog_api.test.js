const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("GET returns all blogs", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("blogs have 'id' property", async () => {
  const response = await api.get("/api/blogs");
  const first_blog = response.body[0];
  expect(first_blog.id).toBeDefined();
});

test("POST works for correct blogs", async () => {
  const newBlog = {
    title: "POST test",
    author: "POST",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogsAfter = await helper.blogsInDb()
  expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1)
});

afterAll(() => {
  mongoose.connection.close();
});
