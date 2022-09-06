const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LoginRouter = require("express").Router();
const User = require("../models/user");

LoginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  authUser = await User.findOne({ username });
  const passwordCorrect =
    authUser === null
      ? false
      : await bcrypt.compare(password, authUser.passwordHash);

  if (!(authUser && passwordCorrect)) {
    return response.status(401).json({
      error: "Invalid username or password",
    });
  }

  const userForSign = {
    username: authUser.username,
    id: authUser.id,
  };

  const token = jwt.sign(userForSign, process.env.JWT_SECRET);

  response.status(200).send({
    token,
    username: authUser.username,
    name: authUser.name,
    id: authUser.id,
  });
});

module.exports = LoginRouter;
