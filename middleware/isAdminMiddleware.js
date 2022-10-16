import HttpException from "../utils/exceptions/httpException.js";

const isAdminMiddleware = async (req, res, next) => {
  const { role } = req.user;
  try {
    if (role !== "admin" || !req.user)
      return next(HttpException(401, "Unauthorized user"));
    next();
  } catch (error) {
    return next(new HttpException(402, error.message));
  }
};
export default isAdminMiddleware;
