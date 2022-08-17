const bcrypt = require("bcrypt");
const UsersRouter = require("express").Router();
const User = require("../models/user");

UsersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

UsersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  response.status(201).json(savedUser);
});

module.exports = UsersRouter;
