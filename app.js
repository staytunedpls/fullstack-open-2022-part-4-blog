const config = require('./utils/config')
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const BlogsRouter = require("./controllers/blogs");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/blogs", BlogsRouter);

module.exports = app