const { chain, countBy } = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum_likes = (sum, item) => sum + item.likes;
  return blogs.reduce(sum_likes, 0);
};

const favoriteBlog = (blogs) => {
  const compare = (previous, current) => {
    if (previous === null) {
      return current;
    } else {
      return previous.likes > current.likes ? previous : current;
    }
  };
  reduced = blogs.reduce(compare, null);
  if (reduced === null) {
    return null;
  }
  const picked = (({ title, author, likes }) => ({ title, author, likes }))(
    reduced
  );
  return picked;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const blogs_by_author = countBy(blogs, "author");
  const most_prolific_author = Object.keys(blogs_by_author).reduce(
    (author_a, author_b) =>
      blogs_by_author[author_a] > blogs_by_author[author_b]
        ? author_a
        : author_b
  );
  return {
    author: most_prolific_author,
    blogs: blogs_by_author[most_prolific_author],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const likes_by_author_array = chain(blogs)
    .groupBy((blog) => blog.author)
    .map((author_blogs, author) => {
      return {
        author: author,
        likes: totalLikes(author_blogs),
      };
    })
    .value();
  return likes_by_author_array.reduce((author_object_a, author_object_b) =>
    author_object_a.likes > author_object_b.likes
      ? author_object_a
      : author_object_b
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
