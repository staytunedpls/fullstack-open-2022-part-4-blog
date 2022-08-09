const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
    const sum_likes = (sum, item) => sum + item.likes
    return blogs.reduce(sum_likes, 0)
};

module.exports = {
  dummy,
  totalLikes
};
