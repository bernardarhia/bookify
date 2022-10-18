import httpException from "../../utils/exceptions/httpException.js";
import {
  userValidationMiddleware,
  authenticationSchema,
} from "./validation.js";
import UserService from "./service.js";
import { Router } from "express";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";
class UserController {
  constructor() {
    this.subRoute = "users";
    this.paths = {
      CREATE: "/register",
      LOGIN: "/login",
      REFRESH: "/refresh",
      LOGOUT: "/logout",
    };
    this.router = new Router();
    this.initializeRoutes();
    this.UserService = new UserService();
  }
  initializeRoutes() {
    this.router.post(
      `${this.paths.CREATE}`,
      userValidationMiddleware(authenticationSchema),
      this.register
    );
    this.router.post(
      `${this.paths.LOGIN}`,
      userValidationMiddleware(authenticationSchema),
      this.login
    );
    this.router.get(`${this.paths.REFRESH}`, this.refreshToken);
    this.router.get(`${this.paths.LOGOUT}`, this.logout);
  }

  // register user method
  register = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const {
        accessToken,
        refreshToken,
        role,
        username: newUsername,
      } = await this.UserService.register(username, password);

      res
        .cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expire: 36000 * Date.now(),
        })
        .status(200)
        .json({ role, accessToken, newUsername });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // Login user method
  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const {
        accessToken,
        refreshToken,
        role,
        username: newUsername,
      } = await this.UserService.login(username, password);

      res
        .cookie("auth_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expire: 36000 * Date.now(),
        })
        .status(200)
        .json({ role, accessToken, newUsername });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  logout = async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.auth_token) return res.status(200);
      const refreshToken = cookies.auth_token;
      // check if refresh token is found in the database
      const foundUser = await User.findOne({ refreshToken });
      if (!foundUser) {
        return res.clearCookie("auth_token").status(200);
      }

      // delete refresh token from user's model
      const updated = await User.findOneAndUpdate(
        { username: foundUser.username },
        { refreshToken: "" },
        { new: true }
      );
      return res.clearCookie("auth_token").status(200);
    } catch (error) {
      return new httpException(400, "Bad request");
    }
  };

  refreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.auth_token)
      return next(new httpException(401, "Unauthorized"));
    const refreshToken = cookies.auth_token;

    const user = await User.findOne({ refreshToken });

    if (!user) return next(new httpException(403, "Forbidden 1"));

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
      if (err || user.username != payload.name)
        return next(new httpException(403, "Forbidden 2"));

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: payload.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "20s" }
      );
      res.json({ role: user.role, accessToken, user: payload.name });
    });
  };
}

export default UserController;
