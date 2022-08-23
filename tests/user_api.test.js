const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
  rawUsersAdded = await User.find({});

  blogsToAdd = helper.initialBlogs.map((blog) => {
    return { ...blog, user: rawUsersAdded[0]._id };
  });
  await Blog.deleteMany({});
  await Blog.insertMany(blogsToAdd);

  rawUsersAdded = await User.find({});
  blogsAdded = await Blog.find({});
  firstUser = rawUsersAdded[0];
  await User.findOneAndUpdate(
    { username: firstUser.username },
    { blogs: blogsAdded }
  );
});

test("getting all users works", async () => {
  const response = await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toHaveLength(helper.initialUsers.length);
});

test("POST valid user", async () => {
  const newUser = {
    username: "username",
    password: "password",
  };

  await api.post("/api/users").send(newUser).expect(201);

  const usersAfter = await helper.usersInDb();
  expect(usersAfter).toHaveLength(helper.initialUsers.length + 1);
});

describe("POST invalid user", () => {
  test("POST user without username fails", async () => {
    const newUser = {
      name: "name",
      password: "password",
    };

    await api.post("/api/users").send(newUser).expect(400);

    const usersAfter = await helper.usersInDb();
    expect(usersAfter).toHaveLength(helper.initialUsers.length);
  });

  test("POST user with too short username fails", async () => {
    const newUser = {
      username: "ah",
      name: "name",
      password: "password",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const usersAfter = await helper.usersInDb();
    expect(usersAfter).toHaveLength(helper.initialUsers.length);
  });

  test("POST user without password fails", async () => {
    const newUser = {
      username: "username",
      name: "name",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const usersAfter = await helper.usersInDb();
    expect(usersAfter).toHaveLength(helper.initialUsers.length);
  });

  test("POST user with too short password fails", async () => {
    const newUser = {
      username: "username",
      name: "name",
      password: "ah",
    };
    await api.post("/api/users").send(newUser).expect(400);

    const usersAfter = await helper.usersInDb();
    expect(usersAfter).toHaveLength(helper.initialUsers.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
