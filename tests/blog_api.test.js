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

test("GET blogs have 'id' property", async () => {
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
  const blogsAfter = await helper.blogsInDb();
  expect(blogsAfter).toHaveLength(helper.initialBlogs.length + 1);
});

test("POST - default likes is 0", async () => {
  const newBlog = {
    title: "Blog no likes info",
    author: "Author no likes info",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogsAfter = await helper.blogsInDb();
  expect(blogsAfter[blogsAfter.length - 1].likes).toBe(0);
});

test("POST without title and url results in 400", async () => {
  const hasNoTitleHasUrl = {
    author: "No title but with url",
    url: "basic url",
    likes: 10,
  };
  await api
    .post("/api/blogs")
    .send(hasNoTitleHasUrl)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const hasTitleHasNoUrl = {
    author: "No url but with title",
    title: "basic title",
    likes: 20,
  };
  await api
    .post("/api/blogs")
    .send(hasTitleHasNoUrl)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const hasNoTitleHasNoUrl = {
    author: "No title and no url",
    likes: 50,
  };
  await api.post("/api/blogs").send(hasNoTitleHasNoUrl).expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 2);
});

test("DELETE existing blog works", async () => {
  const blogsAtStart = await helper.blogsInDb();
  blogToBeDeleted = blogsAtStart[0];
  await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

  blogTitles = blogsAtEnd.map((blog) => blog.title);
  expect(blogTitles).not.toContain(blogToBeDeleted.title);
});

test("DELETE non-existing blog returns 204", async () => {
  const blogsAtStart = await helper.blogsInDb();
  non_existent_id = "62fcae649d68dcc58d9b7af7";
  await api.delete(`/api/blogs/${non_existent_id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
});

afterAll(() => {
  mongoose.connection.close();
});
