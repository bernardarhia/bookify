const { verifyToken } = require("../utils/token");
const User = require("../models/User");
const HttpException = require("../utils/exceptions/httpException");

const authenticatedMiddleware = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) return next(new HttpException(401, "Unauthorized"));

  const accessToken = bearer.split("Bearer ")[1].trim();

  try {
    const payload = await verifyToken(accessToken);
    if (!payload) return next(new HttpException(401, "Unauthorized"));

    const user = await User.findById(payload.id).select("-password").exec();

    if (!user) return next(new HttpException(401, "Unauthorized"));
    req.user = user;

     next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorized"));
  }
};

module.exports = authenticatedMiddleware;
