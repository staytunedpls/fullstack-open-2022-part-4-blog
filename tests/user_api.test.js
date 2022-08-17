const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");
const helper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

test("getting all users works", async () => {
  const response = await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toHaveLength(helper.initialUsers.length);
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
