const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
require("express-async-errors");

const BlogsRouter = require("./controllers/blogs");
const UsersRouter = require("./controllers/users");
const LoginRouter = require("./controllers/login");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestInfoLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", LoginRouter);
app.use("/api/blogs", BlogsRouter);
app.use("/api/users", UsersRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
