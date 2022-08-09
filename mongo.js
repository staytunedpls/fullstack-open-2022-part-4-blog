const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://staytuned:${password}@cluster0.csb6ok7.mongodb.net/blogApp?retryWrites=true&w=majority`

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

mongoose
  .connect(url)
  .then((result) => {
    const blog = new Blog({
      title: "Blog title",
      author: "Author Authorovich",
      url: "NICEURL",
      likes: 1000,
    });

    return blog.save();
    // Blog.find({}).then((result) => {
    //   result.forEach((note) => {
    //     console.log(note);
    //   });
    //   mongoose.connection.close();
    // });
  })
  .then(() => {
    console.log("note saved!");
    mongoose.connection.close();
  });
