const logger = require("./logger");
const jwt = require("jsonwebtoken")
const User = require("../models/user");

const requestInfoLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = await jwt.verify(request.token, process.env.JWT_SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "Invalid token" });
  }
  request.user = await User.findById(decodedToken.id);
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Endpoint is unknown" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  requestInfoLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
