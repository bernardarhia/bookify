import { verifyToken } from "../utils/token.js";
import User from  "../models/User.js";
import httpException from "../utils/exceptions/httpException.js";

const authenticatedMiddleware = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) return next(new httpException(401, "Unauthorized"));

  const accessToken = bearer.split("Bearer ")[1].trim();

  try {
    const payload = await verifyToken(accessToken);
    if (!payload) return next(new httpException(401, "Unauthorized 1"));

    const user = await User.findById(payload.id).select("-password").exec();

    if (!user) return next(new httpException(401, "Unauthorized 2"));
    req.user = user;

     next();
  } catch (error) {
    return next(new httpException(401, "Unauthorized"));
  }
};

export default authenticatedMiddleware;
