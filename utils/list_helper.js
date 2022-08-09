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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
