const HttpException = require("../utils/exceptions/httpException");

const isAdminMiddleware = (req, res, next) => {
  const { role } = req.user;
  try {
    if (role !== "admin" || !user)
      return next(HttpException(401, "Unauthorized user"));
    next();
  } catch (error) {
    return next(new HttpException(401, "Unauthorized"));
  }
};

module.exports = isAdminMiddleware;