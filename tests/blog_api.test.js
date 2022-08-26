const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

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

const getFirstUserToken = async () => {
  const firstUserInfo = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  };
  console.log("First user info", firstUserInfo);
  const response = await api.post("/api/login").send(firstUserInfo);
  return response.body.token;
};

describe("GET blog testing", () => {
  test("GET returns all blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("GET blogs have 'id' property", async () => {
    const response = await api.get("/api/blogs");
    const first_blog = response.body[0];
    expect(first_blog.id).toBeDefined();
  });
});

describe("POST blog testing", () => {
  test("POST works for correct blogs", async () => {
    const newBlog = {
      title: "POST test",
      author: "POST",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + (await getFirstUserToken()))
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
      .set("Authorization", "bearer " + (await getFirstUserToken()))
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
      .set("Authorization", "bearer " + (await getFirstUserToken()))
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
      .set("Authorization", "bearer " + (await getFirstUserToken()))
      .send(hasTitleHasNoUrl)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const hasNoTitleHasNoUrl = {
      author: "No title and no url",
      likes: 50,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", "bearer " + (await getFirstUserToken()))
      .send(hasNoTitleHasNoUrl)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 2);
  });
});

describe("DELETE blog testing", () => {
  test("DELETE existing blog works", async () => {
    const blogsAtStart = await helper.blogsInDb();
    blogToBeDeleted = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set("Authorization", "bearer " + (await getFirstUserToken()))
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    blogTitles = blogsAtEnd.map((blog) => blog.title);
    expect(blogTitles).not.toContain(blogToBeDeleted.title);
  });

  test("DELETE non-existing blog returns 204", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const nonExistendId = "62fcae649d68dcc58d9b7af7";
    await api
      .delete(`/api/blogs/${nonExistendId}`)
      .set("Authorization", "bearer " + (await getFirstUserToken()))
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

describe("PUT blog testing", () => {
  test("PUT on existing id works", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updateInfo = {
      author: "Test blog update",
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateInfo)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].author).toEqual(updateInfo.author);
  });

  test("PUT on non-existing id returns 200", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const nonExistendId = "62fcae649d68dcc58d9b7af7";

    const updateInfo = {
      author: "Test blog update",
    };
    await api.put(`/api/blogs/${nonExistendId}`).send(updateInfo).expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toEqual(blogsAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
