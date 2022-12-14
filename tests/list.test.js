const listHelper = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("empty blog list gives zero", () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });
  test("one-blog list gives this blog likes", () => {
    result = listHelper.totalLikes(blogs.slice(0, 1));
    expect(result).toBe(blogs[0].likes);
  });
  test("right calculation on normal list", () => {
    result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe("favorite", () => {
  test("empty blog list gives null", () => {
    expect(listHelper.favoriteBlog([])).toBe(null);
  });
  test("one-blog list gives this blog", () => {
    result = listHelper.favoriteBlog(blogs.slice(0, 1));
    expect(result).toEqual({
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });
  test("right calculation on normal list", () => {
    favblog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    };
    expect(listHelper.favoriteBlog(blogs)).toEqual(favblog);
  });
});

describe("most blogs", () => {
  test("empty blog list gives null", () => {
    expect(listHelper.mostBlogs([])).toBe(null);
  });
  test("one-blog list gives this author and one blog", () => {
    result = listHelper.mostBlogs(blogs.slice(0, 1));
    expect(result).toEqual({
      author: "Michael Chan",
      blogs: 1,
    });
  });
  test("right calculation on normal list", () => {
    popular = {
      author: "Robert C. Martin",
      blogs: 3,
    };
    expect(listHelper.mostBlogs(blogs)).toEqual(popular);
  });
});

describe("most likes", () => {
  test("empty blog list gives null", () => {
    expect(listHelper.mostLikes([])).toBe(null);
  });
  test("one-blog list gives this author and its likes", () => {
    result = listHelper.mostLikes(blogs.slice(0, 1));
    expect(result).toEqual({
      author: "Michael Chan",
      likes: 7,
    });
  });
  test("right calculation on normal list", () => {
    popular = {
      author: "Edsger W. Dijkstra",
      likes: 17,
    };
    expect(listHelper.mostLikes(blogs)).toEqual(popular);
  });
});
